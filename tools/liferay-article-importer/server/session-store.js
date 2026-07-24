import {randomUUID} from 'node:crypto';
import {AppError} from './errors.js';

export class SessionStore {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.sessions = new Map();
    this.timer = setInterval(() => this.cleanup(), Math.min(ttlMs, 60000));
    this.timer.unref();
  }

  create(value) {
    const id = randomUUID();
    const now = Date.now();
    this.sessions.set(id, {...value, createdAt: now, expiresAt: now + this.ttlMs, id});
    return this.sessions.get(id);
  }

  get(id) {
    const session = this.sessions.get(id);

    if (!session || session.expiresAt <= Date.now()) {
      this.sessions.delete(id);
      throw new AppError(404, 'SESSION_NOT_FOUND', 'Workbook session was not found or has expired');
    }

    session.expiresAt = Date.now() + this.ttlMs;
    return session;
  }

  update(id, patch) {
    const session = this.get(id);
    Object.assign(session, patch, {expiresAt: Date.now() + this.ttlMs});
    return session;
  }

  cleanup() {
    const now = Date.now();

    for (const [id, session] of this.sessions) {
      if (session.expiresAt <= now) {
        this.sessions.delete(id);
      }
    }
  }
}
