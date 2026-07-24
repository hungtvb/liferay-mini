import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTargets} from '../server/mapping.js';
import {convertValue, validateAndBuildPayload} from '../server/validation.js';

const structure = {
  contentStructureFields: [
    {dataType: 'string', label: 'Body', name: 'body', required: true},
    {dataType: 'image', label: 'Cover Image', name: 'coverImage', required: true}
  ],
  id: 123
};
const targets = buildTargets(structure);
const mapping = {
  'content.body': 'Body',
  'content.coverImage': 'Cover Image ERC',
  'system.externalReferenceCode': 'ERC',
  'system.title': 'Title'
};
const folder = {externalReferenceCode: 'NXC_ARTICLES', id: 456, name: 'Articles'};
const image = {
  contentType: 'Document',
  contentUrl: '/documents/20117/0/cover.png/uuid',
  description: 'Cover description',
  encodingFormat: 'image/png',
  externalReferenceCode: 'IMG-COVER-001',
  fileExtension: 'png',
  id: 789,
  sizeInBytes: 1234,
  title: 'cover.png'
};

test('builds payload in the configured folder with a resolved image', async () => {
  const result = await validateAndBuildPayload({
    folder,
    mapping,
    resolveDocument: async (erc) => erc === 'IMG-COVER-001' ? image : null,
    rowNumbers: [2],
    rows: [{Body: '<p>Hello</p>', 'Cover Image ERC': 'IMG-COVER-001', ERC: 'NXC-ARTICLE-001', Title: 'First article'}],
    structure,
    targets
  });
  assert.equal(result.canImport, true);
  assert.deepEqual(result.payload, [{
    contentFields: [
      {contentFieldValue: {data: '<p>Hello</p>'}, name: 'body'},
      {contentFieldValue: {image: {
        contentType: 'Document',
        contentUrl: '/documents/20117/0/cover.png/uuid',
        description: 'Cover description',
        encodingFormat: 'image/png',
        fileExtension: 'png',
        id: 789,
        sizeInBytes: 1234,
        title: 'cover.png'
      }}, name: 'coverImage'}
    ],
    contentStructureId: 123,
    externalReferenceCode: 'NXC-ARTICLE-001',
    structuredContentFolderId: 456,
    title: 'First article'
  }]);
});

test('rejects a row when the referenced image does not exist', async () => {
  const result = await validateAndBuildPayload({
    folder,
    mapping,
    resolveDocument: async () => null,
    rowNumbers: [2],
    rows: [{Body: '<p>Hello</p>', 'Cover Image ERC': 'MISSING-IMAGE', ERC: 'NXC-ARTICLE-001', Title: 'First article'}],
    structure,
    targets
  });
  assert.equal(result.canImport, false);
  assert.equal(result.stats.invalidRows, 1);
  assert.ok(result.errors.some((entry) => entry.row === 2 && entry.message.includes('does not exist')));
});

test('rejects duplicate article ERCs and empty titles', async () => {
  const result = await validateAndBuildPayload({
    folder,
    mapping,
    resolveDocument: async () => image,
    rowNumbers: [2, 3],
    rows: [
      {Body: 'A', 'Cover Image ERC': 'IMG-COVER-001', ERC: 'NXC-1', Title: 'A'},
      {Body: 'B', 'Cover Image ERC': 'IMG-COVER-001', ERC: 'nxc-1', Title: ''}
    ],
    structure,
    targets
  });
  assert.equal(result.canImport, false);
  assert.ok(result.errors.some((entry) => entry.message.includes('Duplicate external reference code')));
  assert.ok(result.errors.some((entry) => entry.message.includes('Article Title')));
});

test('converts supported scalar types', () => {
  assert.equal(convertValue('1', {dataType: 'boolean'}), true);
  assert.equal(convertValue('42', {dataType: 'integer'}), 42);
  assert.equal(convertValue('4.2', {dataType: 'double'}), 4.2);
  assert.equal(convertValue(new Date('2026-07-24T00:00:00Z'), {dataType: 'date'}), '2026-07-24');
});
