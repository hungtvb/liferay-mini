import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  'server/config.js', 'server/app.js', 'server/structure-analyzer.js', 'server/image-resolver.js',
  'server/workbook.js', 'server/validation.js', 'server/import-service.js', 'public/index.html', 'public/app.js',
  '.env.example', 'README.md'
];
const content = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(path.join(root, file), 'utf8')])));

for (const [file, text] of Object.entries(content)) {
  if (/LIFERAY_ARTICLE_STRUCTURE|LIFERAY_ARTICLE_FOLDER/.test(text)) {
    throw new Error(`${file} still depends on Article-specific ENV configuration`);
  }
}
for (const expected of ['LIFERAY_IMAGE_SOURCE_TYPE', 'LIFERAY_IMAGE_SOURCE_ID', 'LIFERAY_CONTENT_VIEWABLE_BY']) {
  if (!content['server/config.js'].includes(expected)) throw new Error(`config.js is missing ${expected}`);
}
for (const expected of ['Content Items', 'Field Guide', 'Example', 'Metadata']) {
  if (!content['server/workbook.js'].includes(expected)) throw new Error(`workbook.js is missing ${expected}`);
}
for (const expected of ["'file'", "'erc'", 'byFileName', 'byErc']) {
  if (!content['server/image-resolver.js'].includes(expected)) throw new Error(`image-resolver.js is missing ${expected}`);
}
if (!content['public/index.html'].includes('value="INSERT" checked')) throw new Error('UI must default to INSERT');
if (!content['server/app.js'].includes("app.post('/api/connect'")) throw new Error('Read-only Connect route is missing');
if (content['server/app.js'].includes('ensureArticleFolder')) throw new Error('Connect must not create an Article folder');
console.log(`Validated ${files.length} generic importer files.`);
