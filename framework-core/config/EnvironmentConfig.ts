/**
 * Supported deployment environments.
 */
export type Environment = 'local' | 'dev' | 'staging' | 'production';

/**
 * Per-environment URL configuration.
 */
export interface EnvironmentUrls {
  coreApiBaseUrl: string;
  customerApiBaseUrl: string;
  customerFrontBaseUrl: string;
  adminFrontBaseUrl: string;
}

const ENVIRONMENT_URLS: Record<Environment, EnvironmentUrls> = {
  local: {
    coreApiBaseUrl: 'http://localhost:3000',
    customerApiBaseUrl: 'http://localhost:3001',
    customerFrontBaseUrl: 'http://localhost:4200',
    adminFrontBaseUrl: 'http://localhost:4201',
  },
  dev: {
    coreApiBaseUrl: 'https://core-api.dev.example.com',
    customerApiBaseUrl: 'https://customer-api.dev.example.com',
    customerFrontBaseUrl: 'https://customer.dev.example.com',
    adminFrontBaseUrl: 'https://admin.dev.example.com',
  },
  staging: {
    coreApiBaseUrl: 'https://core-api.staging.example.com',
    customerApiBaseUrl: 'https://customer-api.staging.example.com',
    customerFrontBaseUrl: 'https://customer.staging.example.com',
    adminFrontBaseUrl: 'https://admin.staging.example.com',
  },
  production: {
    coreApiBaseUrl: 'https://core-api.example.com',
    customerApiBaseUrl: 'https://customer-api.example.com',
    customerFrontBaseUrl: 'https://customer.example.com',
    adminFrontBaseUrl: 'https://admin.example.com',
  },
};

/**
 * Resolves environment configuration from the ENV environment variable.
 * Falls back to 'local' when the variable is absent or unrecognised.
 */
export class EnvironmentConfig {
  private readonly env: Environment;

  constructor() {
    const raw = process.env.ENV ?? 'local';
    this.env = this.isEnvironment(raw) ? raw : 'local';
  }

  get urls(): EnvironmentUrls {
    return ENVIRONMENT_URLS[this.env];
  }

  get currentEnvironment(): Environment {
    return this.env;
  }

  private isEnvironment(value: string): value is Environment {
    return ['local', 'dev', 'staging', 'production'].includes(value);
  }
}

export const environmentConfig = new EnvironmentConfig();
