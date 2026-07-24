import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {AppError, assert} from './errors.js';
import {buildTargets, summarizeStructure} from './mapping.js';
import {validateAndBuildPayload} from './validation.js';
import {buildTemplateWorkbook, parseTemplateWorkbook} from './workbook.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, '../public');
const CREATE_STRATEGIES = new Set(['INSERT', 'UPSERT']);
const IMPORT_STRATEGIES = new Set(['ON_ERROR_FAIL', 'ON_ERROR_CONTINUE']);

function normalizeIdentifier(value) {
  return String(value ?? '').trim().toLowerCase();
}

function assertArticleStructure(structure, config) {
  const expected = normalizeIdentifier(config.articleStructureId);
  const actual = normalizeIdentifier(structure?.id);
  assert(
    actual === expected,
    400,
    'ARTICLE_STRUCTURE_MISMATCH',
    `Expected Article Structure ID "${config.articleStructureId}" but received "${structure?.id || structure?.name || 'unknown'}"`
  );
  return structure;
}

function findArticleStructure(structures, config) {
  const expected = normalizeIdentifier(config.articleStructureId);
  return structures.find((structure) => normalizeIdentifier(structure.id) === expected);
}

function asTask(task) {
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

async function validateWorkbookSession({config, folder, liferay, session}) {
  assertArticleStructure(session.structure, config);
  return validateAndBuildPayload({
    folder,
    imageLookupConcurrency: config.imageLookupConcurrency,
    mapping: session.workbook.mapping,
    resolveDocument: (erc) => liferay.getSiteDocumentByExternalReferenceCode(erc),
    rowNumbers: session.workbook.rowNumbers,
    rows: session.workbook.rows,
    structure: session.structure,
    targets: session.workbook.targets
  });
}

export function createApp({config, liferay, sessions}) {
  const app = express();
  const upload = multer({limits: {fileSize: config.maxUploadBytes}, storage: multer.memoryStorage()});

  app.disable('x-powered-by');
  app.use(express.json({limit: '2mb'}));
  app.use(express.static(publicDir));

  app.get('/api/config', (request, response) => {
    response.json({
      articleFolderExternalReferenceCode: config.articleFolderExternalReferenceCode,
      articleFolderName: config.articleFolderName,
      articleStructureId: config.articleStructureId,
      baseUrl: config.baseUrl,
      connected: liferay.connected,
      locale: config.locale,
      maxImportRows: config.maxImportRows,
      maxUploadMb: Math.round(config.maxUploadBytes / 1024 / 1024),
      pollIntervalMs: config.pollIntervalMs,
      pollTimeoutMs: config.pollTimeoutMs,
      siteId: config.siteId
    });
  });

  app.post('/api/connect', async (request, response, next) => {
    try {
      const {folder, structures} = await liferay.connect();
      const articleStructure = findArticleStructure(structures, config);
      assert(
        articleStructure,
        409,
        'ARTICLE_STRUCTURE_NOT_FOUND',
        `Content Structure with ID "${config.articleStructureId}" was not found in Site ${config.siteId}`
      );
      response.json({
        articleStructure,
        connection: {baseUrl: config.baseUrl, siteId: config.siteId},
        folder,
        structures: [articleStructure]
      });
    }
    catch (error) { next(error); }
  });

  app.get('/api/structures/:structureId', async (request, response, next) => {
    try {
      const structure = assertArticleStructure(
        await liferay.getContentStructure(request.params.structureId),
        config
      );
      const targets = buildTargets(structure);
      response.json({
        structure: summarizeStructure(structure),
        supportedFields: targets.filter((target) => target.key.startsWith('content.') && target.supported),
        unsupportedFields: targets.filter((target) => target.key.startsWith('content.') && !target.supported)
      });
    }
    catch (error) { next(error); }
  });

  app.get('/api/structures/:structureId/template', async (request, response, next) => {
    try {
      const folder = await liferay.ensureArticleFolder({force: true});
      const structure = assertArticleStructure(
        await liferay.getContentStructure(request.params.structureId),
        config
      );
      const template = await buildTemplateWorkbook(structure, folder);
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
      assert(request.body.structureId, 400, 'STRUCTURE_REQUIRED', 'Select a Content Structure');

      const folder = await liferay.ensureArticleFolder({force: true});
      const structure = assertArticleStructure(
        await liferay.getContentStructure(request.body.structureId),
        config
      );
      const workbook = await parseTemplateWorkbook(request.file.buffer, structure, folder);
      assert(workbook.rows.length <= config.maxImportRows, 400, 'ROW_LIMIT_EXCEEDED', `Workbook contains ${workbook.rows.length} rows; the configured limit is ${config.maxImportRows}`);

      liferay.clearDocumentCache();
      const sessionData = {
        fileName: request.file.originalname,
        folder,
        mapping: workbook.mapping,
        structure,
        targets: workbook.targets,
        workbook
      };
      const validation = await validateWorkbookSession({config, folder, liferay, session: sessionData});
      const session = sessions.create({...sessionData, validation});

      response.status(201).json({
        fileName: session.fileName,
        folder,
        metadata: workbook.metadata,
        previewRows: workbook.rows.slice(0, 8),
        rowCount: workbook.rows.length,
        sessionId: session.id,
        sheetName: workbook.sheetName,
        structure: summarizeStructure(structure),
        validation
      });
    }
    catch (error) { next(error); }
  });

  app.post('/api/imports', async (request, response, next) => {
    try {
      const session = sessions.get(request.body?.sessionId);
      assert(session.validation, 409, 'VALIDATION_REQUIRED', 'Validate the workbook before importing');
      assertArticleStructure(session.structure, config);

      const createStrategy = String(request.body?.createStrategy || '').toUpperCase();
      const importStrategy = String(request.body?.importStrategy || '').toUpperCase();
      assert(CREATE_STRATEGIES.has(createStrategy), 400, 'CREATE_STRATEGY_INVALID', 'createStrategy must be INSERT or UPSERT');
      assert(IMPORT_STRATEGIES.has(importStrategy), 400, 'IMPORT_STRATEGY_INVALID', 'importStrategy must be ON_ERROR_FAIL or ON_ERROR_CONTINUE');

      const folder = await liferay.ensureArticleFolder({force: true});
      liferay.clearDocumentCache();
      const validation = await validateWorkbookSession({config, folder, liferay, session});
      sessions.update(session.id, {folder, validation});
      assert(validation.canImport, 409, 'VALIDATION_FAILED', 'Resolve all validation errors before importing', {validation});

      const task = await liferay.submitStructuredContents(validation.payload, {createStrategy, importStrategy});
      sessions.update(session.id, {createStrategy, importStrategy, taskId: task.id});
      response.status(202).json({...asTask(task), createStrategy, folder, importStrategy});
    }
    catch (error) { next(error); }
  });

  app.get('/api/imports/:taskId', async (request, response, next) => {
    try { response.json(asTask(await liferay.getImportTask(request.params.taskId))); }
    catch (error) { next(error); }
  });

  app.use('/api', (request, response) => response.status(404).json({error: {code: 'NOT_FOUND', message: 'API route not found'}}));
  app.use((error, request, response, next) => {
    if (response.headersSent) { next(error); return; }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      response.status(413).json({error: {code: 'FILE_TOO_LARGE', message: `Workbook exceeds the ${Math.round(config.maxUploadBytes / 1024 / 1024)} MB upload limit`}});
      return;
    }
    const status = error instanceof AppError ? error.status : 500;
    const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';
    if (!(error instanceof AppError)) console.error(error);
    response.status(status).json({error: {code, details: error.details, message: error.message || 'Unexpected server error'}});
  });

  return app;
}
