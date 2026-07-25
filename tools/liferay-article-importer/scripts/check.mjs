import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'server/config.js', 'server/app.js', 'server/index.js', 'server/structure-analyzer.js', 'server/image-resolver.js',
  'server/liferay-client.js', 'server/session-store.js', 'server/workbook.js', 'server/validation.js',
  'server/import-service.js', 'public/index.html', 'public/app.js', 'public/styles.css', '.env.example', 'README.md'
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
  if (!content['server/config.js'].includes(expected)) {
    throw new Error(`config.js is missing ${expected}`);
  }
}

if (!content['server/config.js'].includes("IMAGE_SOURCE_TYPES = ['site']")) {
  throw new Error('Demo release must expose only the configured Current Site image source');
}

for (const expected of ['Content Items', 'Field Guide', 'Example', 'Metadata']) {
  if (!content['server/workbook.js'].includes(expected)) {
    throw new Error(`workbook.js is missing ${expected}`);
  }
}

for (const expected of ["'file'", "'erc'", 'byFileName', 'byErc']) {
  if (!content['server/image-resolver.js'].includes(expected)) {
    throw new Error(`image-resolver.js is missing ${expected}`);
  }
}

for (const expected of ['site-source-card', 'imageSourceTypeGroup', 'imageSourceSelect', 'imageFolderSelect', 'viewableBySelect']) {
  if (!content['public/index.html'].includes(expected)) {
    throw new Error(`UI is missing ${expected}`);
  }
}

for (const expected of ['data-step-target="1"', 'workbookDropzone', 'validationRows', 'progressFill']) {
  if (!content['public/index.html'].includes(expected)) {
    throw new Error(`Wizard UI is missing ${expected}`);
  }
}

for (const expected of ['--green-500', '.stepper', '.site-source-card', '.result-banner', 'prefers-reduced-motion']) {
  if (!content['public/styles.css'].includes(expected)) {
    throw new Error(`Nexcent UI styles are missing ${expected}`);
  }
}

if (!content['public/index.html'].includes('value="INSERT" checked')) {
  throw new Error('UI must default to INSERT');
}
if (content['public/index.html'].includes('localeSelect')) {
  throw new Error('Per-run locale selector must remain out of the current release');
}
if (!content['server/app.js'].includes("app.post('/api/connect'")) {
  throw new Error('Read-only Connect route is missing');
}
if (!content['server/app.js'].includes("app.post('/api/image-folders'")) {
  throw new Error('Per-run image folder route is missing');
}
if (content['server/app.js'].includes('ensureArticleFolder')) {
  throw new Error('Connect must not create an Article folder');
}
if (!content['server/liferay-client.js'].includes('IMAGE_SOURCE_FOLDER_MISMATCH')) {
  throw new Error('Image folder ownership validation is missing');
}
if (content['server/liferay-client.js'].includes('/o/headless-asset-library/')) {
  throw new Error('Demo release must not call Asset Library discovery');
}
if (!content['server/liferay-client.js'].includes('/sites/${encodePath(source.id)}/document-folders?flatten=true')) {
  throw new Error('Current Site Documents and Media folder listing is missing');
}
if (!content['server/liferay-client.js'].includes('/structured-content-folders?flatten=true')) {
  throw new Error('Flattened Web Content folder listing is missing');
}
if (!content['server/import-service.js'].includes('BATCH_SUBMISSION_UNKNOWN')) {
  throw new Error('Ambiguous Batch submission lock is missing');
}
if (!content['server/index.js'].includes('config.host')) {
  throw new Error('Local host binding is missing');
}

console.log(`Validated ${files.length} Current Site importer files.`);
