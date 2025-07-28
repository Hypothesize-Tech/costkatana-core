import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const XAI_PRICING: ModelPricingConfig[] = [
  // Grok 4 - Latest flagship model
  {
    modelId: 'grok-4-0709',
    modelName: 'Grok 4',
    provider: 'xAI',
    inputPrice: 3.00,
    outputPrice: 15.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 256000,
    capabilities: ['text', 'vision', 'reasoning', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Latest Grok 4 with reasoning, vision support coming soon. 200K TPM, 120 RPM rate limits'
  },
  // Grok 3 - Standard model
  {
    modelId: 'grok-3',
    modelName: 'Grok 3',
    provider: 'xAI',
    inputPrice: 3.00,
    outputPrice: 15.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 131072,
    capabilities: ['text', 'vision', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Standard Grok 3 model. 600 RPM rate limits'
  },
  // Grok 3 Mini - Cost-effective
  {
    modelId: 'grok-3-mini',
    modelName: 'Grok 3 Mini',
    provider: 'xAI',
    inputPrice: 0.30,
    outputPrice: 0.50,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 131072,
    capabilities: ['text', 'vision', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Cost-effective Grok 3 Mini. 480 RPM rate limits'
  },
  // Grok 3 Fast - High performance
  {
    modelId: 'grok-3-fast',
    modelName: 'Grok 3 Fast',
    provider: 'xAI',
    inputPrice: 5.00,
    outputPrice: 25.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 131072,
    capabilities: ['text', 'vision', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    notes: 'High-performance Grok 3 Fast. 600 RPM rate limits'
  },
  // Grok 3 Mini Fast - Fast and cost-effective
  {
    modelId: 'grok-3-mini-fast',
    modelName: 'Grok 3 Mini Fast',
    provider: 'xAI',
    inputPrice: 0.60,
    outputPrice: 4.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 131072,
    capabilities: ['text', 'vision', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Fast and cost-effective Grok 3 Mini Fast. 180 RPM rate limits'
  },
  // Grok 2 US East
  {
    modelId: 'grok-2-1212us-east-1',
    modelName: 'Grok 2 (US East)',
    provider: 'xAI',
    inputPrice: 2.00,
    outputPrice: 10.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 131072,
    capabilities: ['text', 'vision', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    region: 'us-east-1',
    notes: 'Grok 2 in US East region. 900 RPM rate limits'
  },
  // Grok 2 Vision US East
  {
    modelId: 'grok-2-vision-1212us-east-1',
    modelName: 'Grok 2 Vision (US East)',
    provider: 'xAI',
    inputPrice: 2.00,
    outputPrice: 10.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32768,
    capabilities: ['text', 'vision', 'multimodal', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    region: 'us-east-1',
    notes: 'Grok 2 Vision in US East region. 10 RPS rate limits'
  },
  // Grok 2 EU West
  {
    modelId: 'grok-2-1212eu-west-1',
    modelName: 'Grok 2 (EU West)',
    provider: 'xAI',
    inputPrice: 2.00,
    outputPrice: 10.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 131072,
    capabilities: ['text', 'vision', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    region: 'eu-west-1',
    notes: 'Grok 2 in EU West region. 50 RPS rate limits'
  },
  // Grok 2 Vision EU West
  {
    modelId: 'grok-2-vision-1212eu-west-1',
    modelName: 'Grok 2 Vision (EU West)',
    provider: 'xAI',
    inputPrice: 2.00,
    outputPrice: 10.00,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32768,
    capabilities: ['text', 'vision', 'multimodal', 'function-calling', 'structured-outputs'],
    category: 'multimodal',
    isLatest: false,
    region: 'eu-west-1',
    notes: 'Grok 2 Vision in EU West region. 50 RPS rate limits'
  },
  // Grok 2 Image Generation
  {
    modelId: 'grok-2-image-1212',
    modelName: 'Grok 2 Image',
    provider: 'xAI',
    inputPrice: 0.07,
    outputPrice: 0.07,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['image-generation'],
    category: 'image',
    isLatest: true,
    notes: 'Grok 2 image generation model. $0.07 per image, 300 RPM rate limits'
  }
]; 