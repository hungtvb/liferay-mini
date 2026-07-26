import type {
  ConnectionPayload,
  CreateStrategy,
  ImageFoldersPayload,
  ImporterConfig,
  ImportStrategy,
  ImportTask,
  ReportStage,
  Selection,
  StructureAnalysis,
  WorkbookValidationPayload
} from './types';

export class ApiError extends Error {
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<{data: T; response: Response}> {
  const response = await fetch(path, options);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.blob();

  if (!response.ok) {
    const payload = data as {error?: {message?: string; code?: string; details?: unknown}};
    throw new ApiError(
      payload?.error?.message || `Request failed (${response.status})`,
      payload?.error?.code,
      payload?.error?.details
    );
  }

  return {data: data as T, response};
}

function currentSiteScope(config: ImporterConfig, selection: Selection) {
  return {
    folderId: selection.folderId,
    imageSourceFolderId: selection.imageFolderId || null,
    imageSourceId: String(config.siteId),
    imageSourceType: 'site',
    structureId: selection.structureId,
    viewableBy: selection.viewableBy
  };
}

function responseFileName(response: Response, fallback: string) {
  const disposition = response.headers.get('content-disposition') || '';
  return disposition.match(/filename="([^"]+)"/)?.[1] || fallback;
}

export async function getConfig() {
  return (await request<ImporterConfig>('/api/config')).data;
}

export async function connect() {
  return (await request<ConnectionPayload>('/api/connect', {method: 'POST'})).data;
}

export async function getStructureAnalysis(structureId: string) {
  return (await request<{analysis: StructureAnalysis}>(`/api/structures/${encodeURIComponent(structureId)}`)).data.analysis;
}

export async function getImageFolders(config: ImporterConfig) {
  return (await request<ImageFoldersPayload>('/api/image-folders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({imageSourceId: String(config.siteId), imageSourceType: 'site'})
  })).data;
}

export async function downloadTemplate(config: ImporterConfig, selection: Selection) {
  const {data, response} = await request<Blob>('/api/templates', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(currentSiteScope(config, selection))
  });

  return {blob: data, fileName: responseFileName(response, 'structured-content-import-template.xlsx')};
}

export async function downloadReport(sessionId: string, stage: ReportStage) {
  const {data, response} = await request<Blob>(
    `/api/reports/${encodeURIComponent(sessionId)}/${encodeURIComponent(stage)}`
  );
  return {blob: data, fileName: responseFileName(response, `structured-content-${stage}-report.xlsx`)};
}

export async function validateWorkbook(config: ImporterConfig, selection: Selection, file: File) {
  const form = new FormData();
  form.set('file', file);

  for (const [key, value] of Object.entries(currentSiteScope(config, selection))) {
    form.set(key, value == null ? '' : String(value));
  }

  return (await request<WorkbookValidationPayload>('/api/workbooks', {
    method: 'POST',
    body: form
  })).data;
}

export async function submitImport(
  sessionId: string,
  createStrategy: CreateStrategy,
  importStrategy: ImportStrategy,
  confirmUpsert: boolean
) {
  return (await request<ImportTask>('/api/imports', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sessionId, createStrategy, importStrategy, confirmUpsert})
  })).data;
}

export async function getImportTask(taskId: string | number) {
  return (await request<ImportTask>(`/api/imports/${encodeURIComponent(String(taskId))}`)).data;
}
