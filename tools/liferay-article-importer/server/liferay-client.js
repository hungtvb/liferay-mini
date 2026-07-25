import {setTimeout as delay} from 'node:timers/promises';
import {AppError} from './errors.js';
import {IMAGE_SOURCE_TYPES} from './config.js';

function encodePath(value) {
  return encodeURIComponent(String(value));
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  }
  catch {
    return text;
  }
}

function retryableStatus(status) {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function folderPaths(items, parentKey) {
  const byId = new Map(items.map((item) => [String(item.id), item]));
  const cache = new Map();

  function build(item, visited = new Set()) {
    const key = String(item.id);
    if (cache.has(key)) return cache.get(key);
    if (visited.has(key)) return item.name;

    const parentId = item[parentKey];
    if (!parentId) {
      cache.set(key, item.name);
      return item.name;
    }

    const parent = byId.get(String(parentId));
    if (!parent) {
      cache.set(key, item.name);
      return item.name;
    }

    const path = `${build(parent, new Set([...visited, key]))} / ${item.name}`;
    cache.set(key, path);
    return path;
  }

  return items
    .map((item) => ({...item, path: build(item)}))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function parsePositiveInteger(value, field, {optional = false} = {}) {
  if ((value == null || value === '') && optional) return null;

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new AppError(400, 'IMAGE_SOURCE_INVALID', `${field} must be a positive integer`);
  }

  return parsed;
}

function normalizeImageSource(scope) {
  const type = String(scope?.type || '').trim();
  if (!IMAGE_SOURCE_TYPES.includes(type)) {
    throw new AppError(400, 'IMAGE_SOURCE_INVALID', `Image source type must be one of: ${IMAGE_SOURCE_TYPES.join(', ')}`);
  }

  return {
    folderId: parsePositiveInteger(scope?.folderId, 'Image source folder ID', {optional: true}),
    id: parsePositiveInteger(scope?.id, 'Image source ID'),
    type
  };
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
      imageSources: [
        {
          id: this.config.siteId,
          name: 'Current Site',
          type: 'site'
        }
      ],
      site: {id: this.config.siteId},
      structures
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
      throw new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay OAuth2 endpoint', {
        cause: error.message
      });
    }

    const data = await parseResponse(response);
    if (!response.ok || !data?.access_token) {
      throw new AppError(502, 'OAUTH_FAILED', 'Liferay OAuth2 client credentials authentication failed', {
        response: data,
        status: response.status
      });
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

      throw new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay API', {
        cause: error.message,
        method,
        path,
        requestMayHaveSucceeded: !canRetry
      });
    }

    if (response.status === 401 && !state.retriedUnauthorized) {
      await this.#getAccessToken(true);
      return this.#request(path, options, {...state, retriedUnauthorized: true}, notFoundAsNull);
    }

    if (canRetry && retryableStatus(response.status) && state.attempt < this.config.maxRetries) {
      const retryAfter = Number(response.headers.get('retry-after'));
      const waitMs = Number.isFinite(retryAfter)
        ? retryAfter * 1000
        : this.config.retryBaseDelayMs * (2 ** state.attempt);

      await delay(waitMs);
      return this.#request(path, options, {...state, attempt: state.attempt + 1}, notFoundAsNull);
    }

    const data = await parseResponse(response);
    if (response.status === 404 && notFoundAsNull) return null;

    if (!response.ok) {
      throw new AppError(response.status, 'LIFERAY_API_ERROR', 'Liferay API request failed', {
        method,
        path,
        requestMayHaveSucceeded: !canRetry && response.status >= 500,
        response: data,
        status: response.status
      });
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
      items.push(...(Array.isArray(data) ? data : (data?.items || [])));
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
    const items = await this.#list(
      `/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/structured-content-folders?flatten=true`
    );

    return folderPaths(items.map((folder) => ({
      externalReferenceCode: folder.externalReferenceCode || null,
      id: folder.id,
      name: folder.name,
      parentStructuredContentFolderId: folder.parentStructuredContentFolderId || null,
      siteId: folder.siteId
    })), 'parentStructuredContentFolderId');
  }

  async getStructuredContentFolder(folderId) {
    return this.#request(`/o/headless-delivery/v1.0/structured-content-folders/${encodePath(folderId)}`);
  }

  async #assertImageSource(scope) {
    const normalized = normalizeImageSource(scope);

    if (normalized.type !== 'site' || String(normalized.id) !== String(this.config.siteId)) {
      throw new AppError(400, 'IMAGE_SOURCE_NOT_AVAILABLE', 'Image source must be the configured Current Site', {
        configuredSiteId: this.config.siteId,
        imageSourceId: normalized.id,
        imageSourceType: normalized.type
      });
    }

    return {
      ...normalized,
      name: 'Current Site'
    };
  }

  async listImageFolders(scope) {
    const source = await this.#assertImageSource({...scope, folderId: null});
    const items = await this.#list(
      `/o/headless-delivery/v1.0/sites/${encodePath(source.id)}/document-folders?flatten=true`
    );

    return folderPaths(items.map((folder) => ({
      externalReferenceCode: folder.externalReferenceCode || null,
      id: folder.id,
      name: folder.name,
      parentDocumentFolderId: folder.parentDocumentFolderId || null,
      siteId: folder.siteId
    })), 'parentDocumentFolderId');
  }

  async resolveImageSource(scope) {
    const source = await this.#assertImageSource(scope);
    let folder = null;

    if (source.folderId) {
      const folders = await this.listImageFolders(source);
      folder = folders.find((item) => String(item.id) === String(source.folderId)) || null;

      if (!folder) {
        throw new AppError(
          400,
          'IMAGE_SOURCE_FOLDER_MISMATCH',
          `Document folder ${source.folderId} does not belong to the configured Current Site`,
          {
            imageSourceFolderId: source.folderId,
            imageSourceId: source.id,
            imageSourceType: source.type
          }
        );
      }
    }

    return {
      assetLibraryId: null,
      externalReferenceCode: null,
      folderId: folder?.id || null,
      folderName: folder?.name || null,
      folderPath: folder?.path || null,
      id: source.id,
      name: source.name,
      referenceFormats: ['file:<exact-file-name>', 'erc:<exact-document-erc>'],
      type: source.type,
      validated: true
    };
  }

  async listImageDocuments(scope) {
    const source = await this.resolveImageSource(scope);
    const path = source.folderId
      ? `/o/headless-delivery/v1.0/document-folders/${encodePath(source.folderId)}/documents`
      : `/o/headless-delivery/v1.0/sites/${encodePath(source.id)}/documents?flatten=true`;

    return this.#list(path);
  }

  async listSiteStructuredContents() {
    return this.#list(
      `/o/headless-delivery/v1.0/sites/${encodePath(this.config.siteId)}/structured-contents?flatten=true`
    );
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
    const query = new URLSearchParams({
      createStrategy,
      importStrategy,
      siteId: String(this.config.siteId)
    });

    return this.#request(
      `/o/headless-batch-engine/v1.0/import-task/${encodePath(this.config.batchClassName)}?${query}`,
      {
        body: JSON.stringify(items),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      }
    );
  }

  async getImportTask(taskId) {
    return this.#request(`/o/headless-batch-engine/v1.0/import-task/${encodePath(taskId)}`);
  }
}
