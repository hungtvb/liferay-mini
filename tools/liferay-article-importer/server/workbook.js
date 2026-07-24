import ExcelJS from 'exceljs';
import {AppError, assert} from './errors.js';

function cellValue(value) {
  if (value == null) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if ('result' in value) {
    return cellValue(value.result);
  }

  if (Array.isArray(value.richText)) {
    return value.richText.map((part) => part.text || '').join('');
  }

  if ('text' in value) {
    return value.text;
  }

  if ('hyperlink' in value) {
    return value.text || value.hyperlink;
  }

  return String(value);
}

function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function rowIsBlank(row) {
  let hasValue = false;

  row.eachCell({includeEmpty: false}, (cell) => {
    if (!isBlank(cellValue(cell.value))) {
      hasValue = true;
    }
  });

  return !hasValue;
}

function chooseWorksheet(workbook) {
  const articleSheet = workbook.worksheets.find(
    (worksheet) => worksheet.name.trim().toLowerCase() === 'articles'
  );

  return articleSheet || workbook.worksheets.find((worksheet) => worksheet.actualRowCount > 0);
}

export async function parseWorkbook(buffer) {
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(buffer);
  }
  catch (error) {
    throw new AppError(400, 'WORKBOOK_INVALID', 'The uploaded file is not a readable .xlsx workbook', {
      cause: error.message
    });
  }

  const worksheet = chooseWorksheet(workbook);
  assert(worksheet, 400, 'WORKBOOK_EMPTY', 'The workbook contains no readable worksheet');

  let headerRowNumber = null;

  for (let index = 1; index <= worksheet.actualRowCount; index += 1) {
    if (!rowIsBlank(worksheet.getRow(index))) {
      headerRowNumber = index;
      break;
    }
  }

  assert(headerRowNumber, 400, 'WORKBOOK_EMPTY', 'The selected worksheet contains no data');

  const headerRow = worksheet.getRow(headerRowNumber);
  const headers = [];

  for (let column = 1; column <= headerRow.cellCount; column += 1) {
    const value = cellValue(headerRow.getCell(column).value);
    headers.push(String(value ?? '').trim());
  }

  assert(headers.some(Boolean), 400, 'HEADER_MISSING', 'The workbook header row is empty');

  const seen = new Map();
  const duplicateHeaders = [];

  headers.forEach((header, index) => {
    if (!header) {
      return;
    }

    const key = header.toLowerCase();

    if (seen.has(key)) {
      duplicateHeaders.push({columns: [seen.get(key), index + 1], header});
    }
    else {
      seen.set(key, index + 1);
    }
  });

  assert(
    duplicateHeaders.length === 0,
    400,
    'HEADER_DUPLICATE',
    'Workbook headers must be unique',
    duplicateHeaders
  );

  const rows = [];
  const rowNumbers = [];

  for (let rowNumber = headerRowNumber + 1; rowNumber <= worksheet.actualRowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);

    if (rowIsBlank(row)) {
      continue;
    }

    const record = {};

    headers.forEach((header, index) => {
      if (header) {
        record[header] = cellValue(row.getCell(index + 1).value);
      }
    });

    rows.push(record);
    rowNumbers.push(rowNumber);
  }

  assert(rows.length > 0, 400, 'WORKBOOK_NO_ROWS', 'The workbook contains a header but no data rows');

  return {
    headerRowNumber,
    headers: headers.filter(Boolean),
    rowNumbers,
    rows,
    sheetName: worksheet.name,
    sheetNames: workbook.worksheets.map((sheet) => sheet.name)
  };
}
