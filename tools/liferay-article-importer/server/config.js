import {AppError} from './errors.js';

function readRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new AppError(500, 'CONFIG_MISSING', `Missing required environment variable: ${name}`);
  return value;
}

function readInteger(name, fallback, {min = 1, max = Number.MAX_SAFE_INTEGER} = {}) {
  const raw = process.env[name]?.trim();
  const value = raw ? Number.parseInt(raw, 10) : fallback;
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new AppError(500, 'CONFIG_INVALID', `${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function loadConfig() {
  const baseUrl = readRequired('LIFERAY_BASE_URL').replace(/\/+$/, '');
  try { new URL(baseUrl); }
  catch { throw new AppError(500, 'CONFIG_INVALID', 'LIFERAY_BASE_URL must be a valid absolute URL'); }

  return {
    articleFolderExternalReferenceCode: readRequired('LIFERAY_ARTICLE_FOLDER_ERC'),
    articleFolderName: readRequired('LIFERAY_ARTICLE_FOLDER_NAME'),
    articleStructureId: readRequired('LIFERAY_ARTICLE_STRUCTURE_ID'),
    baseUrl,
    batchClassName: 'com.liferay.headless.delivery.dto.v1_0.StructuredContent',
    clientId: readRequired('LIFERAY_OAUTH_CLIENT_ID'),
    clientSecret: readRequired('LIFERAY_OAUTH_CLIENT_SECRET'),
    imageLookupConcurrency: readInteger('IMAGE_LOOKUP_CONCURRENCY', 8, {max: 32}),
    locale: (process.env.LIFERAY_LOCALE || 'en-US').trim(),
    maxImportRows: readInteger('MAX_IMPORT_ROWS', 5000, {max: 100000}),
    maxUploadBytes: readInteger('MAX_UPLOAD_MB', 10, {max: 100}) * 1024 * 1024,
    pollIntervalMs: readInteger('BATCH_POLL_INTERVAL_MS', 1500, {min: 500, max: 30000}),
    pollTimeoutMs: readInteger('BATCH_POLL_TIMEOUT_MS', 600000, {min: 10000, max: 3600000}),
    port: readInteger('PORT', 4174, {max: 65535}),
    sessionTtlMs: readInteger('SESSION_TTL_MS', 1800000, {min: 60000, max: 86400000}),
    siteId: readRequired('LIFERAY_SITE_ID')
  };
}
