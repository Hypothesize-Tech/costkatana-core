import { ModelPricingConfig, PricingUnit } from '../pricing-data';

export const COHERE_PRICING: ModelPricingConfig[] = [
  // Latest Generative Models
  {
    modelId: 'command-a-03-2025',
    modelName: 'Command A',
    provider: 'Cohere',
    inputPrice: 2.5,
    outputPrice: 10.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 256000,
    capabilities: ['text', 'agentic', 'multilingual', 'human-evaluations'],
    category: 'text',
    isLatest: true,
    notes:
      'Most performant model to date, excelling at tool use, agents, RAG, and multilingual use cases'
  },
  {
    modelId: 'command-r7b-12-2024',
    modelName: 'Command R7B',
    provider: 'Cohere',
    inputPrice: 0.0375,
    outputPrice: 0.15,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'rag', 'tool-use', 'agents'],
    category: 'text',
    isLatest: true,
    notes:
      'Small, fast update delivered in December 2024, excels at RAG, tool use, and complex reasoning'
  },
  {
    modelId: 'command-a-reasoning-08-2025',
    modelName: 'Command A Reasoning',
    provider: 'Cohere',
    inputPrice: 2.5,
    outputPrice: 10.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 256000,
    capabilities: ['text', 'reasoning', 'agentic', 'multilingual'],
    category: 'text',
    isLatest: true,
    notes:
      'First reasoning model, able to think before generating output for nuanced problem-solving and agent-based tasks in 23 languages'
  },
  {
    modelId: 'command-a-vision-07-2025',
    modelName: 'Command A Vision',
    provider: 'Cohere',
    inputPrice: 2.5,
    outputPrice: 10.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'vision', 'multimodal', 'enterprise'],
    category: 'multimodal',
    isLatest: true,
    notes:
      'First model capable of processing images, excelling in enterprise use cases like charts, graphs, diagrams, table understanding, OCR, and object detection'
  },
  // Command R+ Models
  {
    modelId: 'command-r-plus-04-2024',
    modelName: 'Command R+',
    provider: 'Cohere',
    inputPrice: 2.5,
    outputPrice: 10.0,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'enterprise', 'rag', 'tools', 'multilingual'],
    category: 'text',
    isLatest: true,
    notes:
      'Instruction-following conversational model for complex RAG workflows and multi-step tool use'
  },
  // Command R Models
  {
    modelId: 'command-r-08-2024',
    modelName: 'Command R (08-2024)',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'rag', 'tools', 'agents'],
    category: 'text',
    isLatest: true,
    notes: 'Update of Command R model delivered in August 2024'
  },
  {
    modelId: 'command-r-03-2024',
    modelName: 'Command R (03-2024)',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'rag', 'tools', 'agents'],
    category: 'text',
    isLatest: false,
    notes:
      'Instruction-following conversational model for complex workflows like code generation, RAG, tool use, and agents'
  },
  // Base Command Models
  {
    modelId: 'command',
    modelName: 'Command',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4096,
    capabilities: ['text', 'conversational'],
    category: 'text',
    isLatest: false,
    notes:
      'Instruction-following conversational model for language tasks with high quality and reliability'
  },
  {
    modelId: 'command-nightly',
    modelName: 'Command Nightly',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'experimental', 'nightly'],
    category: 'text',
    isLatest: false,
    notes: 'Latest experimental version, not recommended for production use'
  },
  {
    modelId: 'command-light',
    modelName: 'Command Light',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 4096,
    capabilities: ['text', 'lightweight', 'fast'],
    category: 'text',
    isLatest: false,
    notes: 'Smaller, faster version of command, almost as capable but much faster'
  },
  {
    modelId: 'command-light-nightly',
    modelName: 'Command Light Nightly',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'lightweight', 'experimental', 'nightly'],
    category: 'text',
    isLatest: false,
    notes: 'Latest experimental version of command-light, not recommended for production use'
  },
  // Embedding Models
  {
    modelId: 'embed-v4.0',
    modelName: 'Embed v4.0',
    provider: 'Cohere',
    inputPrice: 0.12,
    outputPrice: 0.12,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['embedding', 'multimodal', 'semantic-search', 'rag'],
    category: 'embedding',
    isLatest: true,
    notes:
      'Leading multimodal embedding model for text and images, acts as intelligent retrieval engine for semantic search and RAG systems'
  },
  {
    modelId: 'embed-english-v3.0',
    modelName: 'Embed English v3.0',
    provider: 'Cohere',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding', 'english'],
    category: 'embedding',
    isLatest: true,
    notes: 'English-only embedding model for text classification and embeddings'
  },
  {
    modelId: 'embed-english-light-v3.0',
    modelName: 'Embed English Light v3.0',
    provider: 'Cohere',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding', 'english', 'lightweight'],
    category: 'embedding',
    isLatest: true,
    notes: 'Smaller, faster version of embed-english-v3.0, almost as capable but much faster'
  },
  {
    modelId: 'embed-multilingual-v3.0',
    modelName: 'Embed Multilingual v3.0',
    provider: 'Cohere',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding', 'multilingual'],
    category: 'embedding',
    isLatest: true,
    notes: 'Multilingual embedding model for classification and embeddings in multiple languages'
  },
  {
    modelId: 'embed-multilingual-light-v3.0',
    modelName: 'Embed Multilingual Light v3.0',
    provider: 'Cohere',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding', 'multilingual', 'lightweight'],
    category: 'embedding',
    isLatest: true,
    notes: 'Smaller, faster version of embed-multilingual-v3.0, almost as capable but much faster'
  },
  // Rerank Models
  {
    modelId: 'rerank-v3.5',
    modelName: 'Rerank v3.5',
    provider: 'Cohere',
    inputPrice: 2.0,
    outputPrice: 2.0,
    unit: PricingUnit.Per1KTokens,
    contextWindow: 4096,
    capabilities: ['rerank', 'semantic-search', 'retrieval'],
    category: 'retrieval',
    isLatest: true,
    notes:
      'Provides powerful semantic boost to search quality of any keyword or vector search system, $2.00 per 1K searches'
  },
  {
    modelId: 'rerank-english-v3.0',
    modelName: 'Rerank English v3.0',
    provider: 'Cohere',
    inputPrice: 2.0,
    outputPrice: 2.0,
    unit: PricingUnit.Per1KTokens,
    contextWindow: 4096,
    capabilities: ['rerank', 'semantic-search', 'english'],
    category: 'retrieval',
    isLatest: true,
    notes: 'English language document and semi-structured data reranking model'
  },
  {
    modelId: 'rerank-multilingual-v3.0',
    modelName: 'Rerank Multilingual v3.0',
    provider: 'Cohere',
    inputPrice: 2.0,
    outputPrice: 2.0,
    unit: PricingUnit.Per1KTokens,
    contextWindow: 4096,
    capabilities: ['rerank', 'semantic-search', 'multilingual'],
    category: 'retrieval',
    isLatest: true,
    notes: 'Multilingual document and semi-structured data reranking model'
  },
  // Aya Models
  {
    modelId: 'c4ai-aya-expanse-8b',
    modelName: 'Aya Expanse 8B',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 8192,
    capabilities: ['text', 'multilingual', '23-languages'],
    category: 'text',
    isLatest: true,
    notes:
      'Highly performant 8B multilingual model designed to rival monolingual performance, serves 23 languages'
  },
  {
    modelId: 'c4ai-aya-expanse-32b',
    modelName: 'Aya Expanse 32B',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 128000,
    capabilities: ['text', 'multilingual', '23-languages'],
    category: 'text',
    isLatest: true,
    notes:
      'Highly performant 32B multilingual model designed to rival monolingual performance, serves 23 languages'
  },
  {
    modelId: 'c4ai-aya-vision-8b',
    modelName: 'Aya Vision 8B',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 16384,
    capabilities: ['text', 'vision', 'multimodal', 'multilingual'],
    category: 'multimodal',
    isLatest: true,
    notes:
      'State-of-the-art multimodal model excelling at language, text, and image capabilities, 8B variant focused on low latency'
  },
  {
    modelId: 'c4ai-aya-vision-32b',
    modelName: 'Aya Vision 32B',
    provider: 'Cohere',
    inputPrice: 0.15,
    outputPrice: 0.6,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 16384,
    capabilities: ['text', 'vision', 'multimodal', 'multilingual', '23-languages'],
    category: 'multimodal',
    isLatest: true,
    notes:
      'State-of-the-art multimodal model excelling at language, text, and image capabilities, 32B variant focused on state-of-art multilingual performance'
  },
  // Legacy Models (for backward compatibility)
  {
    modelId: 'command-r-plus-04-2024-legacy',
    modelName: 'Command R+ (04-2024 Legacy)',
    provider: 'Cohere',
    inputPrice: 3.0,
    outputPrice: 15.0,
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
    inputPrice: 1.0,
    outputPrice: 1.0,
    unit: PricingUnit.Per1KTokens,
    contextWindow: 0,
    capabilities: ['rerank', 'semantic-search', 'legacy'],
    category: 'retrieval',
    isLatest: false,
    notes: 'Previous generation rerank model'
  },
  {
    modelId: 'embed-multilingual-v3.0-legacy',
    modelName: 'Embed Multilingual v3.0 (Legacy)',
    provider: 'Cohere',
    inputPrice: 0.1,
    outputPrice: 0.1,
    unit: PricingUnit.Per1MTokens,
    contextWindow: 512,
    capabilities: ['embedding', 'multilingual', 'legacy'],
    category: 'embedding',
    isLatest: false,
    notes: 'Previous generation multilingual embedding model'
  },
  {
    modelId: 'command-light-legacy',
    modelName: 'Command Light (Legacy)',
    provider: 'Cohere',
    inputPrice: 0.3,
    outputPrice: 0.6,
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
    inputPrice: 1.0,
    outputPrice: 1.0,
    unit: PricingUnit.Per1KTokens,
    contextWindow: 0,
    capabilities: ['classification', 'legacy'],
    category: 'classification',
    isLatest: false,
    notes: 'Legacy text classification model'
  }
];
