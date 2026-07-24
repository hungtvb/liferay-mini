import {AppError} from './errors.js';

function encodePath(value) {
  return encodeURIComponent(String(value));
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return text; }
}

function folderSummary(folder) {
  return {
    externalReferenceCode: folder.externalReferenceCode || null,
    id: folder.id,
    name: folder.name,
    siteId: folder.siteId
  };
}

export class LiferayClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.fetch = fetchImpl;
    this.token = null;
    this.tokenExpiresAt = 0;
    this.articleFolder = null;
    this.documentCache = new Map();
  }

  get connected() {
    return Boolean(this.token && Date.now() < this.tokenExpiresAt);
  }

  async connect() {
    await this.#getAccessToken(true);
    this.clearDocumentCache();
    const folder = await this.ensureArticleFolder({force: true});
    const structures = await this.listContentStructures();
    return {folder, structures};
  }

  clearDocumentCache() {
    this.documentCache.clear();
  }

  async #getAccessToken(force = false) {
    if (!force && this.connected) return this.token;
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials'
    });

    let response;
    try {
      response = await this.fetch(`${this.config.baseUrl}/o/oauth2/token`, {
        body,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        method: 'POST'
      });
    }
    catch (error) {
      throw new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay OAuth2 endpoint', {cause: error.message});
    }

    const data = await parseResponse(response);
    if (!response.ok || !data?.access_token) {
      throw new AppError(502, 'OAUTH_FAILED', 'Liferay OAuth2 client credentials authentication failed', {response: data, status: response.status});
    }

    const expiresIn = Number(data.expires_in || 600);
    this.token = data.access_token;
    this.tokenExpiresAt = Date.now() + Math.max(expiresIn - 30, 30) * 1000;
    return this.token;
  }

  async #request(path, options = {}, retryAfterUnauthorized = true, notFoundAsNull = false) {
    const token = await this.#getAccessToken();
    let response;
    try {
      response = await this.fetch(`${this.config.baseUrl}${path}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Accept-Language': this.config.locale,
          Authorization: `Bearer ${token}`,
          ...options.headers
        }
      });
    }
    catch (error) {
      throw new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay API', {cause: error.message, path});
    }

    if (response.status === 401 && retryAfterUnauthorized) {
      await this.#getAccessToken(true);
      return this.#request(path, options, false, notFoundAsNull);
    }

    const data = await parseResponse(response);
    if (response.status === 404 && notFoundAsNull) return null;
    if (!response.ok) {
      throw new AppError(response.status, 'LIFERAY_API_ERROR', 'Liferay API request failed', {path, response: data, status: response.status});
    }
    return data;
  }

  async ensureArticleFolder({force = false} = {}) {
    if (this.articleFolder && !force) return this.articleFolder;

    const siteId = encodePath(this.config.siteId);
    const erc = encodePath(this.config.articleFolderExternalReferenceCode);
    const lookupPath = `/o/headless-delivery/v1.0/sites/${siteId}/structured-content-folders/by-external-reference-code/${erc}`;
    let folder = await this.#request(lookupPath, {}, true, true);

    if (!folder) {
      folder = await this.#request(`/o/headless-delivery/v1.0/sites/${siteId}/structured-content-folders`, {
        body: JSON.stringify({
          externalReferenceCode: this.config.articleFolderExternalReferenceCode,
          name: this.config.articleFolderName,
          viewableBy: 'Anyone'
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      });
    }

    this.articleFolder = folderSummary(folder);
    return this.articleFolder;
  }

  async getSiteDocumentByExternalReferenceCode(externalReferenceCode, {force = false} = {}) {
    const erc = String(externalReferenceCode || '').trim();
    if (!erc) return null;
    if (!force && this.documentCache.has(erc)) return this.documentCache.get(erc);

    const path = `/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/documents/by-external-reference-code/${encodePath(erc)}`;
    const document = await this.#request(path, {}, true, true);
    this.documentCache.set(erc, document);
    return document;
  }

  async listContentStructures() {
    const items = [];
    let page = 1;
    let lastPage = 1;
    do {
      const path = `/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/content-structures?page=${page}&pageSize=200&sort=name:asc`;
      const data = await this.#request(path);
      items.push(...(data?.items || []));
      lastPage = Number(data?.lastPage || 1);
      page += 1;
    }
    while (page <= lastPage);

    return items.map((item) => ({
      availableLanguages: item.availableLanguages || [],
      externalReferenceCode: item.externalReferenceCode || null,
      id: item.id,
      name: item.name,
      siteId: item.siteId
    }));
  }

  async getContentStructure(structureId) {
    return this.#request(`/o/headless-delivery/v1.0/content-structures/${encodePath(structureId)}`);
  }

  async submitStructuredContents(items, {createStrategy, importStrategy}) {
    const query = new URLSearchParams({
      createStrategy,
      importStrategy,
      siteId: this.config.siteId
    });
    const path = `/o/headless-batch-engine/v1.0/import-task/${encodePath(this.config.batchClassName)}?${query}`;
    console.log(`Path: ${path}`);
    return this.#request(path, {
      body: JSON.stringify(items),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
  }

  async getImportTask(taskId) {
    return this.#request(`/o/headless-batch-engine/v1.0/import-task/${encodePath(taskId)}`);
  }
}
