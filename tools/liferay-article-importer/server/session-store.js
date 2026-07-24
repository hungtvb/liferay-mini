import crypto from 'node:crypto';
import {AppError} from './errors.js';

export class SessionStore {
  constructor({ttlMs, maxSessions = 10}) {
    this.ttlMs = ttlMs;
    this.maxSessions = maxSessions;
    this.sessions = new Map();
    this.cleanupTimer = setInterval(() => this.#cleanup(), Math.min(60000, Math.max(10000, Math.floor(ttlMs / 2))));
    this.cleanupTimer.unref?.();
  }

  #cleanup() {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (session.expiresAt <= now && !session.submissionPending) this.sessions.delete(id);
    }
  }

  #ensureCapacity() {
    this.#cleanup();
    if (this.sessions.size < this.maxSessions) return;

    const removable = [...this.sessions.values()]
      .filter((session) => !session.taskId && !session.submissionPending && !session.submissionUnknown)
      .sort((left, right) => left.createdAt - right.createdAt);

    while (this.sessions.size >= this.maxSessions && removable.length > 0) {
      this.sessions.delete(removable.shift().id);
    }

    if (this.sessions.size >= this.maxSessions) {
      throw new AppError(
        429,
        'SESSION_LIMIT_REACHED',
        `The importer already has ${this.maxSessions} active validation sessions. Wait for old sessions to expire or restart the local tool.`
      );
    }
  }

  create(data) {
    this.#ensureCapacity();
    const now = Date.now();
    const session = {
      ...data,
      createdAt: now,
      expiresAt: now + this.ttlMs,
      id: crypto.randomUUID(),
      submissionPending: false,
      submissionUnknown: false,
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
    if (session.taskId || session.submissionPending || session.submissionUnknown) {
      throw new AppError(
        409,
        session.submissionUnknown ? 'BATCH_SUBMISSION_UNKNOWN' : 'IMPORT_ALREADY_SUBMITTED',
        session.submissionUnknown
          ? 'The previous Batch submission result is unknown. Do not submit this session again; verify Batch Engine tasks in Liferay.'
          : 'This validation session already has an import task',
        {taskId: session.taskId}
      );
    }
    session.submissionPending = true;
    return session;
  }

  completeSubmission(id, patch) {
    return this.update(id, {...patch, submissionPending: false, submissionUnknown: false});
  }

  failSubmission(id) {
    return this.update(id, {submissionPending: false});
  }

  markSubmissionUnknown(id, patch = {}) {
    return this.update(id, {...patch, submissionPending: false, submissionUnknown: true});
  }
}
