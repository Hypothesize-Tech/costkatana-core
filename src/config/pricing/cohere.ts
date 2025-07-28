import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const COHERE_PRICING: ModelPricingConfig[] = [
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
]; 