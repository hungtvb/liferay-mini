import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import {buildReportWorkbook} from '../server/report.js';

const validation = {
  canImport: false,
  errors: [{code: 'IMAGE_NOT_FOUND', field: 'coverImage', message: 'Image missing', row: 3, severity: 'error', value: 'file:missing.webp'}],
  warnings: [{code: 'ERC_UPDATE_CONFIRMATION_REQUIRED', field: 'externalReferenceCode', message: 'ERC exists', row: 2, severity: 'warning'}],
  ercCollisions: [{externalReferenceCode: 'article-one'}],
  imageSummary: {distinctReferenceCount: 2},
  rowResults: [
    {row: 2, externalReferenceCode: 'article-one', title: 'Article One', friendlyUrlPath: 'article-one', friendlyUrlGenerated: true, status: 'VALID'},
    {row: 3, externalReferenceCode: 'article-two', title: 'Article Two', friendlyUrlPath: 'article-two', friendlyUrlGenerated: false, status: 'BLOCKED'}
  ],
  stats: {totalRows: 2, validRows: 1, invalidRows: 1}
};

const session = {
  fileName: 'articles.xlsx',
  structure: {id: 10, name: 'NXC Articles'},
  folder: {id: 20, name: 'Articles', path: 'Marketing / Articles'},
  imageSource: {id: 20125, name: 'Current Site', folderId: 30, folderName: 'Covers', folderPath: 'Media / Covers'},
  locale: 'en-US',
  viewableBy: 'Anyone',
  validation,
  createStrategy: 'INSERT',
  importStrategy: 'ON_ERROR_CONTINUE',
  taskId: 99
};

async function loadWorkbook(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
}

test('validation report contains full row and issue sheets with friendly URLs', async () => {
  const report = await buildReportWorkbook({config: {siteId: 20125}, session, stage: 'validation'});
  const workbook = await loadWorkbook(report.buffer);
  assert.equal(report.fileName, 'nxc-articles-validation-report.xlsx');
  assert(workbook.getWorksheet('Summary'));
  assert(workbook.getWorksheet('Rows'));
  assert(workbook.getWorksheet('Issues'));
  assert.equal(workbook.getWorksheet('Rows').getCell('D2').value, 'article-one');
  assert.equal(workbook.getWorksheet('Rows').getCell('E2').value, 'Generated from title');
  assert.equal(workbook.getWorksheet('Issues').getCell('B2').value, 'IMAGE_NOT_FOUND');
});

test('import report contains Batch summary and failed items', async () => {
  const task = {
    id: 99,
    executeStatus: 'COMPLETED_WITH_ERRORS',
    processedItemsCount: 2,
    failedItemsCount: 1,
    totalItemsCount: 2,
    failedItems: [{externalReferenceCode: 'article-two', errorMessage: 'Rejected by Liferay'}]
  };
  const report = await buildReportWorkbook({config: {siteId: 20125}, session, stage: 'import', task});
  const workbook = await loadWorkbook(report.buffer);
  assert.equal(report.fileName, 'nxc-articles-import-report.xlsx');
  assert(workbook.getWorksheet('Batch'));
  assert(workbook.getWorksheet('Batch Failed Items'));
  assert.equal(workbook.getWorksheet('Batch Failed Items').getCell('B2').value, 'article-two');
});

test('import report is blocked while the Batch task is still running', async () => {
  await assert.rejects(
    () => buildReportWorkbook({config: {siteId: 20125}, session, stage: 'import', task: {id: 99, executeStatus: 'STARTED'}}),
    (error) => error.code === 'IMPORT_REPORT_NOT_READY' && error.status === 409
  );
});
