import { defineConfig} from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  
  retries: 0,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list']],
  timeout: 30000,
  
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    // baseURL: process.env.BASE_URL || 'https://with-bugs.practicesoftwaretesting.com/',
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },

});
