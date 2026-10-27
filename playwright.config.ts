import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Overall test timeout: 25s accommodates multi-step SPA workflows and remote demo latency
  timeout: 25000,

  // Assertion timeout: 7s gives Angular async UI updates enough time without masking failures
  expect: {
    timeout: 7000
  },

  // Retries: retry once in CI to absorb intermittent network drops against the shared demo API
  retries: process.env.CI ? 1 : 0,

  // Concurrency: run single worker on CI to prevent Cloudflare rate-limiting and challenge interstitials
  workers: process.env.CI ? 1 : undefined,

  // Reporters: include 'github' reporter in CI for inline annotations on PRs and job summaries
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',

    // Matches Toolshop Angular component test attributes: data-test="..."
    testIdAttribute: 'data-test',

    // In CI, Google Chrome is installed and run under xvfb to pass Cloudflare verification
    channel: process.env.BROWSER_CHANNEL || (process.env.CI ? 'chrome' : undefined),
    headless: process.env.CI ? false : true,

    // Specific action and navigation timeouts prevent an individual stuck step from hanging the whole test
    actionTimeout: 10000,
    navigationTimeout: 15000,

    launchOptions: {
      // Allows live visual debugging when SLOWMO=<ms> is passed in terminal
      slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    },

    // Capture artifacts only on test failures to keep CI artifact sizes light and focused
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  }
});

