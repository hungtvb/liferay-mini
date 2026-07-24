import {AppError} from './errors.js';

const VIEWABLE_BY_VALUES = new Set(['Anyone', 'Members', 'Owner']);
const IMAGE_SOURCE_TYPES = new Set(['site', 'assetLibrary']);

function readRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new AppError(500, 'CONFIG_MISSING', `Missing required environment variable: ${name}`);
  return value;
}

function readInteger(name, fallback, {min = 1, max = Number.MAX_SAFE_INTEGER, optional = false} = {}) {
  const raw = process.env[name]?.trim();
  if (!raw && optional) return null;
  const value = raw ? Number(raw) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new AppError(500, 'CONFIG_INVALID', `${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function readEnum(name, fallback, allowed) {
  const value = (process.env[name]?.trim() || fallback);
  if (!allowed.has(value)) {
    throw new AppError(500, 'CONFIG_INVALID', `${name} must be one of: ${[...allowed].join(', ')}`);
  }
  return value;
}

function readHost(name, fallback = '127.0.0.1') {
  const value = (process.env[name]?.trim() || fallback);
  if (!/^[A-Za-z0-9.:[\]_-]+$/.test(value)) {
    throw new AppError(500, 'CONFIG_INVALID', `${name} must be a valid host name or IP address`);
  }
  return value;
}

function readUrl(name) {
  const value = readRequired(name).replace(/\/+$/, '');
  try { return new URL(value).toString().replace(/\/$/, ''); }
  catch { throw new AppError(500, 'CONFIG_INVALID', `${name} must be a valid absolute URL`); }
}

export function loadConfig() {
  const siteId = readInteger('LIFERAY_SITE_ID', undefined);
  const imageSourceType = readEnum('LIFERAY_IMAGE_SOURCE_TYPE', undefined, IMAGE_SOURCE_TYPES);
  const imageSourceId = readInteger('LIFERAY_IMAGE_SOURCE_ID', undefined);

  return {
    baseUrl: readUrl('LIFERAY_BASE_URL'),
    batchClassName: 'com.liferay.headless.delivery.dto.v1_0.StructuredContent',
    clientId: readRequired('LIFERAY_OAUTH_CLIENT_ID'),
    clientSecret: readRequired('LIFERAY_OAUTH_CLIENT_SECRET'),
    defaultLocale: (process.env.LIFERAY_DEFAULT_LOCALE || 'en-US').trim(),
    host: readHost('HOST'),
    imageIndexPageSize: readInteger('IMAGE_INDEX_PAGE_SIZE', 200, {max: 500}),
    imageSourceFolderId: readInteger('LIFERAY_IMAGE_SOURCE_FOLDER_ID', null, {optional: true}),
    imageSourceId,
    imageSourceType,
    maxActiveSessions: readInteger('MAX_ACTIVE_SESSIONS', 10, {max: 100}),
    maxImportRows: readInteger('MAX_IMPORT_ROWS', 5000, {max: 100000}),
    maxRetries: readInteger('LIFERAY_MAX_RETRIES', 3, {min: 0, max: 10}),
    maxUploadBytes: readInteger('MAX_UPLOAD_MB', 50, {max: 500}) * 1024 * 1024,
    pollIntervalMs: readInteger('BATCH_POLL_INTERVAL_MS', 1500, {min: 500, max: 30000}),
    pollTimeoutMs: readInteger('BATCH_POLL_TIMEOUT_MS', 600000, {min: 10000, max: 3600000}),
    port: readInteger('PORT', 4174, {max: 65535}),
    previewRows: readInteger('PREVIEW_ROWS', 20, {min: 1, max: 100}),
    requestTimeoutMs: readInteger('LIFERAY_REQUEST_TIMEOUT_MS', 30000, {min: 1000, max: 120000}),
    retryBaseDelayMs: readInteger('LIFERAY_RETRY_BASE_DELAY_MS', 500, {min: 50, max: 10000}),
    sessionTtlMs: readInteger('SESSION_TTL_MS', 1800000, {min: 60000, max: 86400000}),
    siteId,
    viewableBy: readEnum('LIFERAY_CONTENT_VIEWABLE_BY', 'Anyone', VIEWABLE_BY_VALUES)
  };
}
