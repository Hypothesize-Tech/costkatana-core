export enum PricingUnit {
  Per1KTokens = 'PER_1K_TOKENS',
  Per1MTokens = 'PER_1M_TOKENS',
  PerRequest = 'PER_REQUEST',
  PerHour = 'PER_HOUR',
  PerMinute = 'PER_MINUTE',
  PerSecond = 'PER_SECOND',
  Per1KCharacters = 'PER_1K_CHARACTERS',
  PerImage = 'PER_IMAGE'
}

export interface ModelPricingConfig {
  modelId: string;
  modelName: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  unit: PricingUnit;
  contextWindow?: number;
  capabilities?: string[];
  category?: string;
  isLatest?: boolean;
  notes?: string;
  region?: string;
  cachedInputPrice?: number;
}

// Import provider-specific pricing configurations
import { OPENAI_PRICING } from './pricing/openai';
import { XAI_PRICING } from './pricing/xai';
import { ANTHROPIC_PRICING } from './pricing/anthropic';
import { GOOGLE_PRICING } from './pricing/google';
import { DEEPSEEK_PRICING } from './pricing/deepseek';
import { MISTRAL_PRICING } from './pricing/mistral';
import { COHERE_PRICING } from './pricing/cohere';
import { GROK_PRICING } from './pricing/grok';
import { META_PRICING } from './pricing/meta';
import { AWS_BEDROCK_PRICING } from './pricing/aws-bedrock';

// Fresh pricing data organized by provider - July 2025
export const PRICING_CONFIG: Record<string, ModelPricingConfig[]> = {
  OpenAI: OPENAI_PRICING,
  xAI: XAI_PRICING,
  Anthropic: ANTHROPIC_PRICING,
  'Google AI': GOOGLE_PRICING,
  DeepSeek: DEEPSEEK_PRICING,
  'Mistral AI': MISTRAL_PRICING,
  Cohere: COHERE_PRICING,
  Groq: GROK_PRICING,
  Meta: META_PRICING,
  'AWS Bedrock': AWS_BEDROCK_PRICING
};

// Utility functions for accessing pricing data
export function getAllProviders(): string[] {
  return Object.keys(PRICING_CONFIG).sort();
}

export function getProviderModels(provider: string): ModelPricingConfig[] {
  return PRICING_CONFIG[provider] || [];
}

export function getModelPricing(provider: string, modelId: string): ModelPricingConfig | null {
  const providerModels = PRICING_CONFIG[provider] || [];
  return (
    providerModels.find(model => model.modelId.toLowerCase() === modelId.toLowerCase()) || null
  );
}

export function getLatestModels(): ModelPricingConfig[] {
  const allModels: ModelPricingConfig[] = [];

  Object.values(PRICING_CONFIG).forEach(providerModels => {
    allModels.push(...providerModels.filter(model => model.isLatest));
  });

  return allModels.sort((a, b) => {
    const aCost = a.inputPrice + a.outputPrice;
    const bCost = b.inputPrice + b.outputPrice;
    return aCost - bCost;
  });
}

export function getModelsByCategory(category: string): ModelPricingConfig[] {
  const allModels: ModelPricingConfig[] = [];

  Object.values(PRICING_CONFIG).forEach(providerModels => {
    allModels.push(
      ...providerModels.filter(model => model.category?.toLowerCase() === category.toLowerCase())
    );
  });

  return allModels.sort((a, b) => {
    const aCost = a.inputPrice + a.outputPrice;
    const bCost = b.inputPrice + b.outputPrice;
    return aCost - bCost;
  });
}

export function findCheapestModel(provider?: string, category?: string): ModelPricingConfig | null {
  let candidates: ModelPricingConfig[] = [];

  if (provider) {
    candidates = PRICING_CONFIG[provider] || [];
  } else {
    Object.values(PRICING_CONFIG).forEach(providerModels => {
      candidates.push(...providerModels);
    });
  }

  if (category) {
    candidates = candidates.filter(
      model => model.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (candidates.length === 0) return null;

  return candidates.reduce((cheapest, current) => {
    const cheapestCost = cheapest.inputPrice + cheapest.outputPrice;
    const currentCost = current.inputPrice + current.outputPrice;
    return currentCost < cheapestCost ? current : cheapest;
  });
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  provider: string,
  modelId: string
): number {
  const pricing = getModelPricing(provider, modelId);

  if (!pricing) {
    throw new Error(`No pricing data found for ${provider}/${modelId}`);
  }

  // Convert to million tokens for calculation (all prices are per 1M tokens)
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

  return inputCost + outputCost;
}

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  provider: string,
  modelId: string
): { inputCost: number; outputCost: number; totalCost: number } {
  const pricing = getModelPricing(provider, modelId);

  if (!pricing) {
    throw new Error(`No pricing data found for ${provider}/${modelId}`);
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}

export function compareProviders(
  inputTokens: number,
  outputTokens: number,
  providers?: string[]
): Array<{
  provider: string;
  model: string;
  cost: number;
  costBreakdown: { inputCost: number; outputCost: number };
  isLatest: boolean;
}> {
  const modelsToCompare: ModelPricingConfig[] = [];

  if (providers && providers.length > 0) {
    providers.forEach(provider => {
      const providerModels = PRICING_CONFIG[provider] || [];
      modelsToCompare.push(...providerModels);
    });
  } else {
    Object.values(PRICING_CONFIG).forEach(providerModels => {
      modelsToCompare.push(...providerModels);
    });
  }

  return modelsToCompare
    .map(pricing => {
      const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
      const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

      return {
        provider: pricing.provider,
        model: pricing.modelName,
        cost: inputCost + outputCost,
        costBreakdown: { inputCost, outputCost },
        isLatest: pricing.isLatest || false
      };
    })
    .sort((a, b) => a.cost - b.cost);
}

// Configuration metadata
export const PRICING_METADATA = {
  lastUpdated: new Date().toISOString(),
  source: 'WebScraperService - July 2025',
  dataVersion: '2025.07',
  totalProviders: getAllProviders().length,
  totalModels: Object.values(PRICING_CONFIG).reduce((sum, models) => sum + models.length, 0),
  standardUnit: PricingUnit.Per1MTokens,
  features: [
    'July 2025 fresh pricing data',
    'xAI Grok models (Grok 4, Grok 3, Grok 2 with regional variants)',
    'Grok image generation and vision capabilities',
    'OpenAI reasoning models (o3, o4-mini, o3-pro)',
    'GPT-4.1 and GPT-4.5 new models',
    'DeepSeek ultra-low cost models with complete lineup',
    'DeepSeek Chat (V3-0324) and Reasoner (R1-0528)',
    'Context caching and off-peak pricing support',
    'Complete Mistral AI lineup with all models',
    'Mistral Medium 3, Magistral Medium/Small, Codestral, Devstral',
    'Document AI & OCR, Mistral Saba, Pixtral Large/12B',
    'Ministral 8B/3B, embedding and moderation models',
    'Complete Cohere AI lineup with all models',
    'Command A, Command R+/R/R7B, Rerank 3.5, Embed 4',
    'Cohere generative and retrieval models',
    'Groq ultra-fast inference',
    'All AWS Bedrock models',
    'Claude 4 (Opus, Sonnet) and 3.7/3.5/3 Haiku/Sonnet/Opus (2025)',
    'Google Gemini 1.5 with 1M context',
    'Comprehensive embedding models',
    'Provider-organized structure',
    'Enhanced model metadata',
    'Context window information',
    'Capability categorization'
  ]
};
