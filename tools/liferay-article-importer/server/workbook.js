import crypto from 'node:crypto';
import ExcelJS from 'exceljs';
import {AppError, assert} from './errors.js';
import {buildTemplateColumns, buildTargets, createTemplateMapping} from './mapping.js';

const TEMPLATE_VERSION = '1';

function cellValue(value) {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value !== 'object') return value;
  if ('result' in value) return cellValue(value.result);
  if (Array.isArray(value.richText)) return value.richText.map((part) => part.text || '').join('');
  if ('text' in value) return value.text;
  if ('hyperlink' in value) return value.text || value.hyperlink;
  return String(value);
}

function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function rowIsBlank(row) {
  let hasValue = false;
  row.eachCell({includeEmpty: false}, (cell) => {
    if (!isBlank(cellValue(cell.value))) hasValue = true;
  });
  return !hasValue;
}

export function structureFingerprint(structure) {
  const fields = buildTargets(structure)
    .filter((target) => target.key.startsWith('content.'))
    .map((target) => ({
      dataType: target.dataType,
      name: target.name,
      required: target.required,
      supported: target.supported
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  return crypto.createHash('sha256').update(JSON.stringify(fields)).digest('hex');
}

function safeFileName(value) {
  return String(value || 'ARTICLE')
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '_')
    .replace(/^_+|_+$/g, '') || 'ARTICLE';
}

export async function buildTemplateWorkbook(structure) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Nexcent Liferay Article Importer';
  workbook.created = new Date();

  const columns = buildTemplateColumns(structure);
  const articles = workbook.addWorksheet('Articles', {views: [{state: 'frozen', ySplit: 1}]});
  articles.columns = columns.map((column) => ({header: column.header, key: column.key, width: Math.max(18, Math.min(48, column.header.length + 6))}));
  articles.autoFilter = {from: 'A1', to: `${articles.getColumn(columns.length).letter}1`};
  articles.getRow(1).font = {bold: true, color: {argb: 'FFFFFFFF'}};
  articles.getRow(1).fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF4CAF4F'}};
  articles.getRow(1).alignment = {vertical: 'middle', wrapText: true};
  articles.getRow(1).height = 30;

  const sample = {};
  for (const column of columns) {
    if (column.key === 'system.title') sample[column.key] = 'Sample article title';
    else if (column.key === 'system.externalReferenceCode') sample[column.key] = 'article-sample-001';
    else if (String(column.dataType).toLowerCase() === 'boolean') sample[column.key] = true;
    else if (String(column.dataType).toLowerCase() === 'date') sample[column.key] = '2026-07-24';
    else if (['integer', 'long', 'double', 'float', 'number', 'decimal'].includes(String(column.dataType).toLowerCase())) sample[column.key] = 1;
    else sample[column.key] = column.inputControl === 'rich_text' ? '<p>Sample content</p>' : `Sample ${column.label}`;
  }
  articles.addRow(sample);
  articles.getRow(2).font = {italic: true, color: {argb: 'FF6B7280'}};

  columns.forEach((column, index) => {
    const excelColumn = articles.getColumn(index + 1);
    if (String(column.dataType).toLowerCase() === 'boolean') {
      for (let row = 2; row <= 5001; row += 1) {
        articles.getCell(row, index + 1).dataValidation = {allowBlank: !column.required, formulae: ['"true,false"'], type: 'list'};
      }
    }
    if (String(column.dataType).toLowerCase() === 'date') excelColumn.numFmt = 'yyyy-mm-dd';
  });

  const guide = workbook.addWorksheet('Field Guide', {views: [{state: 'frozen', ySplit: 1}]});
  guide.columns = [
    {header: 'Column', key: 'header', width: 38},
    {header: 'Field Reference', key: 'name', width: 28},
    {header: 'Type', key: 'dataType', width: 18},
    {header: 'Required', key: 'required', width: 12},
    {header: 'Format / Notes', key: 'notes', width: 52}
  ];
  guide.getRow(1).font = {bold: true};
  columns.forEach((column) => guide.addRow({
    dataType: column.dataType,
    header: column.header,
    name: column.name,
    notes: String(column.dataType).toLowerCase() === 'date' ? 'YYYY-MM-DD' : String(column.dataType).toLowerCase() === 'boolean' ? 'true or false' : column.inputControl === 'rich_text' ? 'HTML is allowed' : 'Do not rename this column',
    required: column.required ? 'Yes' : 'No'
  }));

  const unsupported = buildTargets(structure).filter((target) => target.key.startsWith('content.') && !target.supported);
  unsupported.forEach((target) => guide.addRow({dataType: target.dataType, header: 'Not included', name: target.name, notes: 'Unsupported in migration v1 (image, document, nested, repeatable, relationship, grid)', required: target.required ? 'Yes' : 'No'}));

  const metadata = workbook.addWorksheet('Metadata');
  metadata.columns = [{header: 'Key', key: 'key', width: 38}, {header: 'Value', key: 'value', width: 80}];
  metadata.getRow(1).font = {bold: true};
  const values = {
    defaultLocale: structure.availableLanguages?.[0] || 'en-US',
    generatedAt: new Date().toISOString(),
    structureExternalReferenceCode: structure.externalReferenceCode || '',
    structureFingerprint: structureFingerprint(structure),
    structureId: String(structure.id),
    structureName: typeof structure.name === 'string' ? structure.name : JSON.stringify(structure.name || ''),
    templateVersion: TEMPLATE_VERSION
  };
  Object.entries(values).forEach(([key, value]) => metadata.addRow({key, value}));
  metadata.state = 'veryHidden';

  return {
    buffer: await workbook.xlsx.writeBuffer(),
    fileName: `${safeFileName(structure.externalReferenceCode || structure.name)}_template.xlsx`
  };
}

function readMetadata(workbook) {
  const worksheet = workbook.getWorksheet('Metadata');
  assert(worksheet, 400, 'TEMPLATE_METADATA_MISSING', 'The workbook is not a generated importer template (Metadata sheet missing)');
  const metadata = {};
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const key = String(cellValue(row.getCell(1).value) ?? '').trim();
    if (key) metadata[key] = String(cellValue(row.getCell(2).value) ?? '').trim();
  });
  return metadata;
}

export async function parseTemplateWorkbook(buffer, structure) {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer);
  }
  catch (error) {
    throw new AppError(400, 'WORKBOOK_INVALID', 'The uploaded file is not a readable .xlsx workbook', {cause: error.message});
  }

  const metadata = readMetadata(workbook);
  assert(metadata.templateVersion === TEMPLATE_VERSION, 400, 'TEMPLATE_VERSION_UNSUPPORTED', `Template version ${metadata.templateVersion || 'unknown'} is not supported`);
  assert(String(metadata.structureId) === String(structure.id), 400, 'TEMPLATE_STRUCTURE_MISMATCH', 'This template belongs to a different Content Structure');
  assert(metadata.structureFingerprint === structureFingerprint(structure), 409, 'STRUCTURE_CHANGED', 'The Content Structure changed after this template was generated. Download a new template.');

  const worksheet = workbook.getWorksheet('Articles');
  assert(worksheet, 400, 'ARTICLES_SHEET_MISSING', 'The Articles sheet is missing');
  const headerRow = worksheet.getRow(1);
  const headers = [];
  for (let column = 1; column <= headerRow.cellCount; column += 1) headers.push(String(cellValue(headerRow.getCell(column).value) ?? '').trim());
  assert(headers.some(Boolean), 400, 'HEADER_MISSING', 'The Articles header row is empty');

  const expectedColumns = buildTemplateColumns(structure);
  const expectedHeaders = expectedColumns.map((column) => column.header);
  assert(JSON.stringify(headers.filter(Boolean)) === JSON.stringify(expectedHeaders), 400, 'TEMPLATE_HEADERS_CHANGED', 'Template columns were renamed, removed, added, or reordered. Download a fresh template and keep its headers unchanged.');

  const rows = [];
  const rowNumbers = [];
  for (let rowNumber = 2; rowNumber <= worksheet.actualRowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    if (rowIsBlank(row)) continue;
    const record = {};
    headers.forEach((header, index) => { if (header) record[header] = cellValue(row.getCell(index + 1).value); });
    rows.push(record);
    rowNumbers.push(rowNumber);
  }
  assert(rows.length > 0, 400, 'WORKBOOK_NO_ROWS', 'The Articles sheet contains no data rows');

  const targets = buildTargets(structure);
  return {
    headers,
    mapping: createTemplateMapping(headers, targets),
    metadata,
    rowNumbers,
    rows,
    sheetName: worksheet.name,
    targets
  };
}
