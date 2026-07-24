import {assert} from './errors.js';

const CREATE_STRATEGIES = new Set(['INSERT', 'UPSERT']);
const IMPORT_STRATEGIES = new Set(['ON_ERROR_FAIL', 'ON_ERROR_CONTINUE']);

export function normalizeTask(task) {
  return {
    errorMessage: task?.errorMessage || '',
    executeStatus: task?.executeStatus || 'UNKNOWN',
    externalReferenceCode: task?.externalReferenceCode || null,
    failedItems: task?.failedItems || [],
    id: task?.id,
    importStrategy: task?.importStrategy || null,
    processedItemsCount: Number(task?.processedItemsCount || 0),
    totalItemsCount: Number(task?.totalItemsCount || 0)
  };
}

export class ImportService {
  constructor({liferay, sessions}) {
    this.liferay = liferay;
    this.sessions = sessions;
  }

  async submit({confirmUpsert = false, createStrategy, importStrategy, sessionId}) {
    const normalizedCreate = String(createStrategy || '').toUpperCase();
    const normalizedImport = String(importStrategy || '').toUpperCase();
    assert(CREATE_STRATEGIES.has(normalizedCreate), 400, 'CREATE_STRATEGY_INVALID', 'createStrategy must be INSERT or UPSERT');
    assert(IMPORT_STRATEGIES.has(normalizedImport), 400, 'IMPORT_STRATEGY_INVALID', 'importStrategy must be ON_ERROR_FAIL or ON_ERROR_CONTINUE');

    const session = this.sessions.beginSubmission(sessionId);
    try {
      assert(session.validation?.canImport, 409, 'VALIDATION_FAILED', 'Resolve all validation errors before importing', {validation: session.validation});
      const collisions = session.validation.ercCollisions || [];
      if (normalizedCreate === 'INSERT') {
        assert(collisions.length === 0, 409, 'ERC_ALREADY_EXISTS', 'INSERT cannot continue because one or more ERCs already exist', {collisions});
      }
      if (normalizedCreate === 'UPSERT') {
        assert(confirmUpsert === true, 409, 'UPSERT_CONFIRMATION_REQUIRED', 'Confirm the UPSERT folder limitation before importing', {collisions});
      }

      const task = await this.liferay.submitStructuredContents(session.validation.payload, {
        createStrategy: normalizedCreate,
        importStrategy: normalizedImport
      });
      this.sessions.completeSubmission(sessionId, {
        createStrategy: normalizedCreate,
        importStrategy: normalizedImport,
        taskId: task.id
      });
      return {...normalizeTask(task), createStrategy: normalizedCreate, importStrategy: normalizedImport};
    }
    catch (error) {
      this.sessions.failSubmission(sessionId);
      throw error;
    }
  }
}
