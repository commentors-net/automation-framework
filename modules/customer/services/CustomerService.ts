import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../../framework-core/api-client/ApiClient';

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phone?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

/**
 * Service layer for the Customer API module.
 * Encapsulates all HTTP interactions with the customer microservice.
 */
export class CustomerService extends ApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async createCustomer(payload: CreateCustomerPayload): Promise<Customer> {
    return this.post<Customer>('/customers', payload);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.get<Customer>(`/customers/${id}`);
  }

  async listCustomers(): Promise<Customer[]> {
    return this.get<Customer[]>('/customers');
  }

  async updateCustomer(id: string, payload: Partial<CreateCustomerPayload>): Promise<Customer> {
    return this.patch<Customer>(`/customers/${id}`, payload);
  }

  async deleteCustomer(id: string): Promise<void> {
    return this.delete(`/customers/${id}`);
  }
}
