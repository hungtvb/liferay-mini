import {Check, Database, Download} from 'lucide-react';
import {useEffect, useState, type ChangeEvent} from 'react';
import {Button} from '../components/Button';
import type {AsyncStatus, CreateStrategy, ImportStrategy, ImportTask, WorkbookValidationPayload} from '../types';

interface ImportStepProps {
  validationPayload: WorkbookValidationPayload;
  task: ImportTask | null;
  status: AsyncStatus;
  reportStatus: AsyncStatus;
  error?: string | null;
  submissionLocked: boolean;
  onBack: () => void;
  onStart: (createStrategy: CreateStrategy, importStrategy: ImportStrategy, confirmUpsert: boolean) => void;
  onDownloadReport: () => void;
  onReset: () => void;
}

const terminalStatuses = new Set(['COMPLETED', 'FAILED', 'CANCELLED', 'COMPLETED_WITH_ERRORS']);

export function ImportStep({validationPayload, task, status, reportStatus, error, submissionLocked, onBack, onStart, onDownloadReport, onReset}: ImportStepProps) {
  const [createStrategy, setCreateStrategy] = useState<CreateStrategy>('INSERT');
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>('ON_ERROR_FAIL');
  const [confirmUpsert, setConfirmUpsert] = useState(false);

  useEffect(() => {
    if (createStrategy !== 'UPSERT') setConfirmUpsert(false);
  }, [createStrategy]);

  const total = Number(task?.totalItemsCount || validationPayload.validation.stats.validRows || 0);
  const processed = Number(task?.processedItemsCount || 0);
  const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
  const completed = task?.executeStatus === 'COMPLETED';
  const reportAvailable = Boolean(task && terminalStatuses.has(task.executeStatus));

  if (completed) {
    return (
      <section className="screen-content" aria-labelledby="import-completed-heading">
        <div className="completed-panel">
          <span className="completed-icon"><Check size={32} /></span>
          <h1 id="import-completed-heading">Import completed</h1>
          <p>{processed} of {total} items processed successfully.</p>
          <div className="action-cluster">
            <Button variant="secondary" icon={Download} loading={reportStatus === 'loading'} onClick={onDownloadReport}>
              {reportStatus === 'loading' ? 'Exporting...' : 'Export import report'}
            </Button>
            <Button variant="secondary" onClick={onReset}>Start New Import</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="screen-content" aria-labelledby="import-heading">
      <header className="page-header compact-heading"><h1 id="import-heading" tabIndex={-1}>Confirm import</h1></header>

      <section className="import-summary">
        <div><span>Total items</span><strong>{validationPayload.validation.stats.validRows}</strong></div>
        <div><span>Structure</span><strong>{validationPayload.structure.name}</strong></div>
        <div><span>Target folder</span><strong>{validationPayload.folder.path || validationPayload.folder.name}</strong></div>
        <div><span>Visibility</span><strong>{validationPayload.viewableBy}</strong></div>
      </section>

      <section className="options-card">
        <h2>Import options</h2>
        <div className="options-grid">
          <fieldset>
            <legend>Existing content handling</legend>
            <div className="radio-list">
              <label className="radio-row"><input type="radio" name="createStrategy" value="INSERT" checked={createStrategy === 'INSERT'} onChange={() => setCreateStrategy('INSERT')} /><span><strong>Create new only</strong><small>INSERT · fails when an existing ERC is detected.</small></span></label>
              <label className="radio-row"><input type="radio" name="createStrategy" value="UPSERT" checked={createStrategy === 'UPSERT'} onChange={() => setCreateStrategy('UPSERT')} /><span><strong>Create or update by ERC</strong><small>UPSERT · existing content keeps its current folder.</small></span></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Failure handling</legend>
            <div className="radio-list">
              <label className="radio-row"><input type="radio" name="importStrategy" value="ON_ERROR_FAIL" checked={importStrategy === 'ON_ERROR_FAIL'} onChange={() => setImportStrategy('ON_ERROR_FAIL')} /><span><strong>Stop on first failure</strong><small>ON_ERROR_FAIL · recommended for controlled migration runs.</small></span></label>
              <label className="radio-row"><input type="radio" name="importStrategy" value="ON_ERROR_CONTINUE" checked={importStrategy === 'ON_ERROR_CONTINUE'} onChange={() => setImportStrategy('ON_ERROR_CONTINUE')} /><span><strong>Continue and collect failures</strong><small>ON_ERROR_CONTINUE · processes all rows and returns mixed results.</small></span></label>
            </div>
          </fieldset>
        </div>

        {createStrategy === 'UPSERT' && (
          <label className="upsert-warning"><input type="checkbox" checked={confirmUpsert} onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmUpsert(event.target.checked)} /><span>I understand that existing items keep their current Web Content folder and a missing item may be created at the Web Content root.</span></label>
        )}
      </section>

      {(status === 'loading' || task) && (
        <section className="progress-card" aria-live="polite">
          <div className="progress-heading"><strong>{task ? 'Importing batch...' : 'Submitting Batch Engine task...'}</strong><span>{processed} / {total}</span></div>
          <div className="progress-track"><span style={{transform: `scaleX(${percent / 100})`}} /></div>
          <small>{task ? `Task ID: ${task.id} · ${task.executeStatus}` : 'Waiting for Liferay to return a task identifier.'}</small>
        </section>
      )}

      {status === 'error' && <div className="alert alert-error"><Database size={20} /><div><strong>{submissionLocked ? 'Submission requires manual verification' : 'Import failed'}</strong><p>{error || 'Batch Engine task failed.'}</p></div></div>}

      <div className="page-actions">
        <Button variant="ghost" onClick={onBack} disabled={status === 'loading'}>Back</Button>
        <div className="action-cluster">
          {reportAvailable && (
            <Button variant="secondary" icon={Download} loading={reportStatus === 'loading'} onClick={onDownloadReport}>
              {reportStatus === 'loading' ? 'Exporting...' : 'Export import report'}
            </Button>
          )}
          <Button
            icon={Database}
            loading={status === 'loading' && !task}
            disabled={(createStrategy === 'UPSERT' && !confirmUpsert) || status === 'loading' || Boolean(task) || submissionLocked}
            onClick={() => onStart(createStrategy, importStrategy, confirmUpsert)}
          >
            Start import of {validationPayload.validation.stats.validRows} items
          </Button>
        </div>
      </div>
    </section>
  );
}
