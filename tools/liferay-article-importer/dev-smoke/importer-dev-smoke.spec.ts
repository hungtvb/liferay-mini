import {expect, test} from '@playwright/test';

test('Vite dev UI renders mobile icons with one React runtime and a valid favicon', async ({page}) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.setViewportSize({width: 375, height: 812});
  await page.route('**/api/config', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      baseUrl: 'http://localhost:8080',
      connected: false,
      defaultLocale: 'en-US',
      defaultViewableBy: 'Anyone',
      host: '127.0.0.1',
      imageSourceTypes: ['site'],
      maxImportRows: 5000,
      maxUploadMb: 50,
      pollIntervalMs: 1500,
      pollTimeoutMs: 600000,
      siteId: 34371,
      viewableByOptions: ['Anyone', 'Members', 'Owner']
    })
  }));

  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', {name: 'Connect to Liferay'})).toBeVisible();
  await expect(page.getByRole('navigation', {name: 'Workflow progress'})).toBeVisible();

  const favicon = await page.request.get('/favicon.svg');
  expect(favicon.ok()).toBe(true);
  expect(favicon.headers()['content-type']).toContain('image/svg+xml');

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
