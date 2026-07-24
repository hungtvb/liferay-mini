const state = {config: null, connection: null, analysis: null, sessionId: null, validation: null, taskId: null};
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
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[char]));
}

function setStatus(element, message, kind = '') {
  element.textContent = message;
  element.className = `status ${kind}`.trim();
}

function renderEnvironment() {
  const config = state.config;
  const source = config.imageSource;
  const rows = [
    ['Liferay', config.baseUrl], ['Site ID', config.siteId], ['Visibility', config.viewableBy],
    ['Image source', `${source.type} #${source.id}`], ['Image folder', source.folderId || 'Source root'],
    ['Limits', `${config.maxImportRows} rows / ${config.maxUploadMb} MB`]
  ];
  byId('environment').innerHTML = rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
}

function selectedValue(id) {
  return byId(id).value;
}

function invalidateValidation() {
  state.sessionId = null;
  state.validation = null;
  byId('validationSummary').classList.add('hidden');
  byId('issuesDetails').classList.add('hidden');
  byId('payloadDetails').classList.add('hidden');
  byId('importButton').disabled = true;
}

function selectionReady() {
  return Boolean(selectedValue('structureSelect') && selectedValue('folderSelect') && selectedValue('localeSelect') && state.analysis?.status !== 'UNSUPPORTED');
}

function updateSelectionButtons() {
  const ready = selectionReady();
  byId('templateButton').disabled = !ready;
  byId('validateButton').disabled = !ready;
}

function renderStructureOptions(structures) {
  const select = byId('structureSelect');
  select.innerHTML = '<option value="">Select Structure</option>' + structures.map((item) =>
    `<option value="${escapeHtml(item.id)}" ${item.status === 'UNSUPPORTED' ? 'disabled' : ''}>${escapeHtml(item.name)} — ${escapeHtml(item.status)}</option>`
  ).join('');
}

function renderFolderOptions(folders) {
  byId('folderSelect').innerHTML = '<option value="">Select folder</option>' + folders.map((item) =>
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)} (#${escapeHtml(item.id)})</option>`
  ).join('');
}

async function loadStructureAnalysis() {
  invalidateValidation();
  const structureId = selectedValue('structureSelect');
  state.analysis = null;
  byId('localeSelect').innerHTML = '<option value="">Select locale</option>';
  byId('structureAnalysis').classList.add('hidden');
  if (!structureId) { updateSelectionButtons(); return; }
  const {data} = await api(`/api/structures/${encodeURIComponent(structureId)}`);
  state.analysis = data.analysis;
  const locales = data.analysis.availableLanguages.length ? data.analysis.availableLanguages : [state.config.defaultLocale];
  byId('localeSelect').innerHTML = locales.map((locale) => `<option value="${escapeHtml(locale)}" ${locale === state.config.defaultLocale ? 'selected' : ''}>${escapeHtml(locale)}</option>`).join('');
  const notice = byId('structureAnalysis');
  notice.classList.remove('hidden');
  const excluded = data.analysis.excludedFields || [];
  notice.innerHTML = `<strong>${escapeHtml(data.analysis.status)}</strong> · ${data.analysis.supportedFields.length} supported fields` +
    (excluded.length ? `<br>Excluded optional fields: ${excluded.map((field) => escapeHtml(field.label)).join(', ')}` : '');
  updateSelectionButtons();
}

async function connect() {
  const button = byId('connectButton');
  button.disabled = true;
  setStatus(byId('connectionStatus'), 'Connecting…');
  try {
    const {data} = await api('/api/connect', {method: 'POST'});
    state.connection = data;
    renderStructureOptions(data.structures);
    renderFolderOptions(data.folders);
    byId('selectionPanel').classList.remove('hidden');
    setStatus(byId('connectionStatus'), `Connected. ${data.structures.length} Structures and ${data.folders.length} folders loaded.`, 'success');
  }
  catch (error) {
    setStatus(byId('connectionStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
  }
  finally { button.disabled = false; }
}

async function downloadTemplate() {
  const button = byId('templateButton');
  button.disabled = true;
  try {
    const {data, response} = await api('/api/templates', {
      body: JSON.stringify({folderId: selectedValue('folderSelect'), locale: selectedValue('localeSelect'), structureId: selectedValue('structureSelect')}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
    const match = response.headers.get('content-disposition')?.match(/filename="([^"]+)"/);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(data);
    link.download = match?.[1] || 'structured-content-import-template.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);
  }
  catch (error) { alert(`${error.code || 'ERROR'}: ${error.message}`); }
  finally { button.disabled = !selectionReady(); }
}

function renderValidation(validation) {
  state.validation = validation;
  const summary = byId('validationSummary');
  summary.classList.remove('hidden');
  summary.innerHTML = `<div class="metrics">
    <div><strong>${validation.stats.totalRows}</strong><span>Total rows</span></div>
    <div><strong>${validation.stats.validRows}</strong><span>Valid</span></div>
    <div><strong>${validation.stats.invalidRows}</strong><span>Blocked</span></div>
    <div><strong>${validation.imageSummary.distinctReferenceCount || 0}</strong><span>Image references</span></div>
  </div>`;
  const allIssues = [...validation.errors, ...validation.warnings];
  const issues = byId('issues');
  byId('issuesDetails').classList.toggle('hidden', allIssues.length === 0);
  issues.innerHTML = allIssues.map((item) => `<article class="issue ${escapeHtml(item.severity)}"><strong>${escapeHtml(item.code)}</strong><span>Row ${escapeHtml(item.row ?? '—')} · ${escapeHtml(item.field || 'workbook')}</span><p>${escapeHtml(item.message)}</p></article>`).join('');
  byId('payloadDetails').classList.remove('hidden');
  byId('payloadPreview').textContent = JSON.stringify(validation.payloadPreview, null, 2);
  byId('importButton').disabled = !validation.canImport;
}

async function validateWorkbook(event) {
  event.preventDefault();
  const file = byId('workbookFile').files[0];
  if (!file) return;
  const button = byId('validateButton');
  button.disabled = true;
  const form = new FormData();
  form.set('file', file);
  form.set('structureId', selectedValue('structureSelect'));
  form.set('folderId', selectedValue('folderSelect'));
  form.set('locale', selectedValue('localeSelect'));
  try {
    const {data} = await api('/api/workbooks', {body: form, method: 'POST'});
    state.sessionId = data.sessionId;
    renderValidation(data.validation);
  }
  catch (error) {
    state.sessionId = null;
    byId('importButton').disabled = true;
    alert(`${error.code || 'ERROR'}: ${error.message}`);
  }
  finally { button.disabled = !selectionReady(); }
}

function updateUpsertWarning() {
  const isUpsert = document.querySelector('input[name="createStrategy"]:checked').value === 'UPSERT';
  byId('upsertConfirmWrap').classList.toggle('hidden', !isUpsert);
  if (!isUpsert) byId('confirmUpsert').checked = false;
}

async function pollTask(taskId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < state.config.pollTimeoutMs) {
    const {data} = await api(`/api/imports/${encodeURIComponent(taskId)}`);
    setStatus(byId('taskStatus'), `${data.executeStatus}: ${data.processedItemsCount}/${data.totalItemsCount}`);
    byId('taskResult').classList.remove('hidden');
    byId('taskResult').textContent = JSON.stringify(data, null, 2);
    if (['COMPLETED', 'FAILED'].includes(data.executeStatus)) return;
    await new Promise((resolve) => setTimeout(resolve, state.config.pollIntervalMs));
  }
  throw new Error('Batch polling timed out');
}

async function startImport() {
  const button = byId('importButton');
  const createStrategy = document.querySelector('input[name="createStrategy"]:checked').value;
  const importStrategy = document.querySelector('input[name="importStrategy"]:checked').value;
  if (createStrategy === 'UPSERT' && !byId('confirmUpsert').checked) {
    alert('Confirm the UPSERT folder limitation first.');
    return;
  }
  button.disabled = true;
  setStatus(byId('taskStatus'), 'Submitting one Batch Engine task…');
  try {
    const {data} = await api('/api/imports', {
      body: JSON.stringify({confirmUpsert: byId('confirmUpsert').checked, createStrategy, importStrategy, sessionId: state.sessionId}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
    state.taskId = data.id;
    await pollTask(data.id);
  }
  catch (error) {
    setStatus(byId('taskStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
  }
}

async function init() {
  const {data} = await api('/api/config');
  state.config = data;
  renderEnvironment();
  byId('connectButton').addEventListener('click', connect);
  byId('structureSelect').addEventListener('change', loadStructureAnalysis);
  byId('folderSelect').addEventListener('change', () => { invalidateValidation(); updateSelectionButtons(); });
  byId('localeSelect').addEventListener('change', () => { invalidateValidation(); updateSelectionButtons(); });
  byId('templateButton').addEventListener('click', downloadTemplate);
  byId('workbookForm').addEventListener('submit', validateWorkbook);
  byId('workbookFile').addEventListener('change', updateSelectionButtons);
  document.querySelectorAll('input[name="createStrategy"]').forEach((input) => input.addEventListener('change', updateUpsertWarning));
  byId('importButton').addEventListener('click', startImport);
}

init().catch((error) => setStatus(byId('connectionStatus'), error.message, 'error'));
