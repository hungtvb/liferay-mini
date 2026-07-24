import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAndBuildPayload} from '../server/validation.js';

const targets = [
  {key:'system.title', label:'Content Title', name:'title', required:true, supported:true, valueKind:'scalar', dataType:'string'},
  {key:'system.externalReferenceCode', label:'External Reference Code', name:'externalReferenceCode', required:true, supported:true, valueKind:'scalar', dataType:'string'},
  {key:'content.body', label:'Body', name:'RichText123', fieldReference:'body', required:true, supported:true, valueKind:'scalar', dataType:'string'},
  {key:'content.coverImage', label:'Cover Image', name:'Image123', fieldReference:'coverImage', required:true, supported:true, valueKind:'imageReference', dataType:'image'}
];
const mapping = {'system.title':'Content Title *','system.externalReferenceCode':'External Reference Code *','content.body':'Body * [body]','content.coverImage':'Cover Image Reference * [coverImage]'};
const imageResolver = {async resolveMany() { return {indexSummary:{documentCount:1,distinctReferenceCount:1}, results:new Map([['file:cover.webp',{status:'RESOLVED',document:{id:9,title:'Cover',description:'Cover',fileName:'cover.webp',externalReferenceCode:'COVER'}}]])}; }};

test('builds generic payload and preserves both field identities', async () => {
  const result = await validateAndBuildPayload({existingContents:[],folder:{id:20},imageResolver,locale:'en-US',mapping,rowNumbers:[2],rows:[{'Content Title *':'Hello','External Reference Code *':'hero-home','Body * [body]':'Body','Cover Image Reference * [coverImage]':'file:cover.webp'}],structure:{id:10},targets,viewableBy:'Anyone'});
  assert.equal(result.canImport, true);
  assert.equal(result.payload[0].contentStructureId, 10);
  assert.equal(result.payload[0].structuredContentFolderId, 20);
  assert.equal(result.payload[0].viewableBy, 'Anyone');
  assert.deepEqual(result.payload[0].contentFields[0], {contentFieldValue:{data:'Body'},fieldReference:'body',name:'RichText123'});
  assert.deepEqual(result.payload[0].contentFields[1].contentFieldValue.image, {id:9,title:'Cover',description:'Cover'});
});

test('duplicate ERC and missing image block preflight', async () => {
  const missingResolver = {async resolveMany() { return {indexSummary:{},results:new Map([['file:missing.webp',{status:'MISSING',code:'IMAGE_NOT_FOUND'}]])}; }};
  const rows = [2,3].map(() => ({'Content Title *':'Hello','External Reference Code *':'same','Body * [body]':'Body','Cover Image Reference * [coverImage]':'file:missing.webp'}));
  const result = await validateAndBuildPayload({folder:{id:20},imageResolver:missingResolver,mapping,rowNumbers:[2,3],rows,structure:{id:10},targets});
  assert.equal(result.canImport, false);
  assert(result.errors.some((item) => item.code === 'ERC_DUPLICATE_IN_WORKBOOK'));
  assert(result.errors.some((item) => item.code === 'IMAGE_NOT_FOUND'));
});
