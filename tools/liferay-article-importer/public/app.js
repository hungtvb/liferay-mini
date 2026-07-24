const state = {
  config: null,
  file: null,
  pollStartedAt: 0,
  sessionId: null,
  structure: null,
  structureId: null,
  structures: [],
  validation: null
};

const terminalStatuses = new Set(['COMPLETED', 'FAILED', 'CANCELLED', 'COMPLETED_WITH_ERRORS']);
const byId = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: options.body instanceof FormData ? options.headers : {'Content-Type': 'application/json', ...options.headers}
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return response;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed with status ${response.status}`);
    error.details = data?.error?.details;
    throw error;
  }
  return data;
}

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function setMessage(element, message, type = '') {
  element.hidden = !message;
  element.textContent = message || '';
  element.className = `message${type ? ` is-${type}` : ''}`;
}

function toast(message) {
  const element = byId('toast');
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { element.hidden = true; }, 2400);
}

function showStep(step) {
  document.querySelectorAll('[data-step-panel]').forEach((panel) => { panel.hidden = Number(panel.dataset.stepPanel) !== step; });
  document.querySelectorAll('[data-step-button]').forEach((button) => {
    const current = Number(button.dataset.stepButton);
    button.classList.toggle('is-active', current === step);
    button.classList.toggle('is-complete', current < step);
  });
}

function enableStep(step) {
  const button = document.querySelector(`[data-step-button="${step}"]`);
  if (button) button.disabled = false;
}

function selectedStructure() {
  return state.structures.find((item) => String(item.id) === String(state.structureId));
}

function renderStructures() {
  const select = byId('structureSelect');
  const preferred = state.structures.find((item) => /article/i.test(item.name)) || state.structures[0];
  select.innerHTML = '<option value="">Select a Structure</option>' + state.structures.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}${item.externalReferenceCode ? ` · ${escapeHtml(item.externalReferenceCode)}` : ''}</option>`).join('');
  select.disabled = state.structures.length === 0;
  if (preferred) {
    select.value = preferred.id;
    state.structureId = String(preferred.id);
    byId('toTemplateButton').disabled = false;
  }
}

async function connect() {
  const button = byId('connectButton');
  button.disabled = true;
  button.textContent = 'Connecting…';
  setMessage(byId('connectMessage'), '');
  try {
    const data = await api('/api/connect', {method: 'POST', body: '{}'});
    state.structures = data.structures;
    renderStructures();
    byId('connectionStatus').textContent = 'Connected';
    byId('connectionStatus').className = 'status-pill is-success';
    setMessage(byId('connectMessage'), `${data.structures.length} Content Structures loaded from Site ${data.connection.siteId}.`, 'success');
    enableStep(2);
    button.textContent = 'Reconnect';
  }
  catch (error) {
    byId('connectionStatus').textContent = 'Connection failed';
    byId('connectionStatus').className = 'status-pill is-error';
    setMessage(byId('connectMessage'), error.message, 'error');
    button.textContent = 'Retry connection';
  }
  finally { button.disabled = false; }
}

async function openTemplateStep() {
  try {
    const data = await api(`/api/structures/${state.structureId}`);
    state.structure = data;
    const structure = selectedStructure();
    byId('selectedStructure').textContent = structure?.name || 'Selected Structure';
    byId('structureSummary').innerHTML = [
      `<div class="read-only-field"><span>Structure</span><strong>${escapeHtml(data.structure.name)}</strong></div>`,
      `<div class="read-only-field"><span>Supported fields</span><strong>${data.supportedFields.length}</strong></div>`,
      `<div class="read-only-field"><span>Excluded fields</span><strong>${data.unsupportedFields.length}</strong></div>`
    ].join('');
    byId('templateStatus').textContent = data.unsupportedFields.length
      ? `${data.unsupportedFields.length} unsupported image/document/nested/repeatable fields are excluded from v1.`
      : 'All Structure fields are supported by this template.';
    showStep(2);
  }
  catch (error) { toast(error.message); }
}

async function downloadTemplate() {
  const button = byId('downloadTemplateButton');
  button.disabled = true;
  button.textContent = 'Generating…';
  try {
    const response = await api(`/api/structures/${state.structureId}/template`);
    const blob = await response.blob();
    const disposition = response.headers.get('content-disposition') || '';
    const fileName = disposition.match(/filename="([^"]+)"/)?.[1] || 'article_template.xlsx';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    byId('templateStatus').textContent = `${fileName} downloaded. Fill the Articles sheet and keep all headers unchanged.`;
  }
  catch (error) { toast(error.message); }
  finally {
    button.disabled = false;
    button.textContent = 'Download Excel template';
  }
}

function setWorkbookFile(file) {
  state.file = file || null;
  byId('fileName').textContent = file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : 'No file selected';
  byId('validateButton').disabled = !file;
}

function renderValidation(data) {
  state.validation = data.validation;
  byId('workbookSummary').innerHTML = [
    `<span>File: <strong>${escapeHtml(data.fileName)}</strong></span>`,
    `<span>Sheet: <strong>${escapeHtml(data.sheetName)}</strong></span>`,
    `<span>Rows: <strong>${data.rowCount}</strong></span>`,
    `<span>Structure: <strong>${escapeHtml(data.structure.name)}</strong></span>`
  ].join('');
  const validation = data.validation;
  byId('validationBadges').innerHTML = [
    `<span class="ok">${validation.stats.validRows} valid</span>`,
    `<span class="${validation.errors.length ? 'bad' : 'ok'}">${validation.errors.length} errors</span>`,
    `<span>${validation.warnings.length} warnings</span>`
  ].join('');
  const issues = [...validation.errors, ...validation.warnings];
  byId('issuesList').innerHTML = issues.length ? issues.map((entry) => `<div class="issue ${entry.severity === 'warning' ? 'warning' : ''}"><strong>${entry.row ? `Excel row ${entry.row}` : 'Template'} · ${escapeHtml(entry.field)}</strong><span>${escapeHtml(entry.message)}</span></div>`).join('') : '<div class="empty-state">No validation issues. The payload is ready for migration.</div>';
  byId('jsonPreview').textContent = JSON.stringify(validation.payload, null, 2);
  byId('jsonCount').textContent = `${validation.payload.length} items`;
  byId('startImportButton').disabled = !validation.canImport;
  enableStep(3);
}

async function validateWorkbook() {
  const button = byId('validateButton');
  button.disabled = true;
  button.textContent = 'Validating…';
  setMessage(byId('uploadMessage'), '');
  try {
    const form = new FormData();
    form.append('file', state.file);
    form.append('structureId', state.structureId);
    const data = await api('/api/workbooks', {body: form, method: 'POST'});
    state.sessionId = data.sessionId;
    renderValidation(data);
    showStep(3);
  }
  catch (error) { setMessage(byId('uploadMessage'), error.message, 'error'); }
  finally {
    button.disabled = !state.file;
    button.textContent = 'Next: validate JSON';
  }
}

function renderJob(task) {
  const total = Number(task.totalItemsCount || state.validation?.payload.length || 0);
  const processed = Number(task.processedItemsCount || 0);
  const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) : 0;
  const terminal = terminalStatuses.has(task.executeStatus);
  const success = task.executeStatus === 'COMPLETED' && (!task.failedItems || task.failedItems.length === 0);
  byId('taskId').textContent = task.id || '—';
  byId('processedCount').textContent = `${processed} / ${total}`;
  byId('jobStrategy').textContent = `${byId('createStrategy').value} · ${byId('importStrategy').value}`;
  byId('progressBar').style.width = `${success ? 100 : percent}%`;
  byId('jobStatus').textContent = task.executeStatus;
  byId('jobStatus').className = `status-pill ${success ? 'is-success' : terminal ? 'is-error' : ''}`;
  byId('jobMessage').textContent = task.errorMessage || (terminal ? 'Batch job finished.' : 'Waiting for Liferay Batch Engine…');
  const failed = task.failedItems || [];
  byId('failedItems').hidden = failed.length === 0;
  byId('failedItems').innerHTML = failed.map((item, index) => `<div class="issue"><strong>Failed item ${index + 1}</strong><span>${escapeHtml(item.message || item.errorMessage || JSON.stringify(item))}</span></div>`).join('');
  byId('newImportButton').hidden = !terminal;
  return terminal;
}

async function pollJob(taskId) {
  if (Date.now() - state.pollStartedAt > state.config.pollTimeoutMs) {
    byId('jobStatus').textContent = 'TIMEOUT';
    byId('jobStatus').className = 'status-pill is-error';
    byId('jobMessage').textContent = 'Polling timed out. The Liferay job may still be running; inspect it using the task ID.';
    byId('newImportButton').hidden = false;
    return;
  }
  try {
    const task = await api(`/api/imports/${taskId}`);
    if (!renderJob(task)) setTimeout(() => pollJob(taskId), state.config.pollIntervalMs);
  }
  catch (error) {
    byId('jobMessage').textContent = `Status check failed: ${error.message}. Retrying…`;
    setTimeout(() => pollJob(taskId), state.config.pollIntervalMs);
  }
}

async function startImport() {
  const button = byId('startImportButton');
  button.disabled = true;
  showStep(4);
  enableStep(4);
  try {
    const task = await api('/api/imports', {
      body: JSON.stringify({
        createStrategy: byId('createStrategy').value,
        importStrategy: byId('importStrategy').value,
        sessionId: state.sessionId
      }),
      method: 'POST'
    });
    state.pollStartedAt = Date.now();
    renderJob(task);
    pollJob(task.id);
  }
  catch (error) {
    byId('jobStatus').textContent = 'SUBMIT FAILED';
    byId('jobStatus').className = 'status-pill is-error';
    byId('jobMessage').textContent = error.message;
    byId('newImportButton').hidden = false;
  }
}

function resetForNewImport() {
  state.file = null;
  state.sessionId = null;
  state.validation = null;
  byId('workbookInput').value = '';
  setWorkbookFile(null);
  byId('startImportButton').disabled = true;
  showStep(2);
}

function setupTabs() {
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('is-active', tab === button));
    document.querySelectorAll('[data-tab-panel]').forEach((panel) => { panel.hidden = panel.dataset.tabPanel !== button.dataset.tab; });
  }));
}

async function initialize() {
  state.config = await api('/api/config');
  byId('baseUrl').textContent = state.config.baseUrl;
  byId('siteId').textContent = state.config.siteId;
  byId('environment').innerHTML = `Liferay: <strong>${escapeHtml(state.config.baseUrl)}</strong><br>Site: <strong>${escapeHtml(state.config.siteId)}</strong><br>Max: <strong>${state.config.maxImportRows} rows / ${state.config.maxUploadMb} MB</strong>`;

  byId('connectButton').addEventListener('click', connect);
  byId('structureSelect').addEventListener('change', (event) => {
    state.structureId = event.target.value;
    byId('toTemplateButton').disabled = !state.structureId;
  });
  byId('toTemplateButton').addEventListener('click', openTemplateStep);
  byId('downloadTemplateButton').addEventListener('click', downloadTemplate);
  byId('workbookInput').addEventListener('change', (event) => setWorkbookFile(event.target.files?.[0]));
  byId('validateButton').addEventListener('click', validateWorkbook);
  byId('startImportButton').addEventListener('click', startImport);
  byId('newImportButton').addEventListener('click', resetForNewImport);
  byId('copyJsonButton').addEventListener('click', async () => { await navigator.clipboard.writeText(byId('jsonPreview').textContent); toast('JSON copied'); });
  byId('downloadJsonButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([byId('jsonPreview').textContent], {type: 'application/json'}));
    link.download = 'structured-content-import.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });
  document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(Number(button.dataset.back))));
  setupTabs();
}

initialize().catch((error) => {
  document.body.innerHTML = `<main class="shell"><section class="panel"><h1>Configuration error</h1><p>${escapeHtml(error.message)}</p></section></main>`;
});
