import crypto from 'node:crypto';
import {AppError} from './errors.js';

export class SessionStore {
  constructor({ttlMs}) {
    this.ttlMs = ttlMs;
    this.sessions = new Map();
  }

  #cleanup() {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (session.expiresAt <= now) this.sessions.delete(id);
    }
  }

  create(data) {
    this.#cleanup();
    const now = Date.now();
    const session = {
      ...data,
      createdAt: now,
      expiresAt: now + this.ttlMs,
      id: crypto.randomUUID(),
      submissionPending: false,
      taskId: null
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id) {
    this.#cleanup();
    const session = this.sessions.get(String(id || ''));
    if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'Validation session was not found or has expired');
    return session;
  }

  update(id, patch) {
    const session = this.get(id);
    Object.assign(session, patch, {expiresAt: Date.now() + this.ttlMs});
    return session;
  }

  beginSubmission(id) {
    const session = this.get(id);
    if (session.taskId || session.submissionPending) {
      throw new AppError(409, 'IMPORT_ALREADY_SUBMITTED', 'This validation session already has an import task', {taskId: session.taskId});
    }
    session.submissionPending = true;
    return session;
  }

  completeSubmission(id, patch) {
    return this.update(id, {...patch, submissionPending: false});
  }

  failSubmission(id) {
    return this.update(id, {submissionPending: false});
  }
}
