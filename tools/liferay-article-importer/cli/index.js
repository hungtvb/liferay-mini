#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {createInterface} from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import {AppError, assert} from '../server/errors.js';
import {ImportWorkflow} from '../server/import-workflow.js';
import {LiferayClient} from '../server/liferay-client.js';
import {normalizeTask} from '../server/import-service.js';
import {configFromProfile, resolveClientId} from './config.js';
import {CliStore} from './store.js';

const rl = createInterface({input, output});
const store = new CliStore();

function option(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? (process.argv[index + 1] || true) : fallback;
}

function flag(name) {
  return process.argv.includes(`--${name}`);
}

function commandArgs() {
  return process.argv.slice(2).filter((value, index, values) => {
    if (value.startsWith('--')) return false;
    return index === 0 || !values[index - 1]?.startsWith('--');
  });
}

async function ask(label, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  const value = (await rl.question(`${label}${suffix}: `)).trim();
  return value || String(fallback || '').trim();
}

async function choose(label, items, describe = (item) => item.name || String(item)) {
  assert(items.length > 0, 409, 'CHOICE_EMPTY', `No options are available for ${label}`);
  output.write(`\n${label}\n`);
  items.forEach((item, index) => output.write(`  ${index + 1}. ${describe(item)}\n`));
  while (true) {
    const raw = await ask('Select', '1');
    const index = Number(raw) - 1;
    if (Number.isInteger(index) && items[index]) return items[index];
    output.write('Enter one of the listed numbers.\n');
  }
}

function selectionFromProfile(profile) {
  return {
    folderId: profile.folderId,
    imageSourceFolderId: profile.imageSourceFolderId || null,
    imageSourceId: profile.siteId,
    imageSourceType: 'site',
    structureId: profile.structureId,
    viewableBy: profile.viewableBy || 'Anyone'
  };
}

async function loadContext(profileName) {
  const profile = await store.readProfile(profileName);
  const config = configFromProfile(profile);
  const liferay = new LiferayClient(config);
  const workflow = new ImportWorkflow({config, liferay});
  return {config, liferay, profile, workflow};
}

async function init(profileName) {
  let existing = {};
  try { existing = await store.readProfile(profileName); }
  catch (error) { if (error.code !== 'PROFILE_NOT_FOUND') throw error; }

  const baseUrl = await ask('Liferay base URL', existing.baseUrl || process.env.LIFERAY_BASE_URL || 'http://localhost:8080');
  const clientId = resolveClientId({
    existingClientId: existing.clientId,
    overrideClientId: option('client-id')
  });
  const siteId = Number(await ask('Current Site ID', existing.siteId || process.env.LIFERAY_SITE_ID || ''));
  const defaultLocale = await ask('Default locale', existing.defaultLocale || process.env.LIFERAY_DEFAULT_LOCALE || 'en-US');
  assert(Number.isSafeInteger(siteId) && siteId > 0, 400, 'SITE_ID_INVALID', 'Current Site ID must be a positive integer');

  let secret = process.env.LIFERAY_OAUTH_CLIENT_SECRET;
  if (!secret) secret = await ask('OAuth2 client secret (not saved)');
  const draft = {baseUrl, clientId, defaultLocale, siteId, viewableBy: existing.viewableBy || 'Anyone'};
  const config = configFromProfile(draft, secret);
  const liferay = new LiferayClient(config);
  const workflow = new ImportWorkflow({config, liferay});
  const connected = await workflow.connect();

  const structure = await choose('Content Structure', connected.structures, (item) => `${item.name} (${item.id})`);
  const folder = await choose('Target Web Content folder', connected.folders, (item) => `${item.path || item.name} (${item.id})`);
  const imageFolders = await liferay.listImageFolders({id: siteId, type: 'site'});
  const imageFolder = await choose('Documents and Media source', [{id: null, path: 'Current Site root'}, ...imageFolders], (item) => item.path || item.name);
  const visibility = await choose('Content visibility', ['Anyone', 'Members', 'Owner'], String);

  const profile = {
    ...draft,
    folderId: folder.id,
    folderPath: folder.path || folder.name,
    imageSourceFolderId: imageFolder.id || null,
    imageSourceFolderPath: imageFolder.path || 'Current Site root',
    structureId: structure.id,
    structureName: structure.name,
    viewableBy: visibility
  };
  const destination = await store.writeProfile(profileName, profile);
  output.write(`\nProfile saved: ${destination}\n`);
  output.write(`OAuth2 client ID: ${clientId}\n`);
  output.write('OAuth2 client secret was not saved. Set LIFERAY_OAUTH_CLIENT_SECRET for future commands.\n');
}

async function template(profileName) {
  const {profile, workflow} = await loadContext(profileName);
  const {template} = await workflow.buildTemplate(selectionFromProfile(profile));
  const destination = path.resolve(String(option('output', template.fileName)));
  await fs.writeFile(destination, Buffer.from(template.buffer));
  output.write(`Template written: ${destination}\n`);
}

async function validateFile(profileName, fileName) {
  assert(fileName, 400, 'FILE_REQUIRED', 'Provide a .xlsx workbook path');
  const {profile, workflow} = await loadContext(profileName);
  const buffer = await fs.readFile(path.resolve(fileName));
  const result = await workflow.validateBuffer(buffer, selectionFromProfile(profile));
  output.write(`${JSON.stringify({
    canImport: result.validation.canImport,
    errors: result.validation.errors,
    stats: result.validation.stats,
    warnings: result.validation.warnings
  }, null, 2)}\n`);
  if (!result.validation.canImport) process.exitCode = 2;
  return result;
}

async function importFile(profileName, fileName) {
  const initial = await validateFile(profileName, fileName);
  if (!initial.validation.canImport) return;
  if (flag('dry-run')) {
    output.write('Dry run complete. No Batch task was submitted.\n');
    return;
  }

  const createStrategy = String(option('create-strategy', 'INSERT')).toUpperCase();
  const importStrategy = String(option('import-strategy', 'ON_ERROR_FAIL')).toUpperCase();
  assert(['INSERT', 'UPSERT'].includes(createStrategy), 400, 'CREATE_STRATEGY_INVALID', 'create strategy must be INSERT or UPSERT');
  assert(['ON_ERROR_FAIL', 'ON_ERROR_CONTINUE'].includes(importStrategy), 400, 'IMPORT_STRATEGY_INVALID', 'import strategy must be ON_ERROR_FAIL or ON_ERROR_CONTINUE');
  if (createStrategy === 'INSERT') {
    assert(initial.validation.ercCollisions.length === 0, 409, 'ERC_ALREADY_EXISTS', 'INSERT cannot continue because one or more ERCs already exist', {collisions: initial.validation.ercCollisions});
  }
  if (createStrategy === 'UPSERT' && !flag('yes')) {
    const confirmed = (await ask('UPSERT may not move existing content between folders. Continue?', 'no')).toLowerCase();
    assert(['y', 'yes'].includes(confirmed), 409, 'IMPORT_CANCELLED', 'Import cancelled');
  }

  const {liferay, profile, workflow} = await loadContext(profileName);
  const revalidated = await workflow.revalidate(initial.workbook, selectionFromProfile(profile));
  assert(revalidated.validation.canImport, 409, 'VALIDATION_FAILED', 'Workbook no longer passes validation; no Batch task was submitted', {validation: revalidated.validation});

  let task;
  try {
    task = await liferay.submitStructuredContents(revalidated.validation.payload, {createStrategy, importStrategy});
    assert(task?.id, 502, 'BATCH_TASK_RESPONSE_INVALID', 'Liferay accepted the request but did not return a Batch task ID', {requestMayHaveSucceeded: true});
  }
  catch (error) {
    if (error.details?.requestMayHaveSucceeded === true) {
      await store.writeRun({
        createStrategy,
        fileName: path.resolve(fileName),
        importStrategy,
        profile: profileName,
        status: 'SUBMISSION_UNKNOWN'
      });
      throw new AppError(409, 'BATCH_SUBMISSION_UNKNOWN', 'The Batch request may have succeeded, but no task ID was confirmed. Check Batch Engine tasks in Liferay before retrying.', {cause: error.message});
    }
    throw error;
  }

  const normalized = normalizeTask(task);
  await store.writeRun({
    ...normalized,
    createStrategy,
    fileName: path.resolve(fileName),
    importStrategy,
    profile: profileName,
    status: normalized.executeStatus,
    taskId: normalized.id
  });
  output.write(`${JSON.stringify(normalized, null, 2)}\n`);
}

async function status(profileName, taskArg) {
  let taskId = taskArg;
  if (flag('latest')) {
    const latest = await store.readLatestRun();
    assert(latest.taskId, 409, 'LATEST_TASK_UNKNOWN', 'The latest run has no confirmed Batch task ID');
    taskId = latest.taskId;
    profileName = latest.profile || profileName;
  }
  assert(taskId, 400, 'TASK_ID_REQUIRED', 'Provide a task ID or use --latest');
  const {liferay} = await loadContext(profileName);
  const task = normalizeTask(await liferay.getImportTask(taskId));
  await store.writeRun({...task, profile: profileName, status: task.executeStatus, taskId: task.id});
  output.write(`${JSON.stringify(task, null, 2)}\n`);
}

function printHelp() {
  output.write(`Liferay Structured Content importer CLI\n\nRun inside tools/liferay-article-importer:\n  npm run cli -- init [--profile name] [--client-id id]\n  npm run cli -- template [--profile name] [--output file.xlsx]\n  npm run cli -- validate <file.xlsx> [--profile name]\n  npm run cli -- import <file.xlsx> [--profile name] [--dry-run] [--create-strategy INSERT|UPSERT] [--import-strategy ON_ERROR_FAIL|ON_ERROR_CONTINUE] [--yes]\n  npm run cli -- status <task-id> [--profile name]\n  npm run cli -- status --latest\n`);
}

async function main() {
  const [command, positional] = commandArgs();
  const profileName = String(option('profile', 'default'));
  if (!command || ['help', '--help', '-h'].includes(command)) return printHelp();
  if (command === 'init') return init(profileName);
  if (command === 'template') return template(profileName);
  if (command === 'validate') return validateFile(profileName, positional);
  if (command === 'import') return importFile(profileName, positional);
  if (command === 'status') return status(profileName, positional);
  throw new AppError(400, 'COMMAND_UNKNOWN', `Unknown command: ${command}`);
}

main()
  .catch((error) => {
    const details = error.details ? `\n${JSON.stringify(error.details, null, 2)}` : '';
    process.stderr.write(`[${error.code || 'ERROR'}] ${error.message}${details}\n`);
    process.exitCode = error.status >= 500 ? 1 : 2;
  })
  .finally(() => rl.close());
