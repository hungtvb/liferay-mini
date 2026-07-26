import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {IMAGE_SOURCE_TYPES, VIEWABLE_BY_VALUES} from './config.js';
import {AppError, assert} from './errors.js';
import {ImageResolver} from './image-resolver.js';
import {ImportService, normalizeTask} from './import-service.js';
import {summarizeStructure} from './mapping.js';
import {buildReportWorkbook} from './report.js';
import {analyzeStructure} from './structure-analyzer.js';
import {validateAndBuildPayload} from './validation.js';
import {buildTemplateWorkbook, parseTemplateWorkbook} from './workbook.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, '../public');

function normalizeLocale(value) {
  return String(value || '').trim().replace('_', '-').toLowerCase();
}

function normalizeViewableBy(value, fallback) {
  const normalized = String(value || fallback || '').trim();
  assert(VIEWABLE_BY_VALUES.includes(normalized), 400, 'VISIBILITY_INVALID', `Content visibility must be one of: ${VIEWABLE_BY_VALUES.join(', ')}`);
  return normalized;
}

function imageSourceInput(input = {}) {
  return {
    folderId: input.imageSourceFolderId || null,
    id: input.imageSourceId,
    type: input.imageSourceType
  };
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({length: Math.min(limit, Math.max(items.length, 1))}, worker));
  return results;
}

function publicValidation(validation, previewRows) {
  const {errors, payload, rowResults, warnings, ...safe} = validation;
  return {
    ...safe,
    errors: errors.slice(0, 200),
    errorsTruncated: errors.length > 200,
    payloadPreview: payload.slice(0, previewRows),
    rowResultsPreview: rowResults.slice(0, previewRows),
    warnings: warnings.slice(0, 200),
    warningsTruncated: warnings.length > 200
  };
}

async function loadSelection({config, liferay, folderId, structureId, viewableBy, ...scopeInput}) {
  assert(structureId, 400, 'STRUCTURE_REQUIRED', 'Select a Content Structure');
  assert(folderId, 400, 'TARGET_FOLDER_REQUIRED', 'Select a target Web Content folder');

  const scope = imageSourceInput(scopeInput);
  const [structure, folder, imageSource] = await Promise.all([
    liferay.getContentStructure(structureId),
    liferay.getStructuredContentFolder(folderId),
    liferay.resolveImageSource(scope)
  ]);

  const selectedLocale = config.defaultLocale;
  const analysis = analyzeStructure(structure, selectedLocale);
  assert(analysis.status !== 'UNSUPPORTED', 409, 'STRUCTURE_UNSUPPORTED', 'Selected Structure is not supported by the flat importer', {blockingFields: analysis.blockingFields});
  assert(String(structure.siteId ?? '') === String(config.siteId), 400, 'STRUCTURE_SITE_MISMATCH', 'Selected Structure does not belong to the configured Site');
  const languages = analysis.availableLanguages.map(normalizeLocale);
  assert(languages.length === 0 || languages.includes(normalizeLocale(selectedLocale)), 400, 'DEFAULT_LOCALE_UNSUPPORTED', `Default locale ${selectedLocale} is not available for the selected Structure`);
  if (folder.siteId != null) {
    assert(String(folder.siteId) === String(config.siteId), 400, 'TARGET_FOLDER_CHANGED', 'Selected folder does not belong to the configured Site');
  }

  return {
    analysis,
    folder: {externalReferenceCode: folder.externalReferenceCode || null, id: folder.id, name: folder.name, siteId: folder.siteId},
    imageSource,
    locale: selectedLocale,
    structure,
    viewableBy: normalizeViewableBy(viewableBy, config.defaultViewableBy)
  };
}

async function validateSession({config, liferay, selection, workbook}) {
  const existingContents = await liferay.listSiteStructuredContents();
  const imageResolver = new ImageResolver({imageSource: selection.imageSource, liferay});

  return validateAndBuildPayload({
    existingContents,
    folder: selection.folder,
    imageResolver,
    locale: selection.locale,
    mapping: workbook.mapping,
    rowNumbers: workbook.rowNumbers,
    rows: workbook.rows,
    structure: selection.structure,
    targets: workbook.targets,
    viewableBy: selection.viewableBy
  });
}

export function createApp({config, liferay, sessions}) {
  const app = express();
  const upload = multer({limits: {fileSize: config.maxUploadBytes}, storage: multer.memoryStorage()});
  const imports = new ImportService({liferay, sessions});

  app.disable('x-powered-by');
  app.use(express.json({limit: '2mb'}));
  app.use(express.static(publicDir));

  app.get('/api/config', (request, response) => {
    response.json({
      baseUrl: config.baseUrl,
      connected: liferay.connected,
      defaultLocale: config.defaultLocale,
      defaultViewableBy: config.defaultViewableBy,
      host: config.host,
      imageSourceTypes: IMAGE_SOURCE_TYPES,
      maxImportRows: config.maxImportRows,
      maxUploadMb: Math.round(config.maxUploadBytes / 1024 / 1024),
      pollIntervalMs: config.pollIntervalMs,
      pollTimeoutMs: config.pollTimeoutMs,
      siteId: config.siteId,
      viewableByOptions: VIEWABLE_BY_VALUES
    });
  });

  app.post('/api/connect', async (request, response, next) => {
    try {
      const connected = await liferay.connect();
      const structures = await mapLimit(connected.structures, 5, async (summary) => {
        const structure = await liferay.getContentStructure(summary.id);
        return summarizeStructure(structure, config.defaultLocale);
      });
      response.json({...connected, structures});
    }
    catch (error) { next(error); }
  });

  app.post('/api/image-folders', async (request, response, next) => {
    try {
      const scope = imageSourceInput(request.body);
      const [source, folders] = await Promise.all([
        liferay.resolveImageSource(scope),
        liferay.listImageFolders(scope)
      ]);
      response.json({folders, source});
    }
    catch (error) { next(error); }
  });

  app.get('/api/structures/:structureId', async (request, response, next) => {
    try {
      const structure = await liferay.getContentStructure(request.params.structureId);
      assert(String(structure.siteId ?? '') === String(config.siteId), 400, 'STRUCTURE_SITE_MISMATCH', 'Selected Structure does not belong to the configured Site');
      response.json({
        analysis: analyzeStructure(structure, config.defaultLocale),
        structure: summarizeStructure(structure, config.defaultLocale)
      });
    }
    catch (error) { next(error); }
  });

  app.get('/api/folders', async (request, response, next) => {
    try { response.json({items: await liferay.listStructuredContentFolders()}); }
    catch (error) { next(error); }
  });

  app.post('/api/templates', async (request, response, next) => {
    try {
      const selection = await loadSelection({config, liferay, ...request.body});
      const template = await buildTemplateWorkbook({
        folder: selection.folder,
        imageSource: selection.imageSource,
        locale: selection.locale,
        siteId: config.siteId,
        structure: selection.structure,
        viewableBy: selection.viewableBy
      });
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.setHeader('Content-Disposition', `attachment; filename="${template.fileName}"`);
      response.send(Buffer.from(template.buffer));
    }
    catch (error) { next(error); }
  });

  app.post('/api/workbooks', upload.single('file'), async (request, response, next) => {
    try {
      assert(request.file, 400, 'FILE_REQUIRED', 'Select the completed .xlsx template');
      assert(request.file.originalname.toLowerCase().endsWith('.xlsx'), 400, 'FILE_TYPE_INVALID', 'Only .xlsx files are supported');
      const selection = await loadSelection({config, liferay, ...request.body});
      const context = {
        folder: selection.folder,
        imageSource: selection.imageSource,
        locale: selection.locale,
        siteId: config.siteId,
        structure: selection.structure,
        viewableBy: selection.viewableBy
      };
      const workbook = await parseTemplateWorkbook(request.file.buffer, context);
      assert(workbook.rows.length <= config.maxImportRows, 400, 'MAX_ROWS_EXCEEDED', `Workbook contains ${workbook.rows.length} rows; limit is ${config.maxImportRows}`);
      const validation = await validateSession({config, liferay, selection, workbook});
      const session = sessions.create({
        fileName: request.file.originalname,
        folder: selection.folder,
        imageSource: selection.imageSource,
        locale: selection.locale,
        structure: selection.structure,
        validation,
        viewableBy: selection.viewableBy,
        workbook
      });
      response.status(201).json({
        fileName: session.fileName,
        folder: selection.folder,
        imageSource: selection.imageSource,
        metadata: workbook.metadata,
        previewRows: workbook.rows.slice(0, config.previewRows),
        rowCount: workbook.rows.length,
        sessionId: session.id,
        sheetName: workbook.sheetName,
        structure: summarizeStructure(selection.structure, selection.locale),
        validation: publicValidation(validation, config.previewRows),
        viewableBy: selection.viewableBy
      });
    }
    catch (error) { next(error); }
  });

  app.post('/api/imports', async (request, response, next) => {
    try {
      const session = sessions.get(request.body?.sessionId);
      const selection = await loadSelection({
        config,
        folderId: session.folder.id,
        imageSourceFolderId: session.imageSource.folderId,
        imageSourceId: session.imageSource.id,
        imageSourceType: session.imageSource.type,
        liferay,
        structureId: session.structure.id,
        viewableBy: session.viewableBy
      });
      const validation = await validateSession({config, liferay, selection, workbook: session.workbook});
      sessions.update(session.id, {
        folder: selection.folder,
        imageSource: selection.imageSource,
        structure: selection.structure,
        validation,
        viewableBy: selection.viewableBy
      });
      assert(validation.canImport, 409, 'VALIDATION_FAILED', 'Resolve all validation errors before importing', {validation: publicValidation(validation, config.previewRows)});
      const task = await imports.submit({...request.body, sessionId: session.id});
      response.status(202).json({...task, folder: selection.folder, imageSource: selection.imageSource, viewableBy: selection.viewableBy});
    }
    catch (error) { next(error); }
  });

  app.get('/api/imports/:taskId', async (request, response, next) => {
    try { response.json(normalizeTask(await liferay.getImportTask(request.params.taskId))); }
    catch (error) { next(error); }
  });

  app.get('/api/reports/:sessionId/:stage', async (request, response, next) => {
    try {
      const stage = String(request.params.stage || '').toLowerCase();
      assert(['validation', 'import'].includes(stage), 400, 'REPORT_STAGE_INVALID', 'Report stage must be validation or import');
      const session = sessions.get(request.params.sessionId);
      let task = null;
      if (stage === 'import') {
        assert(session.taskId, 409, 'IMPORT_REPORT_NOT_READY', 'Import report is available after a Batch task is submitted');
        task = normalizeTask(await liferay.getImportTask(session.taskId));
      }
      const report = await buildReportWorkbook({config, session, stage, task});
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
      response.send(Buffer.from(report.buffer));
    }
    catch (error) { next(error); }
  });

  app.use('/api', (request, response) => response.status(404).json({error: {code: 'NOT_FOUND', message: 'API route not found'}}));
  app.use((error, request, response, next) => {
    if (response.headersSent) { next(error); return; }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      response.status(413).json({error: {code: 'FILE_TOO_LARGE', message: `Workbook exceeds the ${Math.round(config.maxUploadBytes / 1024 / 1024)} MB upload limit`}});
      return;
    }
    const status = error instanceof AppError ? error.status : Number(error.status) || 500;
    const code = error instanceof AppError ? error.code : error.code || 'INTERNAL_ERROR';
    if (status >= 500) console.error(error);
    response.status(status).json({error: {code, details: error.details, message: error.message || 'Unexpected server error'}});
  });

  return app;
}
