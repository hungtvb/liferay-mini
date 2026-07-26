import {useEffect, useMemo, useRef, useState} from 'react';
import {ApiError, connect, downloadReport, downloadTemplate, getConfig, getImageFolders, getImportTask, getStructureAnalysis, submitImport, validateWorkbook} from './api';
import {AppHeader} from './components/AppHeader';
import {ToastRegion, type ToastMessage} from './components/ToastRegion';
import {WorkflowNav} from './components/WorkflowNav';
import {ConfigureStep} from './steps/ConfigureStep';
import {ConnectStep} from './steps/ConnectStep';
import {ImportStep} from './steps/ImportStep';
import {ValidationStep} from './steps/ValidationStep';
import {WorkbookStep} from './steps/WorkbookStep';
import type {
  AsyncStatus,
  ConnectionPayload,
  CreateStrategy,
  FolderSummary,
  ImporterConfig,
  ImportStrategy,
  ImportTask,
  ReportStage,
  Selection,
  Step,
  StructureAnalysis,
  WorkbookValidationPayload
} from './types';

const terminalStatuses = new Set(['COMPLETED', 'FAILED', 'CANCELLED', 'COMPLETED_WITH_ERRORS']);

function messageFrom(error: unknown) {
  if (error instanceof ApiError) return `${error.code ? `${error.code}: ` : ''}${error.message}`;
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

function initialSelection(): Selection {
  return {structureId: '', folderId: '', imageFolderId: '', viewableBy: 'Anyone'};
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState<Step>(1);
  const [config, setConfig] = useState<ImporterConfig | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [connection, setConnection] = useState<ConnectionPayload | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<AsyncStatus>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [analysis, setAnalysis] = useState<StructureAnalysis | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AsyncStatus>('idle');
  const [imageFolders, setImageFolders] = useState<FolderSummary[]>([]);
  const [imageFoldersStatus, setImageFoldersStatus] = useState<AsyncStatus>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<AsyncStatus>('idle');
  const [reportStatus, setReportStatus] = useState<Record<ReportStage, AsyncStatus>>({validation: 'idle', import: 'idle'});
  const [validationStatus, setValidationStatus] = useState<AsyncStatus>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [validationPayload, setValidationPayload] = useState<WorkbookValidationPayload | null>(null);
  const [importStatus, setImportStatus] = useState<AsyncStatus>('idle');
  const [importError, setImportError] = useState<string | null>(null);
  const [task, setTask] = useState<ImportTask | null>(null);
  const [submissionLocked, setSubmissionLocked] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastId = useRef(0);

  function showToast(message: string, tone: ToastMessage['tone'] = 'success') {
    const id = ++toastId.current;
    setToasts((items) => [...items, {id, message, tone}]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3600);
  }

  useEffect(() => {
    getConfig()
      .then((nextConfig) => {
        setConfig(nextConfig);
        setSelection((current) => ({...current, viewableBy: nextConfig.defaultViewableBy}));
      })
      .catch((error) => setConfigError(messageFrom(error)));
  }, []);

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const heading = document.querySelector<HTMLElement>(`.screen-content h1`);
    window.setTimeout(() => heading?.focus({preventScroll: true}), 180);
  }, [currentStep]);

  function unlockStep(step: Step) {
    setMaxUnlockedStep((current) => Math.max(current, step) as Step);
  }

  function goToStep(step: Step) {
    if (step <= maxUnlockedStep) setCurrentStep(step);
  }

  function invalidateValidation({clearWorkbook = false}: {clearWorkbook?: boolean} = {}) {
    setValidationPayload(null);
    setValidationStatus('idle');
    setValidationMessage('');
    setReportStatus({validation: 'idle', import: 'idle'});
    setTask(null);
    setImportStatus('idle');
    setImportError(null);
    setSubmissionLocked(false);
    setMaxUnlockedStep((current) => Math.min(current, 3) as Step);
    if (clearWorkbook) setFile(null);
  }

  async function handleConnect() {
    if (!config) return;
    setConnectionStatus('loading');
    setConnectionError(null);

    try {
      const nextConnection = await connect();
      const imageFolderPayload = await getImageFolders(config);
      setConnection(nextConnection);
      setImageFolders(imageFolderPayload.folders);
      setImageFoldersStatus('success');
      setConnectionStatus('success');
      unlockStep(2);
      showToast('Connected to Liferay');
      setCurrentStep(2);
    }
    catch (error) {
      setConnectionStatus('error');
      setConnectionError(messageFrom(error));
      setImageFoldersStatus('error');
      showToast(messageFrom(error), 'error');
    }
  }

  async function handleSelectionChange(patch: Partial<Selection>) {
    const structureChanged = patch.structureId !== undefined && patch.structureId !== selection.structureId;
    setSelection((current) => ({...current, ...patch}));
    invalidateValidation({clearWorkbook: true});

    if (!structureChanged) return;

    const structureId = patch.structureId || '';
    setAnalysis(null);

    if (!structureId) {
      setAnalysisStatus('idle');
      return;
    }

    setAnalysisStatus('loading');

    try {
      const nextAnalysis = await getStructureAnalysis(structureId);
      setAnalysis(nextAnalysis);
      setAnalysisStatus('success');
    }
    catch (error) {
      setAnalysisStatus('error');
      showToast(messageFrom(error), 'error');
    }
  }

  async function handleDownloadTemplate() {
    if (!config) return;
    setDownloadStatus('loading');

    try {
      const {blob, fileName} = await downloadTemplate(config, selection);
      saveBlob(blob, fileName);
      setDownloadStatus('success');
      showToast('Excel template downloaded');
    }
    catch (error) {
      setDownloadStatus('error');
      showToast(messageFrom(error), 'error');
    }
  }

  async function handleDownloadReport(stage: ReportStage) {
    if (!validationPayload?.sessionId) return;
    setReportStatus((current) => ({...current, [stage]: 'loading'}));

    try {
      const {blob, fileName} = await downloadReport(validationPayload.sessionId, stage);
      saveBlob(blob, fileName);
      setReportStatus((current) => ({...current, [stage]: 'success'}));
      showToast(`${stage === 'import' ? 'Import' : 'Validation'} report downloaded`);
    }
    catch (error) {
      setReportStatus((current) => ({...current, [stage]: 'error'}));
      showToast(messageFrom(error), 'error');
    }
  }

  function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    invalidateValidation();
  }

  async function handleValidate() {
    if (!config || !file) return;
    setValidationStatus('loading');
    setValidationMessage('Uploading and validating every workbook row…');

    try {
      const payload = await validateWorkbook(config, selection, file);
      setValidationPayload(payload);
      setValidationStatus(payload.validation.canImport ? 'success' : 'error');
      setValidationMessage(`${payload.fileName} validated. ${payload.rowCount} rows detected.`);
      setReportStatus({validation: 'idle', import: 'idle'});
      unlockStep(4);
      if (payload.validation.canImport) unlockStep(5);
      showToast(payload.validation.canImport ? 'Workbook validation passed' : 'Workbook contains blocked rows', payload.validation.canImport ? 'success' : 'error');
      setCurrentStep(4);
    }
    catch (error) {
      setValidationStatus('error');
      setValidationMessage(messageFrom(error));
      showToast(messageFrom(error), 'error');
    }
  }

  async function pollTask(initialTask: ImportTask) {
    if (!config) return;
    const startedAt = Date.now();
    let latest = initialTask;

    while (!terminalStatuses.has(latest.executeStatus)) {
      if (Date.now() - startedAt > config.pollTimeoutMs) throw new Error('Batch polling timed out');
      await new Promise((resolve) => window.setTimeout(resolve, config.pollIntervalMs));
      latest = await getImportTask(latest.id);
      setTask(latest);
    }

    if (latest.executeStatus === 'COMPLETED') {
      setImportStatus('success');
      showToast('Batch import completed');
      return;
    }

    throw new Error(`Batch import ended with ${latest.executeStatus}`);
  }

  async function handleStartImport(createStrategy: CreateStrategy, importStrategy: ImportStrategy, confirmUpsert: boolean) {
    if (!validationPayload?.sessionId) return;
    setImportStatus('loading');
    setImportError(null);
    setSubmissionLocked(false);
    setReportStatus((current) => ({...current, import: 'idle'}));

    try {
      const initialTask = await submitImport(validationPayload.sessionId, createStrategy, importStrategy, confirmUpsert);
      setTask(initialTask);
      await pollTask(initialTask);
    }
    catch (error) {
      setImportStatus('error');
      setSubmissionLocked(error instanceof ApiError && error.code === 'BATCH_SUBMISSION_UNKNOWN');
      setImportError(messageFrom(error));
      showToast(messageFrom(error), 'error');
    }
  }

  function resetRun() {
    setCurrentStep(2);
    setMaxUnlockedStep(2);
    setSelection({structureId: '', folderId: '', imageFolderId: '', viewableBy: config?.defaultViewableBy || 'Anyone'});
    setAnalysis(null);
    setAnalysisStatus('idle');
    setFile(null);
    setValidationPayload(null);
    setValidationStatus('idle');
    setValidationMessage('');
    setReportStatus({validation: 'idle', import: 'idle'});
    setTask(null);
    setImportStatus('idle');
    setImportError(null);
    setSubmissionLocked(false);
  }

  const structureLabel = useMemo(() => connection?.structures.find((item) => String(item.id) === selection.structureId)?.name || 'Not selected', [connection, selection.structureId]);
  const folderLabel = useMemo(() => {
    const folder = connection?.folders.find((item) => String(item.id) === selection.folderId);
    return folder?.path || folder?.name || 'Not selected';
  }, [connection, selection.folderId]);

  if (configError) {
    return <main className="fatal-error"><h1>Importer configuration failed</h1><p>{configError}</p></main>;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace">Skip to importer workspace</a>
      <AppHeader config={config} connected={connectionStatus === 'success'} />

      <main className="app-main">
        <WorkflowNav currentStep={currentStep} maxUnlockedStep={maxUnlockedStep} onStepChange={goToStep} />
        <section id="workspace" className="workspace" tabIndex={-1}>
          {currentStep === 1 && <ConnectStep config={config} status={connectionStatus} error={connectionError} onConnect={handleConnect} />}

          {currentStep === 2 && config && connection && (
            <ConfigureStep
              config={config}
              connection={connection}
              analysis={analysis}
              analysisStatus={analysisStatus}
              imageFolders={imageFolders}
              imageFoldersStatus={imageFoldersStatus}
              selection={selection}
              onSelectionChange={handleSelectionChange}
              onBack={() => setCurrentStep(1)}
              onNext={() => {unlockStep(3); setCurrentStep(3);}}
            />
          )}

          {currentStep === 3 && config && (
            <WorkbookStep
              selection={selection}
              structureLabel={structureLabel}
              folderLabel={folderLabel}
              locale={config.defaultLocale}
              file={file}
              downloadStatus={downloadStatus}
              validationStatus={validationStatus}
              validationMessage={validationMessage}
              onFileChange={handleFileChange}
              onDownload={handleDownloadTemplate}
              onValidate={handleValidate}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && validationPayload && (
            <ValidationStep
              validation={validationPayload.validation}
              reportStatus={reportStatus.validation}
              onBack={() => setCurrentStep(3)}
              onDownloadReport={() => handleDownloadReport('validation')}
              onContinue={() => {
                if (!validationPayload.validation.canImport) return;
                unlockStep(5);
                setCurrentStep(5);
              }}
            />
          )}

          {currentStep === 5 && validationPayload && (
            <ImportStep
              validationPayload={validationPayload}
              task={task}
              status={importStatus}
              reportStatus={reportStatus.import}
              error={importError}
              submissionLocked={submissionLocked}
              onBack={() => setCurrentStep(4)}
              onStart={handleStartImport}
              onDownloadReport={() => handleDownloadReport('import')}
              onReset={resetRun}
            />
          )}
        </section>
      </main>

      <ToastRegion toasts={toasts} />
    </div>
  );
}
