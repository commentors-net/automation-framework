import { test, expect } from '../framework-core/fixtures/index';
import { LoginPage } from '../apps/customer-front/pages/LoginPage';
import { DashboardPage } from '../apps/customer-front/pages/DashboardPage';
import { DataGenerator } from '../framework-core/utils/DataGenerator';
import { environmentConfig } from '../framework-core/config/EnvironmentConfig';

/**
 * Cross-module integration test – @integration
 *
 * Validates a full end-to-end flow:
 * 1. Create a customer via the Customer API
 * 2. Submit a processing job via the Core API
 * 3. Login via the Customer Front UI
 * 4. Verify the customer appears in the dashboard
 *
 * This test depends on all modules being available and healthy.
 */
test.describe('Integration – customer lifecycle @integration @smoke', () => {
  test('creates customer via API, processes data, and verifies via UI', async ({
    page,
    customerService,
    coreService,
    logger,
  }) => {
    // Step 1 – Create customer via Customer API
    const customerPayload = {
      name: DataGenerator.fullName(),
      email: DataGenerator.email(),
      phone: DataGenerator.phoneNumber(),
    };

    logger.info(`[Integration] Creating customer: ${customerPayload.email}`);
    const customer = await customerService.createCustomer(customerPayload);

    expect(customer.id).toBeTruthy();
    logger.info(`[Integration] Customer created: ${customer.id}`);

    // Step 2 – Submit processing job via Core API
    const jobPayload = {
      customerId: customer.id,
      data: { action: 'onboard', source: 'integration-test' },
    };

    logger.info(`[Integration] Submitting processing job for customer: ${customer.id}`);
    const job = await coreService.processData(jobPayload);

    expect(job.jobId).toBeTruthy();
    expect(job.customerId).toBe(customer.id);
    logger.info(`[Integration] Job submitted: ${job.jobId}`);

    // Step 3 – Login via Customer Front UI
    const baseUrl = environmentConfig.urls.customerFrontBaseUrl;
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    logger.info('[Integration] Navigating to login page');
    await loginPage.goto(baseUrl);
    await loginPage.login('admin@example.com', 'password123');

    await expect(page).toHaveURL(/dashboard/);
    logger.info('[Integration] Logged in successfully');

    // Step 4 – Verify customer in dashboard UI
    logger.info(`[Integration] Searching for customer: ${customer.name}`);
    await dashboardPage.searchCustomer(customer.name);

    await expect(page.getByText(customer.name)).toBeVisible();
    logger.info('[Integration] Customer verified in dashboard');
  });

  test('verifies core service health before integration flow @integration', async ({
    coreService,
    logger,
  }) => {
    logger.info('[Integration] Checking core service health');
    const health = await coreService.getHealth();

    expect(health.status).toBe('ok');
    logger.info(`[Integration] Core service healthy: v${health.version}`);
  });
});
