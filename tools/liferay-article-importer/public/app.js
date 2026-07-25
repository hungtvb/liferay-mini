const state = {
  analysis: null,
  config: null,
  connection: null,
  imageFoldersLoaded: false,
  sessionId: null,
  taskId: null,
  validation: null
};
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
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[char]));
}

function setStatus(element, message, kind = '') {
  element.textContent = message;
  element.className = `status ${kind}`.trim();
}

function renderEnvironment() {
  const config = state.config;
  const rows = [
    ['Liferay', config.baseUrl],
    ['Site ID', config.siteId],
    ['Default locale', config.defaultLocale],
    ['Default visibility', config.defaultViewableBy],
    ['Local bind', `${config.host}:${location.port || '4174'}`],
    ['Image scope', 'Selected per import run'],
    ['Limits', `${config.maxImportRows} rows / ${config.maxUploadMb} MB`]
  ];
  byId('environment').innerHTML = rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
}

function selectedValue(id) {
  return byId(id).value;
}

function migrationScope() {
  return {
    imageSourceFolderId: selectedValue('imageFolderSelect') || null,
    imageSourceId: selectedValue('imageSourceSelect'),
    imageSourceType: selectedValue('imageSourceTypeSelect'),
    viewableBy: selectedValue('viewableBySelect')
  };
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
  return Boolean(
    selectedValue('structureSelect')
    && selectedValue('folderSelect')
    && selectedValue('imageSourceTypeSelect')
    && selectedValue('imageSourceSelect')
    && selectedValue('viewableBySelect')
    && state.imageFoldersLoaded
    && state.analysis?.status !== 'UNSUPPORTED'
  );
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
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.path || item.name)} (#${escapeHtml(item.id)})</option>`
  ).join('');
}

function renderVisibilityOptions() {
  const select = byId('viewableBySelect');
  select.innerHTML = state.config.viewableByOptions.map((value) =>
    `<option value="${escapeHtml(value)}" ${value === state.config.defaultViewableBy ? 'selected' : ''}>${escapeHtml(value)}</option>`
  ).join('');
}

function renderImageSourceTypes() {
  const available = new Set((state.connection?.imageSources || []).map((source) => source.type));
  const labels = {assetLibrary: 'Asset Library', site: 'Current Site'};
  const select = byId('imageSourceTypeSelect');
  select.innerHTML = state.config.imageSourceTypes
    .filter((type) => available.has(type))
    .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(labels[type] || type)}</option>`)
    .join('');
}

function renderImageSources() {
  const type = selectedValue('imageSourceTypeSelect');
  const sources = (state.connection?.imageSources || []).filter((source) => source.type === type);
  byId('imageSourceSelect').innerHTML = sources.map((source) =>
    `<option value="${escapeHtml(source.id)}">${escapeHtml(source.name)} (#${escapeHtml(source.id)})</option>`
  ).join('');
}

function renderImageFolders(folders) {
  byId('imageFolderSelect').innerHTML = '<option value="">Source root</option>' + folders.map((item) =>
    `<option value="${escapeHtml(item.id)}">${escapeHtml(item.path || item.name)} (#${escapeHtml(item.id)})</option>`
  ).join('');
}

async function loadImageFolders() {
  invalidateValidation();
  state.imageFoldersLoaded = false;
  renderImageFolders([]);
  updateSelectionButtons();

  const imageSourceType = selectedValue('imageSourceTypeSelect');
  const imageSourceId = selectedValue('imageSourceSelect');
  if (!imageSourceType || !imageSourceId) return;

  const select = byId('imageFolderSelect');
  select.disabled = true;
  setStatus(byId('imageScopeStatus'), 'Loading image folders…');

  try {
    const {data} = await api('/api/image-folders', {
      body: JSON.stringify({imageSourceId, imageSourceType}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST'
    });
    renderImageFolders(data.folders);
    state.imageFoldersLoaded = true;
    setStatus(byId('imageScopeStatus'), `${data.folders.length} folders available in ${data.source.name}.`, 'success');
  }
  catch (error) {
    setStatus(byId('imageScopeStatus'), `${error.code || 'ERROR'}: ${error.message}`, 'error');
  }
  finally {
    select.disabled = false;
    updateSelectionButtons();
  }
}

async function changeImageSourceType() {
  invalidateValidation();
  state.imageFoldersLoaded = false;
  renderImageSources();
  await loadImageFolders();
}

async function loadStructureAnalysis() {
  invalidateValidation();
  const structureId = selectedValue('structureSelect');
  state.analysis = null;
  byId('structureAnalysis').classList.add('hidden');
  if (!structureId) { updateSelectionButtons(); return; }
  const {data} = await api(`/api/structures/${encodeURIComponent(structureId)}`);
  state.analysis = data.analysis;
  const notice = byId('structureAnalysis');
  notice.classList.remove('hidden');
  const excluded = data.analysis.excludedFields || [];
  const optionFields = (data.analysis.supportedFields || []).filter((field) => field.valueKind === 'option');
  notice.innerHTML = `<strong>${escapeHtml(data.analysis.status)}</strong> · ${data.analysis.supportedFields.length} supported fields · default locale ${escapeHtml(state.config.defaultLocale)}` +
    (excluded.length ? `<br>Excluded optional fields: ${excluded.map((field) => escapeHtml(field.label)).join(', ')}` : '') +
    (optionFields.length ? `<br>Validated option fields: ${optionFields.map((field) => escapeHtml(field.label)).join(', ')}` : '');
  updateSelectionButtons();
}

async function connect() {
  const button = byId('connectButton');
  button.disabled = true;
  setStatus(byId('connectionStatus'), 'Connecting and loading migration scope…');
  try {
    const {data} = await api('/api/connect', {method: 'POST'});
    state.connection = data;
    renderEnvironment();
    renderStructureOptions(data.structures);
    renderFolderOptions(data.folders);
    renderVisibilityOptions();
    renderImageSourceTypes();
    renderImageSources();
    byId('selectionPanel').classList.remove('hidden');
    await loadImageFolders();
    setStatus(
      byId('connectionStatus'),
      `Connected. ${data.structures.length} Structures, ${data.folders.length} Web Content folders, and ${data.imageSources.length} image sources loaded.`,
      'success'
    );
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
      body: JSON.stringify({
        folderId: selectedValue('folderSelect'),
        structureId: selectedValue('structureSelect'),
        ...migrationScope()
      }),
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

function updateImportButton() {
  const createStrategy = document.querySelector('input[name="createStrategy"]:checked')?.value || 'INSERT';
  const hasCollisions = (state.validation?.ercCollisions || []).length > 0;
  const upsertConfirmed = byId('confirmUpsert').checked;
  const strategyBlocked = (createStrategy === 'INSERT' && hasCollisions) || (createStrategy === 'UPSERT' && !upsertConfirmed);
  byId('importButton').disabled = !state.sessionId || !state.validation?.canImport || strategyBlocked;
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
  updateImportButton();
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
  for (const [key, value] of Object.entries(migrationScope())) form.set(key, value ?? '');
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
  updateImportButton();
}

async function pollTask(taskId) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < state.config.pollTimeoutMs) {
    const {data} = await api(`/api/imports/${encodeURIComponent(taskId)}`);
    setStatus(byId('taskStatus'), `${data.executeStatus}: ${data.processedItemsCount}/${data.totalItemsCount}`);
    byId('taskResult').classList.remove('hidden');
    byId('taskResult').textContent = JSON.stringify(data, null, 2);
    if (terminalStatuses.has(data.executeStatus)) return;
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
  byId('imageSourceTypeSelect').addEventListener('change', changeImageSourceType);
  byId('imageSourceSelect').addEventListener('change', loadImageFolders);
  byId('imageFolderSelect').addEventListener('change', () => { invalidateValidation(); updateSelectionButtons(); });
  byId('viewableBySelect').addEventListener('change', () => { invalidateValidation(); updateSelectionButtons(); });
  byId('templateButton').addEventListener('click', downloadTemplate);
  byId('workbookForm').addEventListener('submit', validateWorkbook);
  byId('workbookFile').addEventListener('change', updateSelectionButtons);
  document.querySelectorAll('input[name="createStrategy"]').forEach((input) => input.addEventListener('change', updateUpsertWarning));
  byId('confirmUpsert').addEventListener('change', updateImportButton);
  byId('importButton').addEventListener('click', startImport);
}

init().catch((error) => setStatus(byId('connectionStatus'), error.message, 'error'));
