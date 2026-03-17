import { APIRequestContext } from '@playwright/test';

/**
 * Base API client that wraps Playwright's APIRequestContext.
 * Provides consistent request handling, base URL resolution,
 * and error reporting across all modules.
 */
export class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseUrl: string,
  ) {}

  async get<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.request.get(url);
    await this.assertOk(response, 'GET', url);
    return response.json() as Promise<T>;
  }

  async post<T = unknown>(path: string, data: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await this.request.post(url, { data });
    await this.assertOk(response, 'POST', url);
    return response.json() as Promise<T>;
  }

  async put<T = unknown>(path: string, data: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await this.request.put(url, { data });
    await this.assertOk(response, 'PUT', url);
    return response.json() as Promise<T>;
  }

  async patch<T = unknown>(path: string, data: unknown): Promise<T> {
    const url = this.buildUrl(path);
    const response = await this.request.patch(url, { data });
    await this.assertOk(response, 'PATCH', url);
    return response.json() as Promise<T>;
  }

  async delete(path: string): Promise<void> {
    const url = this.buildUrl(path);
    const response = await this.request.delete(url);
    await this.assertOk(response, 'DELETE', url);
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    }
    return url.toString();
  }

  private async assertOk(
    response: Awaited<ReturnType<APIRequestContext['get']>>,
    method: string,
    url: string,
  ): Promise<void> {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `[ApiClient] ${method} ${url} failed with status ${response.status()}: ${body}`,
      );
    }
  }
}
