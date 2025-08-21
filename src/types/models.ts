import { AIProvider } from './index';
import { ProviderModel, PricingUnit } from './providers';

/**
 * Comprehensive model registry for major AI providers.
 * Pricing and capabilities are based on official documentation as of June 2024.
 * For the latest, always check provider docs.
 */
export const MODELS: Record<string, ProviderModel> = {
  // ==== OpenAI ====
  // === GPT-5 Models (Latest) ===
  'gpt-5': {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: AIProvider.OpenAI,
    maxTokens: 128000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.00125,
      completion: 0.01,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gpt-5-mini': {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: AIProvider.OpenAI,
    maxTokens: 128000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.00025,
      completion: 0.002,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gpt-5-nano': {
    id: 'gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: AIProvider.OpenAI,
    maxTokens: 128000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.00005,
      completion: 0.0004,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gpt-5-chat-latest': {
    id: 'gpt-5-chat-latest',
    name: 'GPT-5 Chat Latest',
    provider: AIProvider.OpenAI,
    maxTokens: 128000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.00125,
      completion: 0.01,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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

  // === GPT-4o Models ===
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: AIProvider.OpenAI,
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: {
      prompt: 0.005,
      completion: 0.015,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-05-13'
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
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
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
  'gpt-4-32k': {
    id: 'gpt-4-32k',
    name: 'GPT-4-32k',
    provider: AIProvider.OpenAI,
    maxTokens: 32768,
    contextWindow: 32768,
    pricing: {
      prompt: 0.06,
      completion: 0.12,
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
  'gpt-3.5-turbo-16k': {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 Turbo 16K',
    provider: AIProvider.OpenAI,
    maxTokens: 16384,
    contextWindow: 16384,
    pricing: {
      prompt: 0.003,
      completion: 0.004,
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
  'text-davinci-003': {
    id: 'text-davinci-003',
    name: 'Text-DaVinci-003',
    provider: AIProvider.OpenAI,
    maxTokens: 4097,
    contextWindow: 4097,
    pricing: {
      prompt: 0.02,
      completion: 0.02,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'text-embedding-ada-002': {
    id: 'text-embedding-ada-002',
    name: 'Text Embedding Ada 002',
    provider: AIProvider.OpenAI,
    maxTokens: 8191,
    contextWindow: 8191,
    pricing: {
      prompt: 0.0001,
      completion: 0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // ==== AWS Bedrock ====
  'nova-pro': {
    id: 'nova-pro',
    name: 'Nova Pro',
    provider: AIProvider.AWSBedrock,
    maxTokens: 5000,
    contextWindow: 300000,
    pricing: {
      prompt: 0.0008,
      completion: 0.0032,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-12-01'
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

  // ==== Anthropic (Claude) ====
  'claude-opus-4-1-20250805': {
    id: 'claude-opus-4-1-20250805',
    name: 'Claude Opus 4.1',
    provider: AIProvider.Anthropic,
    maxTokens: 32000,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-05'
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
  'claude-opus-4-20250514': {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    provider: AIProvider.Anthropic,
    maxTokens: 32000,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-14'
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
  'claude-sonnet-4-20250514': {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: AIProvider.Anthropic,
    maxTokens: 64000,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-14'
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
  'claude-3-7-sonnet-20250219': {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude Sonnet 3.7',
    provider: AIProvider.Anthropic,
    maxTokens: 64000,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-02-19'
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
  'claude-3-5-sonnet-20241022': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude Sonnet 3.5 v2',
    provider: AIProvider.Anthropic,
    maxTokens: 8192,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-10-22'
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
  'claude-3-5-haiku-20241022': {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude Haiku 3.5',
    provider: AIProvider.Anthropic,
    maxTokens: 8192,
    contextWindow: 200000,
    pricing: {
      prompt: 0.8,
      completion: 4.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-10-22'
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
  'claude-3-opus-20240229': {
    id: 'claude-3-opus-20240229',
    name: 'Claude Opus 3',
    provider: AIProvider.Anthropic,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-03-01'
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
  'claude-3-sonnet-20240229': {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude Sonnet 3',
    provider: AIProvider.Anthropic,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-03-01'
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
  'claude-3-haiku-20240307': {
    id: 'claude-3-haiku-20240307',
    name: 'Claude Haiku 3',
    provider: AIProvider.Anthropic,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 0.25,
      completion: 1.25,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-03-01'
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
    name: 'Claude Sonnet 3.5',
    provider: AIProvider.Anthropic,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-20'
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

  // ==== AWS Bedrock (Anthropic, Amazon, Meta, Cohere, Mistral, etc.) ====
  'anthropic.claude-opus-4-1-20250805-v1:0': {
    id: 'anthropic.claude-opus-4-1-20250805-v1:0',
    name: 'Claude Opus 4.1 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 32000,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-05'
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
  'anthropic.claude-opus-4-20250514-v1:0': {
    id: 'anthropic.claude-opus-4-20250514-v1:0',
    name: 'Claude Opus 4 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 32000,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-14'
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
  'anthropic.claude-sonnet-4-20250514-v1:0': {
    id: 'anthropic.claude-sonnet-4-20250514-v1:0',
    name: 'Claude Sonnet 4 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 64000,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-14'
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
  'anthropic.claude-3-7-sonnet-20250219-v1:0': {
    id: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
    name: 'Claude Sonnet 3.7 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 64000,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-02-19'
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
  'anthropic.claude-3-5-sonnet-20241022-v2:0': {
    id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    name: 'Claude Sonnet 3.5 v2 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-10-22'
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
  'anthropic.claude-3-5-sonnet-20240620-v1:0': {
    id: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    name: 'Claude Sonnet 3.5 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-20'
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
    name: 'Claude 3 Opus (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 15.0,
      completion: 75.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-03-01'
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
    name: 'Claude 3 Haiku (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 0.25,
      completion: 1.25,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-03-01'
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
  'anthropic.claude-v2:1': {
    id: 'anthropic.claude-v2:1',
    name: 'Claude 2.1 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 200000,
    pricing: {
      prompt: 8.0,
      completion: 24.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-11-21'
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
  'anthropic.claude-v2': {
    id: 'anthropic.claude-v2',
    name: 'Claude 2 (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 100000,
    pricing: {
      prompt: 8.0,
      completion: 24.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-07-18'
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
  'anthropic.claude-instant-v1': {
    id: 'anthropic.claude-instant-v1',
    name: 'Claude Instant (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 100000,
    pricing: {
      prompt: 0.8,
      completion: 2.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-07-18'
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
  'amazon.titan-text-lite-v1': {
    id: 'amazon.titan-text-lite-v1',
    name: 'Titan Text Lite',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 4096,
    pricing: {
      prompt: 0.3,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
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
  'amazon.titan-embed-text-v1': {
    id: 'amazon.titan-embed-text-v1',
    name: 'Titan Text Embeddings',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'amazon.titan-image-generator-v1': {
    id: 'amazon.titan-image-generator-v1',
    name: 'Titan Image Generator',
    provider: AIProvider.AWSBedrock,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2023-11-29'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: false
    }
  },
  'ai21.jamba-instruct-v1:0': {
    id: 'ai21.jamba-instruct-v1:0',
    name: 'Jamba Instruct',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 256000,
    pricing: {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-24'
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
  'ai21.jurassic-2-ultra': {
    id: 'ai21.jurassic-2-ultra',
    name: 'Jurassic-2 Ultra',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 18.75,
      completion: 18.75,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
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
  'ai21.jurassic-2-mid': {
    id: 'ai21.jurassic-2-mid',
    name: 'Jurassic-2 Mid',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 12.5,
      completion: 12.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
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
  'cohere.command-text-v14': {
    id: 'cohere.command-text-v14',
    name: 'Command',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 4096,
    pricing: {
      prompt: 1.5,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
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
  'cohere.command-r-v1:0': {
    id: 'cohere.command-r-v1:0',
    name: 'Command R',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-12-01'
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
  'cohere.command-r-plus-v1:0': {
    id: 'cohere.command-r-plus-v1:0',
    name: 'Command R+',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: {
      prompt: 2.5,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-12-01'
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
  'cohere.embed-english-v3': {
    id: 'cohere.embed-english-v3',
    name: 'Embed English',
    provider: AIProvider.AWSBedrock,
    maxTokens: 512,
    contextWindow: 512,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'cohere.embed-multilingual-v3': {
    id: 'cohere.embed-multilingual-v3',
    name: 'Embed Multilingual',
    provider: AIProvider.AWSBedrock,
    maxTokens: 512,
    contextWindow: 512,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-04-13'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'meta.llama2-13b-chat-v1': {
    id: 'meta.llama2-13b-chat-v1',
    name: 'Meta Llama 2 13B Chat',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 4096,
    pricing: {
      prompt: 0.75,
      completion: 1.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2023-07-18'
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
  'meta.llama2-70b-chat-v1': {
    id: 'meta.llama2-70b-chat-v1',
    name: 'Meta Llama 2 70B Chat',
    provider: AIProvider.AWSBedrock,
    maxTokens: 4096,
    contextWindow: 4096,
    pricing: {
      prompt: 0.8,
      completion: 0.8,
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
  'meta.llama3-8b-instruct-v1:0': {
    id: 'meta.llama3-8b-instruct-v1:0',
    name: 'Llama 3 8B Instruct',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.4,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-18'
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
  'meta.llama3-70b-instruct-v1:0': {
    id: 'meta.llama3-70b-instruct-v1:0',
    name: 'Llama 3 70B Instruct',
    provider: AIProvider.AWSBedrock,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 2.65,
      completion: 2.65,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-18'
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
  'mistral.mistral-7b-instruct-v0:2': {
    id: 'mistral.mistral-7b-instruct-v0:2',
    name: 'Mistral 7B Instruct (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.15,
      completion: 0.2,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-10'
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
  'mistral.mixtral-8x7b-instruct-v0:1': {
    id: 'mistral.mixtral-8x7b-instruct-v0:1',
    name: 'Mixtral 8x7B Instruct (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.45,
      completion: 0.7,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-10'
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
  'mistral.mistral-large-2402-v1:0': {
    id: 'mistral.mistral-large-2402-v1:0',
    name: 'Mistral Large (Bedrock)',
    provider: AIProvider.AWSBedrock,
    maxTokens: 32768,
    contextWindow: 32768,
    pricing: {
      prompt: 2.0,
      completion: 6.0,
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
  'stability.stable-diffusion-xl-v1': {
    id: 'stability.stable-diffusion-xl-v1',
    name: 'Stable Diffusion XL 1.0',
    provider: AIProvider.AWSBedrock,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-04-10'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: false
    }
  },

  // ==== Google Gemini ====
  // === Gemini 2.5 Models (Latest) ===
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 2000000,
    pricing: {
      prompt: 1.25,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.3,
      completion: 2.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemini-2.5-flash-lite-preview': {
    id: 'gemini-2.5-flash-lite-preview',
    name: 'Gemini 2.5 Flash-Lite Preview',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.1,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemini-2.5-flash-audio': {
    id: 'gemini-2.5-flash-audio',
    name: 'Gemini 2.5 Flash Audio',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 1.0,
      completion: 2.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'gemini-2.5-flash-lite-audio-preview': {
    id: 'gemini-2.5-flash-lite-audio-preview',
    name: 'Gemini 2.5 Flash-Lite Audio Preview',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.5,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'gemini-2.5-flash-native-audio': {
    id: 'gemini-2.5-flash-native-audio',
    name: 'Gemini 2.5 Flash Native Audio',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.5,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'gemini-2.5-flash-native-audio-output': {
    id: 'gemini-2.5-flash-native-audio-output',
    name: 'Gemini 2.5 Flash Native Audio Output',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 3.0,
      completion: 12.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'gemini-2.5-flash-preview-tts': {
    id: 'gemini-2.5-flash-preview-tts',
    name: 'Gemini 2.5 Flash Preview TTS',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.5,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'gemini-2.5-pro-preview-tts': {
    id: 'gemini-2.5-pro-preview-tts',
    name: 'Gemini 2.5 Pro Preview TTS',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 1.0,
      completion: 20.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },

  // === Gemini 2.0 Models ===
  'gemini-2.0-flash': {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.1,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemini-2.0-flash-lite': {
    id: 'gemini-2.0-flash-lite',
    name: 'Gemini 2.0 Flash-Lite',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.075,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemini-2.0-flash-audio': {
    id: 'gemini-2.0-flash-audio',
    name: 'Gemini 2.0 Flash Audio',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.7,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },

  // === Gemini 1.5 Models ===
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 2000000,
    pricing: {
      prompt: 1.25,
      completion: 5.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
    maxTokens: 32000,
    contextWindow: 1000000,
    pricing: {
      prompt: 0.075,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemini-1.0-pro': {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 32000,
    pricing: {
      prompt: 1.0,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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

  // === Gemma Models (Open Source) ===
  'gemma-3n': {
    id: 'gemma-3n',
    name: 'Gemma 3n',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemma-3': {
    id: 'gemma-3',
    name: 'Gemma 3',
    provider: AIProvider.Google,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'gemma-2': {
    id: 'gemma-2',
    name: 'Gemma 2',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  gemma: {
    id: 'gemma',
    name: 'Gemma',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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

  // === Specialized Gemma Models ===
  'shieldgemma-2': {
    id: 'shieldgemma-2',
    name: 'ShieldGemma 2',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  paligemma: {
    id: 'paligemma',
    name: 'PaliGemma',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  codegemma: {
    id: 'codegemma',
    name: 'CodeGemma',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  txgemma: {
    id: 'txgemma',
    name: 'TxGemma',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  medgemma: {
    id: 'medgemma',
    name: 'MedGemma',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  medsiglip: {
    id: 'medsiglip',
    name: 'MedSigLIP',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: true
    }
  },
  t5gemma: {
    id: 't5gemma',
    name: 'T5Gemma',
    provider: AIProvider.Google,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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

  // === Embeddings Models ===
  'text-embedding-004': {
    id: 'text-embedding-004',
    name: 'Text Embedding 004',
    provider: AIProvider.Google,
    maxTokens: 2048,
    contextWindow: 2048,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'multimodal-embeddings': {
    id: 'multimodal-embeddings',
    name: 'Multimodal Embeddings',
    provider: AIProvider.Google,
    maxTokens: 2048,
    contextWindow: 2048,
    pricing: {
      prompt: 0.0,
      completion: 0.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: false
    }
  },

  // === Imagen Models (Image Generation) ===
  'imagen-4-generation': {
    id: 'imagen-4-generation',
    name: 'Imagen 4 for Generation',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.04,
      completion: 0.04,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'imagen-4-fast-generation': {
    id: 'imagen-4-fast-generation',
    name: 'Imagen 4 for Fast Generation',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.04,
      completion: 0.04,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'imagen-4-ultra-generation': {
    id: 'imagen-4-ultra-generation',
    name: 'Imagen 4 for Ultra Generation',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.06,
      completion: 0.06,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'imagen-3-generation': {
    id: 'imagen-3-generation',
    name: 'Imagen 3 for Generation',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.03,
      completion: 0.03,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // === Veo Models (Video Generation) ===
  'veo-2': {
    id: 'veo-2',
    name: 'Veo 2',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.35,
      completion: 0.35,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'veo-3': {
    id: 'veo-3',
    name: 'Veo 3',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.35,
      completion: 0.35,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'veo-3-fast': {
    id: 'veo-3-fast',
    name: 'Veo 3 Fast',
    provider: AIProvider.Google,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.35,
      completion: 0.35,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // ==== Cohere ====
  'command-a-03-2025': {
    id: 'command-a-03-2025',
    name: 'Command A',
    provider: AIProvider.Cohere,
    maxTokens: 8000,
    contextWindow: 256000,
    pricing: {
      prompt: 2.5,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-03-01'
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
  'command-r7b-12-2024': {
    id: 'command-r7b-12-2024',
    name: 'Command R7B',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.0375,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-12-01'
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
  'command-a-reasoning-08-2025': {
    id: 'command-a-reasoning-08-2025',
    name: 'Command A Reasoning',
    provider: AIProvider.Cohere,
    maxTokens: 32000,
    contextWindow: 256000,
    pricing: {
      prompt: 2.5,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'command-a-vision-07-2025': {
    id: 'command-a-vision-07-2025',
    name: 'Command A Vision',
    provider: AIProvider.Cohere,
    maxTokens: 8000,
    contextWindow: 128000,
    pricing: {
      prompt: 2.5,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'command-r-plus-04-2024': {
    id: 'command-r-plus-04-2024',
    name: 'Command R+',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 2.5,
      completion: 10.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-01'
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
  'command-r-08-2024': {
    id: 'command-r-08-2024',
    name: 'Command R (08-2024)',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-08-01'
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
  'command-r-03-2024': {
    id: 'command-r-03-2024',
    name: 'Command R (03-2024)',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.6,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-03-01'
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
  command: {
    id: 'command',
    name: 'Command',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 4096,
    pricing: {
      prompt: 0.15,
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
  'command-nightly': {
    id: 'command-nightly',
    name: 'Command Nightly',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
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
  'command-light': {
    id: 'command-light',
    name: 'Command Light',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 4096,
    pricing: {
      prompt: 0.15,
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
  'command-light-nightly': {
    id: 'command-light-nightly',
    name: 'Command Light Nightly',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
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
  'rerank-v3.5': {
    id: 'rerank-v3.5',
    name: 'Rerank v3.5',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 4096,
    pricing: {
      prompt: 2.0,
      completion: 2.0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'rerank-english-v3.0': {
    id: 'rerank-english-v3.0',
    name: 'Rerank English v3.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 4096,
    pricing: {
      prompt: 2.0,
      completion: 2.0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'rerank-multilingual-v3.0': {
    id: 'rerank-multilingual-v3.0',
    name: 'Rerank Multilingual v3.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 4096,
    pricing: {
      prompt: 2.0,
      completion: 2.0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'embed-v4.0': {
    id: 'embed-v4.0',
    name: 'Embed v4.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 128000,
    pricing: {
      prompt: 0.12,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'embed-english-v3.0': {
    id: 'embed-english-v3.0',
    name: 'Embed English v3.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 512,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'embed-english-light-v3.0': {
    id: 'embed-english-light-v3.0',
    name: 'Embed English Light v3.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 512,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'embed-multilingual-v3.0': {
    id: 'embed-multilingual-v3.0',
    name: 'Embed Multilingual v3.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 512,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'embed-multilingual-light-v3.0': {
    id: 'embed-multilingual-light-v3.0',
    name: 'Embed Multilingual Light v3.0',
    provider: AIProvider.Cohere,
    maxTokens: 0,
    contextWindow: 512,
    pricing: {
      prompt: 0.1,
      completion: 0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-01-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'c4ai-aya-expanse-8b': {
    id: 'c4ai-aya-expanse-8b',
    name: 'Aya Expanse 8B',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 8192,
    pricing: {
      prompt: 0.15,
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
  'c4ai-aya-expanse-32b': {
    id: 'c4ai-aya-expanse-32b',
    name: 'Aya Expanse 32B',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
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
  'c4ai-aya-vision-8b': {
    id: 'c4ai-aya-vision-8b',
    name: 'Aya Vision 8B',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 16384,
    pricing: {
      prompt: 0.15,
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
      vision: true,
      audio: false,
      streaming: true
    }
  },
  'c4ai-aya-vision-32b': {
    id: 'c4ai-aya-vision-32b',
    name: 'Aya Vision 32B',
    provider: AIProvider.Cohere,
    maxTokens: 4000,
    contextWindow: 16384,
    pricing: {
      prompt: 0.15,
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
      vision: true,
      audio: false,
      streaming: true
    }
  },

  // ==== Mistral AI ====
  // Premier Models
  'mistral-medium-2508': {
    id: 'mistral-medium-2508',
    name: 'Mistral Medium 3.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.4,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'mistral-medium-latest': {
    id: 'mistral-medium-latest',
    name: 'Mistral Medium 3.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.4,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'magistral-medium-2507': {
    id: 'magistral-medium-2507',
    name: 'Magistral Medium 1.1',
    provider: AIProvider.Mistral,
    maxTokens: 4000,
    contextWindow: 40000,
    pricing: {
      prompt: 2.0,
      completion: 5.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'magistral-medium-latest': {
    id: 'magistral-medium-latest',
    name: 'Magistral Medium 1.1',
    provider: AIProvider.Mistral,
    maxTokens: 4000,
    contextWindow: 40000,
    pricing: {
      prompt: 2.0,
      completion: 5.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'codestral-2508': {
    id: 'codestral-2508',
    name: 'Codestral 2508',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 256000,
    pricing: {
      prompt: 0.3,
      completion: 0.9,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'codestral-latest': {
    id: 'codestral-latest',
    name: 'Codestral 2508',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 256000,
    pricing: {
      prompt: 0.3,
      completion: 0.9,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'voxtral-mini-2507': {
    id: 'voxtral-mini-2507',
    name: 'Voxtral Mini Transcribe',
    provider: AIProvider.Mistral,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: true,
      streaming: false
    }
  },
  'voxtral-mini-latest': {
    id: 'voxtral-mini-latest',
    name: 'Voxtral Mini Transcribe',
    provider: AIProvider.Mistral,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: true,
      streaming: false
    }
  },
  'devstral-medium-2507': {
    id: 'devstral-medium-2507',
    name: 'Devstral Medium',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.4,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'devstral-medium-latest': {
    id: 'devstral-medium-latest',
    name: 'Devstral Medium',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.4,
      completion: 2.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'mistral-ocr-2505': {
    id: 'mistral-ocr-2505',
    name: 'Mistral OCR 2505',
    provider: AIProvider.Mistral,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 1.0,
      completion: 3.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: false
    }
  },
  'mistral-ocr-latest': {
    id: 'mistral-ocr-latest',
    name: 'Mistral OCR 2505',
    provider: AIProvider.Mistral,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 1.0,
      completion: 3.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: true,
      audio: false,
      streaming: false
    }
  },
  'mistral-large-2411': {
    id: 'mistral-large-2411',
    name: 'Mistral Large 2.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 2.0,
      completion: 6.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-11-01'
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
  'mistral-large-latest': {
    id: 'mistral-large-latest',
    name: 'Mistral Large 2.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 2.0,
      completion: 6.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-11-01'
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
  'pixtral-large-2411': {
    id: 'pixtral-large-2411',
    name: 'Pixtral Large',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 2.0,
      completion: 6.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-11-01'
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
  'pixtral-large-latest': {
    id: 'pixtral-large-latest',
    name: 'Pixtral Large',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 2.0,
      completion: 6.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-11-01'
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
  'mistral-small-2407': {
    id: 'mistral-small-2407',
    name: 'Mistral Small 2',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-07-01'
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
  'mistral-embed': {
    id: 'mistral-embed',
    name: 'Mistral Embed',
    provider: AIProvider.Mistral,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-12-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'codestral-embed-2505': {
    id: 'codestral-embed-2505',
    name: 'Codestral Embed',
    provider: AIProvider.Mistral,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.15,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: true,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'mistral-moderation-2411': {
    id: 'mistral-moderation-2411',
    name: 'Mistral Moderation 24.11',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-11-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },
  'mistral-moderation-latest': {
    id: 'mistral-moderation-latest',
    name: 'Mistral Moderation 24.11',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-11-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // Open Models
  'magistral-small-2507': {
    id: 'magistral-small-2507',
    name: 'Magistral Small 1.1',
    provider: AIProvider.Mistral,
    maxTokens: 4000,
    contextWindow: 40000,
    pricing: {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'magistral-small-latest': {
    id: 'magistral-small-latest',
    name: 'Magistral Small 1.1',
    provider: AIProvider.Mistral,
    maxTokens: 4000,
    contextWindow: 40000,
    pricing: {
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'voxtral-small-2507': {
    id: 'voxtral-small-2507',
    name: 'Voxtral Small',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'voxtral-small-latest': {
    id: 'voxtral-small-latest',
    name: 'Voxtral Small',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.1,
      completion: 0.1,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: true,
      vision: false,
      audio: true,
      streaming: true
    }
  },
  'mistral-small-2506': {
    id: 'mistral-small-2506',
    name: 'Mistral Small 3.2',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-06-01'
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
  'devstral-small-2507': {
    id: 'devstral-small-2507',
    name: 'Devstral Small 1.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'devstral-small-latest': {
    id: 'devstral-small-latest',
    name: 'Devstral Small 1.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-07-01'
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
  'mistral-small-2503': {
    id: 'mistral-small-2503',
    name: 'Mistral Small 3.1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-03-01'
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
  'mistral-small-2501': {
    id: 'mistral-small-2501',
    name: 'Mistral Small 3',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-01-01'
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
  'devstral-small-2505': {
    id: 'devstral-small-2505',
    name: 'Devstral Small 1',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.1,
      completion: 0.3,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-05-01'
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
  'pixtral-12b-2409': {
    id: 'pixtral-12b-2409',
    name: 'Pixtral 12B',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-09-01'
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
  'pixtral-12b': {
    id: 'pixtral-12b',
    name: 'Pixtral 12B',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-09-01'
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
  'open-mistral-nemo-2407': {
    id: 'open-mistral-nemo-2407',
    name: 'Mistral NeMo 12B',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-07-01'
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
  'open-mistral-nemo': {
    id: 'open-mistral-nemo',
    name: 'Mistral NeMo 12B',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-07-01'
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
  'mistral-nemo': {
    id: 'mistral-nemo',
    name: 'Mistral NeMo',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 128000,
    pricing: {
      prompt: 0.15,
      completion: 0.15,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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
  'open-mistral-7b': {
    id: 'open-mistral-7b',
    name: 'Mistral 7B',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.25,
      completion: 0.25,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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
  'open-mixtral-8x7b': {
    id: 'open-mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: AIProvider.Mistral,
    maxTokens: 32000,
    contextWindow: 32000,
    pricing: {
      prompt: 0.7,
      completion: 0.7,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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
  'open-mixtral-8x22b': {
    id: 'open-mixtral-8x22b',
    name: 'Mixtral 8x22B',
    provider: AIProvider.Mistral,
    maxTokens: 65000,
    contextWindow: 65000,
    pricing: {
      prompt: 2.0,
      completion: 6.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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

  // ==== DeepSeek ====
  'deepseek-chat': {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: AIProvider.DeepSeek,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.2,
      completion: 0.4,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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

  // ==== Groq ====
  'llama3-70b-8192': {
    id: 'llama3-70b-8192',
    name: 'Llama 3 70B (Groq)',
    provider: AIProvider.Groq,
    maxTokens: 8192,
    contextWindow: 8192,
    pricing: {
      prompt: 0.0008,
      completion: 0.0012,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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
  'mixtral-8x7b-32768': {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (Groq)',
    provider: AIProvider.Groq,
    maxTokens: 32768,
    contextWindow: 32768,
    pricing: {
      prompt: 0.0005,
      completion: 0.00075,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
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

  // ==== HuggingFace ====
  'mistralai/Mixtral-8x7B-Instruct-v0.1': {
    id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    name: 'Mixtral-8x7B-Instruct-v0.1',
    provider: AIProvider.HuggingFace,
    maxTokens: 32768,
    contextWindow: 32768,
    pricing: {
      prompt: 0,
      completion: 0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // ==== Ollama ====
  'llama2-7b': {
    id: 'llama2-7b',
    name: 'Llama 2 7B',
    provider: AIProvider.Ollama,
    maxTokens: 4096,
    contextWindow: 4096,
    pricing: {
      prompt: 0,
      completion: 0,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // ==== Replicate ====
  'meta/llama-2-70b-chat': {
    id: 'meta/llama-2-70b-chat',
    name: 'Llama 2 70B Chat (Replicate)',
    provider: AIProvider.Replicate,
    maxTokens: 4096,
    contextWindow: 4096,
    pricing: {
      prompt: 0.2,
      completion: 0.2,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-06-01'
    },
    capabilities: {
      chat: true,
      completion: true,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // ==== Azure OpenAI ====
  'azure-gpt-4o': {
    id: 'azure-gpt-4o',
    name: 'Azure GPT-4o',
    provider: AIProvider.Azure,
    maxTokens: 4096,
    contextWindow: 128000,
    pricing: {
      prompt: 0.005,
      completion: 0.015,
      unit: PricingUnit.Per1KTokens,
      currency: 'USD',
      effectiveDate: '2024-05-13'
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

  // ==== Grok AI ====
  // Latest Models
  'grok-4-0709': {
    id: 'grok-4-0709',
    name: 'Grok 4',
    provider: AIProvider.XAI,
    maxTokens: 32000,
    contextWindow: 256000,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'grok-3': {
    id: 'grok-3',
    name: 'Grok 3',
    provider: AIProvider.XAI,
    maxTokens: 32000,
    contextWindow: 131072,
    pricing: {
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'grok-3-mini': {
    id: 'grok-3-mini',
    name: 'Grok 3 Mini',
    provider: AIProvider.XAI,
    maxTokens: 32000,
    contextWindow: 131072,
    pricing: {
      prompt: 0.3,
      completion: 0.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'grok-2-image-1212': {
    id: 'grok-2-image-1212',
    name: 'Grok 2 Image',
    provider: AIProvider.XAI,
    maxTokens: 0,
    contextWindow: 0,
    pricing: {
      prompt: 0.07,
      completion: 0.07,
      unit: PricingUnit.PerToken,
      currency: 'USD',
      effectiveDate: '2025-08-01'
    },
    capabilities: {
      chat: false,
      completion: false,
      embedding: false,
      functionCalling: false,
      vision: false,
      audio: false,
      streaming: false
    }
  },

  // ==== Meta Llama 4 ====
  // Latest Models
  'llama-4-scout': {
    id: 'llama-4-scout',
    name: 'Llama 4 Scout',
    provider: AIProvider.Meta,
    maxTokens: 32000,
    contextWindow: 10000000,
    pricing: {
      prompt: 0.19,
      completion: 0.49,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'llama-4-maverick': {
    id: 'llama-4-maverick',
    name: 'Llama 4 Maverick',
    provider: AIProvider.Meta,
    maxTokens: 32000,
    contextWindow: 10000000,
    pricing: {
      prompt: 0.19,
      completion: 0.49,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
  'llama-4-behemoth-preview': {
    id: 'llama-4-behemoth-preview',
    name: 'Llama 4 Behemoth Preview',
    provider: AIProvider.Meta,
    maxTokens: 32000,
    contextWindow: 10000000,
    pricing: {
      prompt: 0.19,
      completion: 0.49,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2025-08-01'
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
