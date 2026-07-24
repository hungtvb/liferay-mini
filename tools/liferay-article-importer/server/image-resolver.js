import {AppError} from './errors.js';

function normalize(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function parseImageReference(value) {
  const raw = String(value ?? '').trim();
  const match = raw.match(/^([a-zA-Z]+):(.*)$/);
  if (!match) return {code: 'IMAGE_REFERENCE_INVALID', raw, valid: false};
  const type = match[1].toLowerCase();
  const reference = match[2].trim();
  if (!['file', 'erc'].includes(type) || !reference) {
    return {code: 'IMAGE_REFERENCE_INVALID', raw, valid: false};
  }
  if (type === 'file' && !/\.[^./\\]+$/.test(reference)) {
    return {code: 'IMAGE_REFERENCE_INVALID', raw, valid: false};
  }
  return {key: normalize(reference), raw, reference, type, valid: true};
}

function pushIndex(map, key, document) {
  if (!key) return;
  const current = map.get(key) || [];
  current.push(document);
  map.set(key, current);
}

function minimalImage(document) {
  const description = String(document.description || '').trim() || String(document.title || '').trim();
  return {
    description,
    externalReferenceCode: document.externalReferenceCode || null,
    fileName: document.fileName || null,
    id: document.id,
    title: String(document.title || document.fileName || '').trim()
  };
}

function emptyResolution() {
  return {
    indexSummary: {
      documentCount: 0,
      duplicateErcCount: 0,
      duplicateFileNameCount: 0,
      distinctReferenceCount: 0
    },
    results: new Map()
  };
}

export class ImageResolver {
  constructor({liferay}) {
    this.liferay = liferay;
    this.index = null;
  }

  clear() {
    this.index = null;
  }

  async load({force = false} = {}) {
    if (this.index && !force) return this.index;
    const documents = await this.liferay.listConfiguredImageDocuments();
    const byErc = new Map();
    const byFileName = new Map();
    for (const document of documents) {
      pushIndex(byErc, normalize(document.externalReferenceCode), document);
      pushIndex(byFileName, normalize(document.fileName), document);
    }
    this.index = {
      byErc,
      byFileName,
      documentCount: documents.length,
      duplicateErcCount: [...byErc.values()].filter((items) => items.length > 1).length,
      duplicateFileNameCount: [...byFileName.values()].filter((items) => items.length > 1).length
    };
    return this.index;
  }

  async resolveMany(values, {force = false} = {}) {
    const distinct = [...new Set(values.filter((value) => String(value ?? '').trim()).map((value) => String(value).trim()))];
    if (distinct.length === 0) return emptyResolution();

    const index = await this.load({force});
    const results = new Map();

    for (const raw of distinct) {
      const parsed = parseImageReference(raw);
      if (!parsed.valid) {
        results.set(raw, {code: parsed.code, reference: raw, status: 'INVALID_REFERENCE_FORMAT'});
        continue;
      }
      const matches = parsed.type === 'file' ? index.byFileName.get(parsed.key) || [] : index.byErc.get(parsed.key) || [];
      if (matches.length === 0) {
        results.set(raw, {code: 'IMAGE_NOT_FOUND', parsed, reference: raw, status: 'MISSING'});
        continue;
      }
      if (matches.length > 1) {
        const code = parsed.type === 'file' ? 'IMAGE_FILENAME_DUPLICATE_IN_SOURCE' : 'IMAGE_ERC_DUPLICATE_IN_SOURCE';
        results.set(raw, {code, matches: matches.map(minimalImage), parsed, reference: raw, status: 'AMBIGUOUS'});
        continue;
      }
      const document = matches[0];
      if (!document?.id || !String(document.encodingFormat || '').toLowerCase().startsWith('image/')) {
        results.set(raw, {code: 'IMAGE_TYPE_INVALID', parsed, reference: raw, status: 'INVALID_DOCUMENT_TYPE'});
        continue;
      }
      results.set(raw, {document: minimalImage(document), parsed, reference: raw, status: 'RESOLVED'});
    }

    return {indexSummary: {
      documentCount: index.documentCount,
      duplicateErcCount: index.duplicateErcCount,
      duplicateFileNameCount: index.duplicateFileNameCount,
      distinctReferenceCount: distinct.length
    }, results};
  }
}

export function requireResolvedImage(result, reference) {
  if (!result || result.status !== 'RESOLVED') {
    throw new AppError(409, result?.code || 'IMAGE_NOT_FOUND', `Image reference ${reference} could not be resolved`);
  }
  return result.document;
}
