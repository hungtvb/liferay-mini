const state = {
  activeStep: 1,
  analysis: null,
  config: null,
  connected: false,
  connection: null,
  imageFoldersLoaded: false,
  maxUnlockedStep: 1,
  sessionId: null,
  submissionLocked: false,
  taskId: null,
  validation: null
};

const stepNames = ['Connect', 'Scope', 'Workbook', 'Validate', 'Import'];
const terminalStatuses = new Set(['COMPLETED', 'FAILED', 'CANCELLED', 'COMPLETED_WITH_ERRORS']);
const byId = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const response = await fetch(path, options);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.blob();

  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed (${response.status})`);
    error.code = data?.error?.code;
    error.details = data?.error?.details;
    throw error;
  }

  return {data, response};
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function showToast(message, kind = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${kind}`;
  toast.textContent = message;
  byId('toastRegion').appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 180);
  }, 3800);
}

function setStatus(element, message = '', kind = '') {
  element.textContent = message;
  element.className = `inline-status ${kind}`.trim();
}

function setButtonLoading(button, loading, loadingLabel = '') {
  if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent;
  button.classList.toggle('is-loading', loading);
  button.setAttribute('aria-busy', String(loading));
  button.textContent = loading && loadingLabel ? loadingLabel : button.dataset.defaultLabel;
  button.disabled = loading;
}

function selectedValue(id) {
  return byId(id)?.value || '';
}

function selectedText(id, fallback = 'Not selected') {
  return byId(id)?.selectedOptions?.[0]?.textContent?.trim() || fallback;
}

function currentSiteId() {
  return state.connection?.site?.id || state.config?.siteId || '';
}

function migrationScope() {
  return {
    imageSourceFolderId: selectedValue('imageFolderSelect') || null,
    imageSourceId: currentSiteId(),
    imageSourceType: 'site',
    viewableBy: selectedValue('viewableBySelect')
  };
}

function setStep(step, {scroll = true, focus = true} = {}) {
  if (step > state.maxUnlockedStep) return;
  state.activeStep = step;

  document.querySelectorAll('.wizard-step').forEach((section) => {
    section.classList.toggle('is-active', Number(section.dataset.step) === step);
  });

  document.querySelectorAll('[data-step-target]').forEach((button) => {
    const target = Number(button.dataset.stepTarget);
    const caption = button.querySelector('small');
    button.disabled = target > state.maxUnlockedStep;
    button.classList.toggle('is-active', target === step);
    button.classList.toggle('is-complete', target < step && target <= state.maxUnlockedStep);
    button.removeAttribute('aria-current');

    if (target === step) {
      button.setAttribute('aria-current', 'step');
      if (caption) caption.textContent = 'Current';
    }
    else if (target < step && target <= state.maxUnlockedStep) {
      if (caption) caption.textContent = 'Done';
    }
    else if (target <= state.maxUnlockedStep) {
      if (caption) caption.textContent = 'Ready';
    }
    else if (caption) caption.textContent = 'Not started';
  });

  byId('mobileStepLabel').textContent = `Step ${step} of 5 · ${stepNames[step - 1]}`;
  byId('journeyProgress').style.transform = `scaleX(${(step - 1) / 4})`;

  if (scroll) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({behavior, top: 0});
  }

  if (focus) {
    requestAnimationFrame(() => {
      document.querySelector(`.wizard-step[data-step="${step}"] h1`)?.focus({preventScroll: true});
    });
  }
}

function unlockStep(step) {
  state.maxUnlockedStep = Math.max(state.maxUnlockedStep, step);
  setStep(state.activeStep, {scroll: false, focus: false});
}

function renderEnvironment() {
  const config = state.config;
  const rows = [
    ['Liferay URL', config.baseUrl],
    ['Site ID', config.siteId],
    ['Default locale', config.defaultLocale],
    ['Row limit', `${config.maxImportRows} items`],
    ['Upload limit', `${config.maxUploadMb} MB`],
    ['Local server', `${config.host}:${location.port || '4174'}`]
  ];

  byId('environment').innerHTML = rows.map(([label, value]) => `
    <div class="environment-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
  `).join('');
  byId('railLiferayUrl').textContent = config.baseUrl;
  byId('railSite').textContent = `Site #${config.siteId}`;
  byId('scopeSiteId').textContent = `#${config.siteId}`;
  byId('summaryLocale').textContent = config.defaultLocale;
  byId('summaryVisibility').textContent = config.defaultViewableBy;
}

function renderConnectionState() {
  const badge = byId('headerConnectionBadge');
  badge.textContent = state.connected ? 'Connected' : 'Not connected';
  badge.classList.toggle('is-connected', state.connected);
  byId('railConnectionDot').classList.toggle('is-connected', state.connected);
}

function updateScopeSummary() {
  byId('summaryStructure').textContent = selectedText('structureSelect');
  byId('summaryFolder').textContent = selectedText('folderSelect');
  byId('summaryImageFolder').textContent = selectedValue('imageFolderSelect')
    ? selectedText('imageFolderSelect')
    : 'Site root';
  byId('summaryVisibility').textContent = selectedText(
    'viewableBySelect',
    state.config?.defaultViewableBy || '—'
  );
  byId('summaryLocale').textContent = state.config?.defaultLocale || '—';
}

function clearValidationView() {
  byId('validationBanner').innerHTML = '';
  byId('validationBanner').className = 'result-banner';
  byId('validationSummary').innerHTML = '';
  byId('validationRows').innerHTML = '';
  byId('issuesDetails').classList.add('hidden');
  byId('payloadDetails').classList.add('hidden');
  byId('validationNextButton').disabled = true;
}

function invalidateValidation() {
  state.sessionId = null;
  state.submissionLocked = false;
  state.taskId = null;
  state.validation = null;
  state.maxUnlockedStep = Math.min(state.maxUnlockedStep, 3);
  clearValidationView();
  byId('taskPanel').classList.add('hidden');
  byId('importBackButton').disabled = false;
  updateImportButton();
  setStep(Math.min(state.activeStep, state.maxUnlockedStep), {scroll: false, focus: false});
}

function selectionReady() {
  return Boolean(
    state.connected
    && selectedValue('structureSelect')
    && selectedValue('folderSelect')
    && selectedValue('viewableBySelect')
    && state.imageFoldersLoaded
    && state.analysis
    && state.analysis.status !== 'UNSUPPORTED'
  );
}

function updateSelectionButtons() {
  const ready = selectionReady();
  byId('scopeNextButton').disabled = !ready;
  byId('templateButton').disabled = !ready;
  byId('validateButton').disabled = !ready || !byId('workbookFile').files[0];
  updateScopeSummary();
}

function renderStructureOptions(structures) {
  byId('structureSelect').innerHTML = '<option value="">Select a Structure</option>' + structures.map((item) =>
    `<option value="${escapeHtml(item.id)}" ${item.status === 'UNSUPPORTED' ? 'disabled' : ''}>${escapeHtml(item.name)} · ${escapeHtml(item.status)}</option>`
  ).join('');
}

function renderFolderOptions(folders) {
  byId('folderSelect').innerHTML = '<option value="">Select a Web Content folder</option>' + folders.map((item) =>
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.path || item.name)}</option>`
  ).join('');
}

function renderVisibilityOptions() {
  byId('viewableBySelect').innerHTML = state.config.viewableByOptions.map((value) =>
    `<option value="${escapeHtml(value)}" ${value === state.config.defaultViewableBy ? 'selected' : ''}>${escapeHtml(value)}</option>`
  ).join('');
}

function renderImageFolders(folders) {
  byId('imageFolderSelect').innerHTML = '<option value="">Current Site root · include nested folders</option>' + folders.map((item) =>
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.path || item.name)}</option>`
  ).join('');
}

async function loadImageFolders() {
  invalidateValidation();
  state.imageFoldersLoaded = false;
  renderImageFolders([]);
  updateSelectionButtons();

  const siteId = currentSiteId();
  if (!siteId) return;

  const select = byId('imageFolderSelect');
  select.disabled = true;
  setStatus(byId('imageScopeStatus'), 'Loading Documents and Media folders…', 'loading');

  try {
    const {data} = await api('/api/image-folders', {
      body: JSON.stringify({imageSourceId: siteId, imageSourceType: 'site'}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
    renderImageFolders(data.folders);
    state.imageFoldersLoaded = true;
    setStatus(
      byId('imageScopeStatus'),
      `${data.folders.length} folders loaded. Use the Site root or restrict matching to one folder.`,
      'success'
    );
  }
  catch (error) {
    setStatus(byId('imageScopeStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
  }
  finally {
    select.disabled = false;
    updateSelectionButtons();
  }
}

async function loadStructureAnalysis() {
  invalidateValidation();
  const structureId = selectedValue('structureSelect');
  const notice = byId('structureAnalysis');
  state.analysis = null;
  notice.classList.add('hidden');

  if (!structureId) {
    updateSelectionButtons();
    return;
  }

  notice.className = 'notice';
  notice.classList.remove('hidden');
  notice.textContent = 'Analyzing the live Structure contract…';

  try {
    const {data} = await api(`/api/structures/${encodeURIComponent(structureId)}`);
    state.analysis = data.analysis;
    const excluded = data.analysis.excludedFields || [];
    const optionFields = (data.analysis.supportedFields || []).filter((field) => field.valueKind === 'option');
    notice.className = `notice ${data.analysis.status === 'UNSUPPORTED' ? 'error' : 'success'}`;
    notice.innerHTML = `<strong>${escapeHtml(data.analysis.status)}</strong> · ${data.analysis.supportedFields.length} supported fields`
      + (excluded.length ? `<br>Excluded optional fields: ${excluded.map((field) => escapeHtml(field.label)).join(', ')}` : '')
      + (optionFields.length ? `<br>Exact option values are enforced for: ${optionFields.map((field) => escapeHtml(field.label)).join(', ')}` : '');
  }
  catch (error) {
    notice.className = 'notice error';
    notice.textContent = `${error.code || 'ERROR'}: ${error.message}`;
  }

  updateSelectionButtons();
}

async function connect() {
  const buttons = [byId('connectButton'), byId('railReconnectButton')];
  buttons.forEach((button) => {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
  });
  setButtonLoading(byId('connectButton'), true, 'Connecting…');
  setStatus(byId('connectionStatus'), 'Authenticating and loading the migration contract…', 'loading');

  try {
    const {data} = await api('/api/connect', {method: 'POST'});
    Object.assign(state, {
      analysis: null,
      connected: true,
      connection: data,
      maxUnlockedStep: 2,
      sessionId: null,
      submissionLocked: false,
      taskId: null,
      validation: null
    });

    renderStructureOptions(data.structures);
    renderFolderOptions(data.folders);
    renderVisibilityOptions();
    byId('scopeSiteId').textContent = `#${data.site.id}`;
    await loadImageFolders();
    renderConnectionState();
    updateScopeSummary();
    setStatus(
      byId('connectionStatus'),
      `Connected. ${data.structures.length} Structures and ${data.folders.length} Web Content folders are ready.`,
      'success'
    );
    showToast('Liferay connection verified');
    setStep(2);
  }
  catch (error) {
    state.connected = false;
    renderConnectionState();
    setStatus(byId('connectionStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
    showToast(error.message, 'error');
  }
  finally {
    setButtonLoading(byId('connectButton'), false);
    buttons.forEach((button) => {
      button.disabled = false;
      button.setAttribute('aria-busy', 'false');
    });
  }
}

async function downloadTemplate() {
  const button = byId('templateButton');
  setButtonLoading(button, true, 'Generating…');
  setStatus(byId('workbookStatus'), 'Generating the scope-bound workbook…', 'loading');

  try {
    const {data, response} = await api('/api/templates', {
      body: JSON.stringify({
        folderId: selectedValue('folderSelect'),
        structureId: selectedValue('structureSelect'),
        ...migrationScope()
      }),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
    const match = response.headers.get('content-disposition')?.match(/filename="([^"]+)"/);
    const fileName = match?.[1] || 'structured-content-import-template.xlsx';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(data);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus(byId('workbookStatus'), `${fileName} generated for this exact migration scope.`, 'success');
    showToast('Excel template downloaded');
  }
  catch (error) {
    setStatus(byId('workbookStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
    showToast(error.message, 'error');
  }
  finally {
    setButtonLoading(button, false);
    button.disabled = !selectionReady();
  }
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function updateWorkbookFile() {
  invalidateValidation();
  const file = byId('workbookFile').files[0];
  byId('workbookDropzone').classList.toggle('has-file', Boolean(file));
  byId('workbookFileMeta').textContent = file
    ? `${file.name} · ${formatFileSize(file.size)}`
    : `Maximum ${state.config?.maxUploadMb || '—'} MB`;
  setStatus(byId('workbookStatus'), file ? 'Workbook selected. Run validation against the current scope.' : '');
  updateSelectionButtons();
}

function assignDroppedFile(file) {
  if (!file) return;
  const transfer = new DataTransfer();
  transfer.items.add(file);
  byId('workbookFile').files = transfer.files;
  updateWorkbookFile();
}

function metricCard(value, label, tone = '') {
  return `<div class="metric ${tone}"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`;
}

function renderValidation(validation) {
  state.validation = validation;
  const collisions = (validation.ercCollisions || []).length;
  const rows = validation.rowResultsPreview || [];
  const issues = [...(validation.errors || []), ...(validation.warnings || [])];

  byId('validationBanner').className = `result-banner ${validation.canImport ? 'success' : 'error'}`;
  byId('validationBanner').innerHTML = validation.canImport
    ? '<strong>Validation passed</strong><span>All rows satisfy the workbook, Structure, image, and ERC checks.</span>'
    : '<strong>Validation blocked</strong><span>Fix every error in the workbook, then upload and validate it again.</span>';
  byId('validationSummary').innerHTML = [
    metricCard(validation.stats.totalRows, 'Total rows'),
    metricCard(validation.stats.validRows, 'Ready', 'success'),
    metricCard(validation.stats.invalidRows, 'Blocked', validation.stats.invalidRows ? 'error' : ''),
    metricCard(validation.imageSummary?.distinctReferenceCount || 0, 'Image references'),
    metricCard(collisions, 'Existing ERCs', collisions ? 'warning' : '')
  ].join('');

  byId('validationPreviewLabel').textContent = `${rows.length} of ${validation.stats.totalRows}`;
  byId('validationRows').innerHTML = rows.length ? rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.row)}</td>
      <td><code>${escapeHtml(row.externalReferenceCode || '—')}</code></td>
      <td>${escapeHtml(row.title || '—')}</td>
      <td><span class="row-status ${row.status === 'VALID' ? 'valid' : 'blocked'}">${escapeHtml(row.status)}</span></td>
    </tr>
  `).join('') : '<tr><td colspan="4" class="empty-cell">No preview rows returned.</td></tr>';

  byId('issueCountBadge').textContent = issues.length;
  byId('issuesDetails').classList.toggle('hidden', issues.length === 0);
  byId('issues').innerHTML = issues.map((item) => `
    <article class="issue ${item.severity === 'warning' ? 'warning' : ''}">
      <div><strong>${escapeHtml(item.code)}</strong><span>Row ${escapeHtml(item.row ?? '—')} · ${escapeHtml(item.field || 'workbook')}</span></div>
      <p>${escapeHtml(item.message)}</p>
    </article>
  `).join('');
  byId('payloadDetails').classList.remove('hidden');
  byId('payloadPreview').textContent = JSON.stringify(validation.payloadPreview || [], null, 2);
  byId('validationNextButton').disabled = !validation.canImport;
  byId('importItemCount').textContent = validation.stats.validRows;

  if (validation.canImport) unlockStep(5);
  else state.maxUnlockedStep = Math.min(state.maxUnlockedStep, 4);
  updateImportButton();
}

async function validateWorkbook(event) {
  event.preventDefault();
  const file = byId('workbookFile').files[0];
  if (!file) return;

  const button = byId('validateButton');
  setButtonLoading(button, true, 'Validating…');
  setStatus(byId('workbookStatus'), 'Uploading and validating every workbook row…', 'loading');
  const form = new FormData();
  form.set('file', file);
  form.set('structureId', selectedValue('structureSelect'));
  form.set('folderId', selectedValue('folderSelect'));
  for (const [key, value] of Object.entries(migrationScope())) form.set(key, value ?? '');

  try {
    const {data} = await api('/api/workbooks', {body: form, method: 'POST'});
    state.sessionId = data.sessionId;
    state.submissionLocked = false;
    state.maxUnlockedStep = Math.max(state.maxUnlockedStep, 4);
    renderValidation(data.validation);
    setStatus(
      byId('workbookStatus'),
      `${data.fileName} validated. ${data.rowCount} rows detected.`,
      data.validation.canImport ? 'success' : 'error'
    );
    showToast(
      data.validation.canImport ? 'Workbook validation passed' : 'Workbook contains blocked rows',
      data.validation.canImport ? 'success' : 'error'
    );
    setStep(4);
  }
  catch (error) {
    state.sessionId = null;
    setStatus(byId('workbookStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
    showToast(error.message, 'error');
  }
  finally {
    setButtonLoading(button, false);
    button.disabled = !selectionReady() || !file;
  }
}

function updateImportButton() {
  const createStrategy = document.querySelector('input[name="createStrategy"]:checked')?.value || 'INSERT';
  const collisions = (state.validation?.ercCollisions || []).length > 0;
  const upsertConfirmed = byId('confirmUpsert').checked;
  const strategyBlocked = (createStrategy === 'INSERT' && collisions)
    || (createStrategy === 'UPSERT' && !upsertConfirmed);
  const count = state.validation?.stats?.validRows || 0;
  const button = byId('importButton');
  button.textContent = count ? `Start import · ${count} items` : 'Start import';
  button.dataset.defaultLabel = button.textContent;
  button.disabled = !state.sessionId
    || !state.validation?.canImport
    || strategyBlocked
    || Boolean(state.taskId)
    || state.submissionLocked;
}

function updateUpsertWarning() {
  const isUpsert = document.querySelector('input[name="createStrategy"]:checked')?.value === 'UPSERT';
  byId('upsertConfirmWrap').classList.toggle('hidden', !isUpsert);
  if (!isUpsert) byId('confirmUpsert').checked = false;
  updateImportButton();
}

function renderTask(task) {
  const processed = Number(task.processedItemsCount || 0);
  const total = Number(task.totalItemsCount || state.validation?.stats?.validRows || 0);
  const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
  const status = task.executeStatus || 'UNKNOWN';
  byId('taskHeading').textContent = status === 'COMPLETED'
    ? 'Import completed'
    : status.replaceAll('_', ' ').toLowerCase();
  byId('taskPercent').textContent = `${percent}%`;
  byId('progressFill').style.transform = `scaleX(${percent / 100})`;
  setStatus(
    byId('taskStatus'),
    `${status} · ${processed} of ${total} processed`,
    terminalStatuses.has(status) && status !== 'COMPLETED' ? 'error' : 'success'
  );
  byId('taskResult').textContent = JSON.stringify(task, null, 2);
}

async function pollTask(taskId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < state.config.pollTimeoutMs) {
    const {data} = await api(`/api/imports/${encodeURIComponent(taskId)}`);
    renderTask(data);
    if (terminalStatuses.has(data.executeStatus)) {
      showToast(
        data.executeStatus === 'COMPLETED'
          ? 'Batch import completed'
          : `Batch import ended with ${data.executeStatus}`,
        data.executeStatus === 'COMPLETED' ? 'success' : 'error'
      );
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, state.config.pollIntervalMs));
  }
  throw new Error('Batch polling timed out');
}

async function startImport() {
  const createStrategy = document.querySelector('input[name="createStrategy"]:checked')?.value;
  const importStrategy = document.querySelector('input[name="importStrategy"]:checked')?.value;
  if (createStrategy === 'UPSERT' && !byId('confirmUpsert').checked) {
    showToast('Confirm the UPSERT folder limitation first', 'error');
    return;
  }

  const button = byId('importButton');
  setButtonLoading(button, true, 'Submitting…');
  byId('importBackButton').disabled = true;
  byId('taskPanel').classList.remove('hidden');
  byId('taskHeading').textContent = 'Submitting one Batch Engine task';
  byId('taskPercent').textContent = '0%';
  byId('progressFill').style.transform = 'scaleX(0)';
  setStatus(byId('taskStatus'), 'Waiting for Liferay to return a task ID…', 'loading');

  try {
    const {data} = await api('/api/imports', {
      body: JSON.stringify({
        confirmUpsert: byId('confirmUpsert').checked,
        createStrategy,
        importStrategy,
        sessionId: state.sessionId
      }),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
    state.taskId = data.id;
    renderTask(data);
    await pollTask(data.id);
  }
  catch (error) {
    if (error.code === 'BATCH_SUBMISSION_UNKNOWN') state.submissionLocked = true;
    byId('taskHeading').textContent = error.code === 'BATCH_SUBMISSION_UNKNOWN'
      ? 'Submission requires manual verification'
      : 'Import failed';
    setStatus(byId('taskStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
    byId('taskResult').textContent = JSON.stringify(error.details || {message: error.message}, null, 2);
    showToast(error.message, 'error');
  }
  finally {
    setButtonLoading(button, false);
    updateImportButton();
  }
}

function bindDropzone() {
  const dropzone = byId('workbookDropzone');
  ['dragenter', 'dragover'].forEach((name) => dropzone.addEventListener(name, (event) => {
    event.preventDefault();
    dropzone.classList.add('is-dragging');
  }));
  ['dragleave', 'drop'].forEach((name) => dropzone.addEventListener(name, (event) => {
    event.preventDefault();
    dropzone.classList.remove('is-dragging');
  }));
  dropzone.addEventListener('drop', (event) => assignDroppedFile(event.dataTransfer?.files?.[0]));
}

async function init() {
  const {data} = await api('/api/config');
  state.config = data;
  renderEnvironment();
  renderConnectionState();
  setStep(1, {scroll: false, focus: false});

  byId('connectButton').addEventListener('click', connect);
  byId('railReconnectButton').addEventListener('click', connect);
  byId('structureSelect').addEventListener('change', loadStructureAnalysis);
  byId('folderSelect').addEventListener('change', () => {
    invalidateValidation();
    updateSelectionButtons();
  });
  byId('imageFolderSelect').addEventListener('change', () => {
    invalidateValidation();
    updateSelectionButtons();
  });
  byId('viewableBySelect').addEventListener('change', () => {
    invalidateValidation();
    updateSelectionButtons();
  });
  byId('scopeNextButton').addEventListener('click', () => {
    unlockStep(3);
    setStep(3);
  });
  byId('templateButton').addEventListener('click', downloadTemplate);
  byId('workbookForm').addEventListener('submit', validateWorkbook);
  byId('workbookFile').addEventListener('change', updateWorkbookFile);
  byId('validationNextButton').addEventListener('click', () => setStep(5));
  document.querySelectorAll('input[name="createStrategy"]').forEach((input) => input.addEventListener('change', updateUpsertWarning));
  document.querySelectorAll('input[name="importStrategy"]').forEach((input) => input.addEventListener('change', updateImportButton));
  byId('confirmUpsert').addEventListener('change', updateImportButton);
  byId('importButton').addEventListener('click', startImport);
  document.querySelectorAll('[data-back-step]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.backStep))));
  document.querySelectorAll('[data-step-target]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.stepTarget))));
  bindDropzone();
  updateSelectionButtons();
}

init().catch((error) => {
  setStatus(byId('connectionStatus'), error.message, 'error');
  showToast(error.message, 'error');
});
