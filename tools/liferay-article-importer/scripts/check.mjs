import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'package.json', 'vite.config.ts', 'tsconfig.json',
  'server/config.js', 'server/app.js', 'server/index.js', 'server/structure-analyzer.js', 'server/image-resolver.js',
  'server/liferay-client.js', 'server/session-store.js', 'server/mapping.js', 'server/workbook.js', 'server/validation.js',
  'server/friendly-url.js', 'server/file-name.js', 'server/report.js', 'server/import-service.js', 'ui/index.html', 'ui/src/App.tsx', 'ui/src/api.ts', 'ui/src/types.ts',
  'ui/src/components/AppHeader.tsx', 'ui/src/components/WorkflowNav.tsx',
  'ui/src/steps/ConnectStep.tsx', 'ui/src/steps/ConfigureStep.tsx', 'ui/src/steps/WorkbookStep.tsx',
  'ui/src/steps/ValidationStep.tsx', 'ui/src/steps/ImportStep.tsx', 'ui/src/styles.scss', '.env.example', 'README.md'
];

const content = Object.fromEntries(await Promise.all(
  files.map(async (file) => [file, await readFile(path.join(root, file), 'utf8')])
));

for (const [file, text] of Object.entries(content)) {
  if (/LIFERAY_ARTICLE_STRUCTURE|LIFERAY_ARTICLE_FOLDER/.test(text)) {
    throw new Error(`${file} still depends on Article-specific ENV configuration`);
  }
}

for (const forbidden of ['LIFERAY_IMAGE_SOURCE_TYPE', 'LIFERAY_IMAGE_SOURCE_ID', 'LIFERAY_IMAGE_SOURCE_FOLDER_ID']) {
  if (content['server/config.js'].includes(forbidden) || content['.env.example'].includes(forbidden)) {
    throw new Error(`${forbidden} must not be required from ENV`);
  }
}

for (const expected of ['LIFERAY_DEFAULT_CONTENT_VIEWABLE_BY', 'MAX_ACTIVE_SESSIONS', "'HOST'"]) {
  if (!content['server/config.js'].includes(expected)) throw new Error(`config.js is missing ${expected}`);
}

if (!content['server/config.js'].includes("IMAGE_SOURCE_TYPES = ['site']")) {
  throw new Error('Demo release must expose only the configured Current Site image source');
}

for (const expected of ['Content Items', 'Field Guide', 'Example', 'Metadata', "TEMPLATE_VERSION = '6'", 'friendlyUrl', 'safeFileStem']) {
  if (!content['server/workbook.js'].includes(expected)) throw new Error(`workbook.js is missing ${expected}`);
}

for (const expected of ['system.friendlyUrlPath', "label: 'Friendly URL'", "valueKind: 'friendlyUrl'"]) {
  if (!content['server/mapping.js'].includes(expected)) throw new Error(`mapping.js is missing ${expected}`);
}

for (const expected of ['slugifyFriendlyUrl', 'FRIENDLY_URL_INVALID', 'Đđ']) {
  if (!content['server/friendly-url.js'].includes(expected)) throw new Error(`friendly-url.js is missing ${expected}`);
}

for (const expected of ['safeFileStem', 'Đđ', 'structured-content']) {
  if (!content['server/file-name.js'].includes(expected)) throw new Error(`file-name.js is missing ${expected}`);
}

for (const expected of ['FRIENDLY_URL_DUPLICATE_IN_WORKBOOK', 'FRIENDLY_URL_ALREADY_EXISTS', 'friendlyUrlPath']) {
  if (!content['server/validation.js'].includes(expected)) throw new Error(`validation.js is missing ${expected}`);
}

for (const expected of ['Summary', 'Rows', 'Issues', 'Batch Failed Items', 'buildReportWorkbook', 'safeFileStem']) {
  if (!content['server/report.js'].includes(expected)) throw new Error(`report.js is missing ${expected}`);
}

for (const expected of ["app.get('/api/reports/:sessionId/:stage'", 'buildReportWorkbook']) {
  if (!content['server/app.js'].includes(expected)) throw new Error(`Report API is missing ${expected}`);
}

for (const expected of ['TERMINAL_TASK_STATUSES', 'isTerminalTask', 'BATCH_SUBMISSION_UNKNOWN']) {
  if (!content['server/import-service.js'].includes(expected)) throw new Error(`import-service.js is missing ${expected}`);
}

for (const expected of ["'file'", "'erc'", 'byFileName', 'byErc']) {
  if (!content['server/image-resolver.js'].includes(expected)) throw new Error(`image-resolver.js is missing ${expected}`);
}

for (const expected of ['react', 'react-dom', 'lucide-react']) {
  if (!content['package.json'].includes(`"${expected}"`)) throw new Error(`React UI dependency is missing ${expected}`);
}

for (const expected of ['vite build', 'tsc --noEmit', 'concurrently']) {
  if (!content['package.json'].includes(expected)) throw new Error(`React UI script is missing ${expected}`);
}

for (const expected of ['WorkflowNav', 'ConnectStep', 'ConfigureStep', 'WorkbookStep', 'ValidationStep', 'ImportStep', 'handleDownloadReport']) {
  if (!content['ui/src/App.tsx'].includes(expected)) throw new Error(`React workflow is missing ${expected}`);
}

for (const expected of ["imageSourceType: 'site'", 'imageSourceId: String(config.siteId)', 'currentSiteScope', 'downloadReport']) {
  if (!content['ui/src/api.ts'].includes(expected)) throw new Error(`Current Site API contract is missing ${expected}`);
}

for (const expected of ['INSERT', 'UPSERT', 'ON_ERROR_FAIL', 'ON_ERROR_CONTINUE', 'Export import report']) {
  if (!content['ui/src/steps/ImportStep.tsx'].includes(expected)) throw new Error(`Import UI is missing ${expected}`);
}

if (!content['ui/src/steps/ValidationStep.tsx'].includes('disabled={!validation.canImport}')) {
  throw new Error('Validation UI must block Import navigation when errors remain');
}
if (!content['ui/src/steps/ValidationStep.tsx'].includes('Export validation report')) {
  throw new Error('Validation UI must expose the Excel report');
}

for (const expected of ['BATCH_SUBMISSION_UNKNOWN', 'submissionLocked']) {
  if (!content['ui/src/App.tsx'].includes(expected)) throw new Error(`React submission safety is missing ${expected}`);
}

if (!content['ui/src/steps/ImportStep.tsx'].includes('submissionLocked')) {
  throw new Error('Import UI must lock ambiguous Batch submissions');
}

for (const expected of ['workflow-mobile', 'mobile-stepper', 'prefers-reduced-motion', '--primary: #4caf4f']) {
  if (!content['ui/src/styles.scss'].includes(expected)) throw new Error(`Faithful Nexcent UI styles are missing ${expected}`);
}

if (content['ui/src/App.tsx'].includes('assetLibrary') || content['ui/src/api.ts'].includes('headless-asset-library')) {
  throw new Error('Demo React UI must remain Current Site only');
}

if (!content['server/app.js'].includes("app.post('/api/connect'")) throw new Error('Read-only Connect route is missing');
if (!content['server/app.js'].includes("app.post('/api/image-folders'")) throw new Error('Per-run image folder route is missing');
if (content['server/app.js'].includes('ensureArticleFolder')) throw new Error('Connect must not create an Article folder');
if (!content['server/liferay-client.js'].includes('IMAGE_SOURCE_FOLDER_MISMATCH')) throw new Error('Image folder ownership validation is missing');
if (content['server/liferay-client.js'].includes('/o/headless-asset-library/')) throw new Error('Demo release must not call Asset Library discovery');
if (!content['server/liferay-client.js'].includes('/sites/${encodePath(source.id)}/document-folders?flatten=true')) throw new Error('Current Site Documents and Media folder listing is missing');
if (!content['server/liferay-client.js'].includes('/structured-content-folders?flatten=true')) throw new Error('Flattened Web Content folder listing is missing');
if (!content['server/index.js'].includes('config.host')) throw new Error('Local host binding is missing');

console.log(`Validated ${files.length} Current Site importer files, friendly URL support, Excel reports, cleanup contracts, and the React migration workspace.`);
