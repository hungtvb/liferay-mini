import assert from 'node:assert/strict';
import test from 'node:test';
import {configFromProfile, DEFAULT_OAUTH_CLIENT_ID, resolveClientId} from '../cli/config.js';

const profile = {
  baseUrl: 'http://localhost:8080',
  defaultLocale: 'en-US',
  siteId: 20125
};

test('CLI uses the fixed importer OAuth client ID by default', () => {
  assert.equal(resolveClientId(), DEFAULT_OAUTH_CLIENT_ID);
});

test('CLI preserves an initialized client ID before falling back to the fixed default', () => {
  assert.equal(resolveClientId({existingClientId: 'saved-client'}), 'saved-client');
});

test('explicit client ID override has highest priority', () => {
  assert.equal(resolveClientId({existingClientId: 'saved-client', overrideClientId: 'override-client'}), 'override-client');
});

test('only OAuth client secret is required outside the initialized profile', () => {
  const config = configFromProfile(profile, 'secret-value');
  assert.equal(config.clientId, DEFAULT_OAUTH_CLIENT_ID);
  assert.equal(config.clientSecret, 'secret-value');
  assert.equal(config.siteId, 20125);
});

test('missing OAuth client secret fails before any Liferay request', () => {
  assert.throws(
    () => configFromProfile(profile, ''),
    (error) => error.code === 'CONFIG_MISSING' && /LIFERAY_OAUTH_CLIENT_SECRET/.test(error.message)
  );
});
