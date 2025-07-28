import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const GOOGLE_PRICING: ModelPricingConfig[] = [
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
]; 