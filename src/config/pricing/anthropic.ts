import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const ANTHROPIC_PRICING: ModelPricingConfig[] = [
  // Claude Opus 4.1 (latest)
  {
    modelId: 'claude-opus-4-1-20250805',
    modelName: 'Claude Opus 4.1',
    provider: 'Anthropic',
    inputPrice: 15.0,
    outputPrice: 75.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: [
      'text',
      'vision',
      'multimodal',
      'reasoning',
      'extended-thinking',
      'multilingual'
    ],
    category: 'multimodal',
    isLatest: true,
    notes:
      'Most capable and intelligent Claude model yet - superior reasoning and advanced coding (Mar 2025 cutoff, 32k output)'
  },
  // Claude Opus 4
  {
    modelId: 'claude-opus-4-20250514',
    modelName: 'Claude Opus 4',
    provider: 'Anthropic',
    inputPrice: 15.0,
    outputPrice: 75.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: [
      'text',
      'vision',
      'multimodal',
      'reasoning',
      'extended-thinking',
      'multilingual'
    ],
    category: 'multimodal',
    isLatest: true,
    notes:
      'Previous flagship model with very high intelligence and capability (Mar 2025 cutoff, 32k output)'
  },
  // Claude Sonnet 4
  {
    modelId: 'claude-sonnet-4-20250514',
    modelName: 'Claude Sonnet 4',
    provider: 'Anthropic',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: [
      'text',
      'vision',
      'multimodal',
      'reasoning',
      'extended-thinking',
      'multilingual'
    ],
    category: 'multimodal',
    isLatest: true,
    notes:
      'High-performance model with exceptional reasoning and efficiency (Mar 2025 cutoff, 1M context beta available, 64k output)'
  },
  // Claude Sonnet 3.7 (latest alias)
  {
    modelId: 'claude-3-7-sonnet-20250219',
    modelName: 'Claude Sonnet 3.7',
    provider: 'Anthropic',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: [
      'text',
      'vision',
      'multimodal',
      'reasoning',
      'extended-thinking',
      'multilingual'
    ],
    category: 'multimodal',
    isLatest: true,
    notes: 'High-performance model with early extended thinking (Oct 2024 cutoff, 64k output)'
  },
  // Claude Sonnet 3.5 v2 (latest alias)
  {
    modelId: 'claude-3-5-sonnet-20241022',
    modelName: 'Claude Sonnet 3.5 v2',
    provider: 'Anthropic',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Upgraded Claude 3.5 Sonnet (Apr 2024 cutoff, 8k output)'
  },
  // Claude Sonnet 3.5 (previous version)
  {
    modelId: 'claude-3-5-sonnet-20240620',
    modelName: 'Claude Sonnet 3.5',
    provider: 'Anthropic',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Previous Claude 3.5 Sonnet (Apr 2024 cutoff, 8k output)'
  },
  // Claude Haiku 3.5 (latest alias)
  {
    modelId: 'claude-3-5-haiku-20241022',
    modelName: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    inputPrice: 0.8,
    outputPrice: 4.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Fastest Claude model (July 2024 cutoff, 8k output)'
  },
  // Claude Opus 3 (legacy)
  {
    modelId: 'claude-3-opus-20240229',
    modelName: 'Claude Opus 3',
    provider: 'Anthropic',
    inputPrice: 15.0,
    outputPrice: 75.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Legacy Claude Opus 3 (Aug 2023 cutoff, 4k output)'
  },
  // Claude Haiku 3 (legacy)
  {
    modelId: 'claude-3-haiku-20240307',
    modelName: 'Claude Haiku 3',
    provider: 'Anthropic',
    inputPrice: 0.25,
    outputPrice: 1.25,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Legacy Claude Haiku 3 (Aug 2023 cutoff, 4k output)'
  },
  // Claude 2.1 (legacy)
  {
    modelId: 'claude-2.1',
    modelName: 'Claude 2.1',
    provider: 'Anthropic',
    inputPrice: 8.0,
    outputPrice: 24.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'analysis'],
    category: 'text',
    isLatest: false,
    notes: 'Previous generation Claude model'
  },
  // Claude 2.0 (legacy)
  {
    modelId: 'claude-2.0',
    modelName: 'Claude 2.0',
    provider: 'Anthropic',
    inputPrice: 8.0,
    outputPrice: 24.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 100000,
    capabilities: ['text', 'analysis'],
    category: 'text',
    isLatest: false,
    notes: 'Earlier Claude 2 model'
  },
  // Claude Instant 1.2 (legacy)
  {
    modelId: 'claude-instant-1.2',
    modelName: 'Claude Instant 1.2',
    provider: 'Anthropic',
    inputPrice: 0.8,
    outputPrice: 2.4,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 100000,
    capabilities: ['text', 'analysis'],
    category: 'text',
    isLatest: false,
    notes: 'Fast and cost-effective Claude variant'
  }
];
