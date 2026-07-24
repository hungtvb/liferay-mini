import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTargets} from '../server/mapping.js';
import {convertValue, validateAndBuildPayload} from '../server/validation.js';

const structure = {
  contentStructureFields: [
    {dataType: 'string', label: 'Summary', name: 'summary'},
    {dataType: 'boolean', label: 'Active', name: 'active'},
    {dataType: 'date', label: 'Publication date', name: 'publicationDate'}
  ],
  id: 123
};
const targets = buildTargets(structure);
const mapping = {
  'content.active': 'Active',
  'content.publicationDate': 'Date',
  'content.summary': 'Summary',
  'system.externalReferenceCode': 'ERC',
  'system.title': 'Title'
};

test('builds the StructuredContent batch payload', () => {
  const result = validateAndBuildPayload({
    mapping,
    rowNumbers: [2],
    rows: [{Active: 'yes', Date: '2026-07-24', ERC: 'NXC-ARTICLE-001', Summary: 'Hello', Title: 'First article'}],
    structure,
    targets
  });

  assert.equal(result.canImport, true);
  assert.deepEqual(result.payload, [{
    contentFields: [
      {contentFieldValue: {data: 'Hello'}, name: 'summary'},
      {contentFieldValue: {data: true}, name: 'active'},
      {contentFieldValue: {data: '2026-07-24'}, name: 'publicationDate'}
    ],
    contentStructureId: 123,
    externalReferenceCode: 'NXC-ARTICLE-001',
    title: 'First article'
  }]);
});

test('rejects duplicate ERCs and empty titles', () => {
  const result = validateAndBuildPayload({
    mapping,
    rowNumbers: [2, 3],
    rows: [
      {Active: true, Date: '2026-07-24', ERC: 'NXC-1', Summary: 'A', Title: 'A'},
      {Active: false, Date: '2026-07-25', ERC: 'nxc-1', Summary: 'B', Title: ''}
    ],
    structure,
    targets
  });

  assert.equal(result.canImport, false);
  assert.ok(result.errors.some((entry) => entry.message.includes('Duplicate external reference code')));
  assert.ok(result.errors.some((entry) => entry.message.includes('Article title')));
});

test('converts supported scalar types', () => {
  assert.equal(convertValue('1', {dataType: 'boolean'}), true);
  assert.equal(convertValue('42', {dataType: 'integer'}), 42);
  assert.equal(convertValue('4.2', {dataType: 'double'}), 4.2);
  assert.equal(convertValue(new Date('2026-07-24T00:00:00Z'), {dataType: 'date'}), '2026-07-24');
});
