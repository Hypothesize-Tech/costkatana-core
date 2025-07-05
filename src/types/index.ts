export interface UsageMetadata {
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  prompt: string;
  completion?: string;
  responseTime?: number;
  tags?: string[];
  sessionId?: string;
}

export interface CostEstimate {
  promptCost: number;
  completionCost: number;
  totalCost: number;
  currency: string;
  breakdown: {
    promptTokens: number;
    completionTokens: number;
    pricePerPromptToken: number;
    pricePerCompletionToken: number;
  };
}

export interface OptimizationSuggestion {
  id: string;
  type: 'prompt' | 'model' | 'batching' | 'caching' | 'compression' | 'context_trimming' | 'request_fusion';
  originalPrompt?: string;
  optimizedPrompt?: string;
  estimatedSavings: number;
  confidence: number;
  explanation: string;
  implementation?: string;
  tradeoffs?: string;
  compressionDetails?: CompressionDetails;
  contextTrimDetails?: ContextTrimDetails;
  fusionDetails?: RequestFusionDetails;
}

export interface CompressionDetails {
  technique: 'json_compression' | 'pattern_replacement' | 'abbreviation' | 'deduplication';
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  reversible: boolean;
}

export interface ContextTrimDetails {
  technique: 'summarization' | 'relevance_filtering' | 'sliding_window' | 'importance_scoring';
  originalMessages: number;
  trimmedMessages: number;
  preservedContext: string[];
}

export interface RequestFusionDetails {
  fusedRequests: string[];
  fusionStrategy: 'sequential' | 'parallel' | 'hierarchical';
  estimatedTimeReduction: number;
}

export interface OptimizationResult {
  id: string;
  suggestions: OptimizationSuggestion[];
  totalSavings: number;
  appliedOptimizations: string[];
  metadata: {
    processingTime: number;
    originalTokens: number;
    optimizedTokens: number;
    techniques: string[];
  };
}

export interface UsageAnalytics {
  totalCost: number;
  totalTokens: number;
  averageTokensPerRequest: number;
  mostUsedModels: ModelUsage[];
  costByProvider: ProviderCost[];
  usageOverTime: TimeSeriesData[];
  topExpensivePrompts: ExpensivePrompt[];
}

export interface ModelUsage {
  model: string;
  provider: AIProvider;
  requestCount: number;
  totalTokens: number;
  totalCost: number;
  averageCostPerRequest: number;
}

export interface ProviderCost {
  provider: AIProvider;
  totalCost: number;
  percentage: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  cost: number;
  tokens: number;
  requests: number;
}

export interface ExpensivePrompt {
  prompt: string;
  cost: number;
  tokens: number;
  model: string;
  timestamp: Date;
}

export enum AIProvider {
  OpenAI = 'openai',
  AWSBedrock = 'aws-bedrock',
  Anthropic = 'anthropic',
  Google = 'google',
  Cohere = 'cohere',
  Gemini = 'gemini',
  DeepSeek = 'deepseek',
  Groq = 'groq',
  HuggingFace = 'huggingface',
  Ollama = 'ollama',
  Replicate = 'replicate',
  Azure = 'azure'
}

import { LoggerConfig } from '../utils/logger';

export interface TrackerConfig {
  providers: ProviderConfig[];
  optimization: OptimizationConfig;
  tracking: TrackingConfig;
  alerts?: AlertConfig;
  logger?: LoggerConfig;
  apiUrl?: string;
}

export interface ProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  region?: string;
  endpoint?: string;
  customPricing?: CustomPricing;
  optimization?: OptimizationConfig;

  // Azure specific
  resourceName?: string;
  deploymentId?: string;
  apiVersion?: string;
}

export interface OptimizationConfig {
  enablePromptOptimization: boolean;
  enableModelSuggestions: boolean;
  enableCachingSuggestions: boolean;
  enableCompression?: boolean;
  enableContextTrimming?: boolean;
  enableRequestFusion?: boolean;
  bedrockConfig?: BedrockConfig;
  compressionSettings?: {
    minCompressionRatio: number;
    jsonCompressionThreshold: number;
  };
  contextTrimmingSettings?: {
    maxContextLength: number;
    preserveRecentMessages: number;
    summarizationModel?: string;
  };
  requestFusionSettings?: {
    maxFusionBatch: number;
    fusionWaitTime: number;
  };
  thresholds: {
    highCostPerRequest: number;
    highTokenUsage: number;
    frequencyThreshold: number;
    batchingThreshold?: number;
    modelDowngradeConfidence?: number;
  };
}

export interface BedrockConfig {
  region: string;
  modelId: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  };
}

export interface TrackingConfig {
  enableAutoTracking: boolean;
  retentionDays?: number;
}

export interface AlertConfig {
  costThreshold?: number;
  tokenThreshold?: number;
  emailNotifications?: boolean;
  webhookUrl?: string;
}

export interface CustomPricing {
  [model: string]: {
    promptPrice: number;
    completionPrice: number;
    unit: 'per-token' | 'per-1k-tokens' | 'per-1m-tokens';
  };
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    tokensUsed: number;
    cost: number;
  };
}
