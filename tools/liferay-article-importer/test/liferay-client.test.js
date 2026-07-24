import test from 'node:test';
import assert from 'node:assert/strict';
import {LiferayClient} from '../server/liferay-client.js';

const config = {baseUrl:'http://liferay.test',clientId:'id',clientSecret:'secret',defaultLocale:'en-US',imageIndexPageSize:200,imageSourceFolderId:456,imageSourceId:123,imageSourceType:'assetLibrary',maxRetries:0,requestTimeoutMs:5000,retryBaseDelayMs:1,siteId:34371,batchClassName:'com.liferay.headless.delivery.dto.v1_0.StructuredContent'};
function response(body,status=200,headers={}) { return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json',...headers}}); }

test('lists configured image folder once with pagination and builds Batch URL', async () => {
  const calls=[];
  const client = new LiferayClient(config, async (url,options={}) => {
    calls.push({url,options});
    if (url.endsWith('/o/oauth2/token')) return response({access_token:'token',expires_in:600});
    if (url.includes('/document-folders/456/documents')) return response({items:[],lastPage:1});
    if (url.includes('/import-task/')) return response({id:77});
    return response({items:[],lastPage:1});
  });
  await client.listConfiguredImageDocuments();
  await client.submitStructuredContents([],{createStrategy:'INSERT',importStrategy:'ON_ERROR_FAIL'});
  assert(calls.some((call) => call.url.includes('/document-folders/456/documents?page=1&pageSize=200')));
  assert(calls.some((call) => call.url.includes('createStrategy=INSERT&importStrategy=ON_ERROR_FAIL&siteId=34371')));
});
