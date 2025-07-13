export enum PricingUnit {
  Per1KTokens = 'PER_1K_TOKENS',
  Per1MTokens = 'PER_1M_TOKENS',
  PerRequest = 'PER_REQUEST',
  PerHour = 'PER_HOUR',
  PerMinute = 'PER_MINUTE'
}

export interface ModelPricingConfig {
  modelId: string;
  modelName: string;
  provider: string;
  inputPrice: number;
  outputPrice: number;
  unit: PricingUnit;
  contextWindow?: number;
  capabilities?: string[];
  category?: string;
  isLatest?: boolean;
  notes?: string;
  region?: string;
  cachedInputPrice?: number;
}

// Fresh pricing data organized by provider - July 2025
export const PRICING_CONFIG: Record<string, ModelPricingConfig[]> = {

  // === OpenAI - April 2025 Fresh Pricing ===
  'OpenAI': [
    // ... (unchanged, see above)
    // (Keep all OpenAI models as in the original selection)
    // ... (unchanged, see above)
    {
      modelId: 'text-embedding-ada-002',
      modelName: 'Ada v2 Embedding',
      provider: 'OpenAI',
      inputPrice: 0.10,
      outputPrice: 0.10,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 8191,
      capabilities: ['embedding'],
      category: 'embedding',
      isLatest: false,
      notes: 'Legacy embedding model'
    }
  ],

  // === xAI Grok - January 2025 Fresh Pricing ===
  'xAI': [
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
  ],

  // === Anthropic - July 2025 Pricing (Updated) ===
  'Anthropic': [
    // Claude Opus 4
    {
      modelId: 'claude-opus-4-20250514',
      modelName: 'Claude Opus 4',
      provider: 'Anthropic',
      inputPrice: 15.00,
      outputPrice: 75.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Most capable Claude model (Mar 2025 cutoff, 200k context, 32k output)'
    },
    // Claude Sonnet 4
    {
      modelId: 'claude-sonnet-4-20250514',
      modelName: 'Claude Sonnet 4',
      provider: 'Anthropic',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'High-performance Claude model (Mar 2025 cutoff, 200k context, 32k output)'
    },
    // Claude Sonnet 3.7 (latest alias)
    {
      modelId: 'claude-3-7-sonnet-20250219',
      modelName: 'Claude Sonnet 3.7',
      provider: 'Anthropic',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'High-performance model with early extended thinking (Oct 2024 cutoff, 200k context, 64k output)'
    },
    // Claude Sonnet 3.5 v2 (latest alias)
    {
      modelId: 'claude-3-5-sonnet-20241022',
      modelName: 'Claude Sonnet 3.5 v2',
      provider: 'Anthropic',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Upgraded Claude 3.5 Sonnet (Apr 2024 cutoff, 200k context, 8k output)'
    },
    // Claude Sonnet 3.5 (previous version)
    {
      modelId: 'claude-3-5-sonnet-20240620',
      modelName: 'Claude Sonnet 3.5',
      provider: 'Anthropic',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Previous Claude 3.5 Sonnet (Apr 2024 cutoff, 200k context, 8k output)'
    },
    // Claude Haiku 3.5 (latest alias)
    {
      modelId: 'claude-3-5-haiku-20241022',
      modelName: 'Claude Haiku 3.5',
      provider: 'Anthropic',
      inputPrice: 0.80,
      outputPrice: 4.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Fastest Claude model (July 2024 cutoff, 200k context, 8k output)'
    },
    // Claude Opus 3 (legacy)
    {
      modelId: 'claude-3-opus-20240229',
      modelName: 'Claude Opus 3',
      provider: 'Anthropic',
      inputPrice: 15.00,
      outputPrice: 75.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Legacy Claude Opus 3 (Aug 2023 cutoff, 200k context, 4k output)'
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
      notes: 'Legacy Claude Haiku 3 (Aug 2023 cutoff, 200k context, 4k output)'
    },
    // Claude 2.1 (legacy)
    {
      modelId: 'claude-2.1',
      modelName: 'Claude 2.1',
      provider: 'Anthropic',
      inputPrice: 8.00,
      outputPrice: 24.00,
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
      inputPrice: 8.00,
      outputPrice: 24.00,
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
      inputPrice: 0.80,
      outputPrice: 2.40,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 100000,
      capabilities: ['text', 'analysis'],
      category: 'text',
      isLatest: false,
      notes: 'Fast and cost-effective Claude variant'
    }
  ],

  // === Google AI - July 2025 Fresh Pricing (Updated) ===
  'Google AI': [
    // Gemini 2.5 Pro
    {
      modelId: 'gemini-2.5-pro',
      modelName: 'Gemini 2.5 Pro',
      provider: 'Google AI',
      inputPrice: 1.25, // <= 200k tokens
      outputPrice: 10.00, // <= 200k tokens
      unit: PricingUnit.Per1MTokens,
      contextWindow: 2000000,
      capabilities: ['text', 'multimodal', 'reasoning', 'coding'],
      category: 'multimodal',
      isLatest: true,
      notes: 'State-of-the-art multipurpose model, excels at coding and complex reasoning. $2.50/$15.00 for prompts > 200k tokens'
    },
    // Gemini 2.5 Flash
    {
      modelId: 'gemini-2.5-flash',
      modelName: 'Gemini 2.5 Flash',
      provider: 'Google AI',
      inputPrice: 0.30, // text/image/video
      outputPrice: 2.50,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text', 'image', 'video', 'multimodal', 'reasoning', 'thinking'],
      category: 'multimodal',
      isLatest: true,
      notes: 'First hybrid reasoning model with 1M context and thinking budgets. Audio input: $1.00'
    },
    // Gemini 2.5 Flash-Lite Preview
    {
      modelId: 'gemini-2.5-flash-lite-preview',
      modelName: 'Gemini 2.5 Flash-Lite Preview',
      provider: 'Google AI',
      inputPrice: 0.10, // text/image/video
      outputPrice: 0.40,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text', 'image', 'video', 'multimodal', 'reasoning', 'thinking'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Smallest and most cost effective model for at-scale usage. Audio input: $0.50'
    },
    // Gemini 2.5 Flash Native Audio
    {
      modelId: 'gemini-2.5-flash-native-audio',
      modelName: 'Gemini 2.5 Flash Native Audio',
      provider: 'Google AI',
      inputPrice: 0.50, // text
      outputPrice: 2.00, // text
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['audio', 'multimodal', 'native-audio'],
      category: 'audio',
      isLatest: true,
      notes: 'Native audio model optimized for higher quality audio outputs. Audio/video input: $3.00, Audio output: $12.00'
    },
    // Gemini 2.5 Flash Preview TTS
    {
      modelId: 'gemini-2.5-flash-preview-tts',
      modelName: 'Gemini 2.5 Flash Preview TTS',
      provider: 'Google AI',
      inputPrice: 0.50,
      outputPrice: 10.00, // audio output
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text-to-speech', 'audio', 'tts'],
      category: 'audio',
      isLatest: true,
      notes: '2.5 Flash TTS model optimized for price-performant, low-latency speech generation'
    },
    // Gemini 2.5 Pro Preview TTS
    {
      modelId: 'gemini-2.5-pro-preview-tts',
      modelName: 'Gemini 2.5 Pro Preview TTS',
      provider: 'Google AI',
      inputPrice: 1.00,
      outputPrice: 20.00, // audio output
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text-to-speech', 'audio', 'tts'],
      category: 'audio',
      isLatest: true,
      notes: '2.5 Pro TTS model optimized for powerful, low-latency speech generation'
    },
    // Gemini 2.0 Flash
    {
      modelId: 'gemini-2.0-flash',
      modelName: 'Gemini 2.0 Flash',
      provider: 'Google AI',
      inputPrice: 0.10, // text/image/video
      outputPrice: 0.40,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text', 'image', 'video', 'multimodal', 'agents'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Most balanced multimodal model built for the era of Agents. Audio input: $0.70'
    },
    // Gemini 2.0 Flash-Lite
    {
      modelId: 'gemini-2.0-flash-lite',
      modelName: 'Gemini 2.0 Flash-Lite',
      provider: 'Google AI',
      inputPrice: 0.075,
      outputPrice: 0.30,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text', 'multimodal'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Smallest and most cost effective model, built for at scale usage'
    },
    // Gemini 1.5 Flash
    {
      modelId: 'gemini-1.5-flash',
      modelName: 'Gemini 1.5 Flash',
      provider: 'Google AI',
      inputPrice: 0.075, // <= 128k tokens
      outputPrice: 0.30, // <= 128k tokens
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text', 'image', 'video', 'multimodal'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Fastest multimodal model for diverse, repetitive tasks. $0.15/$0.60 for prompts > 128k tokens'
    },
    // Gemini 1.5 Flash-8B
    {
      modelId: 'gemini-1.5-flash-8b',
      modelName: 'Gemini 1.5 Flash-8B',
      provider: 'Google AI',
      inputPrice: 0.0375, // <= 128k tokens
      outputPrice: 0.15, // <= 128k tokens
      unit: PricingUnit.Per1MTokens,
      contextWindow: 1000000,
      capabilities: ['text', 'image', 'video', 'multimodal'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Smallest model for lower intelligence use cases. $0.075/$0.30 for prompts > 128k tokens'
    },
    // Gemini 1.5 Pro
    {
      modelId: 'gemini-1.5-pro',
      modelName: 'Gemini 1.5 Pro',
      provider: 'Google AI',
      inputPrice: 1.25, // <= 128k tokens
      outputPrice: 5.00, // <= 128k tokens
      unit: PricingUnit.Per1MTokens,
      contextWindow: 2000000,
      capabilities: ['text', 'code', 'reasoning', 'multimodal'],
      category: 'text',
      isLatest: false,
      notes: 'Highest intelligence Gemini 1.5 series model with 2M context. $2.50/$10.00 for prompts > 128k tokens'
    },
    // Text Embedding 004
    {
      modelId: 'text-embedding-004',
      modelName: 'Text Embedding 004',
      provider: 'Google AI',
      inputPrice: 0.00, // Free tier only
      outputPrice: 0.00, // Free tier only
      unit: PricingUnit.Per1MTokens,
      contextWindow: 2048,
      capabilities: ['embedding'],
      category: 'embedding',
      isLatest: true,
      notes: 'State-of-the-art text embedding model (free tier only)'
    },
    // Gemma 3
    {
      modelId: 'gemma-3',
      modelName: 'Gemma 3',
      provider: 'Google AI',
      inputPrice: 0.00, // Free tier only
      outputPrice: 0.00, // Free tier only
      unit: PricingUnit.Per1MTokens,
      contextWindow: 8192,
      capabilities: ['text', 'open-source'],
      category: 'text',
      isLatest: true,
      notes: 'Lightweight, state-of-the-art open model (free tier only)'
    },
    // Gemma 3n
    {
      modelId: 'gemma-3n',
      modelName: 'Gemma 3n',
      provider: 'Google AI',
      inputPrice: 0.00, // Free tier only
      outputPrice: 0.00, // Free tier only
      unit: PricingUnit.Per1MTokens,
      contextWindow: 8192,
      capabilities: ['text', 'open-source', 'mobile-optimized'],
      category: 'text',
      isLatest: true,
      notes: 'Open model built for efficient performance on everyday devices (free tier only)'
    },
    // Imagen 4 Preview
    {
      modelId: 'imagen-4-preview',
      modelName: 'Imagen 4 Preview',
      provider: 'Google AI',
      inputPrice: 0.04, // Standard
      outputPrice: 0.04, // Standard
      unit: PricingUnit.PerRequest,
      contextWindow: 0,
      capabilities: ['image-generation'],
      category: 'image',
      isLatest: true,
      notes: 'Latest image generation model with better text rendering. Ultra: $0.06 per image'
    },
    // Imagen 3
    {
      modelId: 'imagen-3',
      modelName: 'Imagen 3',
      provider: 'Google AI',
      inputPrice: 0.03,
      outputPrice: 0.03,
      unit: PricingUnit.PerRequest,
      contextWindow: 0,
      capabilities: ['image-generation'],
      category: 'image',
      isLatest: false,
      notes: 'State-of-the-art image generation model'
    },
    // Veo 2
    {
      modelId: 'veo-2',
      modelName: 'Veo 2',
      provider: 'Google AI',
      inputPrice: 0.35, // per second
      outputPrice: 0.35, // per second
      unit: PricingUnit.PerRequest,
      contextWindow: 0,
      capabilities: ['video-generation'],
      category: 'video',
      isLatest: true,
      notes: 'State-of-the-art video generation model (priced per second)'
    },
    // Legacy models for backward compatibility
    {
      modelId: 'gemini-1.0-pro',
      modelName: 'Gemini 1.0 Pro',
      provider: 'Google AI',
      inputPrice: 0.50,
      outputPrice: 1.50,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 32000,
      capabilities: ['text', 'analysis'],
      category: 'text',
      isLatest: false,
      notes: 'Earlier generation Gemini model'
    }
  ],

  // === DeepSeek - Ultra Low Cost January 2025 (Updated with all models) ===
  'DeepSeek': [
    // DeepSeek Chat (V3-0324) - Latest
    {
      modelId: 'deepseek-chat',
      modelName: 'DeepSeek Chat (V3-0324)',
      provider: 'DeepSeek',
      inputPrice: 0.27, // Standard price (cache miss)
      outputPrice: 1.10,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 64000,
      cachedInputPrice: 0.07, // Cache hit price
      capabilities: ['text', 'analysis', 'json-output', 'function-calling', 'chat-prefix-completion', 'fim-completion'],
      category: 'text',
      isLatest: true,
      notes: 'Latest DeepSeek V3 model with 64K context. Cache hit: $0.07, Off-peak 50% discount (16:30-00:30 UTC)'
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
      capabilities: ['text', 'reasoning', 'cot', 'json-output', 'function-calling', 'chat-prefix-completion'],
      category: 'reasoning',
      isLatest: true,
      notes: 'Latest DeepSeek R1 reasoning model with CoT. Max 32K default output (64K max). Cache hit: $0.14, Off-peak 75% discount (16:30-00:30 UTC)'
    },
    // DeepSeek V3 (Previous version for compatibility)
    {
      modelId: 'deepseek-v3',
      modelName: 'DeepSeek V3',
      provider: 'DeepSeek',
      inputPrice: 0.27,
      outputPrice: 1.10,
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
  ],

  // === Mistral AI - January 2025 Fresh Pricing (Complete Lineup) ===
  'Mistral AI': [
    // Premier Models
    {
      modelId: 'mistral-medium-latest',
      modelName: 'Mistral Medium 3',
      provider: 'Mistral AI',
      inputPrice: 0.40,
      outputPrice: 2.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'analysis', 'reasoning', 'enterprise'],
      category: 'text',
      isLatest: true,
      notes: 'State-of-the-art performance. Simplified enterprise deployments. Cost-efficient.'
    },
    {
      modelId: 'magistral-medium-latest',
      modelName: 'Magistral Medium (Preview)',
      provider: 'Mistral AI',
      inputPrice: 2.00,
      outputPrice: 5.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'reasoning', 'thinking', 'domain-specific', 'multilingual'],
      category: 'reasoning',
      isLatest: true,
      notes: 'Thinking model excelling in domain-specific, transparent, and multilingual reasoning.'
    },
    {
      modelId: 'codestral-latest',
      modelName: 'Codestral',
      provider: 'Mistral AI',
      inputPrice: 0.30,
      outputPrice: 0.90,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 32000,
      capabilities: ['code', 'programming', 'multilingual-code'],
      category: 'code',
      isLatest: true,
      notes: 'Lightweight, fast, and proficient in over 80 programming languages.'
    },
    {
      modelId: 'devstral-medium-2507',
      modelName: 'Devstral Medium',
      provider: 'Mistral AI',
      inputPrice: 0.40,
      outputPrice: 2.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['code', 'agents', 'advanced-coding'],
      category: 'code',
      isLatest: true,
      notes: 'Enhanced model for advanced coding agents.'
    },
    {
      modelId: 'mistral-ocr-latest',
      modelName: 'Document AI & OCR',
      provider: 'Mistral AI',
      inputPrice: 1.00, // OCR per 1000 pages
      outputPrice: 3.00, // Annotations per 1000 pages
      unit: PricingUnit.PerRequest,
      contextWindow: 0,
      capabilities: ['ocr', 'document-understanding', 'annotations'],
      category: 'document',
      isLatest: true,
      notes: 'World\'s best document understanding API. OCR: $1/1000 pages, Annotations: $3/1000 pages'
    },
    {
      modelId: 'mistral-saba-latest',
      modelName: 'Mistral Saba',
      provider: 'Mistral AI',
      inputPrice: 0.20,
      outputPrice: 0.60,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'custom-trained', 'regional'],
      category: 'text',
      isLatest: true,
      notes: 'Custom-trained model to serve specific geographies, markets, and customers.'
    },
    {
      modelId: 'mistral-large-latest',
      modelName: 'Mistral Large',
      provider: 'Mistral AI',
      inputPrice: 2.00,
      outputPrice: 6.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'reasoning', 'complex-tasks'],
      category: 'text',
      isLatest: true,
      notes: 'Top-tier reasoning for high-complexity tasks and sophisticated problems.'
    },
    {
      modelId: 'pixtral-large-latest',
      modelName: 'Pixtral Large',
      provider: 'Mistral AI',
      inputPrice: 2.00,
      outputPrice: 6.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['vision', 'multimodal', 'reasoning'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Vision-capable large model with frontier reasoning capabilities.'
    },
    {
      modelId: 'ministral-8b-latest',
      modelName: 'Ministral 8B 24.10',
      provider: 'Mistral AI',
      inputPrice: 0.10,
      outputPrice: 0.10,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'edge', 'on-device'],
      category: 'text',
      isLatest: true,
      notes: 'Powerful model for on-device use cases.'
    },
    {
      modelId: 'ministral-3b-latest',
      modelName: 'Ministral 3B 24.10',
      provider: 'Mistral AI',
      inputPrice: 0.04,
      outputPrice: 0.04,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'edge', 'efficient'],
      category: 'text',
      isLatest: true,
      notes: 'Most efficient edge model.'
    },
    {
      modelId: 'codestral-embed-2505',
      modelName: 'Codestral Embed',
      provider: 'Mistral AI',
      inputPrice: 0.15,
      outputPrice: 0.15,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 8192,
      capabilities: ['embedding', 'code'],
      category: 'embedding',
      isLatest: true,
      notes: 'State-of-the-art embedding model for code.'
    },
    {
      modelId: 'mistral-embed',
      modelName: 'Mistral Embed',
      provider: 'Mistral AI',
      inputPrice: 0.10,
      outputPrice: 0.10,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 8192,
      capabilities: ['embedding', 'text'],
      category: 'embedding',
      isLatest: true,
      notes: 'State-of-the-art model for extracting representation of text extracts.'
    },
    {
      modelId: 'mistral-moderation-latest',
      modelName: 'Mistral Moderation 24.11',
      provider: 'Mistral AI',
      inputPrice: 0.10,
      outputPrice: 0.10,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 32000,
      capabilities: ['moderation', 'classification'],
      category: 'moderation',
      isLatest: true,
      notes: 'A classifier service for text content moderation.'
    },
    // Open Models
    {
      modelId: 'mistral-small-latest',
      modelName: 'Mistral Small 3.2',
      provider: 'Mistral AI',
      inputPrice: 0.10,
      outputPrice: 0.30,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'multimodal', 'multilingual', 'open-source'],
      category: 'multimodal',
      isLatest: true,
      notes: 'SOTA. Multimodal. Multilingual. Apache 2.0.'
    },
    {
      modelId: 'magistral-small-latest',
      modelName: 'Magistral Small',
      provider: 'Mistral AI',
      inputPrice: 0.50,
      outputPrice: 1.50,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'reasoning', 'thinking', 'domain-specific', 'multilingual'],
      category: 'reasoning',
      isLatest: true,
      notes: 'Thinking model excelling in domain-specific, transparent, and multilingual reasoning.'
    },
    {
      modelId: 'devstral-small-2507',
      modelName: 'Devstral Small',
      provider: 'Mistral AI',
      inputPrice: 0.10,
      outputPrice: 0.30,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['code', 'agents', 'open-source'],
      category: 'code',
      isLatest: true,
      notes: 'The best open-source model for coding agents.'
    },
    {
      modelId: 'pixtral-12b',
      modelName: 'Pixtral 12B',
      provider: 'Mistral AI',
      inputPrice: 0.15,
      outputPrice: 0.15,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['vision', 'multimodal', 'small'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Vision-capable small model.'
    },
    {
      modelId: 'mistral-nemo',
      modelName: 'Mistral NeMo',
      provider: 'Mistral AI',
      inputPrice: 0.15,
      outputPrice: 0.15,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'code', 'specialized'],
      category: 'code',
      isLatest: true,
      notes: 'State-of-the-art Mistral model trained specifically for code tasks.'
    },
    {
      modelId: 'open-mistral-7b',
      modelName: 'Mistral 7B',
      provider: 'Mistral AI',
      inputPrice: 0.25,
      outputPrice: 0.25,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 32000,
      capabilities: ['text', 'open-source', 'fast'],
      category: 'text',
      isLatest: false,
      notes: 'A 7B transformer model, fast-deployed and easily customisable.'
    },
    {
      modelId: 'open-mixtral-8x7b',
      modelName: 'Mixtral 8x7B',
      provider: 'Mistral AI',
      inputPrice: 0.70,
      outputPrice: 0.70,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 32000,
      capabilities: ['text', 'mixture-of-experts', 'open-source'],
      category: 'text',
      isLatest: false,
      notes: 'A 7B sparse Mixture-of-Experts (SMoE). Uses 12.9B active parameters out of 45B total.'
    },
    {
      modelId: 'open-mixtral-8x22b',
      modelName: 'Mixtral 8x22B',
      provider: 'Mistral AI',
      inputPrice: 2.00,
      outputPrice: 6.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 65000,
      capabilities: ['text', 'mixture-of-experts', 'open-source', 'high-performance'],
      category: 'text',
      isLatest: false,
      notes: 'Most performant open model. A 22B sparse Mixture-of-Experts (SMoE). Uses only 39B active parameters out of 141B.'
    }
  ],

  // === Groq - Ultra Fast Inference January 2025 ===
  'Groq': [
    // ... (unchanged, see above)
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
  ],

  // === Cohere - January 2025 Fresh Pricing (Complete Lineup) ===
  'Cohere': [
    // Generative Models
    {
      modelId: 'command-a',
      modelName: 'Command A',
      provider: 'Cohere',
      inputPrice: 2.50,
      outputPrice: 10.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'agentic', 'multilingual', 'human-evaluations'],
      category: 'text',
      isLatest: true,
      notes: 'Most efficient and performant model to date, specializing in agentic AI, multilingual, and human evaluations for real-life use cases'
    },
    {
      modelId: 'command-r-plus',
      modelName: 'Command R+',
      provider: 'Cohere',
      inputPrice: 2.50,
      outputPrice: 10.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'enterprise', 'rag', 'tools', 'multilingual'],
      category: 'text',
      isLatest: true,
      notes: 'Powerful, scalable large language model purpose-built to excel at real-world enterprise use cases'
    },
    {
      modelId: 'command-r',
      modelName: 'Command R',
      provider: 'Cohere',
      inputPrice: 0.15,
      outputPrice: 0.60,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'rag', 'tools', 'long-context'],
      category: 'text',
      isLatest: true,
      notes: 'Generative model optimized for long context tasks such as retrieval-augmented generation (RAG) and using external APIs and tools'
    },
    {
      modelId: 'command-r-fine-tuned',
      modelName: 'Command R Fine-tuned',
      provider: 'Cohere',
      inputPrice: 0.30,
      outputPrice: 1.20,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'fine-tuned', 'custom'],
      category: 'text',
      isLatest: true,
      notes: 'Fine-tuned Command R model for specialized use cases. Training: $3.00/1M tokens'
    },
    {
      modelId: 'command-r7b',
      modelName: 'Command R7B',
      provider: 'Cohere',
      inputPrice: 0.0375,
      outputPrice: 0.15,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'small', 'efficient', 'speed'],
      category: 'text',
      isLatest: true,
      notes: 'Smallest generative model optimized for top-tier speed, efficiency, and quality to build powerful AI applications'
    },
    // Retrieval Models
    {
      modelId: 'rerank-3.5',
      modelName: 'Rerank 3.5',
      provider: 'Cohere',
      inputPrice: 2.00,
      outputPrice: 2.00,
      unit: PricingUnit.Per1KTokens, // Note: Per 1K searches, not tokens
      contextWindow: 0,
      capabilities: ['rerank', 'semantic-search', 'retrieval'],
      category: 'retrieval',
      isLatest: true,
      notes: 'Provides a powerful semantic boost to the search quality of any keyword or vector search system. $2.00 per 1K searches (query with up to 100 documents)'
    },
    {
      modelId: 'embed-4',
      modelName: 'Embed 4',
      provider: 'Cohere',
      inputPrice: 0.12,
      outputPrice: 0.12,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 512,
      capabilities: ['embedding', 'multimodal', 'semantic-search', 'rag'],
      category: 'embedding',
      isLatest: true,
      notes: 'Leading multimodal embedding model. Acts as an intelligent retrieval engine for semantic search and RAG systems. Image: $0.47/1M image tokens'
    },
    // Legacy Models (for backward compatibility)
    {
      modelId: 'command-r-03-2024',
      modelName: 'Command R (03-2024)',
      provider: 'Cohere',
      inputPrice: 0.50,
      outputPrice: 1.50,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'rag', 'tools', 'legacy'],
      category: 'text',
      isLatest: false,
      notes: 'Previous version of Command R (March 2024)'
    },
    {
      modelId: 'command-r-plus-04-2024',
      modelName: 'Command R+ (04-2024)',
      provider: 'Cohere',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'enterprise', 'rag', 'tools', 'legacy'],
      category: 'text',
      isLatest: false,
      notes: 'Previous version of Command R+ (April 2024)'
    },
    {
      modelId: 'rerank-2',
      modelName: 'Rerank 2',
      provider: 'Cohere',
      inputPrice: 1.00,
      outputPrice: 1.00,
      unit: PricingUnit.Per1KTokens,
      contextWindow: 0,
      capabilities: ['rerank', 'semantic-search', 'legacy'],
      category: 'retrieval',
      isLatest: false,
      notes: 'Previous generation rerank model'
    },
    {
      modelId: 'embed-multilingual-v3.0',
      modelName: 'Embed Multilingual v3.0',
      provider: 'Cohere',
      inputPrice: 0.10,
      outputPrice: 0.10,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 512,
      capabilities: ['embedding', 'multilingual'],
      category: 'embedding',
      isLatest: false,
      notes: 'Previous generation multilingual embedding model'
    },
    {
      modelId: 'command-light',
      modelName: 'Command Light',
      provider: 'Cohere',
      inputPrice: 0.30,
      outputPrice: 0.60,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 4096,
      capabilities: ['text', 'lightweight', 'legacy'],
      category: 'text',
      isLatest: false,
      notes: 'Legacy lightweight Command model'
    },
    {
      modelId: 'classify',
      modelName: 'Classify',
      provider: 'Cohere',
      inputPrice: 1.00,
      outputPrice: 1.00,
      unit: PricingUnit.Per1KTokens,
      contextWindow: 0,
      capabilities: ['classification', 'legacy'],
      category: 'classification',
      isLatest: false,
      notes: 'Legacy text classification model'
    }
  ],

  // === AWS Bedrock - July 2025 Fresh Pricing (Complete Lineup) ===
  'AWS Bedrock': [
    // === AI21 Labs Models ===
    {
      modelId: 'ai21.jamba-1-5-large-v1:0',
      modelName: 'Jamba 1.5 Large (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 2.00,
      outputPrice: 8.00,
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
      inputPrice: 0.20,
      outputPrice: 0.40,
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
      inputPrice: 12.50,
      outputPrice: 12.50,
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
      inputPrice: 18.80,
      outputPrice: 18.80,
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
      inputPrice: 0.50,
      outputPrice: 0.70,
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
      inputPrice: 0.80,
      outputPrice: 3.20,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 300000,
      cachedInputPrice: 0.20, // Cache read price
      capabilities: ['text', 'multimodal', 'reasoning'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Amazon Nova Pro via AWS Bedrock. Cache read: $0.20, Batch: $0.40/$1.60, Latency optimized: $1.00/$4.00'
    },
    {
      modelId: 'amazon.nova-premier-v1:0',
      modelName: 'Amazon Nova Premier (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 2.50,
      outputPrice: 12.50,
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
      notes: 'Amazon Nova Canvas via AWS Bedrock. Standard: $0.04-$0.06, Premium: $0.06-$0.08 per image'
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
      inputPrice: 3.40, // Speech input
      outputPrice: 13.60, // Speech output
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
      notes: 'Amazon\'s own text generation model via Bedrock'
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
      inputPrice: 15.00,
      outputPrice: 75.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      cachedInputPrice: 1.50, // Cache read price
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Claude Opus 4 via AWS Bedrock. Cache write: $18.75, Cache read: $1.50'
    },
    {
      modelId: 'anthropic.claude-sonnet-4-20250514-v1:0',
      modelName: 'Claude Sonnet 4 (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      cachedInputPrice: 0.30, // Cache read price
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Claude Sonnet 4 via AWS Bedrock. Cache write: $3.75, Cache read: $0.30'
    },
    {
      modelId: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
      modelName: 'Claude Sonnet 3.7 (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      cachedInputPrice: 0.30, // Cache read price
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'extended-thinking', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Claude Sonnet 3.7 via AWS Bedrock. Cache write: $3.75, Cache read: $0.30'
    },
    {
      modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      modelName: 'Claude Sonnet 3.5 v2 (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 3.00,
      outputPrice: 15.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      cachedInputPrice: 0.30, // Cache read price
      capabilities: ['text', 'vision', 'multimodal', 'reasoning', 'multilingual'],
      category: 'multimodal',
      isLatest: false,
      notes: 'Claude Sonnet 3.5 v2 via AWS Bedrock. Cache write: $3.75, Cache read: $0.30, Batch: $1.50/$7.50'
    },
    {
      modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      modelName: 'Claude Sonnet 3.5 (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 3.00,
      outputPrice: 15.00,
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
      inputPrice: 0.80,
      outputPrice: 4.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 200000,
      cachedInputPrice: 0.08, // Cache read price
      capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
      category: 'multimodal',
      isLatest: true,
      notes: 'Claude Haiku 3.5 via AWS Bedrock. Cache write: $1.00, Cache read: $0.08, Latency optimized: $1.00/$5.00'
    },
    {
      modelId: 'anthropic.claude-3-opus-20240229-v1:0',
      modelName: 'Claude Opus 3 (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 15.00,
      outputPrice: 75.00,
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
      inputPrice: 1.00,
      outputPrice: 2.00,
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
      inputPrice: 0.30,
      outputPrice: 0.60,
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
      inputPrice: 3.00,
      outputPrice: 15.00,
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
      inputPrice: 0.50,
      outputPrice: 1.50,
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
      inputPrice: 0.10,
      outputPrice: 0.10,
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
      inputPrice: 0.10,
      outputPrice: 0.10,
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
      inputPrice: 2.00,
      outputPrice: 2.00,
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
      outputPrice: 5.40,
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
      inputPrice: 1.50, // 720p per second
      outputPrice: 1.50,
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
      inputPrice: 0.10,
      outputPrice: 0.10,
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
      notes: 'Meta Llama 3.1 70B Instruct via AWS Bedrock. Batch: $0.36/$0.36, Latency optimized: $0.90/$0.90'
    },
    {
      modelId: 'meta.llama3-1-405b-instruct-v1:0',
      modelName: 'Llama 3.1 405B Instruct (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 2.40,
      outputPrice: 2.40,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 128000,
      capabilities: ['text', 'instruct', 'large'],
      category: 'text',
      isLatest: false,
      notes: 'Meta Llama 3.1 405B Instruct via AWS Bedrock. Batch: $1.20/$1.20, Latency optimized: $3.00/$3.00'
    },
    {
      modelId: 'meta.llama3-8b-instruct-v1:0',
      modelName: 'Llama 3 8B Instruct (Bedrock)',
      provider: 'AWS Bedrock',
      inputPrice: 0.30,
      outputPrice: 0.60,
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
      outputPrice: 3.50,
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
      outputPrice: 1.00,
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
      inputPrice: 2.00,
      outputPrice: 6.00,
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
      inputPrice: 2.50,
      outputPrice: 10.00,
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
      inputPrice: 0.60,
      outputPrice: 6.00,
      unit: PricingUnit.Per1MTokens,
      contextWindow: 32000,
      capabilities: ['text', 'enterprise'],
      category: 'text',
      isLatest: true,
      notes: 'Writer Palmyra X5 via AWS Bedrock'
    }
  ]
};

// Utility functions for accessing pricing data
export function getAllProviders(): string[] {
  return Object.keys(PRICING_CONFIG).sort();
}

export function getProviderModels(provider: string): ModelPricingConfig[] {
  return PRICING_CONFIG[provider] || [];
}

export function getModelPricing(provider: string, modelId: string): ModelPricingConfig | null {
  const providerModels = PRICING_CONFIG[provider] || [];
  return providerModels.find(model =>
    model.modelId.toLowerCase() === modelId.toLowerCase()
  ) || null;
}

export function getLatestModels(): ModelPricingConfig[] {
  const allModels: ModelPricingConfig[] = [];

  Object.values(PRICING_CONFIG).forEach(providerModels => {
    allModels.push(...providerModels.filter(model => model.isLatest));
  });

  return allModels.sort((a, b) => {
    const aCost = a.inputPrice + a.outputPrice;
    const bCost = b.inputPrice + b.outputPrice;
    return aCost - bCost;
  });
}

export function getModelsByCategory(category: string): ModelPricingConfig[] {
  const allModels: ModelPricingConfig[] = [];

  Object.values(PRICING_CONFIG).forEach(providerModels => {
    allModels.push(...providerModels.filter(model =>
      model.category?.toLowerCase() === category.toLowerCase()
    ));
  });

  return allModels.sort((a, b) => {
    const aCost = a.inputPrice + a.outputPrice;
    const bCost = b.inputPrice + b.outputPrice;
    return aCost - bCost;
  });
}

export function findCheapestModel(
  provider?: string,
  category?: string
): ModelPricingConfig | null {
  let candidates: ModelPricingConfig[] = [];

  if (provider) {
    candidates = PRICING_CONFIG[provider] || [];
  } else {
    Object.values(PRICING_CONFIG).forEach(providerModels => {
      candidates.push(...providerModels);
    });
  }

  if (category) {
    candidates = candidates.filter(model =>
      model.category?.toLowerCase() === category.toLowerCase()
    );
  }

  if (candidates.length === 0) return null;

  return candidates.reduce((cheapest, current) => {
    const cheapestCost = cheapest.inputPrice + cheapest.outputPrice;
    const currentCost = current.inputPrice + current.outputPrice;
    return currentCost < cheapestCost ? current : cheapest;
  });
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  provider: string,
  modelId: string
): number {
  const pricing = getModelPricing(provider, modelId);

  if (!pricing) {
    throw new Error(`No pricing data found for ${provider}/${modelId}`);
  }

  // Convert to million tokens for calculation (all prices are per 1M tokens)
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

  return inputCost + outputCost;
}

export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  provider: string,
  modelId: string
): { inputCost: number; outputCost: number; totalCost: number } {
  const pricing = getModelPricing(provider, modelId);

  if (!pricing) {
    throw new Error(`No pricing data found for ${provider}/${modelId}`);
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}

export function compareProviders(
  inputTokens: number,
  outputTokens: number,
  providers?: string[]
): Array<{
  provider: string;
  model: string;
  cost: number;
  costBreakdown: { inputCost: number; outputCost: number };
  isLatest: boolean;
}> {
  let modelsToCompare: ModelPricingConfig[] = [];

  if (providers && providers.length > 0) {
    providers.forEach(provider => {
      const providerModels = PRICING_CONFIG[provider] || [];
      modelsToCompare.push(...providerModels);
    });
  } else {
    Object.values(PRICING_CONFIG).forEach(providerModels => {
      modelsToCompare.push(...providerModels);
    });
  }

  return modelsToCompare.map(pricing => {
    const inputCost = (inputTokens / 1_000_000) * pricing.inputPrice;
    const outputCost = (outputTokens / 1_000_000) * pricing.outputPrice;

    return {
      provider: pricing.provider,
      model: pricing.modelName,
      cost: inputCost + outputCost,
      costBreakdown: { inputCost, outputCost },
      isLatest: pricing.isLatest || false
    };
  }).sort((a, b) => a.cost - b.cost);
}

// Configuration metadata
export const PRICING_METADATA = {
  lastUpdated: new Date().toISOString(),
  source: 'WebScraperService - July 2025',
  dataVersion: '2025.07',
  totalProviders: getAllProviders().length,
  totalModels: Object.values(PRICING_CONFIG).reduce((sum, models) => sum + models.length, 0),
  standardUnit: PricingUnit.Per1MTokens,
  features: [
    'July 2025 fresh pricing data',
    'xAI Grok models (Grok 4, Grok 3, Grok 2 with regional variants)',
    'Grok image generation and vision capabilities',
    'OpenAI reasoning models (o3, o4-mini, o3-pro)',
    'GPT-4.1 and GPT-4.5 new models',
    'DeepSeek ultra-low cost models with complete lineup',
    'DeepSeek Chat (V3-0324) and Reasoner (R1-0528)',
    'Context caching and off-peak pricing support',
    'Complete Mistral AI lineup with all models',
    'Mistral Medium 3, Magistral Medium/Small, Codestral, Devstral',
    'Document AI & OCR, Mistral Saba, Pixtral Large/12B',
    'Ministral 8B/3B, embedding and moderation models',
    'Complete Cohere AI lineup with all models',
    'Command A, Command R+/R/R7B, Rerank 3.5, Embed 4',
    'Cohere generative and retrieval models',
    'Groq ultra-fast inference',
    'All AWS Bedrock models',
    'Claude 4 (Opus, Sonnet) and 3.7/3.5/3 Haiku/Sonnet/Opus (2025)',
    'Google Gemini 1.5 with 1M context',
    'Comprehensive embedding models',
    'Provider-organized structure',
    'Enhanced model metadata',
    'Context window information',
    'Capability categorization'
  ]
};
