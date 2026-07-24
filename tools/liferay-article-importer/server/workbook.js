import ExcelJS from 'exceljs';
import {assert} from './errors.js';
import {buildTargets, buildTemplateColumns, strictTemplateMapping} from './mapping.js';
import {analyzeStructure} from './structure-analyzer.js';

const TEMPLATE_VERSION = '4';
const CONTENT_SHEET = 'Content Items';
const GUIDE_SHEET = 'Field Guide';
const EXAMPLE_SHEET = 'Example';
const METADATA_SHEET = 'Metadata';

function safeFileName(value) {
  return String(value || 'structured-content')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function metadataContract({folder, imageSource, locale, siteId, structure}) {
  const analysis = analyzeStructure(structure, locale);
  return {
    generatedAt: new Date().toISOString(),
    imageSourceFolderId: imageSource.folderId ?? '',
    imageSourceId: imageSource.id,
    imageSourceType: imageSource.type,
    locale,
    siteId,
    structureFingerprint: analysis.fingerprint,
    structureId: structure.id,
    structureName: analysis.name,
    targetFolderId: folder.id,
    targetFolderName: folder.name,
    templateVersion: TEMPLATE_VERSION
  };
}

function acceptedValue(column) {
  if (column.valueKind === 'imageReference') return 'file:<exact-file-name> or erc:<exact-document-erc>';
  if (column.valueKind === 'option') return column.options.map((option) => option.value).join(' | ');
  return column.dataType;
}

function sampleValue(column) {
  if (column.key === 'system.title') return 'Example content item';
  if (column.key === 'system.externalReferenceCode') return 'example-content-item';
  if (column.valueKind === 'imageReference') return 'file:example-image.webp';
  if (column.valueKind === 'option') return column.options[0]?.value || '';
  if (column.dataType === 'boolean') return true;
  if (column.dataType === 'date') return '2026-01-31';
  if (['integer', 'long'].includes(column.dataType)) return 1;
  if (['decimal', 'double', 'float', 'number'].includes(column.dataType)) return 1.5;
  return `Example ${column.label}`;
}

function styleHeader(row) {
  row.font = {bold: true};
  row.alignment = {vertical: 'middle'};
  row.height = 24;
}

function writeMetadata(workbook, metadata) {
  const sheet = workbook.addWorksheet(METADATA_SHEET, {state: 'veryHidden'});
  sheet.addRow(['key', 'value']);
  for (const [key, value] of Object.entries(metadata)) sheet.addRow([key, String(value ?? '')]);
}

function readMetadata(workbook) {
  const sheet = workbook.getWorksheet(METADATA_SHEET);
  assert(sheet, 400, 'TEMPLATE_METADATA_MISSING', 'Metadata sheet is missing');
  const metadata = {};
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const key = String(row.getCell(1).value || '').trim();
    if (key) metadata[key] = String(row.getCell(2).value ?? '').trim();
  });
  return metadata;
}

function assertMetadata(actual, expected) {
  assert(actual.templateVersion === TEMPLATE_VERSION, 400, 'TEMPLATE_VERSION_UNSUPPORTED', `Template version ${actual.templateVersion || 'missing'} is not supported`);
  const checks = [
    ['siteId', 'TEMPLATE_SITE_MISMATCH'],
    ['structureId', 'TEMPLATE_STRUCTURE_MISMATCH'],
    ['structureFingerprint', 'STRUCTURE_CHANGED'],
    ['targetFolderId', 'TARGET_FOLDER_CHANGED'],
    ['locale', 'LOCALE_CHANGED'],
    ['imageSourceType', 'IMAGE_SOURCE_CHANGED'],
    ['imageSourceId', 'IMAGE_SOURCE_CHANGED'],
    ['imageSourceFolderId', 'IMAGE_SOURCE_CHANGED']
  ];
  for (const [key, code] of checks) {
    assert(String(actual[key] ?? '') === String(expected[key] ?? ''), 400, code, `Workbook metadata ${key} no longer matches the selected migration scope`);
  }
}

export async function buildTemplateWorkbook({folder, imageSource, locale, siteId, structure}) {
  const analysis = analyzeStructure(structure, locale);
  assert(analysis.status !== 'UNSUPPORTED', 409, 'STRUCTURE_UNSUPPORTED', 'Selected Structure contains nested, repeatable, or required unsupported fields', {blockingFields: analysis.blockingFields});
  const columns = buildTemplateColumns(structure, locale);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Liferay Flat Structured Content Importer';
  workbook.created = new Date();

  const content = workbook.addWorksheet(CONTENT_SHEET, {views: [{state: 'frozen', ySplit: 1}]});
  content.addRow(columns.map((column) => column.header));
  styleHeader(content.getRow(1));
  content.columns = columns.map((column) => ({key: column.key, width: Math.max(22, Math.min(48, column.header.length + 4))}));
  content.autoFilter = {from: {row: 1, column: 1}, to: {row: 1, column: columns.length}};

  const guide = workbook.addWorksheet(GUIDE_SHEET);
  guide.addRow(['Column', 'Field Reference', 'Internal Name', 'Type', 'Required', 'Input Control', 'Accepted Value']);
  styleHeader(guide.getRow(1));
  for (const column of columns) {
    guide.addRow([
      column.header,
      column.fieldReference || '',
      column.name,
      column.dataType,
      column.required ? 'Yes' : 'No',
      column.inputControl || '',
      acceptedValue(column)
    ]);
  }
  for (const field of analysis.excludedFields) {
    guide.addRow([`Excluded: ${field.label}`, field.fieldReference, field.name, field.dataType, field.required ? 'Yes' : 'No', field.inputControl || '', field.reason]);
  }
  guide.columns = [{width: 42}, {width: 28}, {width: 28}, {width: 16}, {width: 12}, {width: 18}, {width: 54}];

  const example = workbook.addWorksheet(EXAMPLE_SHEET);
  example.addRow(columns.map((column) => column.header));
  example.addRow(columns.map(sampleValue));
  styleHeader(example.getRow(1));
  example.columns = content.columns.map((column) => ({width: column.width}));

  const metadata = metadataContract({folder, imageSource, locale, siteId, structure});
  writeMetadata(workbook, metadata);
  return {
    buffer: await workbook.xlsx.writeBuffer(),
    fileName: `${safeFileName(analysis.name)}-import-template.xlsx`,
    metadata
  };
}

function cellValue(cell) {
  const value = cell.value;
  if (value && typeof value === 'object' && 'text' in value) return value.text;
  if (value && typeof value === 'object' && 'result' in value) return value.result;
  return value;
}

export async function parseTemplateWorkbook(buffer, context) {
  const workbook = new ExcelJS.Workbook();
  try { await workbook.xlsx.load(buffer); }
  catch (error) { throw Object.assign(new Error(`Workbook could not be read: ${error.message}`), {code: 'WORKBOOK_INVALID', status: 400}); }

  const sheet = workbook.getWorksheet(CONTENT_SHEET);
  assert(sheet, 400, 'WORKBOOK_INVALID', `Workbook must contain the "${CONTENT_SHEET}" sheet`);
  const expectedMetadata = metadataContract(context);
  const metadata = readMetadata(workbook);
  assertMetadata(metadata, expectedMetadata);

  const columns = buildTemplateColumns(context.structure, context.locale);
  const headers = sheet.getRow(1).values.slice(1).map((value) => String(value ?? '').trim());
  const mapping = strictTemplateMapping(headers, columns);
  assert(mapping, 400, 'TEMPLATE_HEADERS_CHANGED', 'Content Items headers were renamed, reordered, added, or removed');

  const rows = [];
  const rowNumbers = [];
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const excelRow = sheet.getRow(rowNumber);
    const values = headers.map((header, index) => [header, cellValue(excelRow.getCell(index + 1))]);
    if (values.every(([, value]) => value == null || String(value).trim() === '')) continue;
    rows.push(Object.fromEntries(values));
    rowNumbers.push(rowNumber);
  }
  assert(rows.length > 0, 400, 'WORKBOOK_NO_ROWS', 'The Content Items sheet contains no data rows');

  return {
    headers,
    mapping,
    metadata,
    rowNumbers,
    rows,
    sheetName: CONTENT_SHEET,
    targets: buildTargets(context.structure, context.locale)
  };
}

export {TEMPLATE_VERSION};
