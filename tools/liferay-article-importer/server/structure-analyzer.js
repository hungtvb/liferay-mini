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

function fieldDescriptor(field, locale) {
  const dataType = String(field.dataType || 'string').toLowerCase();
  const fieldReference = field.fieldReference || field.name;
  const name = field.name || fieldReference;
  const isNested = nestedFields(field).length > 0;
  const isRepeatable = field.repeatable === true || field.multiple === true;
  let reason = null;

  if (isNested) reason = 'NESTED_FIELD';
  else if (isRepeatable) reason = 'REPEATABLE_FIELD';
  else if (UNSUPPORTED_TYPES.has(dataType) || !SUPPORTED_TYPES.has(dataType)) reason = 'UNSUPPORTED_FIELD_TYPE';

  return {
    dataType,
    fieldReference,
    inputControl: field.inputControl || null,
    label: localizedText(field.label, locale) || fieldReference || name,
    name,
    reason,
    required: required(field),
    supported: !reason,
    valueKind: dataType === 'image' ? 'imageReference' : 'scalar'
  };
}

export function structureFingerprint(structure) {
  const contract = (structure.contentStructureFields || []).map((field) => ({
    dataType: String(field.dataType || 'string').toLowerCase(),
    fieldReference: field.fieldReference || field.name,
    name: field.name || field.fieldReference,
    nested: nestedFields(field).map((item) => item.fieldReference || item.name),
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
    name: localizedText(structure.name, locale) || structure.name || `Structure ${structure.id}`,
    siteId: structure.siteId,
    status,
    supportedFields
  };
}
