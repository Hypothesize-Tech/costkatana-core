import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const OPENAI_PRICING: ModelPricingConfig[] = [
  {
    modelId: 'gpt-4o-mini-2024-07-18',
    modelName: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: true,
    notes: 'Latest GPT-4o Mini model with vision capabilities'
  },
  {
    modelId: 'gpt-4o',
    modelName: 'GPT-4o',
    provider: 'OpenAI',
    inputPrice: 2.5,
    outputPrice: 10.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: true,
    notes: 'Latest GPT-4o model with enhanced capabilities'
  },
  {
    modelId: 'gpt-4o-mini',
    modelName: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: true,
    notes: 'GPT-4o Mini model with vision capabilities'
  },
  {
    modelId: 'gpt-4-turbo',
    modelName: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputPrice: 10.0,
    outputPrice: 30.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'multimodal'],
    category: 'text',
    isLatest: false,
    notes: 'GPT-4 Turbo with vision capabilities'
  },
  {
    modelId: 'gpt-4',
    modelName: 'GPT-4',
    provider: 'OpenAI',
    inputPrice: 30.0,
    outputPrice: 60.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['text'],
    category: 'text',
    isLatest: false,
    notes: 'GPT-4 base model'
  },
  {
    modelId: 'gpt-3.5-turbo',
    modelName: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    inputPrice: 0.5,
    outputPrice: 1.5,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 16385,
    capabilities: ['text'],
    category: 'text',
    isLatest: false,
    notes: 'GPT-3.5 Turbo model'
  },
  {
    modelId: 'gpt-4.1-2025-04-14',
    modelName: 'GPT-4.1',
    provider: 'OpenAI',
    inputPrice: 2.0,
    outputPrice: 8.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'analysis', 'reasoning'],
    category: 'text',
    isLatest: true,
    notes: 'Latest GPT-4.1 model with enhanced capabilities'
  },
  {
    modelId: 'text-embedding-ada-002',
    modelName: 'Ada v2 Embedding',
    provider: 'OpenAI',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8191,
    capabilities: ['embedding'],
    category: 'embedding',
    isLatest: false,
    notes: 'Legacy embedding model'
  }
];
