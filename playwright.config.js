// @ts-check
import { defineConfig, devices } from '@playwright/test';
import envConfig from './config/environment.js';

/**
 * Enterprise-grade Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for */
  timeout: envConfig.timeouts.testTimeout,
  expect: {
    timeout: 10000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI or configured retries */
  retries: process.env.CI ? 2 : 1,
  /* Limit workers to 2 to prevent session exhaustion on single-tenant backend */
  workers: process.env.CI ? 2 : 2,
  /* Reporters: List for console, HTML report generated for review */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  /* Shared settings for all projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('')` */
    baseURL: envConfig.baseURL,

    /* Headless mode */
    headless: envConfig.headless,

    /* Action and navigation timeouts */
    actionTimeout: envConfig.timeouts.actionTimeout,
    navigationTimeout: envConfig.timeouts.navigationTimeout,

    /* Capture artifacts on retry/failure */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Viewport settings */
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces */
  outputDir: 'test-results',
});
