import { defineConfig, devices } from '@playwright/test';
import { environmentConfig } from './framework-core/config/EnvironmentConfig';

/**
 * Playwright multi-project configuration.
 *
 * Projects:
 *   customer-api   – Customer module API tests
 *   core-api       – Core module API tests
 *   customer-ui    – Customer Front UI tests (Chromium)
 *   admin-ui       – Admin Front UI tests (Chromium)
 *   integration    – Cross-module E2E tests (Chromium)
 *
 * Run a single project:
 *   npx playwright test --project=customer-api
 *
 * Run by tag:
 *   npx playwright test --grep "@smoke"
 *   npx playwright test --grep "@module:customer"
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'customer-api',
      testDir: './modules/customer/api-tests',
      use: {
        baseURL: environmentConfig.urls.customerApiBaseUrl,
      },
    },
    {
      name: 'core-api',
      testDir: './modules/core/api-tests',
      use: {
        baseURL: environmentConfig.urls.coreApiBaseUrl,
      },
    },
    {
      name: 'customer-ui',
      testDir: './apps/customer-front/ui-tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: environmentConfig.urls.customerFrontBaseUrl,
      },
    },
    {
      name: 'admin-ui',
      testDir: './apps/admin-front/ui-tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: environmentConfig.urls.adminFrontBaseUrl,
      },
    },
    {
      name: 'integration',
      testDir: './integration',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: environmentConfig.urls.customerFrontBaseUrl,
      },
    },
  ],
});
