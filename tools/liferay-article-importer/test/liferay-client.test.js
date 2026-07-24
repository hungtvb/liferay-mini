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
  imageSourceFolderId: 456,
  imageSourceId: 123,
  imageSourceType: 'assetLibrary',
  maxRetries: 0,
  requestTimeoutMs: 5000,
  retryBaseDelayMs: 1,
  siteId: 34371
};

function response(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json', ...headers}});
}

test('validates configured image folder ownership and builds Batch URL', async () => {
  const calls = [];
  const client = new LiferayClient(config, async (url, options = {}) => {
    calls.push({url, options});
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    if (url.includes('/asset-libraries/123/document-folders')) {
      return response({items: [{id: 456, name: 'Migration Images'}], lastPage: 1});
    }
    if (url.includes('/document-folders/456/documents')) return response({items: [], lastPage: 1});
    if (url.includes('/import-task/')) return response({id: 77});
    return response({items: [], lastPage: 1});
  });

  await client.validateConfiguredImageSource();
  await client.listConfiguredImageDocuments();
  await client.submitStructuredContents([], {createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'});

  assert(calls.some((call) => call.url.includes('/asset-libraries/123/document-folders?flatten=true&page=1&pageSize=200')));
  assert(calls.some((call) => call.url.includes('/document-folders/456/documents?page=1&pageSize=200')));
  assert(calls.some((call) => call.url.includes('createStrategy=INSERT&importStrategy=ON_ERROR_FAIL&siteId=34371')));
  assert.equal(client.imageSourceSummary().folderName, 'Migration Images');
});

test('rejects an image folder outside the configured source', async () => {
  const client = new LiferayClient(config, async (url) => {
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    if (url.includes('/asset-libraries/123/document-folders')) return response({items: [{id: 999}], lastPage: 1});
    return response({items: [], lastPage: 1});
  });

  await assert.rejects(
    () => client.validateConfiguredImageSource(),
    (error) => error.code === 'IMAGE_SOURCE_FOLDER_MISMATCH'
  );
});

test('uses flatten=true for source-root documents and nested Web Content folders', async () => {
  const rootConfig = {...config, imageSourceFolderId: null, imageSourceType: 'site'};
  const calls = [];
  const client = new LiferayClient(rootConfig, async (url) => {
    calls.push(url);
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    return response({items: [], lastPage: 1});
  });

  await client.validateConfiguredImageSource();
  await client.listConfiguredImageDocuments();
  await client.listStructuredContentFolders();

  assert(calls.some((url) => url.includes('/sites/123/documents?flatten=true&page=1&pageSize=200')));
  assert(calls.some((url) => url.includes('/sites/34371/structured-content-folders?flatten=true&sort=name:asc&page=1&pageSize=200')));
});

test('does not automatically retry Batch POST requests and marks transport failures ambiguous', async () => {
  let batchCalls = 0;
  const retryConfig = {...config, maxRetries: 3};
  const client = new LiferayClient(retryConfig, async (url) => {
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    if (url.includes('/import-task/')) {
      batchCalls += 1;
      throw new Error('connection reset');
    }
    return response({items: [], lastPage: 1});
  });

  await assert.rejects(
    () => client.submitStructuredContents([], {createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'}),
    (error) => error.code === 'LIFERAY_UNREACHABLE' && error.details.requestMayHaveSucceeded === true
  );
  assert.equal(batchCalls, 1);
});
