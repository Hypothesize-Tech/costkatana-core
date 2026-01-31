/**
 * Gateway types for CostKATANA AI Gateway functionality
 */

export interface GatewayConfig {
  /** Gateway base URL */
  baseUrl: string;
  /** API key for authentication (dashboard API key, proxy key, or JWT token) */
  apiKey: string;
  /**
   * Authentication method - determines which header to use
   * 'gateway' uses CostKatana-Auth header (default for gateway requests)
   * 'standard' uses Authorization header (for direct API calls)
   * @default 'gateway'
   */
  authMethod?: 'gateway' | 'standard';
  /** Default target URL for requests */
  defaultTargetUrl?: string;
  /** Enable caching by default */
  enableCache?: boolean;
  /** Enable retries by default */
  enableRetries?: boolean;
  /** Default retry configuration */
  retryConfig?: RetryConfig;
  /** Default cache configuration */
  cacheConfig?: CacheConfig;
  /** Custom properties to include with all requests */
  defaultProperties?: Record<string, string>;
  /** Key Vault configuration for proxy key management */
  keyVault?: KeyVaultConfig;
  /** Firewall configuration for prompt security */
  firewall?: FirewallConfig;
  /** Failover configuration for high availability */
  failover?: FailoverConfig;
}

export interface KeyVaultConfig {
  /** Enable Key Vault functionality */
  enabled?: boolean;
  /** Auto-detect proxy key format (ck-proxy-*) */
  autoDetectProxyKey?: boolean;
  /** Fallback to environment variables if proxy key fails */
  fallbackToEnv?: boolean;
}

export interface FirewallConfig {
  /** Enable basic firewall (Prompt Guard) */
  enabled?: boolean;
  /** Enable advanced firewall (OpenAI Safeguard) */
  advanced?: boolean;
  /** Prompt Guard confidence threshold (0.0-1.0) */
  promptThreshold?: number;
  /** OpenAI Safeguard confidence threshold (0.0-1.0) */
  openaiThreshold?: number;
}

export interface FailoverConfig {
  /** Enable failover functionality */
  enabled?: boolean;
  /** Default failover policy */
  defaultPolicy?: FailoverPolicy;
  /** Global timeout for failover sequences (milliseconds) */
  globalTimeout?: number;
}

export interface FailoverTarget {
  /** The base URL of the AI provider to try */
  'target-url': string;
  /** Authentication headers needed for this specific provider */
  headers: Record<string, string>;
  /** HTTP status codes that will trigger a failover to the next provider */
  onCodes: (number | { from: number; to: number })[];
  /** Optional object to modify keys in the request body */
  bodyKeyOverride?: Record<string, string>;
  /** Optional timeout for this specific provider (milliseconds) */
  timeout?: number;
}

export interface FailoverPolicy {
  /** Array of providers in order of priority */
  targets: FailoverTarget[];
  /** Global timeout for the entire failover sequence (milliseconds) */
  globalTimeout?: number;
  /** Whether to continue trying providers after a successful response */
  continueOnSuccess?: boolean;
}

export interface FailoverOptions {
  /** Enable failover for this request */
  enabled?: boolean;
  /** Failover policy to use for this request */
  policy?: FailoverPolicy;
}

export interface CortexConfig {
  /** Enable Cortex meta-language processing */
  enabled?: boolean;
  /** Cortex processing operation */
  operation?: 'optimize' | 'compress' | 'analyze' | 'transform' | 'sast';
  /** Output style for Cortex processing */
  style?: 'formal' | 'casual' | 'technical' | 'conversational';
  /** Output format for Cortex processing */
  format?: 'plain' | 'markdown' | 'structured' | 'json';
  /** Enable semantic caching */
  semanticCache?: boolean;
  /** Preserve semantics during optimization */
  preserveSemantics?: boolean;
  /** Enable intelligent model routing */
  intelligentRouting?: boolean;
  /** SAST-specific configuration */
  sast?: SastConfig;
}

export interface SastConfig {
  /** Enable SAST semantic processing */
  enabled?: boolean;
  /** Language for SAST processing */
  language?: string;
  /** Enable ambiguity resolution */
  ambiguityResolution?: boolean;
  /** Enable cross-lingual semantic mapping */
  crossLingualMode?: boolean;
  /** Disambiguation strategy */
  disambiguationStrategy?: 'strict' | 'permissive' | 'hybrid';
  /** Preserve ambiguous structures for analysis */
  preserveAmbiguity?: boolean;
  /** Maximum semantic primitives to use */
  maxPrimitives?: number;
  /** Semantic confidence threshold */
  semanticThreshold?: number;
}

export interface RetryConfig {
  /** Maximum number of retry attempts (0-10) */
  count?: number;
  /** Exponential backoff factor (1-5) */
  factor?: number;
  /** Minimum wait time in milliseconds (100-60000) */
  minTimeout?: number;
  /** Maximum wait time in milliseconds (1000-300000) */
  maxTimeout?: number;
}

export interface CacheConfig {
  /** Cache TTL in seconds */
  ttl?: number;
  /** User scope for cache isolation */
  userScope?: string;
  /** Maximum number of responses for variety (1-10) */
  bucketMaxSize?: number;
}

export interface WorkflowConfig {
  /** Unique workflow identifier */
  workflowId: string;
  /** Human-readable workflow name */
  workflowName: string;
  /** Current step in the workflow */
  workflowStep?: string;
}

export interface GatewayRequestOptions {
  /** Target AI provider URL */
  targetUrl?: string;
  /** Enable caching for this request */
  cache?: boolean | CacheConfig;
  /** Enable retries for this request */
  retry?: boolean | RetryConfig;
  /** Custom properties for cost attribution */
  properties?: Record<string, string>;
  /** Workflow tracking configuration */
  workflow?: WorkflowConfig;
  /** Budget/project ID for cost allocation */
  budgetId?: string;
  /** Project ID for request tracking (sent via CostKatana-Project-Id header) */
  projectId?: string;
  /** Authentication method override (sent via CostKatana-Auth-Method header) */
  authMethodOverride?: 'gateway' | 'standard';
  /** Override model for this request */
  modelOverride?: string;
  /** Omit request content from logs (privacy) */
  omitRequest?: boolean;
  /** Omit response content from logs (privacy) */
  omitResponse?: boolean;
  /** Enable LLM security scanning */
  security?: boolean;
  /** Firewall configuration for this request */
  firewall?: boolean | FirewallOptions;
  /** Failover configuration for this request */
  failover?: boolean | FailoverOptions;
  /** Rate limiting policy */
  rateLimitPolicy?: string;
  /** Session ID for grouping requests */
  sessionId?: string;
  /** Trace ID for debugging */
  traceId?: string;
  /** User ID for user-scoped operations */
  userId?: string;
  /** User email for usage tracking and analytics */
  userEmail?: string;
  /** Customer email for business intelligence and reporting */
  customerEmail?: string;
  /** Cortex/SAST configuration for semantic optimization */
  cortex?: CortexConfig;
}

export interface GatewayResponse<T = any> {
  /** Response data from the AI provider */
  data: T;
  /** Response headers from the gateway */
  headers: Record<string, string>;
  /** HTTP status code */
  status: number;
  /** Gateway metadata */
  metadata: {
    /** Cache status (HIT or MISS) */
    cacheStatus?: 'HIT' | 'MISS';
    /** Processing time in milliseconds */
    processingTime?: number;
    /** Number of retry attempts made */
    retryAttempts?: number;
    /** Budget remaining after this request */
    budgetRemaining?: number;
    /** Unique request ID from gateway */
    requestId?: string;
    /** Index of the provider that handled the request (for failover) */
    failoverProviderIndex?: number;
  };
}

export interface GatewayStats {
  /** Total requests processed */
  totalRequests: number;
  /** Cache hit rate percentage */
  cacheHitRate: number;
  /** Average response time in milliseconds */
  averageResponseTime: number;
  /** Total retry attempts made */
  totalRetryAttempts: number;
  /** Success rate percentage */
  successRate: number;
  /** Requests by provider */
  providerStats: Record<
    string,
    {
      requests: number;
      successRate: number;
      averageResponseTime: number;
    }
  >;
}

export interface CacheStats {
  /** Single response cache statistics */
  singleResponseCache: {
    size: number;
    entries: CacheEntry[];
  };
  /** Bucket cache statistics */
  bucketCache: {
    size: number;
    buckets: CacheBucket[];
  };
  /** Cache configuration */
  config: {
    defaultTTL: number;
    defaultTTLHours: number;
  };
}

export interface CacheEntry {
  key: string;
  timestamp: number;
  age: number;
  ttl?: number;
  userScope?: string;
  expired: boolean;
}

export interface CacheBucket {
  key: string;
  entryCount: number;
  currentIndex: number;
  entries: CacheEntry[];
}

export interface WorkflowSummary {
  workflowId: string;
  workflowName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalCost: number;
  totalTokens: number;
  requestCount: number;
  averageCost: number;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  step: string;
  cost: number;
  tokens: number;
  requestCount: number;
}

export interface WorkflowDetails {
  workflowId: string;
  workflowName: string;
  requests: WorkflowRequest[];
  totalCost: number;
  totalTokens: number;
  duration: number;
  steps: string[];
}

export interface WorkflowRequest {
  _id: string;
  model: string;
  service: string;
  cost: number;
  totalTokens: number;
  workflowStep: string;
  workflowSequence: number;
  createdAt: Date;
  prompt?: string;
}

/**
 * OpenAI-compatible request format for the gateway
 */
export interface OpenAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  stream?: boolean;
}

/**
 * Anthropic-compatible request format for the gateway
 */
export interface AnthropicRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  stream?: boolean;
}

/**
 * Google AI-compatible request format for the gateway
 */
export interface GoogleAIRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
}

/**
 * Cohere-compatible request format for the gateway
 */
export interface CohereRequest {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  k?: number;
  p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  end_sequences?: string[];
  stop_sequences?: string[];
  return_likelihoods?: string;
  truncate?: string;
}

/**
 * Proxy Key interfaces for Key Vault functionality
 */
export interface ProxyKeyInfo {
  /** Proxy key ID (ck-proxy-*) */
  keyId: string;
  /** Human-readable name */
  name: string;
  /** Description */
  description?: string;
  /** Associated provider */
  provider: string;
  /** Permissions */
  permissions: ('read' | 'write' | 'admin')[];
  /** Budget limits */
  budgetLimit?: number;
  dailyBudgetLimit?: number;
  monthlyBudgetLimit?: number;
  /** Rate limiting */
  rateLimit?: number;
  /** Security restrictions */
  allowedIPs?: string[];
  allowedDomains?: string[];
  /** Status */
  isActive: boolean;
  /** Usage statistics */
  usageStats: {
    totalRequests: number;
    totalCost: number;
    dailyCost: number;
    monthlyCost: number;
  };
}

export interface ProxyKeyUsageOptions {
  /** Track usage under a specific project */
  projectId?: string;
  /** Add custom properties for cost attribution */
  properties?: Record<string, string>;
  /** Override model for this request */
  modelOverride?: string;
  /** Omit request content from logs */
  omitRequest?: boolean;
  /** Omit response content from logs */
  omitResponse?: boolean;
}

/**
 * Firewall threat detection result
 */
export interface ThreatDetectionResult {
  /** Whether the request was blocked */
  isBlocked: boolean;
  /** Threat category if blocked */
  threatCategory?: string;
  /** Confidence score (0.0-1.0) */
  confidence: number;
  /** Human-readable reason */
  reason: string;
  /** Detection stage */
  stage: 'prompt-guard' | 'openai-safeguard';
  /** Additional details */
  details?: any;
}

/**
 * Firewall analytics data
 */
export interface FirewallAnalytics {
  /** Total requests processed */
  totalRequests: number;
  /** Number of blocked requests */
  blockedRequests: number;
  /** Total cost saved by blocking threats */
  costSaved: number;
  /** Threats grouped by category */
  threatsByCategory: Record<string, number>;
  /** Cost savings by threat type */
  savingsByThreatType: Record<string, number>;
}

/**
 * Firewall request options
 */
export interface FirewallOptions {
  /** Enable basic firewall */
  enabled?: boolean;
  /** Enable advanced firewall */
  advanced?: boolean;
  /** Custom prompt threshold */
  promptThreshold?: number;
  /** Custom OpenAI Safeguard threshold */
  openaiThreshold?: number;
}
