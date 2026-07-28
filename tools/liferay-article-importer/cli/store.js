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

export class CliStore {
  constructor(rootDir = process.env.LIFERAY_IMPORT_HOME || path.join(os.homedir(), '.liferay-import')) {
    this.rootDir = rootDir;
    this.profilesDir = path.join(rootDir, 'profiles');
    this.runsDir = path.join(rootDir, 'runs');
  }

  async ensure() {
    await Promise.all([
      fs.mkdir(this.profilesDir, {recursive: true}),
      fs.mkdir(this.runsDir, {recursive: true})
    ]);
  }

  profilePath(name = 'default') {
    return path.join(this.profilesDir, `${safeName(name)}.json`);
  }

  async readProfile(name = 'default') {
    try {
      return JSON.parse(await fs.readFile(this.profilePath(name), 'utf8'));
    }
    catch (error) {
      if (error.code === 'ENOENT') {
        throw new AppError(404, 'PROFILE_NOT_FOUND', `Profile "${name}" was not found. Run liferay-import init --profile ${name} first.`);
      }
      throw error;
    }
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

  async writeRun(run) {
    await this.ensure();
    const timestamp = new Date().toISOString();
    const record = {...run, updatedAt: timestamp};
    const id = String(record.taskId || record.id || Date.now());
    const destination = path.join(this.runsDir, `${safeName(id)}.json`);
    await fs.writeFile(destination, `${JSON.stringify(record, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    await fs.writeFile(path.join(this.runsDir, 'latest.json'), `${JSON.stringify(record, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    return record;
  }

  async readLatestRun() {
    try {
      return JSON.parse(await fs.readFile(path.join(this.runsDir, 'latest.json'), 'utf8'));
    }
    catch (error) {
      if (error.code === 'ENOENT') throw new AppError(404, 'RUN_NOT_FOUND', 'No previous CLI import run was found');
      throw error;
    }
  }
}
