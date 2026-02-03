import { AIProvider, ProviderConfig, UsageMetadata, CostEstimate } from '../types';
import {
  ProviderRequest,
  ProviderResponse,
  ProviderModel,
  AnyUsage,
  Message
} from '../types/providers';
import { getModelById, MODELS } from '../types/models';
import { calculateCost } from '../utils/pricing';
import { v4 as uuidv4 } from 'uuid';
import { ClientSideRequestData } from '../interceptors/comprehensive-tracking.interceptor';

export abstract class BaseProvider {
  protected config: ProviderConfig;
  protected provider: AIProvider;
  private comprehensiveTrackingCallback?: (data: ClientSideRequestData) => Promise<void>;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.provider = config.provider;
  }

  /**
   * Set the comprehensive tracking callback
   */
  setComprehensiveTrackingCallback(callback: (data: ClientSideRequestData) => Promise<void>): void {
    this.comprehensiveTrackingCallback = callback;
  }

  abstract countTokens(text: string, model: string): Promise<number>;
  abstract makeRequest(request: ProviderRequest): Promise<ProviderResponse>;
  abstract parseUsage(usage: any): AnyUsage;

  async estimateCost(
    prompt: string,
    model: string,
    expectedCompletion?: number
  ): Promise<CostEstimate> {
    const modelInfo = getModelById(model);
    if (!modelInfo) {
      throw new Error(`Unknown model: ${model}`);
    }

    const promptTokens = await this.countTokens(prompt, model);
    const completionTokens = expectedCompletion || Math.floor(promptTokens * 0.5);

    return calculateCost(promptTokens, completionTokens, modelInfo, this.config.customPricing);
  }

  /**
   * Enhanced tracking that includes comprehensive client-side data
   */
  trackUsageWithComprehensiveData(
    request: ProviderRequest,
    response: ProviderResponse,
    startTime: number,
    clientSideData?: ClientSideRequestData
  ): UsageMetadata & { comprehensiveTracking?: any } {
    const baseUsage = this.trackUsage(request, response, startTime);
    
    if (!clientSideData) {
      return baseUsage;
    }
    
    // Enhance usage metadata with comprehensive tracking data
    return {
      ...baseUsage,
      // Enhanced client information - user agent moved to comprehensive tracking data
      
      // Enhanced request/response metadata
      requestMetadata: {
        ...baseUsage.requestMetadata,
        clientEnvironment: clientSideData.clientEnvironment,
        networking: clientSideData.networking,
        performanceMetrics: clientSideData.performance,
        headers: clientSideData.request.headers,
        requestSize: clientSideData.request.size
      },
      
      responseMetadata: {
        ...baseUsage.responseMetadata,
        headers: clientSideData.response?.headers,
        responseSize: clientSideData.response?.size,
        statusCode: clientSideData.response?.statusCode
      },
      
      // Comprehensive tracking data
      comprehensiveTracking: {
        clientSideTime: clientSideData.performance.totalTime,
        networkTime: clientSideData.performance.totalTime - (baseUsage.responseTime || 0),
        serverProcessingTime: baseUsage.responseTime || 0,
        dataTransferEfficiency: this.calculateDataTransferEfficiency(clientSideData),
        networkMetrics: {
          dnsTime: clientSideData.performance.dnsTime,
          connectTime: clientSideData.performance.connectTime,
          uploadTime: clientSideData.performance.uploadTime,
          downloadTime: clientSideData.performance.downloadTime
        },
        compressionRatio: this.calculateCompressionRatio(clientSideData)
      }
    };
  }
  
  /**
   * Calculate data transfer efficiency (bytes per second)
   */
  private calculateDataTransferEfficiency(clientSideData: ClientSideRequestData): number {
    const totalBytes = clientSideData.request.size + (clientSideData.response?.size || 0);
    const totalTimeSeconds = clientSideData.performance.totalTime / 1000;
    
    if (totalTimeSeconds === 0) return 0;
    return totalBytes / totalTimeSeconds;
  }
  
  /**
   * Calculate compression ratio if applicable
   */
  private calculateCompressionRatio(clientSideData: ClientSideRequestData): number | undefined {
    const contentEncoding = clientSideData.response?.headers['content-encoding'];
    if (!contentEncoding || !contentEncoding.includes('gzip')) {
      return undefined;
    }
    
    // Estimate compression ratio based on content type and size
    const responseSize = clientSideData.response?.size || 0;
    const estimatedUncompressed = responseSize * 3; // Rough estimate
    
    return responseSize / estimatedUncompressed;
  }

  /**
   * Interceptor method for request data capture (to be implemented by subclasses if needed)
   */
  protected async interceptRequest(request: any): Promise<ClientSideRequestData | null> {
    // Base implementation can capture basic request data
    try {
      const requestData: any = {
        requestId: this.generateRequestId(),
        environment: {
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js SDK',
          platform: typeof process !== 'undefined' ? process.platform : 'unknown',
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'localhost',
          sdkVersion: '2.0.0' // This should be imported from package.json
        },
        network: {
          endpoint: request.url || request.baseURL || 'unknown',
          method: request.method?.toUpperCase() || 'POST',
          protocol: 'https:',
          port: 443
        },
        request: {
          method: request.method?.toUpperCase() || 'POST',
          url: request.url || '',
          path: new URL(request.url || '', request.baseURL).pathname,
          headers: this.sanitizeHeaders(request.headers || {}),
          body: this.sanitizeBody(request.data || request.body),
          size: this.calculateSize(request.data || request.body),
          timestamp: new Date()
        },
        timestamp: new Date()
      };
      
      return requestData as ClientSideRequestData;
    } catch (error) {
      // Return null if unable to capture data - don't break the main flow
      return null;
    }
  }
  
  /**
   * Interceptor method for response data capture (to be implemented by subclasses if needed)
   */
  protected async interceptResponse(
    response: any, 
    requestData?: ClientSideRequestData
  ): Promise<ClientSideRequestData | null> {
    // Base implementation can capture basic response data
    if (!requestData) {
      return null;
    }
    
    try {
      const responseEndTime = Date.now();
      const requestStartTime = requestData.request.timestamp?.getTime() || responseEndTime;
      
      // Update request data with response information
      const updatedData: ClientSideRequestData = {
        ...requestData,
        response: {
          statusCode: (response as any).status || 200,
          headers: this.sanitizeHeaders(response.headers || {}),
          body: this.sanitizeBody(response.data || response.body),
          size: this.calculateSize(response.data || response.body),
          timestamp: new Date()
        },
        performance: {
          totalTime: responseEndTime - requestStartTime,
          // These would be filled in by more sophisticated implementations
          dnsTime: 0,
          connectTime: 0, // TCP connection time
          uploadTime: 0  // TLS/SSL time
        }
      };
      
      return updatedData;
    } catch (error) {
      // Return original request data if unable to capture response data
      return requestData;
    }
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize headers to remove sensitive information
   */
  private sanitizeHeaders(headers: Record<string, any>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    const sensitiveKeys = ['authorization', 'x-api-key', 'cookie', 'set-cookie'];
    
    for (const [key, value] of Object.entries(headers)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = String(value);
      }
    }
    
    return sanitized;
  }

  /**
   * Sanitize request/response body to remove sensitive information
   */
  private sanitizeBody(body: any): string {
    if (!body) return '';
    
    try {
      let bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      
      // Redact common sensitive fields
      const sensitivePatterns = [
        /(api_key["']?\s*:\s*["'])[^"']*["']/gi,
        /(password["']?\s*:\s*["'])[^"']*["']/gi,
        /(secret["']?\s*:\s*["'])[^"']*["']/gi,
        /(token["']?\s*:\s*["'])[^"']*["']/gi
      ];
      
      sensitivePatterns.forEach(pattern => {
        bodyStr = bodyStr.replace(pattern, '$1[REDACTED]"');
      });
      
      return bodyStr;
    } catch (error) {
      return '[Unable to serialize body]';
    }
  }

  /**
   * Calculate the size of data in bytes
   */
  private calculateSize(data: any): number {
    if (!data) return 0;
    
    try {
      const str = typeof data === 'string' ? data : JSON.stringify(data);
      return new Blob([str]).size;
    } catch (error) {
      return 0;
    }
  }

  trackUsage(
    request: ProviderRequest,
    response: ProviderResponse,
    startTime: number
  ): UsageMetadata {
    const endTime = Date.now();
    const usage = this.parseUsage(response.usage);
    const model = getModelById(request.model);

    if (!model) {
      throw new Error(`Unknown model: ${request.model}`);
    }

    const promptTokens = this.getPromptTokens(usage);
    const completionTokens = this.getCompletionTokens(usage);
    const totalTokens = promptTokens + completionTokens;

    const cost = calculateCost(promptTokens, completionTokens, model, this.config.customPricing);

    const prompt =
      request.prompt || (request.messages ? this.messagesToPrompt(request.messages) : '');

    const completion = response.choices[0]?.text || response.choices[0]?.message?.content || '';

    const usageMetadata: UsageMetadata = {
      provider: this.provider,
      model: request.model,
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost: cost.totalCost,
      prompt,
      completion,
      responseTime: endTime - startTime,
      tags: request.metadata?.tags,
      sessionId: request.metadata?.sessionId || uuidv4(),
      projectId: request.metadata?.projectId,
      
      // Enhanced metadata fields for comprehensive tracking
      requestMetadata: {
        messages: request.messages?.filter(msg => msg.role !== 'function') as { role: "system" | "user" | "assistant"; content: string; }[] | undefined,
        system: (request as any).system,
        input: prompt,
        prompt,
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        topP: (request as any).topP,
        frequencyPenalty: (request as any).frequencyPenalty,
        presencePenalty: (request as any).presencePenalty
      },
      
      responseMetadata: {
        completion,
        output: completion,
        finishReason: response.choices[0]?.finishReason,
        processingTime: endTime - startTime
      }
    };

    // Automatically trigger comprehensive tracking if callback is set
    if (this.comprehensiveTrackingCallback) {
      this.triggerComprehensiveTracking(request, response, startTime, endTime)
        .catch(error => {
          // Don't fail the main tracking if comprehensive tracking fails
          console.warn('Comprehensive tracking failed:', error);
        });
    }

    return usageMetadata;
  }

  /**
   * Trigger comprehensive tracking automatically
   */
  private async triggerComprehensiveTracking(
    request: ProviderRequest,
    response: ProviderResponse,
    startTime: number,
    endTime: number
  ): Promise<void> {
    try {
      // Attempt to capture request data
      const requestData = await this.interceptRequest(request);
      
      if (requestData) {
        // Enhance with response data
        const comprehensiveData = await this.interceptResponse(response, requestData);
        
        if (comprehensiveData && this.comprehensiveTrackingCallback) {
          // Ensure performance timing is accurate
          comprehensiveData.performance = {
            ...comprehensiveData.performance,
            totalTime: endTime - startTime
          };
          
          await this.comprehensiveTrackingCallback(comprehensiveData);
        }
      }
    } catch (error) {
      // Silently handle errors to avoid breaking main flow
      console.warn('Error in automatic comprehensive tracking:', error);
    }
  }

  protected abstract getPromptTokens(usage: AnyUsage): number;
  protected abstract getCompletionTokens(usage: AnyUsage): number;

  protected messagesToPrompt(messages: Message[]): string {
    return messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  getConfig(): ProviderConfig {
    return this.config;
  }

  validateModel(modelId: string): boolean {
    const model = getModelById(modelId);
    return model !== undefined && model.provider === this.provider;
  }

  getSupportedModels(): ProviderModel[] {
    return Object.values(MODELS).filter(model => model && model.provider === this.provider);
  }
}
