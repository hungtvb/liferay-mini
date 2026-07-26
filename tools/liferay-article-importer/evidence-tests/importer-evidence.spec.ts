import {expect, test, type Page, type Route} from '@playwright/test';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const evidenceRoot = path.resolve('evidence');
const viewports = [
  {name: 'desktop-1440', width: 1440, height: 1100},
  {name: 'tablet-768', width: 768, height: 1024},
  {name: 'mobile-375', width: 375, height: 812}
] as const;

const config = {
  baseUrl: 'https://dev-portal.internal.corp', connected: false, defaultLocale: 'en-US',
  defaultViewableBy: 'Anyone', host: '127.0.0.1', imageSourceTypes: ['site'],
  maxImportRows: 5000, maxUploadMb: 50, pollIntervalMs: 30, pollTimeoutMs: 5000,
  siteId: 20125, viewableByOptions: ['Anyone', 'Members', 'Owner']
};

const connection = {
  site: {id: 20125, name: 'Nexcent Public Website'},
  structures: [
    {id: 34818, name: 'NXC Articles', status: 'SUPPORTED', externalReferenceCode: 'NXC_ARTICLE'},
    {id: 34819, name: 'NXC Hero', status: 'SUPPORTED', externalReferenceCode: 'NXC_HERO'}
  ],
  folders: [
    {id: 34762, name: 'Test Articles', path: 'Test Articles', siteId: 20125},
    {id: 34763, name: 'Campaigns', path: 'Marketing / Campaigns', siteId: 20125},
    {id: 34764, name: 'Product Updates', path: 'News / Product Updates', siteId: 20125}
  ],
  imageSources: [{id: 20125, type: 'site', name: 'Current Site'}]
};

const imageFolders = {
  source: {id: 20125, type: 'site', name: 'Current Site'},
  folders: [
    {id: 34827, name: 'Article Covers', path: 'Article Covers', siteId: 20125},
    {id: 34828, name: 'Hero Images', path: 'Marketing / Hero Images', siteId: 20125}
  ]
};

const analysis = {
  status: 'SUPPORTED',
  supportedFields: [
    {label: 'Body', fieldReference: 'body', valueKind: 'richText'},
    {label: 'Cover image', fieldReference: 'coverImage', valueKind: 'image'}
  ],
  excludedFields: [], blockingFields: []
};

const previewRows = Array.from({length: 12}, (_, index) => ({
  row: index + 2,
  externalReferenceCode: `NXC_ARTICLE_${String(index + 1).padStart(4, '0')}`,
  title: `Nexcent Article ${String(index + 1).padStart(3, '0')}`,
  status: 'VALID',
  imageReference: `file:nxc-article-cover-${String((index % 50) + 1).padStart(3, '0')}.webp`
}));

const validationPayload = {
  fileName: 'nxc-articles-import-500rows-random-covers.xlsx', rowCount: 500,
  sessionId: 'evidence-session-001', structure: connection.structures[0],
  folder: connection.folders[0], imageSource: {...imageFolders.source, folderId: 34827},
  viewableBy: 'Anyone',
  validation: {
    canImport: true,
    stats: {totalRows: 500, validRows: 500, invalidRows: 0},
    errors: [], warnings: [], rowResultsPreview: previewRows,
    payloadPreview: [{
      externalReferenceCode: 'NXC_ARTICLE_0001', title: 'Nexcent Article 001',
      contentStructureId: 34818, structuredContentFolderId: 34762, viewableBy: 'Anyone',
      contentFields: [
        {fieldReference: 'body', contentFieldValue: {data: '<p>Evidence article body</p>'}},
        {fieldReference: 'coverImage', contentFieldValue: {image: {id: 34831, title: 'nxc-article-cover-001.webp'}}}
      ]
    }],
    imageSummary: {distinctReferenceCount: 50}, ercCollisions: []
  }
};

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({status, contentType: 'application/json', body: JSON.stringify(body)});
}

async function mockImporterApi(page: Page) {
  let pollCount = 0;
  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;

    if (pathname === '/api/config' && request.method() === 'GET') return json(route, config);
    if (pathname === '/api/connect' && request.method() === 'POST') return json(route, connection);
    if (pathname === '/api/image-folders' && request.method() === 'POST') return json(route, imageFolders);
    if (pathname === '/api/structures/34818' && request.method() === 'GET') return json(route, {analysis});
    if (pathname === '/api/templates' && request.method() === 'POST') {
      return route.fulfill({
        status: 200,
        headers: {
          'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'content-disposition': 'attachment; filename="nxc-articles-import-template.xlsx"'
        },
        body: Buffer.from('mock-xlsx-template')
      });
    }
    if (pathname === '/api/workbooks' && request.method() === 'POST') return json(route, validationPayload, 201);
    if (pathname === '/api/imports' && request.method() === 'POST') {
      pollCount = 0;
      return json(route, {id: 84592, executeStatus: 'STARTED', processedItemsCount: 0, failedItemsCount: 0, totalItemsCount: 500}, 202);
    }
    if (pathname === '/api/imports/84592' && request.method() === 'GET') {
      pollCount += 1;
      const complete = pollCount >= 2;
      return json(route, {
        id: 84592, executeStatus: complete ? 'COMPLETED' : 'STARTED',
        processedItemsCount: complete ? 500 : 275, failedItemsCount: 0, totalItemsCount: 500
      });
    }
    return json(route, {error: {code: 'MOCK_ROUTE_MISSING', message: `${request.method()} ${pathname} is not mocked`}}, 404);
  });
}

async function capture(page: Page, viewportName: string, fileName: string) {
  await page.screenshot({path: path.join(evidenceRoot, viewportName, fileName), fullPage: true, animations: 'disabled'});
}

test.beforeAll(async () => {
  await mkdir(evidenceRoot, {recursive: true});
  await writeFile(path.join(evidenceRoot, 'manifest.json'), JSON.stringify({
    generatedBy: 'Playwright against the production React importer bundle',
    apiMode: 'deterministic browser-layer API mocks', viewports,
    screens: ['01-connect.png', '02-configure.png', '03-workbook.png', '04-validation.png', '05-import-confirm.png', '06-import-completed.png']
  }, null, 2));
});

for (const viewport of viewports) {
  test(`${viewport.name} importer journey evidence`, async ({page}) => {
    await page.setViewportSize({width: viewport.width, height: viewport.height});
    await mockImporterApi(page);
    await page.goto('/');

    await expect(page.getByRole('heading', {name: 'Connect to Liferay'})).toBeVisible();
    await capture(page, viewport.name, '01-connect.png');

    await page.getByRole('button', {name: 'Connect to Liferay'}).click();
    await expect(page.getByRole('heading', {name: 'Configure import'})).toBeVisible();
    await page.locator('#structureSelect').selectOption('34818');
    await expect(page.getByText('SUPPORTED · 2 importable fields')).toBeVisible();
    await page.locator('#targetFolderSelect').selectOption('34762');
    await page.locator('#imageFolderSelect').selectOption('34827');
    await capture(page, viewport.name, '02-configure.png');

    await page.getByRole('button', {name: 'Continue to workbook'}).click();
    await expect(page.getByRole('heading', {name: 'Prepare workbook'})).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'nxc-articles-import-500rows-random-covers.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('mock-workbook')
    });
    await expect(page.getByText('nxc-articles-import-500rows-random-covers.xlsx')).toBeVisible();
    await capture(page, viewport.name, '03-workbook.png');

    await page.getByRole('button', {name: 'Validate workbook'}).click();
    await expect(page.getByRole('heading', {name: 'Review validation'})).toBeVisible();
    await expect(page.getByRole('status').getByText('Validation passed', {exact: true})).toBeVisible();
    await capture(page, viewport.name, '04-validation.png');

    await page.getByRole('button', {name: 'Continue to import'}).click();
    await expect(page.getByRole('heading', {name: 'Confirm import'})).toBeVisible();
    await capture(page, viewport.name, '05-import-confirm.png');

    await page.getByRole('button', {name: 'Start import of 500 items'}).click();
    await expect(page.getByRole('heading', {name: 'Import completed'})).toBeVisible();
    await expect(page.getByText('500 of 500 items processed successfully.', {exact: true})).toBeVisible();
    await capture(page, viewport.name, '06-import-completed.png');
  });
}
