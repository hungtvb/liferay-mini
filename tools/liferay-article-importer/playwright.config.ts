import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './evidence-tests',
  outputDir: './test-results/importer-evidence',
  timeout: 45_000,
  fullyParallel: false,
  reporter: [['line']],
  use: {
    baseURL: 'http://127.0.0.1:4175',
    colorScheme: 'light',
    locale: 'en-US',
    reducedMotion: 'reduce',
    screenshot: 'off',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
