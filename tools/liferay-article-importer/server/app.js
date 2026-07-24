import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {AppError, assert} from './errors.js';
import {buildTargets, createAutoMapping, summarizeStructure} from './mapping.js';
import {validateAndBuildPayload} from './validation.js';
import {parseWorkbook} from './workbook.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, '../public');

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

export function createApp({config, liferay, sessions}) {
  const app = express();
  const upload = multer({
    limits: {fileSize: config.maxUploadBytes},
    storage: multer.memoryStorage()
  });

  app.disable('x-powered-by');
  app.use(express.json({limit: '2mb'}));
  app.use(express.static(publicDir));

  app.get('/api/config', (request, response) => {
    response.json({
      baseUrl: config.baseUrl,
      connected: liferay.connected,
      importStrategy: config.importStrategy,
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
      const structures = await liferay.connect();
      response.json({
        connection: {baseUrl: config.baseUrl, siteId: config.siteId},
        structures
      });
    }
    catch (error) {
      next(error);
    }
  });

  app.get('/api/structures/:structureId', async (request, response, next) => {
    try {
      const structure = await liferay.getContentStructure(request.params.structureId);
      response.json({structure: summarizeStructure(structure), targets: buildTargets(structure)});
    }
    catch (error) {
      next(error);
    }
  });

  app.post('/api/workbooks', upload.single('file'), async (request, response, next) => {
    try {
      assert(request.file, 400, 'FILE_REQUIRED', 'Select an .xlsx file');
      assert(
        request.file.originalname.toLowerCase().endsWith('.xlsx'),
        400,
        'FILE_TYPE_INVALID',
        'Only .xlsx files are supported'
      );
      assert(request.body.structureId, 400, 'STRUCTURE_REQUIRED', 'Select a Content Structure');

      const [structure, workbook] = await Promise.all([
        liferay.getContentStructure(request.body.structureId),
        parseWorkbook(request.file.buffer)
      ]);

      assert(
        workbook.rows.length <= config.maxImportRows,
        400,
        'ROW_LIMIT_EXCEEDED',
        `Workbook contains ${workbook.rows.length} rows; the configured limit is ${config.maxImportRows}`
      );

      const targets = buildTargets(structure);
      const mapping = createAutoMapping(workbook.headers, targets);
      const session = sessions.create({
        fileName: request.file.originalname,
        mapping,
        structure,
        targets,
        validation: null,
        workbook
      });

      response.status(201).json({
        fileName: session.fileName,
        headers: workbook.headers,
        mapping,
        previewRows: workbook.rows.slice(0, 8),
        rowCount: workbook.rows.length,
        sessionId: session.id,
        sheetName: workbook.sheetName,
        sheetNames: workbook.sheetNames,
        structure: summarizeStructure(structure),
        targets
      });
    }
    catch (error) {
      next(error);
    }
  });

  app.post('/api/workbooks/:sessionId/validate', (request, response, next) => {
    try {
      const session = sessions.get(request.params.sessionId);
      const mapping = request.body?.mapping;
      assert(mapping && typeof mapping === 'object', 400, 'MAPPING_REQUIRED', 'Mapping is required');

      const validation = validateAndBuildPayload({
        mapping,
        rowNumbers: session.workbook.rowNumbers,
        rows: session.workbook.rows,
        structure: session.structure,
        targets: session.targets
      });

      sessions.update(session.id, {mapping, validation});
      response.json(validation);
    }
    catch (error) {
      next(error);
    }
  });

  app.post('/api/imports', async (request, response, next) => {
    try {
      const session = sessions.get(request.body?.sessionId);
      assert(session.validation, 409, 'VALIDATION_REQUIRED', 'Validate the workbook before importing');
      assert(
        session.validation.canImport,
        409,
        'VALIDATION_FAILED',
        'Resolve all validation errors before importing'
      );

      const task = await liferay.submitStructuredContents(session.validation.payload);
      sessions.update(session.id, {taskId: task.id});
      response.status(202).json(asTask(task));
    }
    catch (error) {
      next(error);
    }
  });

  app.get('/api/imports/:taskId', async (request, response, next) => {
    try {
      const task = await liferay.getImportTask(request.params.taskId);
      response.json(asTask(task));
    }
    catch (error) {
      next(error);
    }
  });

  app.use('/api', (request, response) => {
    response.status(404).json({error: {code: 'NOT_FOUND', message: 'API route not found'}});
  });

  app.use((error, request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      response.status(413).json({
        error: {
          code: 'FILE_TOO_LARGE',
          message: `Workbook exceeds the ${Math.round(config.maxUploadBytes / 1024 / 1024)} MB upload limit`
        }
      });
      return;
    }

    const status = error instanceof AppError ? error.status : 500;
    const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';

    if (!(error instanceof AppError)) {
      console.error(error);
    }

    response.status(status).json({
      error: {
        code,
        details: error.details,
        message: error.message || 'Unexpected server error'
      }
    });
  });

  return app;
}
