import { test, expect } from '../../../framework-core/fixtures/index';
import { DataGenerator } from '../../../framework-core/utils/DataGenerator';

/**
 * Core API tests – @module:core
 *
 * Validates the core microservice health and data-processing contracts.
 */
test.describe('Core API – health and processing @module:core', () => {
  test('returns healthy status @smoke', async ({ coreService, logger }) => {
    logger.info('Checking core service health');
    const health = await coreService.getHealth();

    expect(health.status).toBe('ok');
    expect(health.version).toBeTruthy();
    expect(health.timestamp).toBeTruthy();

    logger.info(`Core service healthy – version: ${health.version}`);
  });

  test('enqueues a data-processing job @module:core', async ({ coreService, logger }) => {
    const payload = {
      customerId: DataGenerator.uuid(),
      data: { action: 'sync', source: 'test' },
    };

    logger.info(`Submitting processing job for customer: ${payload.customerId}`);
    const result = await coreService.processData(payload);

    expect(result.jobId).toBeTruthy();
    expect(result.customerId).toBe(payload.customerId);
    expect(['queued', 'processing', 'completed']).toContain(result.status);

    logger.info(`Job created: ${result.jobId} with status: ${result.status}`);
  });

  test('retrieves job status by id @module:core', async ({ coreService, logger }) => {
    const payload = {
      customerId: DataGenerator.uuid(),
      data: { action: 'verify' },
    };

    const job = await coreService.processData(payload);
    logger.info(`Polling status for job: ${job.jobId}`);

    const status = await coreService.getJobStatus(job.jobId);

    expect(status.jobId).toBe(job.jobId);
    expect(status.customerId).toBe(payload.customerId);
  });
});
