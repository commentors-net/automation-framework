import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../../../framework-core/api-client/ApiClient';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  version: string;
  timestamp: string;
}

export interface ProcessDataPayload {
  customerId: string;
  data: Record<string, unknown>;
}

export interface ProcessDataResult {
  jobId: string;
  customerId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

/**
 * Service layer for the Core API module.
 * Encapsulates all HTTP interactions with the core microservice.
 */
export class CoreService extends ApiClient {
  constructor(request: APIRequestContext, baseUrl: string) {
    super(request, baseUrl);
  }

  async getHealth(): Promise<HealthStatus> {
    return this.get<HealthStatus>('/health');
  }

  async processData(payload: ProcessDataPayload): Promise<ProcessDataResult> {
    return this.post<ProcessDataResult>('/process', payload);
  }

  async getJobStatus(jobId: string): Promise<ProcessDataResult> {
    return this.get<ProcessDataResult>(`/jobs/${jobId}`);
  }
}
