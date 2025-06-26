import { AIProvider } from './index';
import { ProviderModel, PricingUnit } from './providers';

/**
 * Comprehensive model registry for major AI providers.
 * Pricing and capabilities are based on official documentation as of June 2024.
 * For the latest, always check provider docs.
 */
export const MODELS: Record<string, ProviderModel> = {
  // ==== OpenAI ====
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
    name: 'Claude 3 Sonnet',
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
    name: 'Claude 3 Haiku',
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
    name: 'Claude 3.5 Sonnet',
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
  'anthropic.claude-3-5-sonnet-20240620-v1:0': {
    id: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    name: 'Claude 3.5 Sonnet (Bedrock)',
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
      prompt: 0.5,
      completion: 1.5,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-23'
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
      prompt: 3.0,
      completion: 15.0,
      unit: PricingUnit.Per1MTokens,
      currency: 'USD',
      effectiveDate: '2024-04-23'
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
      effectiveDate: '2024-06-01'
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
      effectiveDate: '2024-06-01'
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
      vision: true,
      audio: true,
      streaming: true
    }
  },

  // ==== Cohere ====
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
