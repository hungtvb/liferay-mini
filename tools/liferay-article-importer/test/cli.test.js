import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {configFromProfile, DEFAULT_OAUTH_CLIENT_ID} from '../cli/config.js';
import {presentCliError} from '../cli/error-output.js';
import {normalizeCreateStrategy, normalizeImportStrategy} from '../cli/import-options.js';
import {CliStore} from '../cli/store.js';
import {AppError} from '../server/errors.js';

const toolRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('CLI keeps safe defaults and requires the OAuth secret', () => {
  assert.equal(normalizeCreateStrategy(), 'INSERT');
  assert.equal(normalizeImportStrategy(), 'ON_ERROR_FAIL');

  const profile = {baseUrl: 'http://localhost:8080', defaultLocale: 'en-US', siteId: 20125};
  const config = configFromProfile(profile, 'secret-value');
  assert.equal(config.clientId, DEFAULT_OAUTH_CLIENT_ID);
  assert.equal(config.clientSecret, 'secret-value');
  assert.throws(() => configFromProfile(profile, ''), (error) => error.code === 'CONFIG_MISSING');
});

test('CLI store excludes secrets and preserves run report data', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'liferay-import-cli-'));
  t.after(() => fs.rm(root, {recursive: true, force: true}));
  const store = new CliStore(root);

  await store.writeProfile('local', {
    baseUrl: 'http://localhost:8080',
    clientSecret: 'do-not-save',
    oauthClientSecret: 'also-do-not-save',
    siteId: 20125
  });
  await store.writeRun({
    createStrategy: 'INSERT',
    fileName: 'workbooks/articles.xlsx',
    profile: 'local',
    status: 'INITIAL',
    taskId: 9876
  });
  await store.writeReportContext(9876, {
    fileName: 'articles.xlsx',
    validation: {stats: {totalRows: 2}}
  });

  const savedProfile = await fs.readFile(store.profilePath('local'), 'utf8');
  const latest = await new CliStore(root).readLatestRun();
  const savedRun = await new CliStore(root).readRun(9876);
  const reportContext = await new CliStore(root).readReportContext(9876);

  assert.equal(savedProfile.includes('do-not-save'), false);
  assert.equal(latest.taskId, 9876);
  assert.equal(savedRun.fileName, 'workbooks/articles.xlsx');
  assert.equal(savedRun.createStrategy, 'INSERT');
  assert.equal(reportContext.validation.stats.totalRows, 2);
  assert.throws(() => store.profilePath('../escape'), /Profile name/);
});

test('missing Batch task output stays scoped to status lookup', () => {
  const missing = presentCliError(new AppError(404, 'LIFERAY_API_ERROR', 'Liferay API request failed', {
    method: 'GET',
    path: '/o/headless-batch-engine/v1.0/import-task/2',
    status: 404
  }));

  assert.equal(missing.tone, 'warning');
  assert.match(missing.lines[0], /Batch task 2 was not found/i);
  assert.doesNotMatch(missing.lines.join('\n'), /npm run cli init/i);

  const submit404 = presentCliError(new AppError(404, 'LIFERAY_API_ERROR', 'Liferay API request failed', {
    method: 'POST',
    path: '/o/headless-batch-engine/v1.0/import-task/com.liferay.headless.delivery.dto.v1_0.StructuredContent',
    status: 404
  }));
  assert.doesNotMatch(submit404.lines[0], /Batch task .* was not found/i);
});

test('unfinished import reports explain when they become available', () => {
  const result = presentCliError(new AppError(
    409,
    'IMPORT_REPORT_NOT_READY',
    'Batch task 12 is STARTED. Wait until it reaches a terminal status.'
  ));
  assert.equal(result.tone, 'warning');
  assert.match(result.lines[0], /report is not ready/i);
  assert.match(result.lines[1], /STARTED/);
});

test('verbose diagnostics redact secrets', () => {
  const error = new AppError(502, 'OAUTH_FAILED', 'authentication failed', {
    clientSecret: 'never-print-me',
    status: 401
  });
  const output = presentCliError(error, {verbose: true}).lines.join('\n');
  assert.match(output, /OAUTH_FAILED/);
  assert.match(output, /\[redacted\]/);
  assert.equal(output.includes('never-print-me'), false);
});

test('Ctrl+C exits the interactive CLI cleanly', async () => {
  const child = spawn(process.execPath, ['cli/index.js', 'init'], {
    cwd: toolRoot,
    env: {...process.env, LIFERAY_OAUTH_CLIENT_SECRET: ''},
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let stdout = '';
  let stderr = '';
  let interrupted = false;
  const timeout = setTimeout(() => child.kill('SIGKILL'), 5000);

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
    if (!interrupted && stdout.includes('Liferay base URL')) {
      interrupted = true;
      child.kill('SIGINT');
    }
  });

  const result = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({code, signal}));
  });

  clearTimeout(timeout);
  assert.equal(interrupted, true);
  assert.deepEqual(result, {code: 0, signal: null});
  assert.match(stdout, /Cancelled by user\./);
  assert.equal(stderr, '');
});
