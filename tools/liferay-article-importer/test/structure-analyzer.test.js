import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeStructure, structureFingerprint} from '../server/structure-analyzer.js';

const flat = {
  id: 10,
  name: 'Hero',
  siteId: 34371,
  availableLanguages: ['en-US'],
  contentStructureFields: [
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

test('select and radio fields expose exact option values', () => {
  const result = analyzeStructure({
    ...flat,
    contentStructureFields: [{
      dataType: 'string',
      fieldReference: 'theme',
      inputControl: 'select',
      name: 'Select1',
      options: [{label: 'Light theme', value: 'light'}, {label: 'Dark theme', value: 'dark'}],
      required: true
    }]
  });
  assert.equal(result.status, 'SUPPORTED');
  assert.equal(result.supportedFields[0].valueKind, 'option');
  assert.deepEqual(result.supportedFields[0].options.map((option) => option.value), ['light', 'dark']);
});

test('required option field without options is unsupported', () => {
  const result = analyzeStructure({
    ...flat,
    contentStructureFields: [{dataType: 'string', fieldReference: 'theme', inputControl: 'select', name: 'Select1', required: true}]
  });
  assert.equal(result.status, 'UNSUPPORTED');
  assert.equal(result.blockingFields[0].reason, 'OPTION_VALUES_MISSING');
});

test('fingerprint preserves field identity and option contract', () => {
  const first = structureFingerprint(flat);
  const changedName = structureFingerprint({...flat, contentStructureFields: [{...flat.contentStructureFields[0], name: 'Text2'}, flat.contentStructureFields[1]]});
  assert.notEqual(first, changedName);

  const select = {
    ...flat,
    contentStructureFields: [{
      dataType: 'string',
      fieldReference: 'theme',
      inputControl: 'select',
      name: 'Select1',
      options: [{value: 'light'}]
    }]
  };
  const changedOptions = {
    ...select,
    contentStructureFields: [{...select.contentStructureFields[0], options: [{value: 'dark'}]}]
  };
  assert.notEqual(structureFingerprint(select), structureFingerprint(changedOptions));
});
