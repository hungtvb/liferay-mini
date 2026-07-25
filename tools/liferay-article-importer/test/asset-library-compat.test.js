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
  return new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json', ...headers}});
}

test('falls back from collection 400 to ERC connected-sites endpoint', async () => {
  const calls = [];
  const client = new LiferayClient(config, async (url) => {
    calls.push(url);
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    if (url.includes('nestedFields=connectedSites&sort=name:asc')) return response({status: 400, title: 'Bad Request'}, 400);
    if (url.includes('/asset-libraries/SHARED/connected-sites')) return response({items: [{id: 34371}], lastPage: 1});
    if (url.includes('/o/headless-asset-library/v1.0/asset-libraries?sort=name:asc')) {
      return response({items: [{id: 9, siteId: 123, name: 'Shared Assets', externalReferenceCode: 'SHARED'}], lastPage: 1});
    }
    return response({items: [], lastPage: 1});
  });

  const connected = await client.connect();

  assert.deepEqual(connected.assetLibraries.map((item) => item.id), [123]);
  assert(calls.some((url) => url.includes('/asset-libraries/SHARED/connected-sites')));
});

test('falls back from ERC route to legacy numeric Asset Library route', async () => {
  const calls = [];
  const client = new LiferayClient(config, async (url) => {
    calls.push(url);
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    if (url.includes('nestedFields=connectedSites&sort=name:asc')) return response({status: 400}, 400);
    if (url.includes('/asset-libraries/SHARED/connected-sites')) return response({status: 404}, 404);
    if (url.includes('/asset-libraries/SHARED?nestedFields=connectedSites')) return response({status: 404}, 404);
    if (url.includes('/asset-libraries/9/connected-sites')) return response({items: [{id: 34371}], lastPage: 1});
    if (url.includes('/o/headless-asset-library/v1.0/asset-libraries?sort=name:asc')) {
      return response({items: [{id: 9, siteId: 123, name: 'Shared Assets', externalReferenceCode: 'SHARED'}], lastPage: 1});
    }
    return response({items: [], lastPage: 1});
  });

  const connected = await client.connect();

  assert.equal(connected.assetLibraries[0].assetLibraryId, 9);
  assert(calls.some((url) => url.includes('/asset-libraries/9/connected-sites')));
});

test('keeps Headless Delivery Asset Library calls on the group siteId', async () => {
  const calls = [];
  const client = new LiferayClient(config, async (url) => {
    calls.push(url);
    if (url.endsWith('/o/oauth2/token')) return response({access_token: 'token', expires_in: 600});
    if (url.includes('/o/headless-asset-library/v1.0/asset-libraries')) {
      return response({items: [{id: 9, siteId: 123, name: 'Shared Assets', externalReferenceCode: 'SHARED', connectedSites: [{id: 34371}]}], lastPage: 1});
    }
    if (url.includes('/asset-libraries/123/document-folders')) return response({items: [], lastPage: 1});
    return response({items: [], lastPage: 1});
  });

  await client.connect();
  await client.listImageFolders({type: 'assetLibrary', id: 123});

  assert(calls.some((url) => url.includes('/o/headless-delivery/v1.0/asset-libraries/123/document-folders')));
  assert(!calls.some((url) => url.includes('/o/headless-delivery/v1.0/asset-libraries/9/document-folders')));
});
