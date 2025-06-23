import { AIProvider } from '../types';
import { PricingUnit } from '../types/providers';

// Pricing data structure for quick reference
// Prices are in USD and effective as of 2024-01-01
// Always verify with official provider documentation

export const PRICING_DATA = {
  [AIProvider.OpenAI]: {
    'gpt-4-turbo-preview': {
      prompt: 0.01,
      completion: 0.03,
      unit: PricingUnit.Per1KTokens,
      notes: '128K context window'
    },
    'gpt-4': {
      prompt: 0.03,
      completion: 0.06,
      unit: PricingUnit.Per1KTokens,
      notes: '8K context window'
    },
    'gpt-4-32k': {
      prompt: 0.06,
      completion: 0.12,
      unit: PricingUnit.Per1KTokens,
      notes: '32K context window'
    },
    'gpt-3.5-turbo': {
      prompt: 0.0005,
      completion: 0.0015,
      unit: PricingUnit.Per1KTokens,
      notes: '16K context window'
    },
    'gpt-3.5-turbo-16k': {
      prompt: 0.001,
      completion: 0.002,
      unit: PricingUnit.Per1KTokens,
      notes: 'Legacy 16K model'
    }
  },
  [AIProvider.AWSBedrock]: {
    'anthropic.claude-3-5-sonnet-20240620-v1:0': {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      notes: 'Most capable Claude model'
    },
    'anthropic.claude-3-opus-20240229-v1:0': {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      notes: 'Previous generation flagship'
    },
    'anthropic.claude-3-haiku-20240307-v1:0': {
      prompt: 0.25,
      completion: 1.25,
      unit: PricingUnit.Per1MTokens,
      notes: 'Fast and affordable'
    },
    'amazon.titan-text-express-v1': {
      prompt: 0.2,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      notes: 'Amazon native model'
    },
    'amazon.titan-text-lite-v1': {
      prompt: 0.15,
      completion: 0.2,
      unit: PricingUnit.Per1MTokens,
      notes: 'Lightweight Titan model'
    },
    'ai21.j2-ultra-v1': {
      prompt: 12.5,
      completion: 12.5,
      unit: PricingUnit.Per1MTokens,
      notes: 'AI21 Labs Jurassic-2'
    },
    'ai21.j2-mid-v1': {
      prompt: 1.25,
      completion: 1.25,
      unit: PricingUnit.Per1MTokens,
      notes: 'AI21 Labs Jurassic-2 Mid'
    },
    'cohere.command-r-plus-v1:0': {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      notes: 'Cohere Command R+'
    },
    'cohere.command-r-v1:0': {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      notes: 'Cohere Command R'
    },
    'meta.llama3-8b-instruct-v1:0': {
      prompt: 0.3,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      notes: 'Meta Llama 3 8B'
    },
    'meta.llama3-70b-instruct-v1:0': {
      prompt: 2.65,
      completion: 3.5,
      unit: PricingUnit.Per1MTokens,
      notes: 'Meta Llama 3 70B'
    }
  },
  [AIProvider.Anthropic]: {
    'claude-3-opus-20240229': {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      notes: 'Direct API access'
    },
    'claude-3-5-sonnet-20240620': {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      notes: 'Direct API access'
    },
    'claude-3-haiku-20240307': {
      prompt: 0.25,
      completion: 1.25,
      unit: PricingUnit.Per1MTokens,
      notes: 'Direct API access'
    }
  },
  [AIProvider.Google]: {
    'gemini-1.5-pro': {
      prompt: 3.5,
      completion: 10.5,
      unit: PricingUnit.Per1MTokens,
      notes: 'Up to 1M context window'
    },
    'gemini-1.5-flash': {
      prompt: 0.35,
      completion: 1.05,
      unit: PricingUnit.Per1MTokens,
      notes: 'Fast multimodal model'
    },
    'gemini-1.0-pro': {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      notes: 'Previous generation'
    }
  },
  [AIProvider.Cohere]: {
    'command-r-plus': {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      notes: '128K context window'
    },
    'command-r': {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      notes: '128K context window'
    },
    command: {
      prompt: 1.0,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      notes: '4K context window'
    },
    'command-light': {
      prompt: 0.15,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      notes: 'Lightweight model'
    }
  }
};

// Regional pricing adjustments (multipliers)
export const REGIONAL_PRICING_ADJUSTMENTS: Record<string, number> = {
  'us-east-1': 1.0,
  'us-west-2': 1.0,
  'eu-west-1': 1.05,
  'eu-central-1': 1.05,
  'ap-northeast-1': 1.1,
  'ap-southeast-1': 1.08,
  'ap-southeast-2': 1.08,
  'ap-south-1': 1.05
};

// Volume discount tiers
export const VOLUME_DISCOUNTS = {
  tiers: [
    { threshold: 0, discount: 0 },
    { threshold: 10000, discount: 0.05 }, // 5% off after $10K
    { threshold: 50000, discount: 0.1 }, // 10% off after $50K
    { threshold: 100000, discount: 0.15 }, // 15% off after $100K
    { threshold: 500000, discount: 0.2 } // 20% off after $500K
  ],
  providers: [AIProvider.OpenAI, AIProvider.Anthropic] // Providers that offer volume discounts
};

// Free tier limits (monthly)
export const FREE_TIERS = {
  [AIProvider.OpenAI]: {
    tokens: 0, // No free tier
    credits: 0
  },
  [AIProvider.AWSBedrock]: {
    tokens: 0, // Pay as you go
    credits: 0
  },
  [AIProvider.Anthropic]: {
    tokens: 0, // No free tier
    credits: 0
  },
  [AIProvider.Google]: {
    tokens: 1000000, // 1M tokens free per month
    credits: 0
  },
  [AIProvider.Cohere]: {
    tokens: 1000000, // 1M tokens free per month
    credits: 0
  }
};

// Rate limits by provider and model
export const RATE_LIMITS = {
  [AIProvider.OpenAI]: {
    default: {
      requestsPerMinute: 3500,
      tokensPerMinute: 90000,
      requestsPerDay: 200000
    },
    'gpt-4': {
      requestsPerMinute: 500,
      tokensPerMinute: 10000,
      requestsPerDay: 10000
    }
  },
  [AIProvider.AWSBedrock]: {
    default: {
      requestsPerMinute: 100,
      tokensPerMinute: 100000,
      requestsPerDay: null // No daily limit
    }
  },
  [AIProvider.Anthropic]: {
    default: {
      requestsPerMinute: 50,
      tokensPerMinute: 100000,
      requestsPerDay: null
    }
  }
};

export function getPricingForModel(
  provider: AIProvider,
  modelId: string
):
  | {
      prompt: number;
      completion: number;
      unit: PricingUnit;
      notes?: string;
    }
  | undefined {
  const providerPricing = PRICING_DATA[provider] as
    | Record<
        string,
        {
          prompt: number;
          completion: number;
          unit: PricingUnit;
          notes?: string;
        }
      >
    | undefined;

  if (!providerPricing) {
    return undefined;
  }

  return providerPricing[modelId];
}

export function getRegionalPricing(basePrice: number, region: string): number {
  const adjustment = REGIONAL_PRICING_ADJUSTMENTS[region] || 1.0;
  return basePrice * adjustment;
}

export function calculateVolumeDiscount(totalSpend: number, provider: AIProvider): number {
  if (!VOLUME_DISCOUNTS.providers.includes(provider)) {
    return 0;
  }

  const applicableTier = VOLUME_DISCOUNTS.tiers
    .reverse()
    .find(tier => totalSpend >= tier.threshold);

  return applicableTier?.discount || 0;
}
