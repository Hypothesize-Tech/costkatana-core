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
  type: 'prompt' | 'model' | 'batching' | 'caching';
  originalPrompt?: string;
  optimizedPrompt?: string;
  estimatedSavings: number;
  confidence: number;
  explanation: string;
  implementation?: string;
  tradeoffs?: string;
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
  bedrockConfig?: BedrockConfig;
  thresholds: {
    highCostPerRequest: number;
    highTokenUsage: number;
    frequencyThreshold: number;
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
  storageType: 'memory' | 'file' | 'custom';
  customStorage?: CustomStorage;
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

export interface CustomStorage {
  save: (data: UsageMetadata) => Promise<void>;
  load: (filter?: any) => Promise<UsageMetadata[]>;
  clear: () => Promise<void>;
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
