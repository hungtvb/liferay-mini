import test from 'node:test';
import assert from 'node:assert/strict';
import {LiferayClient} from '../server/liferay-client.js';

const config = {
  baseUrl: 'http://liferay.test',
  batchClassName: 'com.liferay.headless.delivery.dto.v1_0.StructuredContent',
  clientId: 'id',
  clientSecret: 'secret',
  defaultLocale: 'en-US',
  imageIndexPageSize: 200,
  maxRetries: 0,
  requestTimeoutMs: 5000,
  retryBaseDelayMs: 1,
  siteId: 34371
};

function response(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json', ...headers}
  });
}

test('connect loads only the configured Site scope and builds the Batch URL', async () => {
  const calls = [];
  const client = new LiferayClient(config, async (url) => {
    calls.push(url);

    if (url.endsWith('/o/oauth2/token')) {
      return response({access_token: 'token', expires_in: 600});
    }
    if (url.includes('/sites/34371/content-structures')) {
      return response({items: [{id: 10, name: 'Article'}], lastPage: 1});
    }
    if (url.includes('/sites/34371/structured-content-folders')) {
      return response({items: [{id: 20, name: 'Articles', siteId: 34371}], lastPage: 1});
    }
    if (url.includes('/sites/34371/document-folders')) {
      return response({items: [{id: 456, name: 'Migration Images', siteId: 34371}], lastPage: 1});
    }
    if (url.includes('/document-folders/456/documents')) {
      return response({items: [], lastPage: 1});
    }
    if (url.includes('/import-task/')) return response({id: 77});

    return response({items: [], lastPage: 1});
  });

  const connected = await client.connect();
  const source = await client.resolveImageSource({type: 'site', id: 34371, folderId: 456});
  await client.listImageDocuments(source);
  await client.submitStructuredContents([], {
    createStrategy: 'INSERT',
    importStrategy: 'ON_ERROR_FAIL'
  });

  assert.deepEqual(connected.imageSources, [{id: 34371, name: 'Current Site', type: 'site'}]);
  assert.equal(connected.folders[0].path, 'Articles');
  assert.equal(source.folderName, 'Migration Images');
  assert.equal(source.assetLibraryId, null);
  assert(calls.some((url) => url.includes('/sites/34371/document-folders?flatten=true&page=1&pageSize=200')));
  assert(calls.some((url) => url.includes('/document-folders/456/documents?page=1&pageSize=200')));
  assert(calls.some((url) => url.includes('createStrategy=INSERT&importStrategy=ON_ERROR_FAIL&siteId=34371')));
  assert(!calls.some((url) => url.includes('headless-asset-library')));
});

test('rejects an image folder outside the configured Site', async () => {
  const client = new LiferayClient(config, async (url) => {
    if (url.endsWith('/o/oauth2/token')) {
      return response({access_token: 'token', expires_in: 600});
    }
    if (url.includes('/sites/34371/document-folders')) {
      return response({items: [{id: 999, name: 'Other'}], lastPage: 1});
    }

    return response({items: [], lastPage: 1});
  });

  await assert.rejects(
    () => client.resolveImageSource({type: 'site', id: 34371, folderId: 456}),
    (error) => error.code === 'IMAGE_SOURCE_FOLDER_MISMATCH'
  );
});

test('uses flatten=true for Site-root documents and nested Web Content folders', async () => {
  const calls = [];
  const client = new LiferayClient(config, async (url) => {
    calls.push(url);

    if (url.endsWith('/o/oauth2/token')) {
      return response({access_token: 'token', expires_in: 600});
    }

    return response({items: [], lastPage: 1});
  });

  await client.listImageDocuments({type: 'site', id: 34371, folderId: null});
  await client.listStructuredContentFolders();

  assert(calls.some((url) => url.includes('/sites/34371/documents?flatten=true&page=1&pageSize=200')));
  assert(calls.some((url) => url.includes('/sites/34371/structured-content-folders?flatten=true&page=1&pageSize=200')));
});

test('rejects Asset Library as a demo image source', async () => {
  const client = new LiferayClient(config, async (url) => {
    if (url.endsWith('/o/oauth2/token')) {
      return response({access_token: 'token', expires_in: 600});
    }

    return response({items: [], lastPage: 1});
  });

  await assert.rejects(
    () => client.resolveImageSource({type: 'assetLibrary', id: 123, folderId: null}),
    (error) => error.code === 'IMAGE_SOURCE_INVALID'
  );
});

test('does not automatically retry Batch POST requests and marks transport failures ambiguous', async () => {
  let batchCalls = 0;
  const retryConfig = {...config, maxRetries: 3};
  const client = new LiferayClient(retryConfig, async (url) => {
    if (url.endsWith('/o/oauth2/token')) {
      return response({access_token: 'token', expires_in: 600});
    }
    if (url.includes('/import-task/')) {
      batchCalls += 1;
      throw new Error('connection reset');
    }

    return response({items: [], lastPage: 1});
  });

  await assert.rejects(
    () => client.submitStructuredContents([], {
      createStrategy: 'INSERT',
      importStrategy: 'ON_ERROR_FAIL'
    }),
    (error) => error.code === 'LIFERAY_UNREACHABLE'
      && error.details.requestMayHaveSucceeded === true
  );
  assert.equal(batchCalls, 1);
});
