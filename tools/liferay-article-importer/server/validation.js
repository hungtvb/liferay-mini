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

function issue({code, field, message, row, severity = 'error', value}) {
  return {code, field, message, row, severity, value};
}

function validErc(value) {
  return /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,254}$/.test(value);
}

function existingIndex(items) {
  return new Map((items || []).map((item) => [String(item.externalReferenceCode || '').trim().toLowerCase(), item]));
}

export async function validateAndBuildPayload({
  existingContents = [],
  folder,
  imageResolver,
  locale,
  mapping,
  rowNumbers,
  rows,
  structure,
  targets,
  viewableBy = 'Anyone'
}) {
  const errors = [];
  const warnings = [];
  const payload = [];
  const rowResults = [];
  const ercRows = new Map();
  const existingByErc = existingIndex(existingContents);
  const imageTargets = targets.filter((target) => target.supported && target.valueKind === 'imageReference');
  const imageValues = imageTargets.flatMap((target) => {
    const header = mapping[target.key];
    return header ? rows.map((row) => row[header]).filter((value) => !blank(value)).map((value) => asString(value)) : [];
  });
  const imageResolution = imageResolver
    ? await imageResolver.resolveMany(imageValues, {force: true})
    : {indexSummary: {distinctReferenceCount: 0, documentCount: 0}, results: new Map()};

  if (!folder?.id) {
    errors.push(issue({code: 'TARGET_FOLDER_CHANGED', field: 'structuredContentFolderId', message: 'Target Web Content folder is not resolved', row: null}));
  }

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const rowNumber = rowNumbers[index];
    const rowErrors = [];
    const item = {
      contentFields: [],
      contentStructureId: structure.id,
      structuredContentFolderId: folder?.id,
      viewableBy
    };

    for (const target of targets.filter((candidate) => candidate.supported)) {
      const header = mapping[target.key];
      const raw = header ? row[header] : undefined;
      if (target.required && blank(raw)) {
        rowErrors.push(issue({
          code: 'REQUIRED_VALUE_MISSING', field: target.fieldReference || target.name, message: `${target.label} is required`, row: rowNumber, value: raw
        }));
        continue;
      }
      if (blank(raw)) continue;

      if (target.valueKind === 'imageReference') {
        const reference = asString(raw);
        const resolved = imageResolution.results.get(reference);
        if (!resolved || resolved.status !== 'RESOLVED') {
          const code = resolved?.code || 'IMAGE_NOT_FOUND';
          rowErrors.push(issue({
            code,
            field: target.fieldReference,
            message: `Image reference "${reference}" could not be resolved from the configured image source`,
            row: rowNumber,
            value: reference
          }));
          continue;
        }
        const document = resolved.document;
        item.contentFields.push({
          contentFieldValue: {image: {id: document.id, title: document.title, description: document.description}},
          fieldReference: target.fieldReference,
          name: target.name
        });
        continue;
      }

      let converted;
      try { converted = convertValue(raw, target); }
      catch (error) {
        rowErrors.push(issue({
          code: 'VALUE_TYPE_INVALID', field: target.fieldReference || target.name, message: `${target.label}: ${error.message}`, row: rowNumber, value: raw
        }));
        continue;
      }

      if (target.key === 'system.title') item.title = converted;
      else if (target.key === 'system.externalReferenceCode') item.externalReferenceCode = converted;
      else {
        item.contentFields.push({
          contentFieldValue: {data: converted},
          fieldReference: target.fieldReference,
          name: target.name
        });
      }
    }

    const erc = String(item.externalReferenceCode || '').trim();
    if (erc && !validErc(erc)) {
      rowErrors.push(issue({
        code: 'ERC_FORMAT_INVALID', field: 'externalReferenceCode', message: 'External Reference Code contains unsupported characters or exceeds 255 characters', row: rowNumber, value: erc
      }));
    }
    if (erc) {
      const normalized = erc.toLowerCase();
      const prior = ercRows.get(normalized);
      if (prior) {
        rowErrors.push(issue({
          code: 'ERC_DUPLICATE_IN_WORKBOOK', field: 'externalReferenceCode', message: `External Reference Code duplicates row ${prior}`, row: rowNumber, value: erc
        }));
      }
      else ercRows.set(normalized, rowNumber);
    }

    errors.push(...rowErrors);
    if (rowErrors.length === 0) payload.push(item);
    rowResults.push({externalReferenceCode: item.externalReferenceCode || null, row: rowNumber, status: rowErrors.length ? 'BLOCKED' : 'VALID', title: item.title || null});
  }

  const collisions = [];
  for (const item of payload) {
    const existing = existingByErc.get(String(item.externalReferenceCode).toLowerCase());
    if (existing) {
      const row = ercRows.get(String(item.externalReferenceCode).toLowerCase());
      collisions.push({
        externalReferenceCode: item.externalReferenceCode,
        existingId: existing.id,
        existingTitle: existing.title || null,
        row
      });
      warnings.push(issue({
        code: 'ERC_UPDATE_CONFIRMATION_REQUIRED', field: 'externalReferenceCode', message: `ERC "${item.externalReferenceCode}" already exists and requires strategy confirmation`, row, severity: 'warning', value: item.externalReferenceCode
      }));
    }
  }

  return {
    canImport: errors.length === 0 && payload.length > 0,
    ercCollisions: collisions,
    errors,
    imageSummary: imageResolution.indexSummary,
    payload,
    rowResults,
    stats: {
      invalidRows: rowResults.filter((row) => row.status === 'BLOCKED').length,
      totalRows: rows.length,
      validRows: rowResults.filter((row) => row.status === 'VALID').length
    },
    warnings
  };
}
