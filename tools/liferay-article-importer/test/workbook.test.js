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
    {dataType: 'string', fieldReference: 'body', inputControl: 'rich_text', label: 'Body', required: true},
    {dataType: 'image', fieldReference: 'coverImage', label: 'Cover Image', required: true}
  ],
  externalReferenceCode: 'NXC_ARTICLE',
  id: 35396,
  name: 'NXC Article'
};
const folder = {externalReferenceCode: 'NXC_ARTICLES', id: 456, name: 'Articles'};

test('generates Articles, Field Guide, and folder-bound hidden Metadata', async () => {
  const template = await buildTemplateWorkbook(structure, folder);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(template.buffer);

  assert.equal(template.fileName, 'NXC_ARTICLE_template.xlsx');
  assert.ok(workbook.getWorksheet('Articles'));
  assert.ok(workbook.getWorksheet('Field Guide'));
  assert.equal(workbook.getWorksheet('Metadata').state, 'veryHidden');
  assert.deepEqual(workbook.getWorksheet('Articles').getRow(1).values.slice(1), [
    'Article Title *',
    'External Reference Code *',
    'Body * [body]',
    'Cover Image * ERC [coverImage]'
  ]);
});

test('parses a generated template with deterministic image mapping and folder metadata', async () => {
  const template = await buildTemplateWorkbook(structure, folder);
  const parsed = await parseTemplateWorkbook(template.buffer, structure, folder);

  assert.equal(parsed.metadata.structureId, '35396');
  assert.equal(parsed.metadata.structureFingerprint, structureFingerprint(structure));
  assert.equal(parsed.metadata.targetFolderExternalReferenceCode, 'NXC_ARTICLES');
  assert.equal(parsed.mapping['content.body'], 'Body * [body]');
  assert.equal(parsed.mapping['content.coverImage'], 'Cover Image * ERC [coverImage]');
  assert.equal(parsed.rows.length, 1);
});
