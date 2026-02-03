/**
 * CostKATANA AI Gateway Client
 * Provides intelligent proxy functionality with caching, retries, and cost optimization
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import { installComprehensiveTracking, ClientSideRequestData } from '../interceptors/comprehensive-tracking.interceptor';
import {
  GatewayConfig,
  GatewayRequestOptions,
  GatewayResponse,
  GatewayStats,
  CacheStats,
  AgentTraceSummary,
  AgentTraceDetails,
  OpenAIRequest,
  AnthropicRequest,
  GoogleAIRequest,
  CohereRequest,
  ProxyKeyInfo,
  FirewallOptions,
  ProxyKeyUsageOptions,
  FirewallAnalytics,
  CortexConfig,
  SastConfig
} from '../types/gateway';

export class GatewayClient {
  private config: GatewayConfig;
  private client: AxiosInstance;
  private comprehensiveTrackingData: ClientSideRequestData[] = [];

  constructor(config: GatewayConfig) {
    this.config = config;

    // Determine which authentication header to use
    const authMethod = config.authMethod || 'gateway';
    const authHeader = authMethod === 'gateway' ? 'CostKatana-Auth' : 'Authorization';

    // Create axios client with gateway configuration
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 120000, // 2 minutes
      headers: {
        'Content-Type': 'application/json',
        // Use appropriate auth header based on config
        [authHeader]: `Bearer ${config.apiKey}`
      }
    });

    // Add request interceptor to add default headers
    this.client.interceptors.request.use(requestConfig => {
      // Add default properties if configured
      if (this.config.defaultProperties) {
        Object.entries(this.config.defaultProperties).forEach(([key, value]) => {
          requestConfig.headers[`CostKatana-Property-${key}`] = value;
        });
      }

      // Add default cache settings
      if (this.config.enableCache) {
        requestConfig.headers['CostKatana-Cache-Enabled'] = 'true';

        if (this.config.cacheConfig?.ttl) {
          requestConfig.headers['Cache-Control'] = `max-age=${this.config.cacheConfig.ttl}`;
        }

        if (this.config.cacheConfig?.userScope) {
          requestConfig.headers['CostKatana-Cache-User-Scope'] = this.config.cacheConfig.userScope;
        }

        if (this.config.cacheConfig?.bucketMaxSize) {
          requestConfig.headers['CostKatana-Cache-Bucket-Max-Size'] =
            this.config.cacheConfig.bucketMaxSize.toString();
        }
      }

      // Add default retry settings
      if (this.config.enableRetries) {
        requestConfig.headers['CostKatana-Retry-Enabled'] = 'true';

        if (this.config.retryConfig?.count !== undefined) {
          requestConfig.headers['CostKatana-Retry-Count'] =
            this.config.retryConfig.count.toString();
        }

        if (this.config.retryConfig?.factor !== undefined) {
          requestConfig.headers['CostKatana-Retry-Factor'] =
            this.config.retryConfig.factor.toString();
        }

        if (this.config.retryConfig?.minTimeout !== undefined) {
          requestConfig.headers['CostKatana-Retry-Min-Timeout'] =
            this.config.retryConfig.minTimeout.toString();
        }

        if (this.config.retryConfig?.maxTimeout !== undefined) {
          requestConfig.headers['CostKatana-Retry-Max-Timeout'] =
            this.config.retryConfig.maxTimeout.toString();
        }
      }

      // Add default firewall settings
      if (this.config.firewall?.enabled) {
        requestConfig.headers['CostKatana-Firewall-Enabled'] = 'true';

        if (this.config.firewall.advanced) {
          requestConfig.headers['CostKatana-Firewall-Advanced'] = 'true';
        }

        if (this.config.firewall.promptThreshold !== undefined) {
          requestConfig.headers['CostKatana-Firewall-Prompt-Threshold'] =
            this.config.firewall.promptThreshold.toString();
        }

        if (this.config.firewall.openaiThreshold !== undefined) {
          requestConfig.headers['CostKatana-Firewall-OpenAI-Threshold'] =
            this.config.firewall.openaiThreshold.toString();
        }
      }

      // Tracking is always on by default; no configuration required
      requestConfig.headers['CostKatana-Auto-Track'] = 'true';

      return requestConfig;
    });

    // Install comprehensive tracking interceptor for gateway requests
    installComprehensiveTracking(
      this.client,
      async (data: ClientSideRequestData) => {
        this.comprehensiveTrackingData.push(data);
        logger.debug('Gateway comprehensive tracking data captured', {
          requestId: data.context.requestId,
          provider: data.context.provider,
          totalTime: data.performance.totalTime
        });
      }
    );

    logger.info('Gateway client initialized', {
      baseUrl: config.baseUrl,
      enableCache: config.enableCache,
      enableRetries: config.enableRetries,
      comprehensiveTracking: true
    });
  }

  /**
   * Make a request through the gateway with OpenAI-compatible format
   */
  async openai(
    request: OpenAIRequest,
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    const targetUrl = options.targetUrl || 'https://api.openai.com';
    const endpoint = '/v1/chat/completions';

    return this.makeRequest(endpoint, request, { ...options, targetUrl });
  }

  /**
   * Make a request through the gateway with Anthropic-compatible format
   */
  async anthropic(
    request: AnthropicRequest,
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    const targetUrl = options.targetUrl || 'https://api.anthropic.com';
    const endpoint = '/v1/messages';

    return this.makeRequest(endpoint, request, { ...options, targetUrl });
  }

  /**
   * Make a request through the gateway with Google AI-compatible format
   */
  async googleAI(
    model: string,
    request: GoogleAIRequest,
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    const targetUrl = options.targetUrl || 'https://generativelanguage.googleapis.com';
    const endpoint = `/v1/models/${model}:generateContent`;

    return this.makeRequest(endpoint, request, { ...options, targetUrl });
  }

  /**
   * Make a request through the gateway with Cohere-compatible format
   */
  async cohere(
    request: CohereRequest,
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    const targetUrl = options.targetUrl || 'https://api.cohere.ai';
    const endpoint = '/v1/generate';

    return this.makeRequest(endpoint, request, { ...options, targetUrl });
  }

  /**
   * Make a generic request through the gateway
   */
  async makeRequest(
    endpoint: string,
    data: any,
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    const startTime = Date.now();

    try {
      // Build headers from options
      const headers = this.buildHeaders(options);

      // Make the request through the gateway
      const response: AxiosResponse = await this.client.post(endpoint, data, { headers });

      const processingTime = Date.now() - startTime;

      // Extract gateway metadata from response headers
      const gatewayResponse: GatewayResponse = {
        data: response.data,
        headers: response.headers as Record<string, string>,
        status: response.status,
        metadata: {
          cacheStatus: response.headers['costkatana-cache-status'] as 'HIT' | 'MISS',
          processingTime:
            parseInt(response.headers['costkatana-processing-time']) || processingTime,
          retryAttempts: parseInt(response.headers['costkatana-retry-attempts']) || 0,
          budgetRemaining: parseFloat(response.headers['costkatana-budget-remaining']),
          requestId: response.headers['costkatana-request-id'] || response.headers['costkatana-id'],
          failoverProviderIndex: response.headers['costkatana-failover-index']
            ? parseInt(response.headers['costkatana-failover-index'])
            : undefined
        }
      };

      logger.info('Gateway request completed', {
        endpoint,
        status: response.status,
        cacheStatus: gatewayResponse.metadata.cacheStatus,
        processingTime: gatewayResponse.metadata.processingTime,
        retryAttempts: gatewayResponse.metadata.retryAttempts
      });

      return gatewayResponse;
    } catch (error) {
      logger.error('Gateway request failed', error as Error, {
        endpoint,
        processingTime: Date.now() - startTime
      });
      throw error;
    }
  }

  /**
   * Get gateway statistics
   */
  async getStats(): Promise<GatewayStats> {
    try {
      const response = await this.client.get('/stats');
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get gateway stats', error as Error);
      throw error;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<CacheStats> {
    try {
      const response = await this.client.get('/cache/stats');
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get cache stats', error as Error);
      throw error;
    }
  }

  /**
   * Clear cache entries
   */
  async clearCache(options: { userScope?: string; expired?: boolean } = {}): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (options.userScope) params.append('userScope', options.userScope);
      if (options.expired) params.append('expired', 'true');

      await this.client.delete(`/cache?${params.toString()}`);
      logger.info('Cache cleared successfully', options);
    } catch (error) {
      logger.error('Failed to clear cache', error as Error);
      throw error;
    }
  }

  /**
   * Get agent trace summaries
   */
  async getAgentTraces(
    options: {
      startDate?: Date;
      endDate?: Date;
      traceName?: string;
      limit?: number;
    } = {}
  ): Promise<AgentTraceSummary[]> {
    try {
      const params = new URLSearchParams();
      if (options.startDate) params.append('startDate', options.startDate.toISOString());
      if (options.endDate) params.append('endDate', options.endDate.toISOString());
      if (options.traceName) params.append('traceName', options.traceName);
      if (options.limit) params.append('limit', options.limit.toString());

      const response = await this.client.get(`/agent-trace?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get agent traces', error as Error);
      throw error;
    }
  }

  /**
   * Get detailed agent trace information
   */
  async getAgentTraceDetails(traceId: string): Promise<AgentTraceDetails> {
    try {
      const response = await this.client.get(`/agent-trace/${traceId}`);
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get agent trace details', error as Error, { traceId });
      throw error;
    }
  }

  /**
   * Export agent trace data as CSV
   */
  async exportAgentTraces(
    options: {
      startDate?: Date;
      endDate?: Date;
      traceName?: string;
    } = {}
  ): Promise<string> {
    try {
      const traces = await this.getAgentTraces(options);
      return this.agentTracesToCSV(traces);
    } catch (error) {
      logger.error('Failed to export agent traces', error as Error);
      throw error;
    }
  }

  /**
   * Check gateway health
   */
  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      logger.error('Gateway health check failed', error as Error);
      throw error;
    }
  }

  /**
   * Update gateway configuration
   */
  updateConfig(config: Partial<GatewayConfig>): void {
    this.config = { ...this.config, ...config };

    // Update client headers if API key changed
    if (config.apiKey) {
      this.client.defaults.headers['CostKatana-Auth'] = `Bearer ${config.apiKey}`;
    }

    logger.info('Gateway configuration updated', config);
  }

  /**
   * Build headers from request options
   */
  private buildHeaders(options: GatewayRequestOptions): Record<string, string> {
    const headers: Record<string, string> = {};

    // Target URL
    if (options.targetUrl || this.config.defaultTargetUrl) {
      headers['CostKatana-Target-Url'] = options.targetUrl || this.config.defaultTargetUrl!;
    }

    // Project ID
    if (options.projectId) {
      headers['CostKatana-Project-Id'] = options.projectId;
    }

    // Authentication method override
    if (options.authMethodOverride) {
      headers['CostKatana-Auth-Method'] = options.authMethodOverride;
    }

    // Cache configuration
    if (options.cache !== undefined) {
      if (typeof options.cache === 'boolean') {
        headers['CostKatana-Cache-Enabled'] = options.cache.toString();
      } else {
        headers['CostKatana-Cache-Enabled'] = 'true';
        if (options.cache.ttl) {
          headers['Cache-Control'] = `max-age=${options.cache.ttl}`;
        }
        if (options.cache.userScope) {
          headers['CostKatana-Cache-User-Scope'] = options.cache.userScope;
        }
        if (options.cache.bucketMaxSize) {
          headers['CostKatana-Cache-Bucket-Max-Size'] = options.cache.bucketMaxSize.toString();
        }
      }
    }

    // Retry configuration
    if (options.retry !== undefined) {
      if (typeof options.retry === 'boolean') {
        headers['CostKatana-Retry-Enabled'] = options.retry.toString();
      } else {
        headers['CostKatana-Retry-Enabled'] = 'true';
        if (options.retry.count !== undefined) {
          headers['CostKatana-Retry-Count'] = options.retry.count.toString();
        }
        if (options.retry.factor !== undefined) {
          headers['CostKatana-Retry-Factor'] = options.retry.factor.toString();
        }
        if (options.retry.minTimeout !== undefined) {
          headers['CostKatana-Retry-Min-Timeout'] = options.retry.minTimeout.toString();
        }
        if (options.retry.maxTimeout !== undefined) {
          headers['CostKatana-Retry-Max-Timeout'] = options.retry.maxTimeout.toString();
        }
      }
    }

    // Agent trace configuration
    if (options.trace) {
      headers['CostKatana-Trace-Id'] = options.trace.traceId;
      headers['CostKatana-Trace-Name'] = options.trace.traceName;
      if (options.trace.traceStep) {
        headers['CostKatana-Trace-Step'] = options.trace.traceStep;
      }
      if (options.trace.traceSequence !== undefined) {
        headers['CostKatana-Trace-Sequence'] = options.trace.traceSequence.toString();
      }
    }
    // Legacy workflow headers (deprecated)
    if (options.workflow) {
      headers['CostKatana-Trace-Id'] = options.workflow.workflowId;
      headers['CostKatana-Trace-Name'] = options.workflow.workflowName;
      if (options.workflow.workflowStep) {
        headers['CostKatana-Trace-Step'] = options.workflow.workflowStep;
      }
    }

    // Custom properties
    if (options.properties) {
      Object.entries(options.properties).forEach(([key, value]) => {
        headers[`CostKatana-Property-${key}`] = value;
      });
    }

    // Other options
    if (options.budgetId) headers['CostKatana-Budget-Id'] = options.budgetId;
    if (options.modelOverride) headers['CostKatana-Model-Override'] = options.modelOverride;
    if (options.omitRequest) headers['CostKatana-Omit-Request'] = 'true';
    if (options.omitResponse) headers['CostKatana-Omit-Response'] = 'true';
    if (options.security) headers['CostKatana-LLM-Security-Enabled'] = 'true';

    // Firewall configuration
    if (options.firewall !== undefined) {
      if (typeof options.firewall === 'boolean') {
        headers['CostKatana-Firewall-Enabled'] = options.firewall.toString();
      } else {
        headers['CostKatana-Firewall-Enabled'] = 'true';
        if (options.firewall.advanced) {
          headers['CostKatana-Firewall-Advanced'] = 'true';
        }
        if (options.firewall.promptThreshold !== undefined) {
          headers['CostKatana-Firewall-Prompt-Threshold'] =
            options.firewall.promptThreshold.toString();
        }
        if (options.firewall.openaiThreshold !== undefined) {
          headers['CostKatana-Firewall-OpenAI-Threshold'] =
            options.firewall.openaiThreshold.toString();
        }
      }
    }

    // Tracking is always on by default; no configuration required
    headers['CostKatana-Auto-Track'] = 'true';

    // Failover configuration
    if (options.failover !== undefined) {
      if (typeof options.failover === 'boolean') {
        // Use default failover policy from config if available
        if (options.failover && this.config.failover?.defaultPolicy) {
          headers['CostKatana-Failover-Policy'] = JSON.stringify(
            this.config.failover.defaultPolicy
          );
        }
      } else {
        // Use specific failover policy from options
        if (options.failover.policy) {
          headers['CostKatana-Failover-Policy'] = JSON.stringify(options.failover.policy);
        }
      }

      // Remove target URL header for failover requests as it's not needed
      if (headers['CostKatana-Failover-Policy']) {
        delete headers['CostKatana-Target-Url'];
      }
    }

    if (options.rateLimitPolicy) headers['CostKatana-RateLimit-Policy'] = options.rateLimitPolicy;
    if (options.sessionId) headers['CostKatana-Session-Id'] = options.sessionId;
    if (options.traceId) headers['CostKatana-Property-Trace-Id'] = options.traceId;
    if (options.userId) headers['CostKatana-User-Id'] = options.userId;
    if (options.userEmail) headers['CostKatana-User-Email'] = options.userEmail;

    // Cortex/SAST configuration
    if (options.cortex) {
      if (options.cortex.enabled) {
        headers['CostKatana-Cortex-Enabled'] = 'true';
      }
      if (options.cortex.operation) {
        headers['CostKatana-Cortex-Operation'] = options.cortex.operation;
      }
      if (options.cortex.style) {
        headers['CostKatana-Cortex-Style'] = options.cortex.style;
      }
      if (options.cortex.format) {
        headers['CostKatana-Cortex-Format'] = options.cortex.format;
      }
      if (options.cortex.semanticCache !== undefined) {
        headers['CostKatana-Cortex-Semantic-Cache'] = options.cortex.semanticCache.toString();
      }
      if (options.cortex.preserveSemantics !== undefined) {
        headers['CostKatana-Cortex-Preserve-Semantics'] =
          options.cortex.preserveSemantics.toString();
      }
      if (options.cortex.intelligentRouting !== undefined) {
        headers['CostKatana-Cortex-Intelligent-Routing'] =
          options.cortex.intelligentRouting.toString();
      }

      // SAST-specific headers
      if (options.cortex.sast) {
        const sast = options.cortex.sast;
        if (sast.enabled !== undefined) {
          headers['CostKatana-Cortex-Sast-Processing'] = sast.enabled.toString();
        }
        if (sast.language) {
          headers['CostKatana-Cortex-Sast-Language'] = sast.language;
        }
        if (sast.ambiguityResolution !== undefined) {
          headers['CostKatana-Cortex-Ambiguity-Resolution'] = sast.ambiguityResolution.toString();
        }
        if (sast.crossLingualMode !== undefined) {
          headers['CostKatana-Cortex-Cross-Lingual-Mode'] = sast.crossLingualMode.toString();
        }
        if (sast.disambiguationStrategy) {
          headers['CostKatana-Cortex-Disambiguation-Strategy'] = sast.disambiguationStrategy;
        }
        if (sast.preserveAmbiguity !== undefined) {
          headers['CostKatana-Cortex-Preserve-Ambiguity'] = sast.preserveAmbiguity.toString();
        }
        if (sast.maxPrimitives !== undefined) {
          headers['CostKatana-Cortex-Max-Primitives'] = sast.maxPrimitives.toString();
        }
        if (sast.semanticThreshold !== undefined) {
          headers['CostKatana-Cortex-Semantic-Threshold'] = sast.semanticThreshold.toString();
        }
      }
    }
    if (options.customerEmail) headers['CostKatana-Customer-Email'] = options.customerEmail;

    return headers;
  }

  /**
   * Convert agent trace summaries to CSV format
   */
  private agentTracesToCSV(traces: AgentTraceSummary[]): string {
    const headers = [
      'Trace ID',
      'Trace Name',
      'Start Time',
      'End Time',
      'Duration (ms)',
      'Total Cost ($)',
      'Total Tokens',
      'Request Count',
      'Average Cost per Request ($)',
      'Steps'
    ];

    const rows = traces.map(trace => [
      trace.traceId,
      trace.traceName,
      new Date(trace.startTime).toISOString(),
      new Date(trace.endTime).toISOString(),
      trace.duration.toString(),
      trace.totalCost.toFixed(6),
      trace.totalTokens.toString(),
      trace.requestCount.toString(),
      trace.averageCost.toFixed(6),
      trace.steps.map(step => `${step.step} (${step.cost.toFixed(6)}$)`).join('; ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  /**
   * Check if the current API key is a proxy key
   */
  public isUsingProxyKey(): boolean {
    return this.config.apiKey.startsWith('ck-proxy-');
  }

  /**
   * Get proxy key information (if using a proxy key)
   */
  public async getProxyKeyInfo(): Promise<ProxyKeyInfo | null> {
    if (!this.isUsingProxyKey()) {
      return null;
    }

    try {
      const response = await this.client.get('/key-vault/proxy-keys', {
        params: { keyId: this.config.apiKey }
      });

      const proxyKeys = response.data.data;
      return proxyKeys.find((key: any) => key.keyId === this.config.apiKey) || null;
    } catch (error) {
      logger.error('Failed to get proxy key info:', error as Error);
      return null;
    }
  }

  /**
   * Make a request with proxy key usage tracking
   */
  public async makeProxyKeyRequest<T = any>(
    targetUrl: string,
    requestData: any,
    options: ProxyKeyUsageOptions = {}
  ): Promise<GatewayResponse<T>> {
    if (!this.isUsingProxyKey()) {
      throw new Error('This method requires a proxy key. Current API key is not a proxy key.');
    }

    const requestOptions: GatewayRequestOptions = {
      targetUrl,
      properties: options.properties,
      modelOverride: options.modelOverride,
      omitRequest: options.omitRequest,
      omitResponse: options.omitResponse,
      budgetId: options.projectId
    };

    return this.makeRequest(requestData, requestOptions);
  }

  /**
   * Get proxy key usage statistics
   */
  public async getProxyKeyUsage(): Promise<{
    totalRequests: number;
    totalCost: number;
    dailyCost: number;
    monthlyCost: number;
  } | null> {
    if (!this.isUsingProxyKey()) {
      return null;
    }

    try {
      const proxyKeyInfo = await this.getProxyKeyInfo();
      return proxyKeyInfo ? proxyKeyInfo.usageStats : null;
    } catch (error) {
      logger.error('Failed to get proxy key usage:', error as Error);
      return null;
    }
  }

  /**
   * Check if proxy key is within budget limits
   */
  public async checkProxyKeyBudget(): Promise<{
    withinBudget: boolean;
    budgetStatus: 'good' | 'warning' | 'over';
    message: string;
  } | null> {
    if (!this.isUsingProxyKey()) {
      return null;
    }

    try {
      const proxyKeyInfo = await this.getProxyKeyInfo();
      if (!proxyKeyInfo) {
        return null;
      }

      const { usageStats, budgetLimit, dailyBudgetLimit, monthlyBudgetLimit } = proxyKeyInfo;

      // Check if over budget
      if (budgetLimit && usageStats.totalCost >= budgetLimit) {
        return { withinBudget: false, budgetStatus: 'over', message: 'Over total budget limit' };
      }
      if (dailyBudgetLimit && usageStats.dailyCost >= dailyBudgetLimit) {
        return { withinBudget: false, budgetStatus: 'over', message: 'Over daily budget limit' };
      }
      if (monthlyBudgetLimit && usageStats.monthlyCost >= monthlyBudgetLimit) {
        return { withinBudget: false, budgetStatus: 'over', message: 'Over monthly budget limit' };
      }

      // Check if approaching limits (80% threshold)
      if (budgetLimit && usageStats.totalCost >= budgetLimit * 0.8) {
        return {
          withinBudget: true,
          budgetStatus: 'warning',
          message: 'Approaching total budget limit'
        };
      }
      if (dailyBudgetLimit && usageStats.dailyCost >= dailyBudgetLimit * 0.8) {
        return {
          withinBudget: true,
          budgetStatus: 'warning',
          message: 'Approaching daily budget limit'
        };
      }
      if (monthlyBudgetLimit && usageStats.monthlyCost >= monthlyBudgetLimit * 0.8) {
        return {
          withinBudget: true,
          budgetStatus: 'warning',
          message: 'Approaching monthly budget limit'
        };
      }

      return { withinBudget: true, budgetStatus: 'good', message: 'Within budget limits' };
    } catch (error) {
      logger.error('Failed to check proxy key budget:', error as Error);
      return null;
    }
  }

  /**
   * Validate proxy key permissions for a specific operation
   */
  public async validateProxyKeyPermissions(
    requiredPermission: 'read' | 'write' | 'admin'
  ): Promise<boolean> {
    if (!this.isUsingProxyKey()) {
      return true; // Dashboard API keys have full permissions
    }

    try {
      const proxyKeyInfo = await this.getProxyKeyInfo();
      if (!proxyKeyInfo) {
        return false;
      }

      // Check if proxy key has required permission
      return (
        proxyKeyInfo.permissions.includes(requiredPermission) ||
        proxyKeyInfo.permissions.includes('admin')
      );
    } catch (error) {
      logger.error('Failed to validate proxy key permissions:', error as Error);
      return false;
    }
  }

  /**
   * Get firewall analytics
   */
  public async getFirewallAnalytics(
    userId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<FirewallAnalytics> {
    try {
      const params: Record<string, string> = {};

      if (userId) {
        params.userId = userId;
      }

      if (dateRange) {
        params.startDate = dateRange.start.toISOString();
        params.endDate = dateRange.end.toISOString();
      }

      const response = await this.client.get('/firewall/analytics', { params });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to get firewall analytics:', error as Error);
      throw new Error('Failed to get firewall analytics');
    }
  }

  /**
   * Make a request with firewall protection
   */
  public async makeFirewallProtectedRequest<T = any>(
    endpoint: string,
    data: any,
    firewallOptions: FirewallOptions,
    requestOptions: GatewayRequestOptions = {}
  ): Promise<GatewayResponse<T>> {
    const options: GatewayRequestOptions = {
      ...requestOptions,
      firewall: firewallOptions
    };

    return this.makeRequest(endpoint, data, options);
  }

  /**
   * Make a request with SAST (Semantic Abstract Syntax Tree) optimization
   */
  async withSast(
    endpoint: string,
    data: any,
    sastOptions: Partial<SastConfig> = {},
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    const cortexOptions: CortexConfig = {
      enabled: true,
      operation: 'sast',
      sast: {
        enabled: true,
        language: 'en',
        ambiguityResolution: true,
        crossLingualMode: false,
        disambiguationStrategy: 'hybrid',
        preserveAmbiguity: false,
        maxPrimitives: 100,
        semanticThreshold: 0.7,
        ...sastOptions
      }
    };

    return this.makeRequest(endpoint, data, {
      ...options,
      cortex: cortexOptions
    });
  }

  /**
   * Compare traditional optimization vs SAST optimization
   */
  async compareSast(
    endpoint: string,
    data: any,
    options: GatewayRequestOptions = {}
  ): Promise<{
    traditional: GatewayResponse;
    sast: GatewayResponse;
    comparison: {
      tokenReduction: number;
      processingTimeDiff: number;
      recommendedApproach: 'traditional' | 'sast';
    };
  }> {
    // Run traditional optimization
    const traditionalPromise = this.makeRequest(endpoint, data, {
      ...options,
      cortex: { enabled: true, operation: 'optimize' }
    });

    // Run SAST optimization
    const sastPromise = this.withSast(endpoint, data, {}, options);

    const [traditional, sast] = await Promise.all([traditionalPromise, sastPromise]);

    // Calculate comparison metrics
    const traditionalTokens = traditional.metadata.processingTime || 0;
    const sastTokens = sast.metadata.processingTime || 0;
    const tokenReduction =
      traditionalTokens > 0 ? ((traditionalTokens - sastTokens) / traditionalTokens) * 100 : 0;

    const processingTimeDiff =
      (sast.metadata.processingTime || 0) - (traditional.metadata.processingTime || 0);

    return {
      traditional,
      sast,
      comparison: {
        tokenReduction,
        processingTimeDiff,
        recommendedApproach: tokenReduction > 10 ? 'sast' : 'traditional'
      }
    };
  }

  /**
   * Test universal semantic compatibility
   */
  async testUniversalSemantics(
    endpoint: string,
    data: any,
    languages: string[] = ['en', 'es', 'fr'],
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse[]> {
    const promises = languages.map(language =>
      this.withSast(
        endpoint,
        data,
        {
          language,
          crossLingualMode: true,
          ambiguityResolution: true
        },
        options
      )
    );

    return Promise.all(promises);
  }

  /**
   * Get SAST vocabulary statistics
   */
  async getSastVocabulary(options: GatewayRequestOptions = {}): Promise<GatewayResponse> {
    return this.makeRequest('/sast/vocabulary', {}, options);
  }

  /**
   * Search semantic primitives
   */
  async searchSemanticPrimitives(
    query: {
      term?: string;
      category?: string;
      language?: string;
      limit?: number;
    },
    options: GatewayRequestOptions = {}
  ): Promise<GatewayResponse> {
    return this.makeRequest('/sast/search', query, options);
  }

  /**
   * Demonstrate telescope ambiguity resolution
   */
  async getTelescopeDemo(options: GatewayRequestOptions = {}): Promise<GatewayResponse> {
    return this.makeRequest('/sast/telescope-demo', {}, options);
  }

  /**
   * Get comprehensive tracking data for recent requests
   */
  getComprehensiveTrackingData(): ClientSideRequestData[] {
    return [...this.comprehensiveTrackingData];
  }

  /**
   * Clear comprehensive tracking data
   */
  clearComprehensiveTrackingData(): void {
    this.comprehensiveTrackingData = [];
  }

  /**
   * Get SAST performance statistics
   */
  async getSastStats(options: GatewayRequestOptions = {}): Promise<GatewayResponse> {
    return this.makeRequest('/sast/stats', {}, options);
  }
}
