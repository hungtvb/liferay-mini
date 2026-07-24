import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeStructure, structureFingerprint} from '../server/structure-analyzer.js';

const flat = {
  id: 10, name: 'Hero', availableLanguages: ['en-US'], contentStructureFields: [
    {dataType: 'string', fieldReference: 'heading', name: 'Text1', required: true},
    {dataType: 'image', fieldReference: 'heroImage', name: 'Image1'}
  ]
};

test('flat Article/Hero-style Structure is supported', () => {
  const result = analyzeStructure(flat);
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(result.supportedFields[1].valueKind, 'imageReference');
});

test('optional unsupported scalar field is excluded with warning', () => {
  const result = analyzeStructure({...flat, contentStructureFields: [...flat.contentStructureFields, {dataType: 'relationship', fieldReference: 'owner', name: 'Rel1'}]});
  assert.equal(result.status, 'SUPPORTED_WITH_WARNINGS');
  assert.equal(result.excludedFields.length, 1);
});

test('nested or repeatable field blocks flat importer', () => {
  const nested = analyzeStructure({...flat, contentStructureFields: [{dataType: 'string', fieldReference: 'slides', name: 'Nested1', nestedContentStructureFields: [{name: 'title'}]}]});
  assert.equal(nested.status, 'UNSUPPORTED');
});

test('fingerprint preserves fieldReference and internal name', () => {
  const first = structureFingerprint(flat);
  const changedName = structureFingerprint({...flat, contentStructureFields: [{...flat.contentStructureFields[0], name: 'Text2'}, flat.contentStructureFields[1]]});
  assert.notEqual(first, changedName);
});
