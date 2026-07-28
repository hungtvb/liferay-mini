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
import {presentCliError, resolveCliExitCode} from './error-output.js';
import {normalizeCreateStrategy, normalizeImportStrategy, requiresUpsertConfirmation} from './import-options.js';
import {CliStore} from './store.js';
import {createTerminal} from './terminal.js';

const DEFAULT_WORKBOOK_DIR = 'workbooks';
const DEFAULT_WORKBOOK_PATH = path.join(DEFAULT_WORKBOOK_DIR, 'articles.xlsx');
const rl = createInterface({input, output});
const store = new CliStore();
const terminal = createTerminal({output, error: process.stderr});
let interruptHandled = false;

function option(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? (process.argv[index + 1] || true) : fallback;
}

function flag(name) {
  return process.argv.includes(`--${name}`);
}

function isInteractive() {
  return Boolean(input.isTTY && output.isTTY && !flag('non-interactive'));
}

function handleInterrupt() {
  if (interruptHandled) return;
  interruptHandled = true;
  rl.close();
  terminal.info('Cancelled by user.');
  process.exit(0);
}

process.once('SIGINT', handleInterrupt);
rl.once('SIGINT', handleInterrupt);

function commandArgs() {
  return process.argv.slice(2).filter((value, index, values) => {
    if (value.startsWith('--')) return false;
    return index === 0 || !values[index - 1]?.startsWith('--');
  });
}

async function ask(label, fallback = '') {
  const value = (await rl.question(terminal.prompt(label, fallback))).trim();
  return value || String(fallback || '').trim();
}

async function choose(label, items, describe = (item) => item.name || String(item)) {
  assert(items.length > 0, 409, 'CHOICE_EMPTY', `No options are available for ${label}`);
  terminal.heading(label);
  items.forEach((item, index) => output.write(`${terminal.choice(index + 1, describe(item))}\n`));
  while (true) {
    const raw = await ask('Select', '1');
    const index = Number(raw) - 1;
    if (Number.isInteger(index) && items[index]) return items[index];
    terminal.warning('Invalid selection.', ['Enter one of the listed numbers.']);
  }
}

async function confirm(label, fallback = false) {
  const answer = (await ask(`${label} (yes/no)`, fallback ? 'yes' : 'no')).toLowerCase();
  return ['y', 'yes'].includes(answer);
}

async function resolveWorkbookPath(fileName) {
  if (fileName) return String(fileName);
  assert(isInteractive(), 400, 'FILE_REQUIRED', 'Provide a .xlsx workbook path');
  return ask('Workbook path', DEFAULT_WORKBOOK_PATH);
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
  terminal.heading('Initialize profile');

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

  terminal.heading('Initialization result');
  terminal.success('Profile initialized successfully.');
  terminal.result('Profile', profileName);
  terminal.result('Saved to', destination);
  terminal.result('Site ID', siteId);
  terminal.result('Structure', `${structure.name} (${structure.id})`);
  terminal.result('Target folder', folder.path || folder.name);
  terminal.result('Image source', imageFolder.path || 'Current Site root');
  terminal.result('Visibility', visibility);
  terminal.info('OAuth2 Client Secret was not saved.', [
    'Keep it in the local .env file or an environment variable.'
  ]);
}

async function template(profileName) {
  const {profile, workflow} = await loadContext(profileName);
  const {template} = await workflow.buildTemplate(selectionFromProfile(profile));
  const defaultDestination = path.join(DEFAULT_WORKBOOK_DIR, template.fileName);
  const destination = path.resolve(String(option('output', defaultDestination)));
  await fs.mkdir(path.dirname(destination), {recursive: true});
  await fs.writeFile(destination, Buffer.from(template.buffer));
  terminal.success('Excel template generated.', [`File: ${destination}`]);
}

async function validateFile(profileName, fileName) {
  fileName = await resolveWorkbookPath(fileName);
  const {profile, workflow} = await loadContext(profileName);
  const buffer = await fs.readFile(path.resolve(fileName));
  const result = await workflow.validateBuffer(buffer, selectionFromProfile(profile));
  const summary = {
    canImport: result.validation.canImport,
    errors: result.validation.errors,
    stats: result.validation.stats,
    warnings: result.validation.warnings
  };

  terminal.heading('Validation result');
  if (result.validation.canImport) {
    terminal.success('Workbook validation passed.');
  }
  else {
    terminal.warning('Workbook validation failed.', ['No Batch task was submitted.']);
  }
  terminal.writeJson(summary);

  if (!result.validation.canImport) {
    process.exitCode = resolveCliExitCode(2, {interactive: isInteractive()});
  }
  return result;
}

async function chooseCreateStrategy() {
  const supplied = option('create-strategy');
  if (supplied) return normalizeCreateStrategy(supplied);
  if (!isInteractive()) return 'INSERT';
  const selected = await choose('Existing content handling', [
    {label: 'Create new only (INSERT)', value: 'INSERT'},
    {label: 'Create or update by ERC (UPSERT)', value: 'UPSERT'}
  ], (item) => item.label);
  return selected.value;
}

async function chooseImportStrategy() {
  const supplied = option('import-strategy');
  if (supplied) return normalizeImportStrategy(supplied);
  if (!isInteractive()) return 'ON_ERROR_FAIL';
  const selected = await choose('Failure handling', [
    {label: 'Stop on first failure (ON_ERROR_FAIL)', value: 'ON_ERROR_FAIL'},
    {label: 'Continue and collect failures (ON_ERROR_CONTINUE)', value: 'ON_ERROR_CONTINUE'}
  ], (item) => item.label);
  return selected.value;
}

async function importFile(profileName, fileName) {
  fileName = await resolveWorkbookPath(fileName);
  const initial = await validateFile(profileName, fileName);
  if (!initial.validation.canImport) return;
  if (flag('dry-run')) {
    terminal.success('Dry run completed.', ['No Batch task was submitted.']);
    return;
  }

  const createStrategy = await chooseCreateStrategy();
  const importStrategy = await chooseImportStrategy();
  if (createStrategy === 'INSERT') {
    assert(initial.validation.ercCollisions.length === 0, 409, 'ERC_ALREADY_EXISTS', 'INSERT cannot continue because one or more ERCs already exist', {collisions: initial.validation.ercCollisions});
  }

  if (requiresUpsertConfirmation(createStrategy) && !flag('confirm-upsert')) {
    if (isInteractive()) {
      const confirmed = await confirm('UPSERT updates existing content by ERC and does not move it between folders. Continue?');
      assert(confirmed, 409, 'IMPORT_CANCELLED', 'Import cancelled');
    }
    else {
      throw new AppError(409, 'UPSERT_CONFIRMATION_REQUIRED', 'Non-interactive UPSERT requires --confirm-upsert');
    }
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

  terminal.heading('Import result');
  terminal.success(`Batch task ${normalized.id} was submitted.`);
  terminal.result('Create strategy', createStrategy);
  terminal.result('Import strategy', importStrategy);
  terminal.writeJson(normalized);
}

async function status(profileName, taskArg, useLatest = flag('latest')) {
  let taskId = taskArg;
  if (useLatest) {
    const latest = await store.readLatestRun();
    assert(latest.taskId, 409, 'LATEST_TASK_UNKNOWN', 'The latest run has no confirmed Batch task ID');
    taskId = latest.taskId;
    profileName = latest.profile || profileName;
  }
  assert(taskId, 400, 'TASK_ID_REQUIRED', 'Provide a task ID or use --latest');
  const {liferay} = await loadContext(profileName);
  const task = normalizeTask(await liferay.getImportTask(taskId));
  await store.writeRun({...task, profile: profileName, status: task.executeStatus, taskId: task.id});

  terminal.heading('Batch task result');
  terminal.success(`Batch task ${task.id} was found.`);
  terminal.result('Status', task.executeStatus || 'Unknown');
  terminal.writeJson(task);
}

async function interactiveStatus(profileName) {
  const source = await choose('Task lookup', [
    {id: 'latest', label: 'Use the latest confirmed task'},
    {id: 'task', label: 'Enter a Batch task ID'}
  ], (item) => item.label);
  if (source.id === 'latest') return status(profileName, null, true);
  return status(profileName, await ask('Batch task ID'), false);
}

async function interactiveMenu(profileName) {
  const action = await choose('What do you want to do?', [
    {id: 'init', label: 'Initialize or update a profile'},
    {id: 'template', label: 'Generate an Excel template'},
    {id: 'validate', label: 'Validate a workbook'},
    {id: 'import', label: 'Import a workbook'},
    {id: 'status', label: 'Check a Batch task status'},
    {id: 'exit', label: 'Exit'}
  ], (item) => item.label);

  if (action.id === 'init') return init(profileName);
  if (action.id === 'template') return template(profileName);
  if (action.id === 'validate') return validateFile(profileName);
  if (action.id === 'import') return importFile(profileName);
  if (action.id === 'status') return interactiveStatus(profileName);
}

function printHelp() {
  output.write(`Liferay Structured Content importer CLI\n\nInteractive workflow:\n  npm run cli\n  npm run cli init\n  npm run cli template\n  npm run cli validate\n  npm run cli import\n\nYou may provide the workbook path directly:\n  npm run cli validate workbooks/file.xlsx\n  npm run cli import workbooks/file.xlsx\n\nUse npm's -- separator only when passing flags:\n  npm run cli -- status --latest\n  npm run cli -- import workbooks/file.xlsx --dry-run\n\nAutomation may pass:\n  --non-interactive\n  --create-strategy INSERT|UPSERT\n  --import-strategy ON_ERROR_FAIL|ON_ERROR_CONTINUE\n  --confirm-upsert\n\nTroubleshooting:\n  --verbose  Show technical error codes, details, and stack traces.\n`);
}

async function main() {
  const [command, positional] = commandArgs();
  const profileName = String(option('profile', 'default'));
  if (!command) return isInteractive() ? interactiveMenu(profileName) : printHelp();
  if (['help', '--help', '-h'].includes(command)) return printHelp();
  if (command === 'init') return init(profileName);
  if (command === 'template') return template(profileName);
  if (command === 'validate') return validateFile(profileName, positional);
  if (command === 'import') return importFile(profileName, positional);
  if (command === 'status') return positional || flag('latest') ? status(profileName, positional) : interactiveStatus(profileName);
  throw new AppError(400, 'COMMAND_UNKNOWN', `Unknown command: ${command}`);
}

main()
  .catch((error) => {
    if (interruptHandled) return;
    const presentation = presentCliError(error, {verbose: flag('verbose')});
    const [title, ...details] = presentation.lines;
    const presenter = terminal[presentation.tone] || terminal.error;
    presenter(title, details);
    process.exitCode = resolveCliExitCode(presentation.exitCode, {interactive: isInteractive()});
  })
  .finally(() => rl.close());
