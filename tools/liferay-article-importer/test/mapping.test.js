import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTargets,
  buildTemplateColumns,
  createTemplateMapping,
  normalizeKey
} from '../server/mapping.js';

test('normalizeKey ignores case, spaces, punctuation, and accents', () => {
  assert.equal(normalizeKey('Tiêu đề bài viết'), 'tieudebaiviet');
  assert.equal(normalizeKey('external_reference-code'), 'externalreferencecode');
});

test('template columns preserve field references and required markers', () => {
  const columns = buildTemplateColumns({
    contentStructureFields: [
      {dataType: 'string', fieldReference: 'summary', label: 'Summary', name: 'SummaryField'},
      {dataType: 'boolean', fieldReference: 'active', label: 'Active', required: true}
    ]
  });

  assert.deepEqual(columns.map((column) => column.header), [
    'Article Title *',
    'External Reference Code *',
    'Summary [summary]',
    'Active * [active]'
  ]);
});

test('template mapping is deterministic from system headers and bracketed field references', () => {
  const structure = {
    contentStructureFields: [
      {dataType: 'string', fieldReference: 'summary', label: 'Summary'},
      {dataType: 'boolean', fieldReference: 'active', label: 'Active'}
    ]
  };
  const targets = buildTargets(structure);
  const headers = buildTemplateColumns(structure).map((column) => column.header);
  const mapping = createTemplateMapping(headers, targets);

  assert.equal(mapping['system.title'], 'Article Title *');
  assert.equal(mapping['system.externalReferenceCode'], 'External Reference Code *');
  assert.equal(mapping['content.summary'], 'Summary [summary]');
  assert.equal(mapping['content.active'], 'Active [active]');
});

test('image, nested, and repeatable fields are marked unsupported', () => {
  const targets = buildTargets({
    contentStructureFields: [
      {dataType: 'image', fieldReference: 'coverImage'},
      {dataType: 'string', fieldReference: 'tags', repeatable: true},
      {dataType: 'string', fieldReference: 'author', nestedContentStructureFields: [{name: 'name'}]}
    ]
  });

  assert.equal(targets.find((target) => target.name === 'coverImage').supported, false);
  assert.equal(targets.find((target) => target.name === 'tags').supported, false);
  assert.equal(targets.find((target) => target.name === 'author').supported, false);
});
