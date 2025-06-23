import { AIProvider } from './index';
import { ProviderModel, PricingUnit } from './providers';

export const MODELS: Record<string, ProviderModel> = {
  // OpenAI Models
  'gpt-4-turbo-preview': {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo Preview',
    provider: AIProvider.OpenAI,
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: {
      prompt: 0.01,
      completion: 0.03,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: AIProvider.OpenAI,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.03,
      completion: 0.06,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: false,
      streaming: true
    }
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: AIProvider.OpenAI,
    maxTokens: 4096,
    contextWindow: 16384,
    pricing: {
      prompt: 0.0005,
      completion: 0.0015,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: false,
      streaming: true
    }
  },
  'gpt-4.5': {
    id: 'gpt-4.5',
    name: 'GPT-4.5',
    provider: AIProvider.OpenAI,
    maxTokens: 8192,
    contextWindow: 128000,
    pricing: {
      prompt: 0.015,
      completion: 0.045,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'gpt-4.1': {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: AIProvider.OpenAI,
    maxTokens: 8192,
    contextWindow: 128000,
    pricing: {
      prompt: 0.012,
      completion: 0.036,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },

  // AWS Bedrock Models
  'anthropic.claude-3-5-sonnet-20240620-v1:0': {
    id: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    name: 'Claude 3.5 Sonnet',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'anthropic.claude-3-opus-20240229-v1:0': {
    id: 'anthropic.claude-3-opus-20240229-v1:0',
    name: 'Claude 3 Opus',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'anthropic.claude-3-haiku-20240307-v1:0': {
    id: 'anthropic.claude-3-haiku-20240307-v1:0',
    name: 'Claude 3 Haiku',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 0.25,
      completion: 1.25,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'amazon.titan-text-express-v1': {
    id: 'amazon.titan-text-express-v1',
    name: 'Titan Text Express',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.2,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: true
    }
  },

  // Direct Anthropic Models
  'claude-3-opus-20240229': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: AIProvider.Anthropic,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'claude-3-5-sonnet-20240620': {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    provider: AIProvider.Anthropic,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: false,
      streaming: true
    }
  },

  // Google Models
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 1000000,
    pricing: {
      prompt: 3.5,
      completion: 10.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: true,
      streaming: true
    }
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.35,
      completion: 1.05,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: true,
      audio: true,
      streaming: true
    }
  },

  'command-r-plus': {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: false,
      streaming: true
    }
  },
  'command-r': {
    id: 'command-r',
    name: 'Command R',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: false,
      streaming: true
    }
  }
};

export function getModelById(modelId: string): ProviderModel | undefined {
  return MODELS[modelId];
}

export function getModelsByProvider(provider: AIProvider): ProviderModel[] {
  return Object.values(MODELS).filter(model => model.provider === provider);
}

export function getAllModels(): ProviderModel[] {
  return Object.values(MODELS);
}
