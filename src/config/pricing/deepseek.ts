import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const DEEPSEEK_PRICING: ModelPricingConfig[] = [
  // DeepSeek Chat (V3.2) - Latest
  {
    modelId: 'deepseek-chat',
    modelName: 'DeepSeek Chat (V3.2)',
    provider: 'DeepSeek',
    inputPrice: 0.28, // Standard price (cache miss)
    outputPrice: 0.42,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    cachedInputPrice: 0.028, // Cache hit price
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
      'Latest DeepSeek V3.2 model with 128K context. Max output: 4K default, 8K maximum. Cache hit: $0.028 per 1M tokens'
  },
  // DeepSeek Reasoner (V3.2 Thinking Mode) - Latest Reasoning Model
  {
    modelId: 'deepseek-reasoner',
    modelName: 'DeepSeek Reasoner (V3.2 Thinking Mode)',
    provider: 'DeepSeek',
    inputPrice: 0.28, // Standard price (cache miss)
    outputPrice: 0.42,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    cachedInputPrice: 0.028, // Cache hit price
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
      'Latest DeepSeek V3.2 reasoning model with CoT (Thinking Mode). Max output: 32K default, 64K maximum. Cache hit: $0.028 per 1M tokens. FIM completion not supported.'
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
