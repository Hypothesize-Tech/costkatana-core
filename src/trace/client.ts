/**
 * Client for interacting with Cost Katana Trace API
 */

import {
  StartSpanInput,
  EndSpanInput,
  RecordMessageInput,
  SessionGraph,
  SessionDetails,
  TraceService
} from './types';

export interface TraceClientConfig {
  /**
   * Cost Katana API endpoint
   */
  apiUrl?: string;
  
  /**
   * API key for authentication
   */
  apiKey: string;
  
  /**
   * Project ID
   */
  projectId: string;
  
  /**
   * Custom headers to include in requests
   */
  headers?: Record<string, string>;
  
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Client for sending trace data to Cost Katana
 * 
 * @example
 * ```typescript
 * import { TraceClient } from 'ai-cost-tracker/trace';
 * 
 * const traceClient = new TraceClient({
 *   apiKey: process.env.COST_KATANA_API_KEY,
 *   projectId: process.env.PROJECT_ID
 * });
 * 
 * // Start a span
 * const { traceId } = await traceClient.startSpan({
 *   name: 'process-request',
 *   type: 'http'
 * });
 * 
 * // End the span
 * await traceClient.endSpan(traceId, {
 *   status: 'ok',
 *   metadata: { duration: 150 }
 * });
 * ```
 */
export class TraceClient implements TraceService {
  private config: Required<TraceClientConfig>;
  
  constructor(config: TraceClientConfig) {
    this.config = {
      apiUrl: config.apiUrl || 'https://cost-katana-backend.store',
      apiKey: config.apiKey,
      projectId: config.projectId,
      headers: config.headers || {},
      timeout: config.timeout || 30000
    };
    
    if (!this.config.apiKey) {
      throw new Error('API key is required for TraceClient');
    }
    
    if (!this.config.projectId) {
      throw new Error('Project ID is required for TraceClient');
    }
  }
  
  private async request(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(`${this.config.apiUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Project-ID': this.config.projectId,
          ...this.config.headers
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Trace API error: ${error.message || response.statusText}`);
      }
      
      return response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Trace API request timeout');
      }
      
      throw error;
    }
  }
  
  async startSpan(input: StartSpanInput): Promise<{ traceId: string; sessionId: string }> {
    try {
      const response = await this.request('POST', '/v1/traces/start', input);
      return {
        traceId: response.traceId,
        sessionId: response.sessionId
      };
    } catch (error) {
      console.error('Failed to start trace span:', error);
      // Return mock IDs to prevent breaking the application
      return {
        traceId: `mock-${Date.now()}-${Math.random()}`,
        sessionId: input.sessionId || `mock-session-${Date.now()}`
      };
    }
  }
  
  async endSpan(traceId: string, input: EndSpanInput): Promise<void> {
    try {
      await this.request('POST', `/v1/traces/${traceId}/end`, input);
    } catch (error) {
      console.error('Failed to end trace span:', error);
      // Fail silently to prevent breaking the application
    }
  }
  
  async recordMessage(input: RecordMessageInput): Promise<void> {
    try {
      await this.request('POST', '/v1/traces/messages', input);
    } catch (error) {
      console.error('Failed to record message:', error);
      // Fail silently
    }
  }
  
  async getSessionGraph(sessionId: string): Promise<SessionGraph> {
    const response = await this.request('GET', `/v1/sessions/${sessionId}/graph`);
    return response;
  }
  
  async getSessionDetails(sessionId: string): Promise<SessionDetails> {
    const response = await this.request('GET', `/v1/sessions/${sessionId}/details`);
    return response;
  }
  
  /**
   * List sessions with optional filters
   */
  async listSessions(params?: {
    userId?: string;
    label?: string;
    from?: Date;
    to?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    sessions: SessionDetails[];
    total: number;
    page: number;
    pages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.label) queryParams.append('label', params.label);
      if (params.from) queryParams.append('from', params.from.toISOString());
      if (params.to) queryParams.append('to', params.to.toISOString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
    }
    
    const response = await this.request('GET', `/v1/sessions?${queryParams}`);
    return response;
  }
  
  /**
   * Get session summary statistics
   */
  async getSessionsSummary(params?: {
    from?: Date;
    to?: Date;
  }): Promise<{
    totalSessions: number;
    activeSessions: number;
    totalCost: number;
    avgDuration: number;
    errorRate: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.from) queryParams.append('from', params.from.toISOString());
      if (params.to) queryParams.append('to', params.to.toISOString());
    }
    
    const response = await this.request('GET', `/v1/sessions/summary?${queryParams}`);
    return response;
  }
  
  /**
   * Batch ingest multiple trace spans
   */
  async ingestBatch(spans: Array<StartSpanInput & EndSpanInput & { traceId: string }>): Promise<void> {
    try {
      await this.request('POST', '/v1/traces/ingest', { spans });
    } catch (error) {
      console.error('Failed to ingest trace batch:', error);
    }
  }
}
