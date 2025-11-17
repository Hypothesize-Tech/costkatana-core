/**
 * Logging Types for Cost Katana SDK
 */

export interface AILogEntry {
  // Required fields
  userId?: string;
  projectId?: string;
  service: string;
  operation: string;
  aiModel: string;
  statusCode: number;
  responseTime: number;

  // Optional fields
  requestId?: string;
  endpoint?: string;
  method?: string;
  modelVersion?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  prompt?: string;
  parameters?: Record<string, any>;
  success?: boolean;
  cost?: number;
  result?: string;
  errorMessage?: string;
  errorType?: string;
  errorStack?: string;
  errorCode?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  cortexEnabled?: boolean;
  cortexOptimizationApplied?: boolean;
  cacheHit?: boolean;
  cacheKey?: string;
  retryAttempt?: number;
  ttfb?: number;
  streamingLatency?: number;
  queueTime?: number;
  costBreakdown?: {
    inputCost?: number;
    outputCost?: number;
    cacheCost?: number;
    additionalFees?: number;
  };
  tags?: string[];
  environment?: 'development' | 'staging' | 'production';
  region?: string;
  logLevel?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  logSource?: string;
  
  // Template metadata
  templateId?: string;
  templateName?: string;
  templateVariables?: Record<string, any>;
  templateCategory?: string;
}

export interface AILoggerConfig {
  apiKey?: string;
  projectId?: string;
  baseUrl?: string;
  batchSize?: number;
  flushInterval?: number;
  enableLogging?: boolean;
  maxPromptLength?: number;
  maxResultLength?: number;
  redactSensitiveData?: boolean;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ConsoleLoggerConfig {
  level?: LogLevel;
  prefix?: string;
  timestamps?: boolean;
  colors?: boolean;
}

