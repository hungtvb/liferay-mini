import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTargets, createAutoMapping, normalizeKey} from '../server/mapping.js';

test('normalizeKey ignores case, spaces, punctuation, and accents', () => {
  assert.equal(normalizeKey('Tiêu đề bài viết'), 'tieudebaiviet');
  assert.equal(normalizeKey('external_reference-code'), 'externalreferencecode');
});

test('auto mapping matches system fields and Structure field names', () => {
  const structure = {
    contentStructureFields: [
      {dataType: 'string', label: 'Summary', name: 'summary'},
      {dataType: 'boolean', label: 'Active', name: 'active'}
    ]
  };
  const targets = buildTargets(structure);
  const mapping = createAutoMapping(['externalReferenceCode', 'Title', 'Summary', 'active'], targets);

  assert.equal(mapping['system.title'], 'Title');
  assert.equal(mapping['system.externalReferenceCode'], 'externalReferenceCode');
  assert.equal(mapping['content.summary'], 'Summary');
  assert.equal(mapping['content.active'], 'active');
});

test('nested and repeatable fields are marked unsupported', () => {
  const targets = buildTargets({
    contentStructureFields: [
      {dataType: 'string', name: 'tags', repeatable: true},
      {dataType: 'string', name: 'author', nestedContentStructureFields: [{name: 'name'}]}
    ]
  });

  assert.equal(targets.find((target) => target.name === 'tags').supported, false);
  assert.equal(targets.find((target) => target.name === 'author').supported, false);
});
