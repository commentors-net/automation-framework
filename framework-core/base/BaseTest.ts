import { test as base, APIRequestContext, Browser, BrowserContext, Page } from '@playwright/test';
import { environmentConfig } from '../config/EnvironmentConfig';
import { Logger } from '../utils/Logger';

/**
 * Extended test options available via fixture injection.
 */
export interface BaseTestOptions {
  logger: Logger;
  apiBaseUrl: string;
}

/**
 * Base test that extends Playwright's built-in test with shared
 * framework fixtures. All project-level tests should extend this.
 */
export const baseTest = base.extend<BaseTestOptions>({
  // eslint-disable-next-line no-empty-pattern
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    await use(logger);
    logger.flush();
  },

  // eslint-disable-next-line no-empty-pattern
  apiBaseUrl: async ({}, use) => {
    await use(environmentConfig.urls.customerApiBaseUrl);
  },
});

export { base, APIRequestContext, Browser, BrowserContext, Page };
