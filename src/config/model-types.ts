import { PRICING_CONFIG } from './pricing-data';

/**
 * Utility to extract model IDs from pricing configuration
 */
function extractModelIds(providerName: string): string[] {
  const providerModels = PRICING_CONFIG[providerName] || [];
  return providerModels.map(model => model.modelId);
}

// Extract model IDs from pricing configurations
const openAIModelIds = extractModelIds('OpenAI');
const anthropicModelIds = extractModelIds('Anthropic');
const awsBedrockModelIds = extractModelIds('AWS Bedrock');
const googleModelIds = extractModelIds('Google AI');
const cohereModelIds = extractModelIds('Cohere');
const groqModelIds = extractModelIds('Grok');
const deepSeekModelIds = extractModelIds('DeepSeek');
const mistralModelIds = extractModelIds('Mistral AI');
const xaiModelIds = extractModelIds('xAI');
const metaModelIds = extractModelIds('Meta');

// Generate literal types from actual pricing data
export type OpenAIModels = (typeof openAIModelIds)[number];
export type AnthropicModels = (typeof anthropicModelIds)[number];
export type AWSBedrockModels = (typeof awsBedrockModelIds)[number];
export type GoogleModels = (typeof googleModelIds)[number];
export type CohereModels = (typeof cohereModelIds)[number];
export type GroqModels = (typeof groqModelIds)[number];
export type DeepSeekModels = (typeof deepSeekModelIds)[number];
export type MistralModels = (typeof mistralModelIds)[number];
export type XAIModels = (typeof xaiModelIds)[number];
export type MetaModels = (typeof metaModelIds)[number];

// Export the model ID arrays for runtime use
export const OPENAI_MODEL_IDS = openAIModelIds;
export const ANTHROPIC_MODEL_IDS = anthropicModelIds;
export const AWS_BEDROCK_MODEL_IDS = awsBedrockModelIds;
export const GOOGLE_MODEL_IDS = googleModelIds;
export const COHERE_MODEL_IDS = cohereModelIds;
export const GROQ_MODEL_IDS = groqModelIds;
export const DEEPSEEK_MODEL_IDS = deepSeekModelIds;
export const MISTRAL_MODEL_IDS = mistralModelIds;
export const XAI_MODEL_IDS = xaiModelIds;
export const META_MODEL_IDS = metaModelIds;

// Utility function to get models for a specific provider
export function getModelsForProvider(provider: string): string[] {
  switch (provider) {
    case 'OpenAI':
      return [...OPENAI_MODEL_IDS];
    case 'Anthropic':
      return [...ANTHROPIC_MODEL_IDS];
    case 'AWS Bedrock':
      return [...AWS_BEDROCK_MODEL_IDS];
    case 'Google AI':
      return [...GOOGLE_MODEL_IDS];
    case 'Cohere':
      return [...COHERE_MODEL_IDS];
    case 'Grok':
      return [...GROQ_MODEL_IDS];
    case 'DeepSeek':
      return [...DEEPSEEK_MODEL_IDS];
    case 'Mistral AI':
      return [...MISTRAL_MODEL_IDS];
    case 'xAI':
      return [...XAI_MODEL_IDS];
    case 'Meta':
      return [...META_MODEL_IDS];
    default:
      return [];
  }
}

// Type guard functions
export function isOpenAIModel(model: string): model is OpenAIModels {
  return OPENAI_MODEL_IDS.includes(model as OpenAIModels);
}

export function isAnthropicModel(model: string): model is AnthropicModels {
  return ANTHROPIC_MODEL_IDS.includes(model as AnthropicModels);
}

export function isAWSBedrockModel(model: string): model is AWSBedrockModels {
  return AWS_BEDROCK_MODEL_IDS.includes(model as AWSBedrockModels);
}

export function isGoogleModel(model: string): model is GoogleModels {
  return GOOGLE_MODEL_IDS.includes(model as GoogleModels);
}

export function isCohereModel(model: string): model is CohereModels {
  return COHERE_MODEL_IDS.includes(model as CohereModels);
}

export function isGroqModel(model: string): model is GroqModels {
  return GROQ_MODEL_IDS.includes(model as GroqModels);
}

export function isDeepSeekModel(model: string): model is DeepSeekModels {
  return DEEPSEEK_MODEL_IDS.includes(model as DeepSeekModels);
}

export function isMistralModel(model: string): model is MistralModels {
  return MISTRAL_MODEL_IDS.includes(model as MistralModels);
}

export function isXAIModel(model: string): model is XAIModels {
  return XAI_MODEL_IDS.includes(model as XAIModels);
}

export function isMetaModel(model: string): model is MetaModels {
  return META_MODEL_IDS.includes(model as MetaModels);
}

// Helper to validate model for provider
export function validateModelForProvider(provider: string, model: string): boolean {
  const providerModels = getModelsForProvider(provider);
  return providerModels.includes(model);
}

// All models type (union of all provider models)
export type AllModels =
  | OpenAIModels
  | AnthropicModels
  | AWSBedrockModels
  | GoogleModels
  | CohereModels
  | GroqModels
  | DeepSeekModels
  | MistralModels
  | XAIModels;
