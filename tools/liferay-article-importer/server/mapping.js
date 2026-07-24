import {analyzeStructure} from './structure-analyzer.js';

export const SYSTEM_TARGETS = [
  {
    dataType: 'string', fieldReference: null, key: 'system.title', label: 'Content Title', name: 'title', required: true,
    section: 'System fields', supported: true, valueKind: 'scalar'
  },
  {
    dataType: 'string', fieldReference: null, key: 'system.externalReferenceCode', label: 'External Reference Code',
    name: 'externalReferenceCode', required: true, section: 'System fields', supported: true, valueKind: 'scalar'
  }
];

export function buildTargets(structure, locale = 'en-US') {
  const analysis = analyzeStructure(structure, locale);
  const contentTargets = analysis.fields.map((field) => ({
    ...field,
    key: `content.${field.fieldReference}`,
    section: 'Structure fields'
  }));
  return [...SYSTEM_TARGETS, ...contentTargets];
}

export function buildTemplateColumns(structure, locale = 'en-US') {
  return buildTargets(structure, locale)
    .filter((target) => target.supported)
    .map((target) => {
      const requiredMark = target.required ? ' *' : '';
      if (target.key.startsWith('system.')) return {...target, header: `${target.label}${requiredMark}`};
      const suffix = target.valueKind === 'imageReference' ? ' Reference' : '';
      return {...target, header: `${target.label}${suffix}${requiredMark} [${target.fieldReference}]`};
    });
}

export function strictTemplateMapping(headers, columns) {
  if (headers.length !== columns.length) return null;
  if (headers.some((header, index) => String(header) !== columns[index].header)) return null;
  return Object.fromEntries(columns.map((column) => [column.key, column.header]));
}

export function summarizeStructure(structure, locale = 'en-US') {
  const analysis = analyzeStructure(structure, locale);
  return {
    availableLanguages: analysis.availableLanguages,
    blockingFields: analysis.blockingFields,
    excludedFields: analysis.excludedFields,
    externalReferenceCode: analysis.externalReferenceCode,
    fingerprint: analysis.fingerprint,
    id: analysis.id,
    name: analysis.name,
    siteId: analysis.siteId,
    status: analysis.status,
    supportedFieldCount: analysis.supportedFields.length
  };
}
