import { test, expect } from '../../../framework-core/fixtures/index';
import { DataGenerator } from '../../../framework-core/utils/DataGenerator';

/**
 * Customer API tests – @module:customer
 *
 * These tests validate the customer microservice API contracts.
 * Test data is generated dynamically; no hard-coded values are used.
 */
test.describe('Customer API – createCustomer @module:customer', () => {
  test('creates a new customer with valid payload @smoke', async ({ customerService, logger }) => {
    const payload = {
      name: DataGenerator.fullName(),
      email: DataGenerator.email(),
      phone: DataGenerator.phoneNumber(),
    };

    logger.info(`Creating customer: ${payload.email}`);
    const customer = await customerService.createCustomer(payload);

    expect(customer.id).toBeTruthy();
    expect(customer.name).toBe(payload.name);
    expect(customer.email).toBe(payload.email);
    expect(customer.createdAt).toBeTruthy();

    logger.info(`Customer created successfully with id: ${customer.id}`);
  });

  test('retrieves an existing customer by id @module:customer', async ({ customerService, logger }) => {
    const payload = {
      name: DataGenerator.fullName(),
      email: DataGenerator.email(),
    };

    const created = await customerService.createCustomer(payload);
    logger.info(`Fetching customer id: ${created.id}`);

    const fetched = await customerService.getCustomer(created.id);

    expect(fetched.id).toBe(created.id);
    expect(fetched.email).toBe(payload.email);
  });

  test('lists all customers @module:customer', async ({ customerService, logger }) => {
    logger.info('Listing all customers');
    const customers = await customerService.listCustomers();

    expect(Array.isArray(customers)).toBe(true);
  });

  test('updates a customer @module:customer', async ({ customerService, logger }) => {
    const created = await customerService.createCustomer({
      name: DataGenerator.fullName(),
      email: DataGenerator.email(),
    });

    const newName = DataGenerator.fullName();
    logger.info(`Updating customer ${created.id} name to: ${newName}`);
    const updated = await customerService.updateCustomer(created.id, { name: newName });

    expect(updated.name).toBe(newName);
    expect(updated.id).toBe(created.id);
  });

  test('deletes a customer @module:customer', async ({ customerService, logger }) => {
    const created = await customerService.createCustomer({
      name: DataGenerator.fullName(),
      email: DataGenerator.email(),
    });

    logger.info(`Deleting customer: ${created.id}`);
    await customerService.deleteCustomer(created.id);
    logger.info('Customer deleted successfully');
  });
});
