import { AIProvider } from './index';

export interface ProviderModel {
  id: string;
  name: string;
  provider: AIProvider;
  maxTokens: number;
  contextWindow: number;
  pricing: ModelPricing;
  capabilities: ModelCapabilities;
}

export interface ModelPricing {
  prompt: number;
  completion: number;
  unit: PricingUnit;
  currency: string;
  effectiveDate: string;
}

export enum PricingUnit {
  PerToken = 'per-token',
  Per1KTokens = 'per-1k-tokens',
  Per1MTokens = 'per-1m-tokens'
}

export interface ModelCapabilities {
  chat: boolean;
  completion: boolean;
  embedding: boolean;
  functionCalling: boolean;
  vision: boolean;
  audio: boolean;
  streaming: boolean;
}

// OpenAI specific types
export interface OpenAIModel extends ProviderModel {
  provider: AIProvider.OpenAI;
  apiVersion?: string;
  deprecated?: boolean;
  replacedBy?: string;
}

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// AWS Bedrock specific types
export interface BedrockModel extends ProviderModel {
  provider: AIProvider.AWSBedrock;
  modelId: string;
  region: string[];
  inputFormats: string[];
  outputFormats: string[];
}

export interface BedrockUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  invocationLatency?: number;
  firstByteLatency?: number;
}

// Anthropic specific types
export interface AnthropicModel extends ProviderModel {
  provider: AIProvider.Anthropic;
  version: string;
  trainingCutoff: string;
}

export interface AnthropicUsage {
  input_tokens: number;
  output_tokens: number;
}

// Google specific types
export interface GoogleModel extends ProviderModel {
  provider: AIProvider.Google;
  apiVersion: string;
  supportedLanguages: string[];
}

export interface GoogleUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

// Cohere specific types
export interface CohereModel extends ProviderModel {
  provider: AIProvider.Cohere;
  endpoint: string;
  finetunable: boolean;
}

export interface CohereUsage {
  tokens: {
    input_tokens: number;
    output_tokens: number;
  };
  meta: {
    billed_units: {
      input_tokens: number;
      output_tokens: number;
    };
  };
}

// Provider request/response types
export interface ProviderRequest {
  model: string;
  prompt?: string;
  messages?: Message[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  stream?: boolean;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  functionCall?: any;
}

export interface ProviderResponse {
  id: string;
  model: string;
  choices: Choice[];
  usage: any;
  created?: number;
  metadata?: Record<string, any>;
}

export interface Choice {
  text?: string;
  message?: Message;
  index: number;
  finishReason?: string;
  logprobs?: any;
}

export type AnyModel = OpenAIModel | BedrockModel | AnthropicModel | GoogleModel | CohereModel;
export type AnyUsage = OpenAIUsage | BedrockUsage | AnthropicUsage | GoogleUsage | CohereUsage;
