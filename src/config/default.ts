import { TrackerConfig, AIProvider } from '../types';

export const optimizationThresholds = {
  highCostPerRequest: 0.1, // $0.10
  highTokenUsage: 2000,
  frequencyThreshold: 10,
  batchingThreshold: 3,
  modelDowngradeConfidence: 0.7
};

export const defaultConfig: Partial<TrackerConfig> = {
  providers: [],
  optimization: {
    enablePromptOptimization: true,
    enableModelSuggestions: true,
    enableCachingSuggestions: true,
    enableCompression: true,
    enableContextTrimming: true,
    enableRequestFusion: true,
    thresholds: optimizationThresholds
  },
  tracking: {
    enableAutoTracking: true,
    retentionDays: 30
  },
  alerts: {
    costThreshold: 100, // $100 per day
    tokenThreshold: 1000000, // 1M tokens per day
    emailNotifications: false
  }
};

export const defaultBedrockRegion = 'us-east-1';

export const defaultOptimizationModel = 'anthropic.claude-3-5-sonnet-20240620-v1:0';

export const supportedProviders = [
  AIProvider.OpenAI,
  AIProvider.AWSBedrock,
  AIProvider.Anthropic,
  AIProvider.Google,
  AIProvider.Cohere,
  AIProvider.Azure,
  AIProvider.DeepSeek,
  AIProvider.Groq,
  AIProvider.Mistral,
  AIProvider.XAI,
  AIProvider.HuggingFace,
  AIProvider.Ollama,
  AIProvider.Replicate,
  AIProvider.Gemini
];

export const providerEndpoints: Record<AIProvider, string> = {
  [AIProvider.OpenAI]: 'https://api.openai.com/v1',
  [AIProvider.AWSBedrock]: 'bedrock-runtime.{region}.amazonaws.com',
  [AIProvider.Anthropic]: 'https://api.anthropic.com/v1',
  [AIProvider.Google]: 'https://generativelanguage.googleapis.com/v1',
  [AIProvider.Cohere]: 'https://api.cohere.ai/v1',
  [AIProvider.Azure]: 'https://{resourceName}.openai.azure.com',
  [AIProvider.DeepSeek]: 'https://api.deepseek.com/v1',
  [AIProvider.Groq]: 'https://api.groq.com/openai/v1',
  [AIProvider.Mistral]: 'https://api.mistral.ai/v1',
  [AIProvider.XAI]: 'https://api.x.ai/v1',
  [AIProvider.HuggingFace]: 'https://api-inference.huggingface.co/v1',
  [AIProvider.Ollama]: 'http://localhost:11434/v1',
  [AIProvider.Replicate]: 'https://api.replicate.com/v1',
  [AIProvider.Gemini]: 'https://generativelanguage.googleapis.com/v1'
};

export const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'User-Agent': 'ai-cost-tracker/1.0.0'
};

export const retryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

export const cachingConfig = {
  defaultTTL: 3600, // 1 hour in seconds
  maxCacheSize: 100, // Maximum number of cached responses
  compressionEnabled: true
};

export const alertThresholds = {
  costSpike: 2.0, // 2x normal usage
  tokenSpike: 2.5, // 2.5x normal usage
  errorRate: 0.1, // 10% error rate
  latencyP95: 5000 // 5 seconds
};

export const exportFormats = ['json', 'csv', 'xlsx'] as const;

export const timeRanges = {
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
  weekly: 7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000
};

export const logConfig = {
  maxLogSize: 10 * 1024 * 1024, // 10MB
  logRotation: true,
  compressionEnabled: true,
  retentionDays: 7
};
