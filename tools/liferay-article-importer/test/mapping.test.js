import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTargets, buildTemplateColumns, createTemplateMapping, normalizeKey} from '../server/mapping.js';

test('normalizeKey ignores case, spaces, punctuation, and accents', () => {
  assert.equal(normalizeKey('Tiêu đề bài viết'), 'tieudebaiviet');
  assert.equal(normalizeKey('external_reference-code'), 'externalreferencecode');
});

test('template columns include image ERC and preserve field references', () => {
  const columns = buildTemplateColumns({contentStructureFields: [
    {dataType: 'string', fieldReference: 'body', label: 'Body', required: true},
    {dataType: 'image', fieldReference: 'coverImage', label: 'Cover Image', required: true}
  ]});
  assert.deepEqual(columns.map((column) => column.header), [
    'Article Title *',
    'External Reference Code *',
    'Body * [body]',
    'Cover Image * ERC [coverImage]'
  ]);
});

test('template mapping is deterministic for bracketed image references', () => {
  const structure = {contentStructureFields: [{dataType: 'image', fieldReference: 'coverImage', label: 'Cover Image'}]};
  const targets = buildTargets(structure);
  const headers = buildTemplateColumns(structure).map((column) => column.header);
  const mapping = createTemplateMapping(headers, targets);
  assert.equal(mapping['system.title'], 'Article Title *');
  assert.equal(mapping['system.externalReferenceCode'], 'External Reference Code *');
  assert.equal(mapping['content.coverImage'], 'Cover Image ERC [coverImage]');
});

test('image is supported while nested and repeatable fields remain unsupported', () => {
  const targets = buildTargets({contentStructureFields: [
    {dataType: 'image', fieldReference: 'coverImage'},
    {dataType: 'string', fieldReference: 'tags', repeatable: true},
    {dataType: 'string', fieldReference: 'author', nestedContentStructureFields: [{name: 'name'}]}
  ]});
  assert.equal(targets.find((target) => target.name === 'coverImage').supported, true);
  assert.equal(targets.find((target) => target.name === 'coverImage').valueKind, 'documentExternalReferenceCode');
  assert.equal(targets.find((target) => target.name === 'tags').supported, false);
  assert.equal(targets.find((target) => target.name === 'author').supported, false);
});
