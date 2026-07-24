import test from 'node:test';
import assert from 'node:assert/strict';
import {SessionStore} from '../server/session-store.js';
import {ImportService} from '../server/import-service.js';

function setup(validation = {canImport: true, ercCollisions: [], payload: [{title: 'A'}]}, liferayOverride = null) {
  const sessions = new SessionStore({maxSessions: 10, ttlMs: 60000});
  const session = sessions.create({validation});
  let submits = 0;
  const liferay = liferayOverride || {
    async submitStructuredContents() {
      submits += 1;
      return {id: 99, executeStatus: 'INITIAL'};
    }
  };
  const service = new ImportService({liferay, sessions});
  return {service, session, sessions, submits: () => submits};
}

test('prevents duplicate Batch submission', async () => {
  const {service, session, submits} = setup();
  await service.submit({sessionId: session.id, createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'});
  await assert.rejects(
    () => service.submit({sessionId: session.id, createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'}),
    (error) => error.code === 'IMPORT_ALREADY_SUBMITTED'
  );
  assert.equal(submits(), 1);
});

test('INSERT blocks known ERC collision and UPSERT requires confirmation', async () => {
  const collision = {canImport: true, ercCollisions: [{externalReferenceCode: 'a'}], payload: [{externalReferenceCode: 'a'}]};
  const first = setup(collision);
  await assert.rejects(
    () => first.service.submit({sessionId: first.session.id, createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'}),
    (error) => error.code === 'ERC_ALREADY_EXISTS'
  );
  const second = setup(collision);
  await assert.rejects(
    () => second.service.submit({sessionId: second.session.id, createStrategy: 'UPSERT', importStrategy: 'ON_ERROR_FAIL'}),
    (error) => error.code === 'UPSERT_CONFIRMATION_REQUIRED'
  );
});

test('locks an ambiguous Batch submission and never allows retry', async () => {
  let submits = 0;
  const {service, session, sessions} = setup(undefined, {
    async submitStructuredContents() {
      submits += 1;
      const error = new Error('connection reset');
      error.code = 'LIFERAY_UNREACHABLE';
      error.details = {requestMayHaveSucceeded: true};
      throw error;
    }
  });

  await assert.rejects(
    () => service.submit({sessionId: session.id, createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'}),
    (error) => error.code === 'BATCH_SUBMISSION_UNKNOWN'
  );
  assert.equal(sessions.get(session.id).submissionUnknown, true);

  await assert.rejects(
    () => service.submit({sessionId: session.id, createStrategy: 'INSERT', importStrategy: 'ON_ERROR_FAIL'}),
    (error) => error.code === 'BATCH_SUBMISSION_UNKNOWN'
  );
  assert.equal(submits, 1);
});

test('caps active sessions and evicts the oldest unsubmitted session', () => {
  const sessions = new SessionStore({maxSessions: 2, ttlMs: 60000});
  const first = sessions.create({validation: {canImport: false}});
  const second = sessions.create({validation: {canImport: false}});
  const third = sessions.create({validation: {canImport: false}});

  assert.throws(() => sessions.get(first.id), (error) => error.code === 'SESSION_NOT_FOUND');
  assert.equal(sessions.get(second.id).id, second.id);
  assert.equal(sessions.get(third.id).id, third.id);
});
