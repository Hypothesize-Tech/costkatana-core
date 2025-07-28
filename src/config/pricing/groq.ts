import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const GROQ_PRICING: ModelPricingConfig[] = [
  {
    modelId: 'mixtral-8x7b-32768',
    modelName: 'Mixtral 8x7B',
    provider: 'Groq',
    inputPrice: 0.24,
    outputPrice: 0.24,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32768,
    capabilities: ['text', 'analysis'],
    category: 'text',
    isLatest: true,
    notes: 'Ultra-fast Mixtral model on Groq'
  }
]; 