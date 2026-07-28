import {assert} from '../server/errors.js';

export const DEFAULT_OAUTH_CLIENT_ID = 'nexcent-import-tool';

export function resolveClientId({existingClientId, overrideClientId} = {}) {
  return String(
    overrideClientId
      || process.env.LIFERAY_OAUTH_CLIENT_ID
      || existingClientId
      || DEFAULT_OAUTH_CLIENT_ID
  ).trim();
}

export function configFromProfile(profile, secret = process.env.LIFERAY_OAUTH_CLIENT_SECRET) {
  assert(secret, 500, 'CONFIG_MISSING', 'Set LIFERAY_OAUTH_CLIENT_SECRET before running this command');
  const clientId = resolveClientId({existingClientId: profile.clientId});
  assert(clientId, 500, 'CONFIG_MISSING', 'OAuth2 client ID is not configured');

  return {
    baseUrl: String(profile.baseUrl).replace(/\/+$/, ''),
    batchClassName: 'com.liferay.headless.delivery.dto.v1_0.StructuredContent',
    clientId,
    clientSecret: secret,
    defaultLocale: profile.defaultLocale || 'en-US',
    defaultViewableBy: profile.viewableBy || 'Anyone',
    imageIndexPageSize: 200,
    maxImportRows: 5000,
    maxRetries: 3,
    pollIntervalMs: 1500,
    pollTimeoutMs: 600000,
    requestTimeoutMs: 30000,
    retryBaseDelayMs: 500,
    siteId: Number(profile.siteId)
  };
}
