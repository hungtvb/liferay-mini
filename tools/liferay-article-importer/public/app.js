const state = {
  config: null,
  file: null,
  mapping: {},
  pollStartedAt: 0,
  sessionId: null,
  structureId: null,
  structures: [],
  targets: [],
  validation: null
};

const terminalStatuses = new Set(['COMPLETED', 'FAILED', 'CANCELLED', 'COMPLETED_WITH_ERRORS']);
const byId = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: options.body instanceof FormData ? options.headers : {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed with status ${response.status}`);
    error.details = data?.error?.details;
    throw error;
  }

  return data;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
  document.querySelectorAll('[data-step-panel]').forEach((panel) => {
    panel.hidden = Number(panel.dataset.stepPanel) !== step;
  });

  document.querySelectorAll('[data-step-button]').forEach((button) => {
    const buttonStep = Number(button.dataset.stepButton);
    button.classList.toggle('is-active', buttonStep === step);
    button.classList.toggle('is-complete', buttonStep < step);
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
  select.innerHTML = '<option value="">Select a Structure</option>' + state.structures.map((item) => (
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}${item.externalReferenceCode ? ` · ${escapeHtml(item.externalReferenceCode)}` : ''}</option>`
  )).join('');
  select.disabled = state.structures.length === 0;

  if (preferred) {
    select.value = preferred.id;
    state.structureId = String(preferred.id);
    byId('toWorkbookButton').disabled = false;
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
  finally {
    button.disabled = false;
  }
}

function setWorkbookFile(file) {
  state.file = file || null;
  byId('fileName').textContent = file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : 'No file selected';
  byId('analyzeButton').disabled = !file;
}

function renderMapping(data) {
  state.targets = data.targets;
  state.mapping = {...data.mapping};
  const options = ['<option value="">Do not import</option>', ...data.headers.map((header) => (
    `<option value="${escapeHtml(header)}">${escapeHtml(header)}</option>`
  ))].join('');

  byId('mappingBody').innerHTML = data.targets.map((target) => {
    const selected = state.mapping[target.key] || '';
    const selectOptions = options.replace(`value="${escapeHtml(selected)}"`, `value="${escapeHtml(selected)}" selected`);
    return `<tr>
      <td><div class="target-name"><strong>${escapeHtml(target.label)}</strong><small>${escapeHtml(target.name)}</small></div></td>
      <td>${escapeHtml(target.dataType)}${target.supported ? '' : '<div class="unsupported">Nested/repeatable unsupported</div>'}</td>
      <td><select data-mapping-key="${escapeHtml(target.key)}" ${target.supported ? '' : 'disabled'}>${selectOptions}</select></td>
      <td><span class="rule ${target.required ? 'required' : 'optional'}">${target.required ? 'Required' : 'Optional'}</span></td>
    </tr>`;
  }).join('');

  byId('workbookSummary').innerHTML = [
    `<span>File: <strong>${escapeHtml(data.fileName)}</strong></span>`,
    `<span>Sheet: <strong>${escapeHtml(data.sheetName)}</strong></span>`,
    `<span>Rows: <strong>${data.rowCount}</strong></span>`,
    `<span>Structure: <strong>${escapeHtml(data.structure.name)}</strong></span>`
  ].join('');
}

function collectMapping() {
  const mapping = {};
  document.querySelectorAll('[data-mapping-key]').forEach((select) => {
    mapping[select.dataset.mappingKey] = select.value || null;
  });
  return mapping;
}

function renderValidation(validation) {
  state.validation = validation;
  byId('validationBadges').innerHTML = [
    `<span class="ok">${validation.stats.validRows} valid</span>`,
    `<span class="${validation.errors.length ? 'bad' : 'ok'}">${validation.errors.length} errors</span>`,
    `<span>${validation.warnings.length} warnings</span>`
  ].join('');

  const issues = [...validation.errors, ...validation.warnings];
  byId('issuesList').innerHTML = issues.length ? issues.map((entry) => (
    `<div class="issue ${entry.severity === 'warning' ? 'warning' : ''}">
      <strong>${entry.row ? `Excel row ${entry.row}` : 'Mapping'} · ${escapeHtml(entry.field)}</strong>
      <span>${escapeHtml(entry.message)}</span>
    </div>`
  )).join('') : '<div class="empty-state">No validation issues.</div>';

  byId('jsonPreview').textContent = JSON.stringify(validation.payload, null, 2);
  byId('jsonCount').textContent = `${validation.payload.length} items`;
  byId('startImportButton').disabled = !validation.canImport;
  enableStep(3);
}

async function validate() {
  const button = byId('revalidateButton');
  button.disabled = true;
  button.textContent = 'Validating…';

  try {
    state.mapping = collectMapping();
    const validation = await api(`/api/workbooks/${state.sessionId}/validate`, {
      body: JSON.stringify({mapping: state.mapping}),
      method: 'POST'
    });
    renderValidation(validation);
  }
  catch (error) {
    toast(error.message);
  }
  finally {
    button.disabled = false;
    button.textContent = 'Revalidate';
  }
}

async function analyzeWorkbook() {
  const button = byId('analyzeButton');
  button.disabled = true;
  button.textContent = 'Reading workbook…';
  setMessage(byId('uploadMessage'), '');

  try {
    const form = new FormData();
    form.append('file', state.file);
    form.append('structureId', state.structureId);
    const data = await api('/api/workbooks', {body: form, method: 'POST'});
    state.sessionId = data.sessionId;
    renderMapping(data);
    showStep(3);
    await validate();
  }
  catch (error) {
    setMessage(byId('uploadMessage'), error.message, 'error');
  }
  finally {
    button.disabled = !state.file;
    button.textContent = 'Next: validate & map';
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
  byId('jobStrategy').textContent = task.importStrategy || state.config.importStrategy;
  byId('progressBar').style.width = `${success ? 100 : percent}%`;
  byId('jobStatus').textContent = task.executeStatus;
  byId('jobStatus').className = `status-pill ${success ? 'is-success' : terminal ? 'is-error' : ''}`;
  byId('jobMessage').textContent = task.errorMessage || (terminal ? 'Batch job finished.' : 'Waiting for Liferay Batch Engine…');

  const failed = task.failedItems || [];
  byId('failedItems').hidden = failed.length === 0;
  byId('failedItems').innerHTML = failed.map((item, index) => (
    `<div class="issue"><strong>Failed item ${index + 1}</strong><span>${escapeHtml(item.message || item.errorMessage || JSON.stringify(item))}</span></div>`
  )).join('');
  byId('newImportButton').hidden = !terminal;

  return terminal;
}

async function pollJob(taskId) {
  if (Date.now() - state.pollStartedAt > state.config.pollTimeoutMs) {
    byId('jobStatus').textContent = 'TIMEOUT';
    byId('jobStatus').className = 'status-pill is-error';
    byId('jobMessage').textContent = 'Polling timed out. The Liferay job may still be running; use the task ID to inspect it in API Explorer.';
    byId('newImportButton').hidden = false;
    return;
  }

  try {
    const task = await api(`/api/imports/${taskId}`);

    if (!renderJob(task)) {
      setTimeout(() => pollJob(taskId), state.config.pollIntervalMs);
    }
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
      body: JSON.stringify({sessionId: state.sessionId}),
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
  state.mapping = {};
  state.sessionId = null;
  state.targets = [];
  state.validation = null;
  byId('workbookInput').value = '';
  setWorkbookFile(null);
  byId('startImportButton').disabled = true;
  showStep(2);
}

function setupTabs() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.toggle('is-active', tab === button));
      document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.tabPanel !== button.dataset.tab;
      });
    });
  });
}

async function initialize() {
  state.config = await api('/api/config');
  byId('baseUrl').textContent = state.config.baseUrl;
  byId('siteId').textContent = state.config.siteId;
  byId('environment').innerHTML = `Liferay: <strong>${escapeHtml(state.config.baseUrl)}</strong><br>Site: <strong>${escapeHtml(state.config.siteId)}</strong><br>Max: <strong>${state.config.maxImportRows} rows / ${state.config.maxUploadMb} MB</strong>`;

  byId('connectButton').addEventListener('click', connect);
  byId('structureSelect').addEventListener('change', (event) => {
    state.structureId = event.target.value;
    byId('toWorkbookButton').disabled = !state.structureId;
  });
  byId('toWorkbookButton').addEventListener('click', () => {
    const structure = selectedStructure();
    byId('selectedStructure').textContent = structure?.name || 'Selected Structure';
    showStep(2);
  });
  byId('workbookInput').addEventListener('change', (event) => setWorkbookFile(event.target.files[0]));
  byId('analyzeButton').addEventListener('click', analyzeWorkbook);
  byId('revalidateButton').addEventListener('click', validate);
  byId('startImportButton').addEventListener('click', startImport);
  byId('newImportButton').addEventListener('click', resetForNewImport);

  document.querySelectorAll('[data-back]').forEach((button) => {
    button.addEventListener('click', () => showStep(Number(button.dataset.back)));
  });
  document.querySelectorAll('[data-step-button]').forEach((button) => {
    button.addEventListener('click', () => { if (!button.disabled) showStep(Number(button.dataset.stepButton)); });
  });

  const dropZone = byId('dropZone');
  ['dragenter', 'dragover'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('is-dragging');
  }));
  ['dragleave', 'drop'].forEach((eventName) => dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('is-dragging');
  }));
  dropZone.addEventListener('drop', (event) => {
    const file = event.dataTransfer.files[0];
    if (file) setWorkbookFile(file);
  });

  byId('copyJsonButton').addEventListener('click', async () => {
    await navigator.clipboard.writeText(byId('jsonPreview').textContent);
    toast('JSON copied');
  });
  byId('downloadJsonButton').addEventListener('click', () => {
    const blob = new Blob([byId('jsonPreview').textContent], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liferay-structured-content-batch.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  setupTabs();
}

initialize().catch((error) => {
  document.body.innerHTML = `<main class="shell"><section class="panel"><h1>Cannot start importer</h1><p>${escapeHtml(error.message)}</p></section></main>`;
});
