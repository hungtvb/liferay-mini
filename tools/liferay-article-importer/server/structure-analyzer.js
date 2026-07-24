import crypto from 'node:crypto';

const SUPPORTED_TYPES = new Set([
  'boolean', 'date', 'decimal', 'double', 'float', 'image', 'integer', 'long', 'number', 'string'
]);
const UNSUPPORTED_TYPES = new Set(['document', 'geolocation', 'grid', 'relationship']);

export function localizedText(value, locale = 'en-US') {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value[locale] || value[locale.replace('-', '_')] || value['en-US'] || value.en_US || Object.values(value).find(Boolean) || '';
}

function required(field) {
  return field.required === true || field.mandatory === true;
}

function nestedFields(field) {
  return field.nestedContentStructureFields || field.nestedContentFields || [];
}

function normalizeOptions(field, locale) {
  return (field.options || []).map((option) => ({
    label: localizedText(option.label_i18n, locale) || localizedText(option.label, locale) || String(option.value || ''),
    value: String(option.value ?? '').trim()
  })).filter((option) => option.value);
}

function fieldDescriptor(field, locale) {
  const dataType = String(field.dataType || 'string').toLowerCase();
  const fieldReference = field.fieldReference || field.name;
  const name = field.name || fieldReference;
  const inputControl = String(field.inputControl || '').trim().toLowerCase() || null;
  const isNested = nestedFields(field).length > 0;
  const isRepeatable = field.repeatable === true || field.multiple === true;
  const options = normalizeOptions(field, locale);
  let reason = null;

  if (isNested) reason = 'NESTED_FIELD';
  else if (isRepeatable) reason = 'REPEATABLE_FIELD';
  else if (UNSUPPORTED_TYPES.has(dataType) || !SUPPORTED_TYPES.has(dataType)) reason = 'UNSUPPORTED_FIELD_TYPE';
  else if (['radio', 'select'].includes(inputControl) && options.length === 0) reason = 'OPTION_VALUES_MISSING';

  return {
    dataType,
    fieldReference,
    inputControl,
    label: localizedText(field.label_i18n, locale) || localizedText(field.label, locale) || fieldReference || name,
    localizable: field.localizable === true,
    name,
    options,
    reason,
    required: required(field),
    supported: !reason,
    valueKind: dataType === 'image'
      ? 'imageReference'
      : ['radio', 'select'].includes(inputControl)
        ? 'option'
        : 'scalar'
  };
}

export function structureFingerprint(structure) {
  const contract = (structure.contentStructureFields || []).map((field) => ({
    dataType: String(field.dataType || 'string').toLowerCase(),
    fieldReference: field.fieldReference || field.name,
    inputControl: String(field.inputControl || '').trim().toLowerCase() || null,
    localizable: field.localizable === true,
    name: field.name || field.fieldReference,
    nested: nestedFields(field).map((item) => item.fieldReference || item.name),
    options: (field.options || []).map((option) => String(option.value ?? '').trim()).filter(Boolean).sort(),
    repeatable: field.repeatable === true || field.multiple === true,
    required: required(field)
  }));
  return crypto.createHash('sha256').update(JSON.stringify(contract)).digest('hex');
}

export function analyzeStructure(structure, locale = 'en-US') {
  const fields = (structure.contentStructureFields || []).map((field) => fieldDescriptor(field, locale));
  const blockingFields = fields.filter((field) =>
    field.reason === 'NESTED_FIELD' || field.reason === 'REPEATABLE_FIELD' || (!field.supported && field.required)
  );
  const excludedFields = fields.filter((field) => !field.supported && !blockingFields.includes(field));
  const supportedFields = fields.filter((field) => field.supported);
  const status = blockingFields.length > 0
    ? 'UNSUPPORTED'
    : excludedFields.length > 0
      ? 'SUPPORTED_WITH_WARNINGS'
      : 'SUPPORTED';

  return {
    availableLanguages: structure.availableLanguages || [],
    blockingFields,
    excludedFields,
    externalReferenceCode: structure.externalReferenceCode || null,
    fields,
    fingerprint: structureFingerprint(structure),
    id: structure.id,
    name: localizedText(structure.name_i18n, locale) || localizedText(structure.name, locale) || `Structure ${structure.id}`,
    siteId: structure.siteId,
    status,
    supportedFields
  };
}
