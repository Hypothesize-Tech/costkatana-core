import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const AWS_BEDROCK_PRICING: ModelPricingConfig[] = [
  // === AI21 Labs Models ===
  {
    modelId: 'ai21.jamba-1-5-large-v1:0',
    modelName: 'Jamba 1.5 Large (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.0,
    outputPrice: 8.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 256000,
    capabilities: ['text', 'long-context'],
    category: 'text',
    isLatest: true,
    notes: 'AI21 Labs Jamba 1.5 Large via AWS Bedrock'
  },
  {
    modelId: 'ai21.jamba-1-5-mini-v1:0',
    modelName: 'Jamba 1.5 Mini (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.2,
    outputPrice: 0.4,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 256000,
    capabilities: ['text', 'long-context', 'efficient'],
    category: 'text',
    isLatest: true,
    notes: 'AI21 Labs Jamba 1.5 Mini via AWS Bedrock'
  },
  {
    modelId: 'ai21.j2-mid-v1',
    modelName: 'Jurassic-2 Mid (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 12.5,
    outputPrice: 12.5,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['text'],
    category: 'text',
    isLatest: false,
    notes: 'AI21 Labs Jurassic-2 Mid via AWS Bedrock'
  },
  {
    modelId: 'ai21.j2-ultra-v1',
    modelName: 'Jurassic-2 Ultra (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 18.8,
    outputPrice: 18.8,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['text'],
    category: 'text',
    isLatest: false,
    notes: 'AI21 Labs Jurassic-2 Ultra via AWS Bedrock'
  },
  {
    modelId: 'ai21.jamba-instruct-v1:0',
    modelName: 'Jamba-Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.5,
    outputPrice: 0.7,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 256000,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: false,
    notes: 'AI21 Labs Jamba-Instruct via AWS Bedrock'
  },

  // === Amazon Nova Models ===
  {
    modelId: 'amazon.nova-micro-v1:0',
    modelName: 'Amazon Nova Micro (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.035,
    outputPrice: 0.14,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    cachedInputPrice: 0.00875, // Cache read price
    capabilities: ['text', 'ultra-fast', 'cost-effective'],
    category: 'text',
    isLatest: true,
    notes: 'Amazon Nova Micro via AWS Bedrock. Cache read: $0.00875, Batch: $0.0175/$0.07'
  },
  {
    modelId: 'amazon.nova-lite-v1:0',
    modelName: 'Amazon Nova Lite (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.06,
    outputPrice: 0.24,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 300000,
    cachedInputPrice: 0.015, // Cache read price
    capabilities: ['text', 'multimodal', 'fast'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Amazon Nova Lite via AWS Bedrock. Cache read: $0.015, Batch: $0.03/$0.12'
  },
  {
    modelId: 'amazon.nova-pro-v1:0',
    modelName: 'Amazon Nova Pro (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.8,
    outputPrice: 3.2,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 300000,
    cachedInputPrice: 0.2, // Cache read price
    capabilities: ['text', 'multimodal', 'reasoning'],
    category: 'multimodal',
    isLatest: true,
    notes:
      'Amazon Nova Pro via AWS Bedrock. Cache read: $0.20, Batch: $0.40/$1.60, Latency optimized: $1.00/$4.00'
  },
  {
    modelId: 'amazon.nova-premier-v1:0',
    modelName: 'Amazon Nova Premier (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.5,
    outputPrice: 12.5,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 300000,
    cachedInputPrice: 0.625, // Cache read price
    capabilities: ['text', 'multimodal', 'advanced-reasoning'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Amazon Nova Premier via AWS Bedrock. Cache read: $0.625, Batch: $1.25/$6.25'
  },
  {
    modelId: 'amazon.nova-canvas-v1:0',
    modelName: 'Amazon Nova Canvas (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.04, // Standard quality up to 1024x1024
    outputPrice: 0.04,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['image-generation'],
    category: 'image',
    isLatest: true,
    notes:
      'Amazon Nova Canvas via AWS Bedrock. Standard: $0.04-$0.06, Premium: $0.06-$0.08 per image'
  },
  {
    modelId: 'amazon.nova-reel-v1:0',
    modelName: 'Amazon Nova Reel (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.08, // per second of video
    outputPrice: 0.08,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['video-generation'],
    category: 'video',
    isLatest: true,
    notes: 'Amazon Nova Reel via AWS Bedrock. $0.08 per second of 720p, 24fps video'
  },
  {
    modelId: 'amazon.nova-sonic-v1:0',
    modelName: 'Amazon Nova Sonic (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 3.4, // Speech input
    outputPrice: 13.6, // Speech output
    unit: PricingUnit.Per1MTokens,
    contextWindow: 300000,
    capabilities: ['speech', 'multimodal', 'native-audio'],
    category: 'audio',
    isLatest: true,
    notes: 'Amazon Nova Sonic via AWS Bedrock. Text input: $0.06, Text output: $0.24'
  },

  // === Amazon Titan Models ===
  {
    modelId: 'amazon.titan-text-express-v1',
    modelName: 'Amazon Titan Text Express (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.8,
    outputPrice: 1.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8000,
    capabilities: ['text'],
    category: 'text',
    isLatest: true,
    notes: "Amazon's own text generation model via Bedrock"
  },
  {
    modelId: 'amazon.titan-text-lite-v1',
    modelName: 'Amazon Titan Text Lite (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.3,
    outputPrice: 0.4,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4000,
    capabilities: ['text'],
    category: 'text',
    isLatest: true,
    notes: 'Lightweight Amazon Titan model via Bedrock'
  },
  {
    modelId: 'amazon.titan-embed-text-v2:0',
    modelName: 'Amazon Titan Text Embeddings V2 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.02,
    outputPrice: 0.02,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['embedding'],
    category: 'embedding',
    isLatest: true,
    notes: 'Amazon Titan Text Embeddings V2 via Bedrock'
  },

  // === Anthropic Claude Models (Updated) ===
  {
    modelId: 'anthropic.claude-opus-4-20250514-v1:0',
    modelName: 'Claude Opus 4 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 15.0,
    outputPrice: 75.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    cachedInputPrice: 1.5, // Cache read price
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
    notes: 'Claude Opus 4 via AWS Bedrock. Cache write: $18.75, Cache read: $1.50'
  },
  {
    modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
    modelName: 'Claude Sonnet 4 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    cachedInputPrice: 0.3, // Cache read price
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
    notes: 'Claude Sonnet 4 via AWS Bedrock. Cache write: $3.75, Cache read: $0.30'
  },
  {
    modelId: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
    modelName: 'Claude Sonnet 3.7 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    cachedInputPrice: 0.3, // Cache read price
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
    notes: 'Claude Sonnet 3.7 via AWS Bedrock. Cache write: $3.75, Cache read: $0.30'
  },
  {
    modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    modelName: 'Claude Sonnet 3.5 v2 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    cachedInputPrice: 0.3, // Cache read price
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes:
      'Claude Sonnet 3.5 v2 via AWS Bedrock. Cache write: $3.75, Cache read: $0.30, Batch: $1.50/$7.50'
  },
  {
    modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    modelName: 'Claude Sonnet 3.5 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Claude Sonnet 3.5 (previous) via AWS Bedrock. Batch: $1.50/$7.50'
  },
  {
    modelId: 'anthropic.claude-3-5-haiku-20241022-v1:0',
    modelName: 'Claude Haiku 3.5 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.8,
    outputPrice: 4.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    cachedInputPrice: 0.08, // Cache read price
    capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes:
      'Claude Haiku 3.5 via AWS Bedrock. Cache write: $1.00, Cache read: $0.08, Latency optimized: $1.00/$5.00'
  },
  {
    modelId: 'anthropic.claude-3-opus-20240229-v1:0',
    modelName: 'Claude Opus 3 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 15.0,
    outputPrice: 75.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Claude Opus 3 via AWS Bedrock'
  },
  {
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    modelName: 'Claude Haiku 3 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.25,
    outputPrice: 1.25,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 200000,
    capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
    category: 'multimodal',
    isLatest: false,
    notes: 'Claude Haiku 3 via AWS Bedrock. Batch: $0.125/$0.625'
  },

  // === Cohere Models ===
  {
    modelId: 'cohere.command-text-v14',
    modelName: 'Cohere Command (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 1.0,
    outputPrice: 2.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4096,
    capabilities: ['text', 'analysis'],
    category: 'text',
    isLatest: true,
    notes: 'Cohere Command via AWS Bedrock'
  },
  {
    modelId: 'cohere.command-light-text-v14',
    modelName: 'Cohere Command Light (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.3,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4096,
    capabilities: ['text'],
    category: 'text',
    isLatest: true,
    notes: 'Cohere Command Light via AWS Bedrock'
  },
  {
    modelId: 'cohere.command-r-plus-v1:0',
    modelName: 'Cohere Command R+ (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 3.0,
    outputPrice: 15.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'enterprise', 'rag', 'tools', 'multilingual'],
    category: 'text',
    isLatest: true,
    notes: 'Cohere Command R+ via AWS Bedrock'
  },
  {
    modelId: 'cohere.command-r-v1:0',
    modelName: 'Cohere Command R (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.5,
    outputPrice: 1.5,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'rag', 'tools', 'long-context'],
    category: 'text',
    isLatest: true,
    notes: 'Cohere Command R via AWS Bedrock'
  },
  {
    modelId: 'cohere.embed-english-v3',
    modelName: 'Cohere Embed English v3 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding'],
    category: 'embedding',
    isLatest: true,
    notes: 'Cohere Embed English v3 via AWS Bedrock'
  },
  {
    modelId: 'cohere.embed-multilingual-v3',
    modelName: 'Cohere Embed Multilingual v3 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding', 'multilingual'],
    category: 'embedding',
    isLatest: true,
    notes: 'Cohere Embed Multilingual v3 via AWS Bedrock'
  },
  {
    modelId: 'cohere.rerank-3-5-v1:0',
    modelName: 'Cohere Rerank 3.5 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.0,
    outputPrice: 2.0,
    unit: PricingUnit.Per1KTokens, // Per 1K searches
    contextWindow: 0,
    capabilities: ['rerank', 'semantic-search', 'retrieval'],
    category: 'retrieval',
    isLatest: true,
    notes: 'Cohere Rerank 3.5 via AWS Bedrock. $2.00 per 1K searches'
  },

  // === DeepSeek Models ===
  {
    modelId: 'deepseek.deepseek-r1-v1:0',
    modelName: 'DeepSeek-R1 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 1.35,
    outputPrice: 5.4,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 64000,
    capabilities: ['text', 'reasoning', 'cot'],
    category: 'reasoning',
    isLatest: true,
    notes: 'DeepSeek-R1 reasoning model via AWS Bedrock'
  },

  // === Luma AI Models ===
  {
    modelId: 'luma.ray2-v1:0',
    modelName: 'Luma Ray2 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 1.5, // 720p per second
    outputPrice: 1.5,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['video-generation'],
    category: 'video',
    isLatest: true,
    notes: 'Luma Ray2 via AWS Bedrock. 720p: $1.50/sec, 540p: $0.75/sec'
  },

  // === Meta Llama Models ===
  {
    modelId: 'meta.llama4-maverick-17b-instruct-v1:0',
    modelName: 'Llama 4 Maverick 17B (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.24,
    outputPrice: 0.97,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: true,
    notes: 'Meta Llama 4 Maverick 17B via AWS Bedrock. Batch: $0.12/$0.485'
  },
  {
    modelId: 'meta.llama4-scout-17b-instruct-v1:0',
    modelName: 'Llama 4 Scout 17B (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.17,
    outputPrice: 0.66,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: true,
    notes: 'Meta Llama 4 Scout 17B via AWS Bedrock. Batch: $0.085/$0.33'
  },
  {
    modelId: 'meta.llama3-3-70b-instruct-v1:0',
    modelName: 'Llama 3.3 70B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.72,
    outputPrice: 0.72,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: true,
    notes: 'Meta Llama 3.3 70B Instruct via AWS Bedrock. Batch: $0.36/$0.36'
  },
  {
    modelId: 'meta.llama3-2-1b-instruct-v1:0',
    modelName: 'Llama 3.2 1B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct', 'small'],
    category: 'text',
    isLatest: true,
    notes: 'Meta Llama 3.2 1B Instruct via AWS Bedrock'
  },
  {
    modelId: 'meta.llama3-2-3b-instruct-v1:0',
    modelName: 'Llama 3.2 3B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.15,
    outputPrice: 0.15,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct', 'small'],
    category: 'text',
    isLatest: true,
    notes: 'Meta Llama 3.2 3B Instruct via AWS Bedrock'
  },
  {
    modelId: 'meta.llama3-2-11b-instruct-v1:0',
    modelName: 'Llama 3.2 11B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.16,
    outputPrice: 0.16,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct', 'vision'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Meta Llama 3.2 11B Instruct via AWS Bedrock'
  },
  {
    modelId: 'meta.llama3-2-90b-instruct-v1:0',
    modelName: 'Llama 3.2 90B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.72,
    outputPrice: 0.72,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct', 'vision'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Meta Llama 3.2 90B Instruct via AWS Bedrock'
  },
  {
    modelId: 'meta.llama3-1-8b-instruct-v1:0',
    modelName: 'Llama 3.1 8B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.22,
    outputPrice: 0.22,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: false,
    notes: 'Meta Llama 3.1 8B Instruct via AWS Bedrock. Batch: $0.11/$0.11'
  },
  {
    modelId: 'meta.llama3-1-70b-instruct-v1:0',
    modelName: 'Llama 3.1 70B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.72,
    outputPrice: 0.72,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: false,
    notes:
      'Meta Llama 3.1 70B Instruct via AWS Bedrock. Batch: $0.36/$0.36, Latency optimized: $0.90/$0.90'
  },
  {
    modelId: 'meta.llama3-1-405b-instruct-v1:0',
    modelName: 'Llama 3.1 405B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.4,
    outputPrice: 2.4,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'instruct', 'large'],
    category: 'text',
    isLatest: false,
    notes:
      'Meta Llama 3.1 405B Instruct via AWS Bedrock. Batch: $1.20/$1.20, Latency optimized: $3.00/$3.00'
  },
  {
    modelId: 'meta.llama3-8b-instruct-v1:0',
    modelName: 'Llama 3 8B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.3,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: false,
    notes: 'Meta Llama 3 8B Instruct via AWS Bedrock'
  },
  {
    modelId: 'meta.llama3-70b-instruct-v1:0',
    modelName: 'Llama 3 70B Instruct (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.65,
    outputPrice: 3.5,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['text', 'instruct'],
    category: 'text',
    isLatest: false,
    notes: 'Meta Llama 3 70B Instruct via AWS Bedrock'
  },
  {
    modelId: 'meta.llama2-13b-chat-v1',
    modelName: 'Llama 2 13B Chat (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.75,
    outputPrice: 1.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4096,
    capabilities: ['text', 'chat'],
    category: 'text',
    isLatest: false,
    notes: 'Meta Llama 2 13B Chat via AWS Bedrock'
  },
  {
    modelId: 'meta.llama2-70b-chat-v1',
    modelName: 'Llama 2 70B Chat (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 1.95,
    outputPrice: 2.56,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4096,
    capabilities: ['text', 'chat'],
    category: 'text',
    isLatest: false,
    notes: 'Meta Llama 2 70B Chat via AWS Bedrock'
  },

  // === Mistral AI Models ===
  {
    modelId: 'mistral.pixtral-large-2502-v1:0',
    modelName: 'Pixtral Large (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.0,
    outputPrice: 6.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['vision', 'multimodal', 'reasoning'],
    category: 'multimodal',
    isLatest: true,
    notes: 'Mistral Pixtral Large via AWS Bedrock'
  },

  // === Stability AI Models ===
  {
    modelId: 'stability.stable-diffusion-3-5-large-v1:0',
    modelName: 'Stable Diffusion 3.5 Large (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.08,
    outputPrice: 0.08,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['image-generation'],
    category: 'image',
    isLatest: true,
    notes: 'Stability AI Stable Diffusion 3.5 Large via AWS Bedrock'
  },
  {
    modelId: 'stability.stable-image-core-v1:0',
    modelName: 'Stable Image Core (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.04,
    outputPrice: 0.04,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['image-generation'],
    category: 'image',
    isLatest: true,
    notes: 'Stability AI Stable Image Core via AWS Bedrock'
  },
  {
    modelId: 'stability.stable-diffusion-3-large-v1:0',
    modelName: 'Stable Diffusion 3 Large (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.08,
    outputPrice: 0.08,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['image-generation'],
    category: 'image',
    isLatest: false,
    notes: 'Stability AI Stable Diffusion 3 Large via AWS Bedrock'
  },
  {
    modelId: 'stability.stable-image-ultra-v1:0',
    modelName: 'Stable Image Ultra (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.14,
    outputPrice: 0.14,
    unit: PricingUnit.PerRequest,
    contextWindow: 0,
    capabilities: ['image-generation', 'high-quality'],
    category: 'image',
    isLatest: true,
    notes: 'Stability AI Stable Image Ultra via AWS Bedrock'
  },

  // === Writer Models ===
  {
    modelId: 'writer.palmyra-x4-v1:0',
    modelName: 'Palmyra X4 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 2.5,
    outputPrice: 10.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32000,
    capabilities: ['text', 'enterprise'],
    category: 'text',
    isLatest: true,
    notes: 'Writer Palmyra X4 via AWS Bedrock'
  },
  {
    modelId: 'writer.palmyra-x5-v1:0',
    modelName: 'Palmyra X5 (Bedrock)',
    provider: 'AWS Bedrock',
    inputPrice: 0.6,
    outputPrice: 6.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 32000,
    capabilities: ['text', 'enterprise'],
    category: 'text',
    isLatest: true,
    notes: 'Writer Palmyra X5 via AWS Bedrock'
  }
];
