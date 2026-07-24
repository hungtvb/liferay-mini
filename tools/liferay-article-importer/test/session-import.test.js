import test from 'node:test';
import assert from 'node:assert/strict';
import {SessionStore} from '../server/session-store.js';
import {ImportService} from '../server/import-service.js';

function setup(validation = {canImport:true,ercCollisions:[],payload:[{title:'A'}]}) {
  const sessions = new SessionStore({ttlMs:60000});
  const session = sessions.create({validation});
  let submits = 0;
  const service = new ImportService({liferay:{async submitStructuredContents(){submits += 1; return {id:99,executeStatus:'INITIAL'};}},sessions});
  return {service,session,submits:()=>submits};
}

test('prevents duplicate Batch submission', async () => {
  const {service,session,submits} = setup();
  await service.submit({sessionId:session.id,createStrategy:'INSERT',importStrategy:'ON_ERROR_FAIL'});
  await assert.rejects(() => service.submit({sessionId:session.id,createStrategy:'INSERT',importStrategy:'ON_ERROR_FAIL'}), (error) => error.code === 'IMPORT_ALREADY_SUBMITTED');
  assert.equal(submits(),1);
});

test('INSERT blocks known ERC collision and UPSERT requires confirmation', async () => {
  const collision = {canImport:true,ercCollisions:[{externalReferenceCode:'a'}],payload:[{externalReferenceCode:'a'}]};
  const first = setup(collision);
  await assert.rejects(() => first.service.submit({sessionId:first.session.id,createStrategy:'INSERT',importStrategy:'ON_ERROR_FAIL'}), (error) => error.code === 'ERC_ALREADY_EXISTS');
  const second = setup(collision);
  await assert.rejects(() => second.service.submit({sessionId:second.session.id,createStrategy:'UPSERT',importStrategy:'ON_ERROR_FAIL'}), (error) => error.code === 'UPSERT_CONFIRMATION_REQUIRED');
});
