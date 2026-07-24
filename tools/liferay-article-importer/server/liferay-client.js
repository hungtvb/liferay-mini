import {setTimeout as delay} from 'node:timers/promises';
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

function retryableStatus(status) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

export class LiferayClient {
  constructor(config, fetchImpl = globalThis.fetch) {
    this.config = config;
    this.fetch = fetchImpl;
    this.token = null;
    this.tokenExpiresAt = 0;
  }

  get connected() {
    return Boolean(this.token && Date.now() < this.tokenExpiresAt);
  }

  async connect() {
    await this.#getAccessToken(true);
    const [structures, folders] = await Promise.all([
      this.listContentStructures(),
      this.listStructuredContentFolders()
    ]);
    return {
      folders,
      imageSource: this.imageSourceSummary(),
      site: {id: this.config.siteId},
      structures
    };
  }

  imageSourceSummary() {
    return {
      folderId: this.config.imageSourceFolderId,
      id: this.config.imageSourceId,
      referenceFormats: ['file:<exact-file-name>', 'erc:<exact-document-erc>'],
      type: this.config.imageSourceType
    };
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
        method: 'POST',
        signal: AbortSignal.timeout(this.config.requestTimeoutMs)
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

  async #request(path, options = {}, state = {attempt: 0, retriedUnauthorized: false}, notFoundAsNull = false) {
    const token = await this.#getAccessToken();
    const method = String(options.method || 'GET').toUpperCase();
    const canRetry = ['GET', 'HEAD', 'OPTIONS'].includes(method);
    let response;
    try {
      response = await this.fetch(`${this.config.baseUrl}${path}`, {
        ...options,
        headers: {
          Accept: 'application/json',
          'Accept-Language': options.locale || this.config.defaultLocale,
          Authorization: `Bearer ${token}`,
          ...options.headers
        },
        signal: AbortSignal.timeout(this.config.requestTimeoutMs)
      });
    }
    catch (error) {
      if (canRetry && state.attempt < this.config.maxRetries) {
        await delay(this.config.retryBaseDelayMs * (2 ** state.attempt));
        return this.#request(path, options, {...state, attempt: state.attempt + 1}, notFoundAsNull);
      }
      throw new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay API', {cause: error.message, path});
    }

    if (response.status === 401 && !state.retriedUnauthorized) {
      await this.#getAccessToken(true);
      return this.#request(path, options, {...state, retriedUnauthorized: true}, notFoundAsNull);
    }
    if (canRetry && retryableStatus(response.status) && state.attempt < this.config.maxRetries) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : this.config.retryBaseDelayMs * (2 ** state.attempt);
      await delay(waitMs);
      return this.#request(path, options, {...state, attempt: state.attempt + 1}, notFoundAsNull);
    }

    const data = await parseResponse(response);
    if (response.status === 404 && notFoundAsNull) return null;
    if (!response.ok) {
      throw new AppError(response.status, 'LIFERAY_API_ERROR', 'Liferay API request failed', {path, response: data, status: response.status});
    }
    return data;
  }

  async #list(path) {
    const items = [];
    let page = 1;
    let lastPage = 1;
    do {
      const separator = path.includes('?') ? '&' : '?';
      const data = await this.#request(`${path}${separator}page=${page}&pageSize=${this.config.imageIndexPageSize}`);
      items.push(...(data?.items || []));
      lastPage = Number(data?.lastPage || 1);
      page += 1;
    }
    while (page <= lastPage);
    return items;
  }

  async listContentStructures() {
    return this.#list(`/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/content-structures?sort=name:asc`);
  }

  async getContentStructure(structureId) {
    return this.#request(`/o/headless-delivery/v1.0/content-structures/${encodePath(structureId)}`);
  }

  async listStructuredContentFolders() {
    const items = await this.#list(`/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/structured-content-folders`);
    return items.map((folder) => ({
      externalReferenceCode: folder.externalReferenceCode || null,
      id: folder.id,
      name: folder.name,
      parentStructuredContentFolderId: folder.parentStructuredContentFolderId || null,
      siteId: folder.siteId
    }));
  }

  async getStructuredContentFolder(folderId) {
    return this.#request(`/o/headless-delivery/v1.0/structured-content-folders/${encodePath(folderId)}`);
  }

  async listConfiguredImageDocuments() {
    let path;
    if (this.config.imageSourceFolderId) {
      path = `/o/headless-delivery/v1.0/document-folders/${encodePath(this.config.imageSourceFolderId)}/documents`;
    }
    else if (this.config.imageSourceType === 'assetLibrary') {
      path = `/o/headless-delivery/v1.0/asset-libraries/${encodePath(this.config.imageSourceId)}/documents`;
    }
    else {
      path = `/o/headless-delivery/v1.0/sites/${encodePath(this.config.imageSourceId)}/documents`;
    }
    return this.#list(path);
  }

  async listSiteStructuredContents() {
    return this.#list(`/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/structured-contents?flatten=true`);
  }

  async getStructuredContentByExternalReferenceCode(externalReferenceCode) {
    return this.#request(
      `/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/structured-contents/by-external-reference-code/${encodePath(externalReferenceCode)}`,
      {},
      {attempt: 0, retriedUnauthorized: false},
      true
    );
  }

  async submitStructuredContents(items, {createStrategy, importStrategy}) {
    const query = new URLSearchParams({createStrategy, importStrategy, siteId: String(this.config.siteId)});
    return this.#request(`/o/headless-batch-engine/v1.0/import-task/${encodePath(this.config.batchClassName)}?${query}`, {
      body: JSON.stringify(items),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
  }

  async getImportTask(taskId) {
    return this.#request(`/o/headless-batch-engine/v1.0/import-task/${encodePath(taskId)}`);
  }
}
