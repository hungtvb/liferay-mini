function textFromLocalized(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return value['en-US'] || value['en_US'] || Object.values(value).find(Boolean) || '';
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
  const type = String(field.dataType || '').toLowerCase();
  const unsupportedTypes = new Set(['document', 'geolocation', 'relationship', 'grid']);
  return nested.length === 0 && !repeatable && !unsupportedTypes.has(type);
}

export function buildTargets(structure) {
  const systemTargets = [
    {
      aliases: ['title', 'article title', 'headline', 'name'],
      dataType: 'string',
      key: 'system.title',
      label: 'Article Title',
      name: 'title',
      required: true,
      section: 'Article',
      supported: true,
      valueKind: 'scalar'
    },
    {
      aliases: ['external reference code', 'externalReferenceCode', 'erc', 'article id'],
      dataType: 'string',
      key: 'system.externalReferenceCode',
      label: 'External Reference Code',
      name: 'externalReferenceCode',
      required: true,
      section: 'Article',
      supported: true,
      valueKind: 'scalar'
    }
  ];

  const contentTargets = (structure.contentStructureFields || []).map((field) => {
    const dataType = String(field.dataType || 'string').toLowerCase();
    const label =
      textFromLocalized(field.label) ||
      field.fieldReference ||
      field.name;

    const fieldReference = field.fieldReference || field.name;
    const name = field.name || fieldReference;

    return {
      aliases: [
        fieldReference,
        name,
        label,
        field.externalReferenceCode,
        ...(dataType === 'image'
          ? [
              `${label} ERC`,
              `${fieldReference} ERC`,
              `${name} ERC`,
              'image ERC',
              'document ERC'
            ]
          : [])
      ],
      dataType,
      fieldReference,
      inputControl: field.inputControl || null,

      // Dùng fieldReference làm identity thân thiện cho mapping Excel.
      key: `content.${fieldReference}`,

      label,

      // Internal DDM field name.
      name,

      required: fieldRequired(field),
      section: 'Structure fields',
      supported: fieldSupported(field),
      valueKind:
        dataType === 'image'
          ? 'documentExternalReferenceCode'
          : 'scalar'
    };
  });

  return [...systemTargets, ...contentTargets];
}

export function buildTemplateColumns(structure) {
  return buildTargets(structure)
    .filter((target) => target.supported)
    .map((target) => {
      if (target.key.startsWith('system.')) {
        return {
          ...target,
          header: `${target.label}${target.required ? ' *' : ''}`
        };
      }

      const reference = target.fieldReference || target.name;

      return {
        ...target,
        header:
          target.valueKind === 'documentExternalReferenceCode'
            ? `${target.label}${target.required ? ' *' : ''} ERC [${reference}]`
            : `${target.label}${target.required ? ' *' : ''} [${reference}]`
      };
    });
}

export function createTemplateMapping(headers, targets) {
  const mapping = {};

  const targetsByReference = new Map();

  for (const target of targets) {
    if (target.fieldReference) {
      targetsByReference.set(target.fieldReference, target);
    }

    if (target.name) {
      targetsByReference.set(target.name, target);
    }
  }

  for (const header of headers) {
    const fieldMatch = String(header).match(/\[([^\]]+)\]\s*$/);

    let target = fieldMatch
      ? targetsByReference.get(fieldMatch[1].trim())
      : null;

    if (!target) {
      const normalized = normalizeKey(
        String(header).replace(/\s*\*\s*$/, '')
      );

      target = targets.find((candidate) =>
        [
          candidate.label,
          candidate.fieldReference,
          candidate.name,
          ...(candidate.aliases || [])
        ]
          .filter(Boolean)
          .map(normalizeKey)
          .includes(normalized)
      );
    }

    if (target) {
      mapping[target.key] = header;
    }
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
