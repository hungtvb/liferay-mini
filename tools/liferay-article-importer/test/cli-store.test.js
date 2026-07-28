import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {CliStore} from '../cli/store.js';

test('CLI profile persistence never stores OAuth secrets', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'liferay-import-profile-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  const store = new CliStore(root);

  await store.writeProfile('local', {
    baseUrl: 'http://localhost:8080',
    clientId: 'client',
    clientSecret: 'do-not-save',
    oauthClientSecret: 'also-do-not-save',
    siteId: 20125
  });

  const raw = await fs.readFile(store.profilePath('local'), 'utf8');
  const profile = JSON.parse(raw);
  assert.equal(profile.clientSecret, undefined);
  assert.equal(profile.oauthClientSecret, undefined);
  assert.equal(profile.siteId, 20125);
  assert.equal(raw.includes('do-not-save'), false);
});

test('latest CLI run survives a new store instance', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'liferay-import-run-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));

  await new CliStore(root).writeRun({profile: 'local', status: 'INITIAL', taskId: 9876});
  const latest = await new CliStore(root).readLatestRun();

  assert.equal(latest.taskId, 9876);
  assert.equal(latest.profile, 'local');
  assert.ok(latest.updatedAt);
});

test('profile names reject path traversal', async () => {
  const store = new CliStore('/tmp/unused');
  assert.throws(() => store.profilePath('../escape'), /Profile name/);
});
