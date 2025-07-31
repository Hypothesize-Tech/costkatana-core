import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const DEEPSEEK_PRICING: ModelPricingConfig[] = [
  // DeepSeek Chat (V3-0324) - Latest
  {
    modelId: 'deepseek-chat',
    modelName: 'DeepSeek Chat (V3-0324)',
    provider: 'DeepSeek',
    inputPrice: 0.27, // Standard price (cache miss)
    outputPrice: 1.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 64000,
    cachedInputPrice: 0.07, // Cache hit price
    capabilities: [
      'text',
      'analysis',
      'json-output',
      'function-calling',
      'chat-prefix-completion',
      'fim-completion'
    ],
    category: 'text',
    isLatest: true,
    notes:
      'Latest DeepSeek V3 model with 64K context. Cache hit: $0.07, Off-peak 50% discount (16:30-00:30 UTC)'
  },
  // DeepSeek Reasoner (R1-0528) - Latest Reasoning Model
  {
    modelId: 'deepseek-reasoner',
    modelName: 'DeepSeek Reasoner (R1-0528)',
    provider: 'DeepSeek',
    inputPrice: 0.55, // Standard price (cache miss)
    outputPrice: 2.19,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 64000,
    cachedInputPrice: 0.14, // Cache hit price
    capabilities: [
      'text',
      'reasoning',
      'cot',
      'json-output',
      'function-calling',
      'chat-prefix-completion'
    ],
    category: 'reasoning',
    isLatest: true,
    notes:
      'Latest DeepSeek R1 reasoning model with CoT. Max 32K default output (64K max). Cache hit: $0.14, Off-peak 75% discount (16:30-00:30 UTC)'
  },
  // DeepSeek V3 (Previous version for compatibility)
  {
    modelId: 'deepseek-v3',
    modelName: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputPrice: 0.27,
    outputPrice: 1.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 64000,
    cachedInputPrice: 0.07,
    capabilities: ['text', 'analysis', 'json-output', 'function-calling'],
    category: 'text',
    isLatest: false,
    notes: 'DeepSeek V3 base model with context caching support'
  },
  // DeepSeek V2.5 (Legacy)
  {
    modelId: 'deepseek-v2.5',
    modelName: 'DeepSeek V2.5',
    provider: 'DeepSeek',
    inputPrice: 0.14,
    outputPrice: 0.28,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32000,
    capabilities: ['text', 'analysis'],
    category: 'text',
    isLatest: false,
    notes: 'Previous generation DeepSeek model'
  },
  // DeepSeek Coder (Legacy)
  {
    modelId: 'deepseek-coder',
    modelName: 'DeepSeek Coder',
    provider: 'DeepSeek',
    inputPrice: 0.14,
    outputPrice: 0.28,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32000,
    capabilities: ['text', 'code', 'analysis'],
    category: 'code',
    isLatest: false,
    notes: 'Specialized coding model from DeepSeek'
  },
  // DeepSeek R1-Lite (Legacy reasoning)
  {
    modelId: 'deepseek-r1-lite',
    modelName: 'DeepSeek R1-Lite',
    provider: 'DeepSeek',
    inputPrice: 0.14,
    outputPrice: 0.28,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32000,
    capabilities: ['text', 'reasoning', 'cot'],
    category: 'reasoning',
    isLatest: false,
    notes: 'Lightweight reasoning model from DeepSeek'
  }
];
