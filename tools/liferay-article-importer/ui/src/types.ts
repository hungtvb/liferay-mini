export type Step = 1 | 2 | 3 | 4 | 5;
export type ViewableBy = 'Anyone' | 'Members' | 'Owner';
export type CreateStrategy = 'INSERT' | 'UPSERT';
export type ImportStrategy = 'ON_ERROR_FAIL' | 'ON_ERROR_CONTINUE';
export type ReportStage = 'validation' | 'import';
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ImporterConfig {
  baseUrl: string;
  connected: boolean;
  defaultLocale: string;
  defaultViewableBy: ViewableBy;
  host: string;
  imageSourceTypes: string[];
  maxImportRows: number;
  maxUploadMb: number;
  pollIntervalMs: number;
  pollTimeoutMs: number;
  siteId: string | number;
  viewableByOptions: ViewableBy[];
}

export interface StructureSummary {
  id: string | number;
  name: string;
  status: string;
  externalReferenceCode?: string | null;
}

export interface FolderSummary {
  id: string | number;
  name: string;
  path?: string;
  siteId?: string | number;
  externalReferenceCode?: string | null;
}

export interface ImageSource {
  id: string | number;
  type: 'site';
  name: string;
  folderId?: string | number | null;
}

export interface ConnectionPayload {
  site?: {id?: string | number; name?: string};
  structures: StructureSummary[];
  folders: FolderSummary[];
  imageSources: ImageSource[];
}

export interface AnalysisField {
  label: string;
  fieldReference?: string;
  valueKind?: string;
}

export interface StructureAnalysis {
  status: string;
  supportedFields: AnalysisField[];
  excludedFields?: AnalysisField[];
  blockingFields?: AnalysisField[];
}

export interface ImageFoldersPayload {
  source: ImageSource;
  folders: FolderSummary[];
}

export interface ValidationIssue {
  code: string;
  message: string;
  row?: number | null;
  field?: string | null;
  severity?: 'warning' | 'error';
  value?: unknown;
}

export interface ValidationRow {
  row: number;
  externalReferenceCode?: string | null;
  friendlyUrlGenerated?: boolean;
  friendlyUrlPath?: string | null;
  title?: string | null;
  status: string;
  imageReference?: string | null;
}

export interface ValidationStats {
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

export interface ValidationResult {
  canImport: boolean;
  stats: ValidationStats;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  rowResultsPreview: ValidationRow[];
  payloadPreview: unknown[];
  imageSummary?: {distinctReferenceCount?: number};
  ercCollisions?: unknown[];
}

export interface WorkbookValidationPayload {
  fileName: string;
  rowCount: number;
  sessionId: string;
  validation: ValidationResult;
  structure: StructureSummary;
  folder: FolderSummary;
  imageSource: ImageSource;
  viewableBy: ViewableBy;
}

export interface ImportTask {
  id: string | number;
  executeStatus: string;
  processedItemsCount?: number;
  failedItemsCount?: number;
  totalItemsCount?: number;
  [key: string]: unknown;
}

export interface Selection {
  structureId: string;
  folderId: string;
  imageFolderId: string;
  viewableBy: ViewableBy;
}
