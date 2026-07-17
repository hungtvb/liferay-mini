import ExcelJS, {type CellValue, type Worksheet} from 'exceljs';

import {type RawWorkbook} from './types';

export const REQUIRED_SHEETS = [
    'Heroes',
    'ServicesIntro',
    'Services',
    'Features',
] as const;

function normalizeCellValue(value: CellValue): unknown {
    if (value === null || value === undefined) {
        return '';
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === 'object') {
        if ('result' in value) {
            return normalizeCellValue(value.result as CellValue);
        }

        if ('text' in value && typeof value.text === 'string') {
            return value.text;
        }

        if ('richText' in value && Array.isArray(value.richText)) {
            return value.richText
                .map((item) => item.text)
                .filter(Boolean)
                .join('');
        }

        if ('hyperlink' in value && typeof value.hyperlink === 'string') {
            return value.text || value.hyperlink;
        }
    }

    return value;
}

function parseWorksheet(worksheet: Worksheet): Record<string, unknown>[] {
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values
        .slice(1)
        .map((value) => String(normalizeCellValue(value) ?? '').trim());
    const records: Record<string, unknown>[] = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            return;
        }

        const record: Record<string, unknown> = {};
        let hasValue = false;

        headers.forEach((header, index) => {
            if (!header) {
                return;
            }

            const value = normalizeCellValue(row.getCell(index + 1).value);

            if (value !== '') {
                hasValue = true;
            }

            record[header] = value;
        });

        if (hasValue) {
            record.__rowNumber = rowNumber;
            records.push(record);
        }
    });

    return records;
}

export async function parseMigrationWorkbook(file: File): Promise<RawWorkbook> {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    return Object.fromEntries(
        workbook.worksheets.map((worksheet) => [
            worksheet.name,
            parseWorksheet(worksheet),
        ])
    );
}
