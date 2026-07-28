import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './dev-smoke',
  outputDir: './test-results/importer-dev-smoke',
  timeout: 30_000,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    colorScheme: 'light',
    locale: 'en-US',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev:ui',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
    timeout: 120_000
  }
});
