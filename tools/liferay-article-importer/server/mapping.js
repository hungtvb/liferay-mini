function textFromLocalized(value) {
  if (typeof value === 'string') {
    return value;
  }

  if (!value || typeof value !== 'object') {
    return '';
  }

  return value['en-US'] || value['en_GB'] || Object.values(value).find(Boolean) || '';
}

export function normalizeKey(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function fieldRequired(field) {
  return field.required === true || field.mandatory === true;
}

function fieldSupported(field) {
  const nested = field.nestedContentStructureFields || field.nestedContentFields || [];
  const repeatable = field.repeatable === true || field.multiple === true;

  return nested.length === 0 && !repeatable;
}

export function buildTargets(structure) {
  const systemTargets = [
    {
      aliases: ['title', 'article title', 'headline', 'name'],
      dataType: 'string',
      key: 'system.title',
      label: 'Article title',
      name: 'title',
      required: true,
      section: 'Article',
      supported: true
    },
    {
      aliases: ['external reference code', 'externalReferenceCode', 'erc', 'article id'],
      dataType: 'string',
      key: 'system.externalReferenceCode',
      label: 'External reference code',
      name: 'externalReferenceCode',
      required: true,
      section: 'Article',
      supported: true
    }
  ];

  const contentTargets = (structure.contentStructureFields || []).map((field) => ({
    aliases: [field.name, textFromLocalized(field.label), field.externalReferenceCode],
    dataType: field.dataType || 'string',
    inputControl: field.inputControl || null,
    key: `content.${field.name}`,
    label: textFromLocalized(field.label) || field.name,
    name: field.name,
    required: fieldRequired(field),
    section: 'Structure fields',
    supported: fieldSupported(field)
  }));

  return [...systemTargets, ...contentTargets];
}

export function createAutoMapping(headers, targets) {
  const normalizedHeaders = headers.map((header) => ({
    header,
    normalized: normalizeKey(header)
  }));
  const mapping = {};

  for (const target of targets) {
    const candidates = [target.name, target.label, ...(target.aliases || [])]
      .map(normalizeKey)
      .filter(Boolean);
    const match = normalizedHeaders.find((header) => candidates.includes(header.normalized));
    mapping[target.key] = match?.header || null;
  }

  return mapping;
}

export function summarizeStructure(structure) {
  return {
    availableLanguages: structure.availableLanguages || [],
    externalReferenceCode: structure.externalReferenceCode || null,
    id: structure.id,
    name: structure.name,
    siteId: structure.siteId
  };
}
