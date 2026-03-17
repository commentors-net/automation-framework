import { APIRequestContext } from '@playwright/test';
import { baseTest, BaseTestOptions } from '../base/BaseTest';
import { CustomerService } from '../../modules/customer/services/CustomerService';
import { CoreService } from '../../modules/core/services/CoreService';
import { environmentConfig } from '../config/EnvironmentConfig';

/**
 * Shared fixtures injected into all test files.
 * Tests can destructure `customerService` or `coreService` directly.
 */
export interface SharedFixtures extends BaseTestOptions {
  customerService: CustomerService;
  coreService: CoreService;
}

export const test = baseTest.extend<SharedFixtures>({
  customerService: async ({ request }: { request: APIRequestContext }, use: (fixture: CustomerService) => Promise<void>) => {
    const service = new CustomerService(request, environmentConfig.urls.customerApiBaseUrl);
    await use(service);
  },

  coreService: async ({ request }: { request: APIRequestContext }, use: (fixture: CoreService) => Promise<void>) => {
    const service = new CoreService(request, environmentConfig.urls.coreApiBaseUrl);
    await use(service);
  },
});

export { expect } from '@playwright/test';
