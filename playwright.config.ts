import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    browserName: 'chromium',
    headless: true,
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  }
});
