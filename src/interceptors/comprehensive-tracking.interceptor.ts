/**
 * Comprehensive Request/Response Tracking Interceptor for Cost Katana SDK
 * 
 * Captures complete client-side networking data, performance metrics,
 * and request/response details for advanced usage optimization
 */

import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { performance } from 'perf_hooks';

export interface ClientSideRequestData {
  // Client Environment
  clientEnvironment: {
    platform: string; // Node.js version, browser, etc.
    userAgent?: string;
    sdkVersion: string;
    hostname?: string;
  };
  
  // Network Details  
  networking: {
    localIP?: string;
    remoteIP: string;
    port: number;
    protocol: 'http' | 'https';
    dnsResolutionTime?: number;
    connectionTime?: number;
    tlsHandshakeTime?: number;
  };
  
  // Request Metadata
  request: {
    method: string;
    url: string;
    path: string;
    headers: Record<string, string>;
    body: any;
    size: number;
    timestamp: Date;
  };
  
  // Response Metadata  
  response?: {
    statusCode: number;
    headers: Record<string, string>;
    body: any;
    size: number;
    timestamp: Date;
  };
  
  // Performance Metrics
  performance: {
    totalTime: number;
    dnsTime?: number;
    connectTime?: number;
    uploadTime?: number;
    downloadTime?: number;
    redirectTime?: number;
  };
  
  // SDK Context
  context: {
    sessionId: string;
    requestId: string;
    projectId?: string;
    userId?: string;
    provider?: string;
    model?: string;
  };
}

export interface NetworkMonitoringSession {
  sessionId: string;
  startTime: number;
  performanceEntry?: PerformanceEntry;
  
  end(): Promise<ClientSideRequestData>;
}

export class NetworkMonitor {
  private sessions = new Map<string, NetworkMonitoringSession>();
  
  startSession(): NetworkMonitoringSession {
    const sessionId = uuidv4();
    const startTime = performance.now();
    
    const session: NetworkMonitoringSession = {
      sessionId,
      startTime,
      end: async () => {
        const endTime = performance.now();
        const totalTime = endTime - startTime;
        
        // Get client environment info
        const clientEnvironment = this.getClientEnvironment();
        
        // Create comprehensive tracking data
        const trackingData: ClientSideRequestData = {
          clientEnvironment,
          networking: {
            remoteIP: '', // Will be populated by request interceptor
            port: 443, // Default HTTPS port
            protocol: 'https'
          },
          request: {
            method: '',
            url: '',
            path: '',
            headers: {},
            body: null,
            size: 0,
            timestamp: new Date(Date.now() - totalTime)
          },
          performance: {
            totalTime
          },
          context: {
            sessionId,
            requestId: uuidv4()
          }
        };
        
        this.sessions.delete(sessionId);
        return trackingData;
      }
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }
  
  private getClientEnvironment() {
    return {
      platform: this.getPlatformInfo(),
      sdkVersion: process.env.SDK_VERSION || '1.0.0',
      hostname: this.getHostname(),
      userAgent: this.getUserAgent()
    };
  }
  
  private getPlatformInfo(): string {
    if (typeof window !== 'undefined') {
      return `Browser ${navigator.userAgent}`;
    } else if (typeof process !== 'undefined') {
      return `Node.js ${process.version} on ${process.platform}`;
    }
    return 'Unknown';
  }
  
  private getHostname(): string | undefined {
    if (typeof window !== 'undefined') {
      return window.location.hostname;
    } else if (typeof process !== 'undefined') {
      try {
        return require('os').hostname();
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  }
  
  private getUserAgent(): string | undefined {
    if (typeof window !== 'undefined') {
      return navigator.userAgent;
    }
    return undefined;
  }
}

export class ComprehensiveTrackingInterceptor {
  private networkMonitor = new NetworkMonitor();
  private trackingData = new Map<string, ClientSideRequestData>();
  private onTrackingComplete?: (data: ClientSideRequestData) => Promise<void>;
  
  constructor(onTrackingComplete?: (data: ClientSideRequestData) => Promise<void>) {
    this.onTrackingComplete = onTrackingComplete;
  }
  
  /**
   * Install comprehensive tracking interceptors on an Axios instance
   */
  install(axiosInstance: AxiosInstance): void {
    // Request interceptor - capture outgoing request data
    axiosInstance.interceptors.request.use(
      async (config: any) => {
        const requestId = uuidv4();
        const startTime = performance.now();
        
        // Create tracking session
        const session = this.networkMonitor.startSession();
        
        // Capture request data
        const trackingData = await this.captureRequestData(config, requestId, startTime);
        
        // Store tracking data for response correlation
        this.trackingData.set(requestId, trackingData);
        
        // Add request ID to headers for correlation
        config.headers = config.headers || {};
        config.headers['X-CostKatana-Request-Id'] = requestId;
        config.headers['X-CostKatana-Session-Id'] = session.sessionId;
        
        logger.debug('Comprehensive tracking: Request captured', {
          requestId,
          url: config.url,
          method: config.method
        });
        
        return config;
      },
      (error) => {
        logger.error('Comprehensive tracking: Request interceptor error', error);
        return Promise.reject(error);
      }
    );
    
    // Response interceptor - capture incoming response data
    axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        const requestId = response.config.headers?.['X-CostKatana-Request-Id'] as string;
        
        if (requestId && this.trackingData.has(requestId)) {
          const trackingData = this.trackingData.get(requestId)!;
          
          // Capture response data
          await this.captureResponseData(response, trackingData);
          
          // Send comprehensive tracking data to backend
          if (this.onTrackingComplete) {
            try {
              await this.onTrackingComplete(trackingData);
            } catch (error) {
              logger.error('Comprehensive tracking: Failed to send tracking data', error as Error);
            }
          }
          
          // Clean up
          this.trackingData.delete(requestId);
          
          logger.debug('Comprehensive tracking: Response captured', {
            requestId,
            statusCode: response.status,
            totalTime: trackingData.performance.totalTime
          });
        }
        
        return response;
      },
      async (error) => {
        const requestId = error.config?.headers?.['X-CostKatana-Request-Id'] as string;
        
        if (requestId && this.trackingData.has(requestId)) {
          const trackingData = this.trackingData.get(requestId)!;
          
          // Capture error response data
          if (error.response) {
            await this.captureResponseData(error.response, trackingData);
          }
          
          // Mark as error
          trackingData.response = trackingData.response || {
            statusCode: error.response?.status || 0,
            headers: error.response?.headers || {},
            body: error.response?.data || error.message,
            size: this.calculateResponseSize(error.response?.data || error.message),
            timestamp: new Date()
          };
          
          // Send tracking data even for errors
          if (this.onTrackingComplete) {
            try {
              await this.onTrackingComplete(trackingData);
            } catch (trackingError) {
              logger.error('Comprehensive tracking: Failed to send error tracking data', trackingError as Error);
            }
          }
          
          // Clean up
          this.trackingData.delete(requestId);
        }
        
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Capture comprehensive request data
   */
  private async captureRequestData(
    config: AxiosRequestConfig,
    requestId: string,
    _startTime: number
  ): Promise<ClientSideRequestData> {
    const url = new URL(config.url!, config.baseURL);
    
    return {
      clientEnvironment: this.getClientEnvironment(),
      networking: {
        remoteIP: url.hostname,
        port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
        protocol: url.protocol.replace(':', '') as 'http' | 'https'
      },
      request: {
        method: config.method?.toUpperCase() || 'GET',
        url: url.toString(),
        path: url.pathname + url.search,
        headers: this.sanitizeHeaders(config.headers || {}),
        body: this.sanitizeRequestBody(config.data),
        size: this.calculateRequestSize(config.data),
        timestamp: new Date()
      },
      performance: {
        totalTime: 0 // Will be updated when response is received
      },
      context: {
        sessionId: config.headers?.['X-CostKatana-Session-Id'] as string || uuidv4(),
        requestId,
        projectId: process.env.PROJECT_ID,
        provider: this.extractProviderFromUrl(url.toString()),
        model: this.extractModelFromRequest(config.data)
      }
    };
  }
  
  /**
   * Capture comprehensive response data
   */
  private async captureResponseData(
    response: AxiosResponse,
    trackingData: ClientSideRequestData
  ): Promise<void> {
    // const _endTime = performance.now(); // Keep for future timing calculations
    const requestStartTime = trackingData.request.timestamp.getTime();
    const totalTime = Date.now() - requestStartTime;
    
    trackingData.response = {
      statusCode: response.status,
      headers: this.sanitizeHeaders(response.headers),
      body: this.sanitizeResponseBody(response.data),
      size: this.calculateResponseSize(response.data),
      timestamp: new Date()
    };
    
    trackingData.performance = {
      totalTime,
      // Additional performance metrics would be populated here
      // from browser Performance API or Node.js performance hooks
    };
    
    // Extract additional networking details from response headers
    this.extractNetworkingDetailsFromResponse(response, trackingData);
  }
  
  /**
   * Extract networking details from response headers
   */
  private extractNetworkingDetailsFromResponse(
    response: AxiosResponse,
    trackingData: ClientSideRequestData
  ): void {
    const headers = response.headers;
    
    // Server processing time
    if (headers['x-response-time']) {
      const serverTime = parseFloat(headers['x-response-time']);
      if (!isNaN(serverTime)) {
        // Calculate network time by subtracting server processing time
        trackingData.performance.downloadTime = trackingData.performance.totalTime - serverTime;
      }
    }
    
    // Connection info from headers
    if (headers['connection']) {
      // Store connection type info
    }
    
    // Server IP from headers (if provided)
    if (headers['x-server-ip']) {
      trackingData.networking.remoteIP = headers['x-server-ip'];
    }
  }
  
  /**
   * Get client environment information
   */
  private getClientEnvironment() {
    return {
      platform: this.getPlatformInfo(),
      sdkVersion: this.getSDKVersion(),
      hostname: this.getHostname(),
      userAgent: this.getUserAgent()
    };
  }
  
  private getPlatformInfo(): string {
    if (typeof window !== 'undefined') {
      return `Browser ${navigator.userAgent}`;
    } else if (typeof process !== 'undefined') {
      return `Node.js ${process.version} on ${process.platform}`;
    }
    return 'Unknown';
  }
  
  private getSDKVersion(): string {
    try {
      return require('../package.json').version;
    } catch {
      return process.env.SDK_VERSION || '1.0.0';
    }
  }
  
  private getHostname(): string | undefined {
    if (typeof window !== 'undefined') {
      return window.location.hostname;
    } else if (typeof process !== 'undefined') {
      try {
        return require('os').hostname();
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
  
  private getUserAgent(): string | undefined {
    if (typeof window !== 'undefined') {
      return navigator.userAgent;
    }
    return undefined;
  }
  
  /**
   * Sanitize headers to remove sensitive information
   */
  private sanitizeHeaders(headers: any): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveHeaders = [
      'authorization', 'cookie', 'x-api-key', 'x-auth-token',
      'authentication', 'proxy-authorization'
    ];
    
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string') {
        if (sensitiveHeaders.includes(key.toLowerCase())) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }
  
  /**
   * Sanitize request body to remove sensitive information
   */
  private sanitizeRequestBody(body: any): any {
    if (!body) return body;
    
    try {
      if (typeof body === 'string') {
        return this.truncateString(body, 1000);
      } else if (typeof body === 'object') {
        // Deep clone and sanitize
        const sanitized = JSON.parse(JSON.stringify(body));
        this.sanitizeObjectRecursive(sanitized);
        return sanitized;
      }
    } catch {
      return '[PARSING_ERROR]';
    }
    
    return body;
  }
  
  /**
   * Sanitize response body to remove sensitive information
   */
  private sanitizeResponseBody(body: any): any {
    if (!body) return body;
    
    try {
      if (typeof body === 'string') {
        return this.truncateString(body, 2000);
      } else if (typeof body === 'object') {
        // For large responses, only keep essential fields
        if (JSON.stringify(body).length > 5000) {
          return this.extractEssentialFields(body);
        }
        return body;
      }
    } catch {
      return '[PARSING_ERROR]';
    }
    
    return body;
  }
  
  /**
   * Recursively sanitize object properties
   */
  private sanitizeObjectRecursive(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    
    const sensitiveFields = [
      'password', 'token', 'secret', 'key', 'apikey', 'api_key',
      'auth', 'authorization', 'credential', 'private'
    ];
    
    for (const key of Object.keys(obj)) {
      const lowerKey = key.toLowerCase();
      
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        this.sanitizeObjectRecursive(obj[key]);
      } else if (typeof obj[key] === 'string' && obj[key].length > 500) {
        obj[key] = this.truncateString(obj[key], 500);
      }
    }
  }
  
  /**
   * Extract essential fields from large response objects
   */
  private extractEssentialFields(body: any): any {
    if (Array.isArray(body)) {
      return {
        type: 'array',
        length: body.length,
        sample: body.slice(0, 3)
      };
    } else if (body && typeof body === 'object') {
      const essential: any = {};
      
      // Common AI response fields
      const importantFields = [
        'choices', 'content', 'message', 'text', 'completion',
        'usage', 'model', 'id', 'object', 'created', 'error',
        'status', 'type', 'role'
      ];
      
      for (const field of importantFields) {
        if (field in body) {
          essential[field] = body[field];
        }
      }
      
      // Add size info
      essential._meta = {
        originalSize: JSON.stringify(body).length,
        truncated: true
      };
      
      return essential;
    }
    
    return body;
  }
  
  /**
   * Truncate string to specified length
   */
  private truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...[TRUNCATED]';
  }
  
  /**
   * Calculate request size in bytes
   */
  private calculateRequestSize(data: any): number {
    if (!data) return 0;
    
    try {
      if (typeof data === 'string') {
        return Buffer.byteLength(data, 'utf8');
      } else if (typeof data === 'object') {
        return Buffer.byteLength(JSON.stringify(data), 'utf8');
      }
    } catch {
      return 0;
    }
    
    return 0;
  }
  
  /**
   * Calculate response size in bytes
   */
  private calculateResponseSize(data: any): number {
    return this.calculateRequestSize(data);
  }
  
  /**
   * Extract AI provider from request URL
   */
  private extractProviderFromUrl(url: string): string | undefined {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('openai.com')) return 'openai';
    if (lowerUrl.includes('anthropic.com')) return 'anthropic';
    if (lowerUrl.includes('googleapis.com')) return 'google';
    if (lowerUrl.includes('cohere.ai')) return 'cohere';
    if (lowerUrl.includes('bedrock')) return 'aws-bedrock';
    if (lowerUrl.includes('costkatana.com')) return 'costkatana-gateway';
    
    return undefined;
  }
  
  /**
   * Extract model name from request body
   */
  private extractModelFromRequest(data: any): string | undefined {
    if (data && typeof data === 'object') {
      return data.model || data.Model || data.modelId;
    }
    return undefined;
  }
}

// Export convenience function to create and install interceptor
export function installComprehensiveTracking(
  axiosInstance: AxiosInstance,
  onTrackingComplete?: (data: ClientSideRequestData) => Promise<void>
): ComprehensiveTrackingInterceptor {
  const interceptor = new ComprehensiveTrackingInterceptor(onTrackingComplete);
  interceptor.install(axiosInstance);
  return interceptor;
}