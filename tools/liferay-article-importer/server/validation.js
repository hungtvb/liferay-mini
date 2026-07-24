function blank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function asString(value) {
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  throw new Error('Expected true/false, yes/no, or 1/0');
}

function parseNumber(value, integer) {
  const parsed = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isFinite(parsed) || (integer && !Number.isInteger(parsed))) {
    throw new Error(integer ? 'Expected an integer' : 'Expected a number');
  }
  return parsed;
}

function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const raw = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const parsed = new Date(`${raw}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === raw) return raw;
  }
  throw new Error('Expected a valid date in YYYY-MM-DD format');
}

export function convertValue(value, target) {
  const dataType = String(target.dataType || 'string').toLowerCase();
  if (blank(value)) return null;
  if (dataType === 'boolean') return parseBoolean(value);
  if (['integer', 'long'].includes(dataType)) return parseNumber(value, true);
  if (['double', 'float', 'number', 'decimal'].includes(dataType)) return parseNumber(value, false);
  if (dataType === 'date') return parseDate(value);
  return asString(value);
}

function issue({field, message, row, severity = 'error', value}) {
  return {field, message, row, severity, value};
}

function isImageDocument(document) {
  return Boolean(document?.id && String(document.encodingFormat || '').toLowerCase().startsWith('image/'));
}

function imagePayload(document) {
  return Object.fromEntries([
    ['contentType', document.contentType || 'Document'],
    ['contentUrl', document.contentUrl],
    ['description', document.description || ''],
    ['encodingFormat', document.encodingFormat],
    ['fileExtension', document.fileExtension],
    ['id', document.id],
    ['sizeInBytes', document.sizeInBytes],
    ['title', document.title]
  ].filter(([, value]) => value !== undefined && value !== null));
}

async function prefetchImages({concurrency, mapping, resolveDocument, rows, targets}) {
  const imageTargets = targets.filter((target) =>
    target.supported && target.valueKind === 'documentExternalReferenceCode' && mapping[target.key]
  );
  const ercs = [...new Set(imageTargets.flatMap((target) => {
    const header = mapping[target.key];
    return rows.map((row) => row[header]).filter((value) => !blank(value)).map((value) => asString(value));
  }))];
  const documents = new Map();
  let cursor = 0;

  async function worker() {
    while (cursor < ercs.length) {
      const erc = ercs[cursor];
      cursor += 1;
      documents.set(erc, await resolveDocument(erc));
    }
  }

  await Promise.all(Array.from({length: Math.min(Math.max(concurrency || 1, 1), ercs.length || 1)}, () => worker()));
  return documents;
}

export async function validateAndBuildPayload({
  folder,
  imageLookupConcurrency = 8,
  mapping,
  resolveDocument = async () => null,
  rowNumbers,
  rows,
  structure,
  targets
}) {
  const errors = [];
  const warnings = [];
  const payload = [];
  const ercRows = new Map();
  const targetsByKey = new Map(targets.map((target) => [target.key, target]));

  if (!folder?.id) {
    errors.push(issue({field: 'structuredContentFolderId', message: 'Target Web Content folder is not resolved', row: null}));
  }

  for (const target of targets) {
    const sourceHeader = mapping[target.key];
    if (target.required && !sourceHeader) {
      errors.push(issue({field: target.key, message: `Required target “${target.label}” is not mapped`, row: null}));
    }
    if (sourceHeader && !target.supported) {
      errors.push(issue({field: target.key, message: `“${target.label}” is nested, repeatable, or has an unsupported field type`, row: null}));
    }
  }

  if (errors.length > 0) {
    return {canImport: false, errors, payload, stats: {invalidRows: rows.length, totalRows: rows.length, validRows: 0}, warnings};
  }

  const documents = await prefetchImages({
    concurrency: imageLookupConcurrency,
    mapping,
    resolveDocument,
    rows,
    targets
  });

  rows.forEach((row, index) => {
    const excelRow = rowNumbers[index];
    const rowErrors = [];
    const article = {
      contentFields: [],
      contentStructureId: structure.id,
      structuredContentFolderId: folder.id
    };

    for (const target of targets) {
      const targetKey = target.key;
      const sourceHeader = mapping[targetKey];
      if (!sourceHeader) continue;
      if (!targetsByKey.has(targetKey)) {
        rowErrors.push(issue({field: targetKey, message: 'Unknown mapping target', row: excelRow}));
        continue;
      }

      const rawValue = row[sourceHeader];
      let converted;
      try { converted = convertValue(rawValue, target); }
      catch (error) {
        rowErrors.push(issue({field: targetKey, message: error.message, row: excelRow, value: rawValue}));
        continue;
      }

      if (converted == null) {
        if (target.required) {
          rowErrors.push(issue({field: targetKey, message: `Required value “${target.label}” is empty`, row: excelRow}));
        }
        continue;
      }

      if (targetKey === 'system.title') article.title = converted;
      else if (targetKey === 'system.externalReferenceCode') article.externalReferenceCode = converted;
      else if (targetKey.startsWith('content.') && target.valueKind === 'documentExternalReferenceCode') {
        const document = documents.get(converted);
        if (!document) {
          rowErrors.push(issue({
            field: targetKey,
            message: `Image with Document external reference code “${converted}” does not exist in the configured Site`,
            row: excelRow,
            value: converted
          }));
          continue;
        }
        if (!isImageDocument(document)) {
          rowErrors.push(issue({
            field: targetKey,
            message: `Document “${converted}” exists but is not an image`,
            row: excelRow,
            value: converted
          }));
          continue;
        }
        article.contentFields.push({contentFieldValue: {image: imagePayload(document)}, name: target.name});
      }
      else if (targetKey.startsWith('content.')) {
        article.contentFields.push({contentFieldValue: {data: converted}, name: target.name});
      }
    }

    if (article.externalReferenceCode) {
      const ercKey = String(article.externalReferenceCode).trim().toLowerCase();
      if (ercRows.has(ercKey)) {
        rowErrors.push(issue({
          field: 'system.externalReferenceCode',
          message: `Duplicate external reference code; first used on Excel row ${ercRows.get(ercKey)}`,
          row: excelRow,
          value: article.externalReferenceCode
        }));
      }
      else ercRows.set(ercKey, excelRow);
    }

    if (article.contentFields.length === 0) {
      warnings.push(issue({field: 'contentFields', message: 'No Structure field value will be sent for this row', row: excelRow, severity: 'warning'}));
    }

    if (rowErrors.length > 0) errors.push(...rowErrors);
    else payload.push(article);
  });

  const invalidRows = new Set(errors.filter((entry) => entry.row != null).map((entry) => entry.row)).size;
  return {
    canImport: errors.length === 0 && payload.length > 0,
    errors,
    payload,
    stats: {invalidRows, totalRows: rows.length, validRows: payload.length},
    warnings
  };
}
