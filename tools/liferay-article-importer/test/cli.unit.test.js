import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {configFromProfile, DEFAULT_OAUTH_CLIENT_ID, resolveClientId} from '../cli/config.js';
import {presentCliError, resolveCliExitCode} from '../cli/error-output.js';
import {normalizeCreateStrategy, normalizeImportStrategy, requiresUpsertConfirmation} from '../cli/import-options.js';
import {CliStore} from '../cli/store.js';
import {createTerminal} from '../cli/terminal.js';
import {AppError} from '../server/errors.js';

const profile = {
  baseUrl: 'http://localhost:8080',
  defaultLocale: 'en-US',
  siteId: 20125
};

function capture() {
  let value = '';
  return {
    stream: {
      isTTY: true,
      write(chunk) {
        value += chunk;
      }
    },
    value() {
      return value;
    }
  };
}

test('CLI client ID resolution uses override, saved value, then default', () => {
  assert.equal(resolveClientId({existingClientId: 'saved', overrideClientId: 'override'}), 'override');
  assert.equal(resolveClientId({existingClientId: 'saved'}), 'saved');
  assert.equal(resolveClientId(), DEFAULT_OAUTH_CLIENT_ID);
});

test('CLI config requires only the OAuth secret outside the saved profile', () => {
  const config = configFromProfile(profile, 'secret-value');
  assert.equal(config.clientId, DEFAULT_OAUTH_CLIENT_ID);
  assert.equal(config.clientSecret, 'secret-value');
  assert.equal(config.siteId, 20125);

  assert.throws(
    () => configFromProfile(profile, ''),
    (error) => error.code === 'CONFIG_MISSING' && /LIFERAY_OAUTH_CLIENT_SECRET/.test(error.message)
  );
});

test('CLI import strategies normalize values and keep safe defaults', () => {
  assert.equal(normalizeCreateStrategy(), 'INSERT');
  assert.equal(normalizeImportStrategy(), 'ON_ERROR_FAIL');
  assert.equal(normalizeCreateStrategy('upsert'), 'UPSERT');
  assert.equal(normalizeImportStrategy('on_error_continue'), 'ON_ERROR_CONTINUE');
  assert.equal(requiresUpsertConfirmation('INSERT'), false);
  assert.equal(requiresUpsertConfirmation('UPSERT'), true);
});

test('invalid CLI import strategies are rejected', () => {
  assert.throws(() => normalizeCreateStrategy('replace'), (error) => error.code === 'CREATE_STRATEGY_INVALID');
  assert.throws(() => normalizeImportStrategy('ignore'), (error) => error.code === 'IMPORT_STRATEGY_INVALID');
});

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
  const saved = JSON.parse(raw);
  assert.equal(saved.clientSecret, undefined);
  assert.equal(saved.oauthClientSecret, undefined);
  assert.equal(saved.siteId, 20125);
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

test('CLI profile names reject path traversal', () => {
  const store = new CliStore('/tmp/unused');
  assert.throws(() => store.profilePath('../escape'), /Profile name/);
});

test('interactive cancellations are friendly and exit cleanly', () => {
  const abort = presentCliError(Object.assign(new Error('aborted'), {name: 'AbortError'}));
  assert.deepEqual(abort, {exitCode: 0, lines: ['Cancelled by user.'], tone: 'info'});

  const declined = presentCliError(new AppError(409, 'IMPORT_CANCELLED', 'Import cancelled'));
  assert.deepEqual(declined, {exitCode: 0, lines: ['Import cancelled.'], tone: 'info'});

  assert.equal(resolveCliExitCode(2, {interactive: true}), 0);
  assert.equal(resolveCliExitCode(1, {interactive: false}), 1);
});

test('missing Batch task errors stay scoped to status lookup', () => {
  const missing = presentCliError(new AppError(404, 'LIFERAY_API_ERROR', 'Liferay API request failed', {
    method: 'GET',
    path: '/o/headless-batch-engine/v1.0/import-task/2',
    status: 404
  }));

  assert.equal(missing.tone, 'warning');
  assert.match(missing.lines[0], /Batch task 2 was not found/i);
  assert.match(missing.lines[1], /latest confirmed task/i);
  assert.doesNotMatch(missing.lines.join('\n'), /run npm run cli init/i);

  const submit404 = presentCliError(new AppError(404, 'LIFERAY_API_ERROR', 'Liferay API request failed', {
    method: 'POST',
    path: '/o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent',
    status: 404
  }));
  assert.doesNotMatch(submit404.lines[0], /Batch task .* was not found/i);
});

test('known CLI failures include a useful next action', () => {
  const unreachable = presentCliError(new AppError(502, 'LIFERAY_UNREACHABLE', 'Cannot reach the Liferay API'));
  assert.equal(unreachable.tone, 'error');
  assert.match(unreachable.lines[0], /connect to Liferay/i);
  assert.match(unreachable.lines[1], /LIFERAY_BASE_URL/);

  const missingFile = presentCliError(Object.assign(new Error('missing'), {
    code: 'ENOENT',
    path: 'workbooks/missing.xlsx'
  }));
  assert.equal(missingFile.tone, 'warning');
  assert.match(missingFile.lines[1], /workbooks\/missing\.xlsx/);
});

test('verbose output shows sanitized diagnostics only when requested', () => {
  const error = new AppError(502, 'OAUTH_FAILED', 'authentication failed', {
    clientSecret: 'never-print-me',
    status: 401
  });

  assert.equal(presentCliError(error).lines.some((line) => line.includes('OAUTH_FAILED')), false);

  const verbose = presentCliError(error, {verbose: true}).lines.join('\n');
  assert.match(verbose, /OAUTH_FAILED/);
  assert.match(verbose, /\[redacted\]/);
  assert.equal(verbose.includes('never-print-me'), false);
});

test('terminal output distinguishes prompts and result tones', () => {
  const stdout = capture();
  const stderr = capture();
  const terminal = createTerminal({output: stdout.stream, error: stderr.stream, color: true});

  assert.match(terminal.prompt('Batch task ID', '1'), /\u001b\[36m/);
  terminal.heading('Batch task result');
  terminal.success('Batch task 42 was found.');
  terminal.warning('Batch task 2 was not found.', ['Check the task ID.']);
  terminal.error('Could not connect to Liferay.', ['Check LIFERAY_BASE_URL.']);

  assert.match(stdout.value(), /\u001b\[32m/);
  assert.match(stdout.value(), /\u001b\[33m/);
  assert.match(stderr.value(), /\u001b\[31m/);
});

test('terminal output remains readable without ANSI colors', () => {
  const stdout = capture();
  const terminal = createTerminal({output: stdout.stream, error: stdout.stream, color: false});

  assert.equal(terminal.prompt('Select', '1'), '› Select [1]: ');
  terminal.success('Profile initialized successfully.', ['Profile: default']);
  assert.equal(stdout.value(), '✓ Profile initialized successfully.\n  Profile: default\n');
  assert.doesNotMatch(stdout.value(), /\u001b\[/);
});
