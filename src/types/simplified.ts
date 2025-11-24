import { AIProvider } from './index';
import {
  OpenAIModels,
  AnthropicModels,
  AWSBedrockModels,
  GoogleModels,
  CohereModels,
  GroqModels,
  DeepSeekModels,
  MistralModels,
  XAIModels,
  MetaModels,
  AllModels
} from '../config/model-types';

// Re-export model types from config
export type {
  OpenAIModels,
  AnthropicModels,
  AWSBedrockModels,
  GoogleModels,
  CohereModels,
  GroqModels,
  DeepSeekModels,
  MistralModels,
  XAIModels,
  MetaModels,
  AllModels
};

// Provider-model mapping type for type safety
export type ProviderModelMap = {
  [AIProvider.OpenAI]: OpenAIModels;
  [AIProvider.Anthropic]: AnthropicModels;
  [AIProvider.AWSBedrock]: AWSBedrockModels;
  [AIProvider.Google]: GoogleModels;
  [AIProvider.Cohere]: CohereModels;
  [AIProvider.Grok]: GroqModels;
  [AIProvider.DeepSeek]: DeepSeekModels;
  [AIProvider.Mistral]: MistralModels;
  [AIProvider.XAI]: XAIModels;
  [AIProvider.Meta]: MetaModels;
};

// Simplified configuration for easy setup
export interface SimpleConfig<T extends keyof ProviderModelMap> {
  provider: T;
  model: ProviderModelMap[T];
  apiKey?: string;
  region?: string; // For AWS Bedrock
  projectId?: string; // For tracking and analytics
  enableOptimization?: boolean;
  enableAutoTracking?: boolean;
}

// Union type for all possible simple configs
export type AnySimpleConfig =
  | SimpleConfig<AIProvider.OpenAI>
  | SimpleConfig<AIProvider.Anthropic>
  | SimpleConfig<AIProvider.AWSBedrock>
  | SimpleConfig<AIProvider.Google>
  | SimpleConfig<AIProvider.Cohere>
  | SimpleConfig<AIProvider.Grok>
  | SimpleConfig<AIProvider.DeepSeek>
  | SimpleConfig<AIProvider.Mistral>
  | SimpleConfig<AIProvider.XAI>
  | SimpleConfig<AIProvider.Meta>;

// Simple request interface
export interface SimpleRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemMessage?: string;
  userId?: string;
  sessionId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Simple response interface
export interface SimpleResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: {
    promptCost: number;
    completionCost: number;
    totalCost: number;
    currency: string;
  };
  model: string;
  provider: string;
  responseTime: number;
}

// Simple cost estimate
export interface SimpleCostEstimate {
  estimatedCost: number;
  currency: string;
  breakdown: {
    promptCost: number;
    estimatedCompletionCost: number;
  };
  tokens: {
    promptTokens: number;
    estimatedCompletionTokens: number;
  };
}
