import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import {
  buildTemplateWorkbook,
  parseTemplateWorkbook,
  structureFingerprint
} from '../server/workbook.js';

const structure = {
  availableLanguages: ['en-US'],
  contentStructureFields: [
    {dataType: 'string', fieldReference: 'summary', label: 'Summary', required: true},
    {dataType: 'boolean', fieldReference: 'active', label: 'Active'},
    {dataType: 'image', fieldReference: 'coverImage', label: 'Cover Image'}
  ],
  externalReferenceCode: 'NXC_ARTICLE',
  id: 35396,
  name: 'NXC Article'
};

test('generates Articles, Field Guide, and hidden Metadata sheets', async () => {
  const template = await buildTemplateWorkbook(structure);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(template.buffer);

  assert.equal(template.fileName, 'NXC_ARTICLE_template.xlsx');
  assert.ok(workbook.getWorksheet('Articles'));
  assert.ok(workbook.getWorksheet('Field Guide'));
  assert.equal(workbook.getWorksheet('Metadata').state, 'veryHidden');
  assert.deepEqual(workbook.getWorksheet('Articles').getRow(1).values.slice(1), [
    'Article Title *',
    'External Reference Code *',
    'Summary * [summary]',
    'Active [active]'
  ]);
});

test('parses a generated template with deterministic mapping', async () => {
  const template = await buildTemplateWorkbook(structure);
  const parsed = await parseTemplateWorkbook(template.buffer, structure);

  assert.equal(parsed.metadata.structureId, '35396');
  assert.equal(parsed.metadata.structureFingerprint, structureFingerprint(structure));
  assert.equal(parsed.mapping['content.summary'], 'Summary * [summary]');
  assert.equal(parsed.mapping['content.active'], 'Active [active]');
  assert.equal(parsed.rows.length, 1);
});
