import ExcelJS from 'exceljs';
import {assert} from './errors.js';

function safeFileName(value) {
  return String(value || 'structured-content')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function styleHeader(row) {
  row.font = {bold: true, color: {argb: 'FFFFFFFF'}};
  row.fill = {type: 'pattern', pattern: 'solid', fgColor: {argb: 'FF2F7D32'}};
  row.alignment = {vertical: 'middle'};
  row.height = 24;
}

function addKeyValueSheet(workbook, name, entries) {
  const sheet = workbook.addWorksheet(name, {views: [{state: 'frozen', ySplit: 1}]});
  sheet.addRow(['Field', 'Value']);
  styleHeader(sheet.getRow(1));
  for (const [field, value] of entries) sheet.addRow([field, value ?? '']);
  sheet.columns = [{width: 30}, {width: 72}];
  return sheet;
}

function issueIndex(validation) {
  const map = new Map();
  for (const item of [...(validation.errors || []), ...(validation.warnings || [])]) {
    const key = item.row == null ? 'global' : String(item.row);
    const current = map.get(key) || [];
    current.push(item);
    map.set(key, current);
  }
  return map;
}

function addRowsSheet(workbook, validation) {
  const sheet = workbook.addWorksheet('Rows', {views: [{state: 'frozen', ySplit: 1}]});
  const headers = ['Excel Row', 'External Reference Code', 'Title', 'Friendly URL', 'Friendly URL Source', 'Status', 'Errors', 'Warnings', 'Messages'];
  sheet.addRow(headers);
  styleHeader(sheet.getRow(1));

  const byRow = issueIndex(validation);
  for (const row of validation.rowResults || []) {
    const issues = byRow.get(String(row.row)) || [];
    const errors = issues.filter((item) => item.severity !== 'warning');
    const warnings = issues.filter((item) => item.severity === 'warning');
    sheet.addRow([
      row.row,
      row.externalReferenceCode || '',
      row.title || '',
      row.friendlyUrlPath || '',
      row.friendlyUrlGenerated ? 'Generated from title' : 'Workbook value',
      row.status,
      errors.length,
      warnings.length,
      issues.map((item) => `${item.code}: ${item.message}`).join('\n')
    ]);
  }

  sheet.autoFilter = {from: 'A1', to: 'I1'};
  sheet.columns = [
    {width: 12}, {width: 30}, {width: 36}, {width: 36}, {width: 24}, {width: 14}, {width: 10}, {width: 10}, {width: 80}
  ];
  sheet.getColumn(9).alignment = {wrapText: true, vertical: 'top'};
  return sheet;
}

function addIssuesSheet(workbook, validation) {
  const sheet = workbook.addWorksheet('Issues', {views: [{state: 'frozen', ySplit: 1}]});
  const headers = ['Severity', 'Code', 'Excel Row', 'Field', 'External Reference Code', 'Title', 'Friendly URL', 'Message', 'Value'];
  sheet.addRow(headers);
  styleHeader(sheet.getRow(1));

  const rowsByNumber = new Map((validation.rowResults || []).map((row) => [String(row.row), row]));
  const issues = [...(validation.errors || []), ...(validation.warnings || [])];
  for (const item of issues) {
    const row = item.row == null ? null : rowsByNumber.get(String(item.row));
    sheet.addRow([
      item.severity === 'warning' ? 'Warning' : 'Error',
      item.code,
      item.row ?? '',
      item.field || '',
      row?.externalReferenceCode || '',
      row?.title || '',
      row?.friendlyUrlPath || '',
      item.message,
      item.value == null ? '' : typeof item.value === 'object' ? JSON.stringify(item.value) : String(item.value)
    ]);
  }

  sheet.autoFilter = {from: 'A1', to: 'I1'};
  sheet.columns = [
    {width: 12}, {width: 38}, {width: 12}, {width: 28}, {width: 30}, {width: 36}, {width: 36}, {width: 80}, {width: 36}
  ];
  sheet.getColumn(8).alignment = {wrapText: true, vertical: 'top'};
  return sheet;
}

function addFailedItemsSheet(workbook, task) {
  if (!Array.isArray(task?.failedItems) || task.failedItems.length === 0) return;
  const sheet = workbook.addWorksheet('Batch Failed Items', {views: [{state: 'frozen', ySplit: 1}]});
  sheet.addRow(['Index', 'External Reference Code', 'Message', 'Raw Item']);
  styleHeader(sheet.getRow(1));
  task.failedItems.forEach((item, index) => {
    sheet.addRow([
      index + 1,
      item?.externalReferenceCode || item?.itemExternalReferenceCode || '',
      item?.errorMessage || item?.message || item?.cause || '',
      JSON.stringify(item)
    ]);
  });
  sheet.columns = [{width: 10}, {width: 34}, {width: 72}, {width: 100}];
  sheet.getColumn(3).alignment = {wrapText: true, vertical: 'top'};
  sheet.getColumn(4).alignment = {wrapText: true, vertical: 'top'};
}

export async function buildReportWorkbook({config, session, stage, task = null}) {
  assert(['validation', 'import'].includes(stage), 400, 'REPORT_STAGE_INVALID', 'Report stage must be validation or import');
  const validation = session.validation;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Liferay Flat Structured Content Importer';
  workbook.created = new Date();

  const summaryEntries = [
    ['Report stage', stage === 'import' ? 'Import report' : 'Validation report'],
    ['Generated at', new Date().toISOString()],
    ['Source workbook', session.fileName],
    ['Site ID', config.siteId],
    ['Structure', session.structure?.name],
    ['Structure ID', session.structure?.id],
    ['Target Web Content folder', session.folder?.path || session.folder?.name],
    ['Target folder ID', session.folder?.id],
    ['Image source', session.imageSource?.name || 'Current Site'],
    ['Documents and Media folder', session.imageSource?.folderPath || session.imageSource?.folderName || 'Site root — include nested folders'],
    ['Locale', session.locale],
    ['Visibility', session.viewableBy],
    ['Total rows', validation?.stats?.totalRows || 0],
    ['Valid rows', validation?.stats?.validRows || 0],
    ['Blocked rows', validation?.stats?.invalidRows || 0],
    ['Errors', validation?.errors?.length || 0],
    ['Warnings', validation?.warnings?.length || 0],
    ['Unique image references', validation?.imageSummary?.distinctReferenceCount || 0],
    ['Existing ERC matches', validation?.ercCollisions?.length || 0]
  ];

  if (stage === 'import') {
    summaryEntries.push(
      ['Batch task ID', task?.id || session.taskId || ''],
      ['Batch status', task?.executeStatus || 'UNKNOWN'],
      ['Create strategy', session.createStrategy || ''],
      ['Import strategy', session.importStrategy || ''],
      ['Processed items', task?.processedItemsCount || 0],
      ['Failed items', task?.failedItemsCount ?? task?.failedItems?.length ?? 0],
      ['Total Batch items', task?.totalItemsCount || 0],
      ['Batch error', task?.errorMessage || '']
    );
  }

  addKeyValueSheet(workbook, 'Summary', summaryEntries);
  addRowsSheet(workbook, validation);
  addIssuesSheet(workbook, validation);

  if (stage === 'import') {
    addKeyValueSheet(workbook, 'Batch', [
      ['Task ID', task?.id || session.taskId || ''],
      ['Status', task?.executeStatus || 'UNKNOWN'],
      ['Create strategy', session.createStrategy || ''],
      ['Import strategy', session.importStrategy || ''],
      ['Processed items', task?.processedItemsCount || 0],
      ['Failed items', task?.failedItemsCount ?? task?.failedItems?.length ?? 0],
      ['Total items', task?.totalItemsCount || 0],
      ['External Reference Code', task?.externalReferenceCode || ''],
      ['Error message', task?.errorMessage || '']
    ]);
    addFailedItemsSheet(workbook, task);
  }

  const structureName = safeFileName(session.structure?.name || 'structured-content');
  return {
    buffer: await workbook.xlsx.writeBuffer(),
    fileName: `${structureName}-${stage}-report.xlsx`
  };
}
