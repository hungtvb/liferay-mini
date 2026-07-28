import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {AppError} from '../server/errors.js';

function safeName(value) {
  const normalized = String(value || 'default').trim();
  if (!/^[A-Za-z0-9._-]+$/.test(normalized)) {
    throw new AppError(400, 'PROFILE_NAME_INVALID', 'Profile name may contain only letters, numbers, dots, underscores, and hyphens');
  }
  return normalized;
}

async function readJson(filePath, code, message) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  }
  catch (error) {
    if (error.code === 'ENOENT') throw new AppError(404, code, message);
    throw error;
  }
}

export class CliStore {
  constructor(rootDir = process.env.LIFERAY_IMPORT_HOME || path.join(os.homedir(), '.liferay-import')) {
    this.rootDir = rootDir;
    this.profilesDir = path.join(rootDir, 'profiles');
    this.reportContextsDir = path.join(rootDir, 'report-contexts');
    this.runsDir = path.join(rootDir, 'runs');
  }

  async ensure() {
    await Promise.all([
      fs.mkdir(this.profilesDir, {recursive: true}),
      fs.mkdir(this.reportContextsDir, {recursive: true}),
      fs.mkdir(this.runsDir, {recursive: true})
    ]);
  }

  profilePath(name = 'default') {
    return path.join(this.profilesDir, `${safeName(name)}.json`);
  }

  reportContextPath(taskId) {
    return path.join(this.reportContextsDir, `${safeName(taskId)}.json`);
  }

  runPath(taskId) {
    return path.join(this.runsDir, `${safeName(taskId)}.json`);
  }

  async readProfile(name = 'default') {
    return readJson(
      this.profilePath(name),
      'PROFILE_NOT_FOUND',
      `Profile "${name}" was not found. Run npm run cli init first.`
    );
  }

  async writeProfile(name, profile) {
    await this.ensure();
    const sanitized = {...profile};
    delete sanitized.clientSecret;
    delete sanitized.oauthClientSecret;
    const destination = this.profilePath(name);
    await fs.writeFile(destination, `${JSON.stringify(sanitized, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    return destination;
  }

  async readRun(taskId) {
    return readJson(this.runPath(taskId), 'RUN_NOT_FOUND', `No saved CLI run was found for Batch task ${taskId}`);
  }

  async writeRun(run) {
    await this.ensure();
    const timestamp = new Date().toISOString();
    const record = {...run, updatedAt: timestamp};
    const id = String(record.taskId || record.id || Date.now());
    const destination = this.runPath(id);
    await fs.writeFile(destination, `${JSON.stringify(record, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    await fs.writeFile(path.join(this.runsDir, 'latest.json'), `${JSON.stringify(record, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    return record;
  }

  async readLatestRun() {
    return readJson(path.join(this.runsDir, 'latest.json'), 'RUN_NOT_FOUND', 'No previous CLI import run was found');
  }

  async writeReportContext(taskId, context) {
    await this.ensure();
    const destination = this.reportContextPath(taskId);
    await fs.writeFile(destination, `${JSON.stringify(context, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    return destination;
  }

  async readReportContext(taskId) {
    return readJson(
      this.reportContextPath(taskId),
      'REPORT_CONTEXT_NOT_FOUND',
      `No saved report context was found for Batch task ${taskId}`
    );
  }
}
