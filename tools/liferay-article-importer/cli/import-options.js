import {assert} from '../server/errors.js';

export const CREATE_STRATEGIES = ['INSERT', 'UPSERT'];
export const IMPORT_STRATEGIES = ['ON_ERROR_FAIL', 'ON_ERROR_CONTINUE'];

export function normalizeCreateStrategy(value = 'INSERT') {
  const strategy = String(value || 'INSERT').toUpperCase();
  assert(CREATE_STRATEGIES.includes(strategy), 400, 'CREATE_STRATEGY_INVALID', 'create strategy must be INSERT or UPSERT');
  return strategy;
}

export function normalizeImportStrategy(value = 'ON_ERROR_FAIL') {
  const strategy = String(value || 'ON_ERROR_FAIL').toUpperCase();
  assert(IMPORT_STRATEGIES.includes(strategy), 400, 'IMPORT_STRATEGY_INVALID', 'import strategy must be ON_ERROR_FAIL or ON_ERROR_CONTINUE');
  return strategy;
}

export function requiresUpsertConfirmation(createStrategy) {
  return normalizeCreateStrategy(createStrategy) === 'UPSERT';
}
