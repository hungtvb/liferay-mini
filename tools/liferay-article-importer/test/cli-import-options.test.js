import assert from 'node:assert/strict';
import test from 'node:test';
import {normalizeCreateStrategy, normalizeImportStrategy, requiresUpsertConfirmation} from '../cli/import-options.js';

test('CLI import strategies use safe defaults', () => {
  assert.equal(normalizeCreateStrategy(), 'INSERT');
  assert.equal(normalizeImportStrategy(), 'ON_ERROR_FAIL');
});

test('CLI import strategies are normalized case-insensitively', () => {
  assert.equal(normalizeCreateStrategy('upsert'), 'UPSERT');
  assert.equal(normalizeImportStrategy('on_error_continue'), 'ON_ERROR_CONTINUE');
});

test('invalid CLI import strategies are rejected', () => {
  assert.throws(() => normalizeCreateStrategy('replace'), (error) => error.code === 'CREATE_STRATEGY_INVALID');
  assert.throws(() => normalizeImportStrategy('ignore'), (error) => error.code === 'IMPORT_STRATEGY_INVALID');
});

test('only UPSERT requires an explicit safety confirmation', () => {
  assert.equal(requiresUpsertConfirmation('INSERT'), false);
  assert.equal(requiresUpsertConfirmation('UPSERT'), true);
});
