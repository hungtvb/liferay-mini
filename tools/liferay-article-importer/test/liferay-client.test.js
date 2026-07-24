import test from 'node:test';
import assert from 'node:assert/strict';
import {LiferayClient} from '../server/liferay-client.js';

function jsonResponse(status, body) {
  return new Response(body == null ? '' : JSON.stringify(body), {
    headers: {'Content-Type': 'application/json'},
    status
  });
}

const config = {
  articleFolderExternalReferenceCode: 'NXC_ARTICLES',
  articleFolderName: 'Articles',
  baseUrl: 'http://localhost:8080',
  batchClassName: 'com.liferay.headless.delivery.dto.v1_0.StructuredContent',
  clientId: 'client',
  clientSecret: 'secret',
  locale: 'en-US',
  siteId: '20117'
};

test('connect creates the configured folder when it does not exist', async () => {
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({url, options});
    if (url.endsWith('/o/oauth2/token')) return jsonResponse(200, {access_token: 'token', expires_in: 600});
    if (url.includes('/structured-content-folders/by-external-reference-code/')) return jsonResponse(404, {status: 404});
    if (url.endsWith('/structured-content-folders')) return jsonResponse(200, {externalReferenceCode: 'NXC_ARTICLES', id: 555, name: 'Articles', siteId: 20117});
    if (url.includes('/content-structures?')) return jsonResponse(200, {items: [], lastPage: 1});
    throw new Error(`Unexpected URL ${url}`);
  };
  const client = new LiferayClient(config, fetchImpl);
  const result = await client.connect();
  assert.equal(result.folder.id, 555);
  const createCall = calls.find((call) => call.url.endsWith('/structured-content-folders'));
  assert.equal(createCall.options.method, 'POST');
  assert.deepEqual(JSON.parse(createCall.options.body), {externalReferenceCode: 'NXC_ARTICLES', name: 'Articles'});
});

test('document lookup returns null for a missing image and caches the result', async () => {
  let documentCalls = 0;
  const fetchImpl = async (url) => {
    if (url.endsWith('/o/oauth2/token')) return jsonResponse(200, {access_token: 'token', expires_in: 600});
    if (url.includes('/documents/by-external-reference-code/')) {
      documentCalls += 1;
      return jsonResponse(404, {status: 404});
    }
    throw new Error(`Unexpected URL ${url}`);
  };
  const client = new LiferayClient(config, fetchImpl);
  assert.equal(await client.getSiteDocumentByExternalReferenceCode('MISSING'), null);
  assert.equal(await client.getSiteDocumentByExternalReferenceCode('MISSING'), null);
  assert.equal(documentCalls, 1);
});
