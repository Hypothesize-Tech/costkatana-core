# Prompt & Request Optimization Guide

This guide covers the advanced prompt optimization features available in the AI Cost Tracker library, designed to achieve 20-40% token cost reduction through intelligent pre-processing.

## Table of Contents

1. [Overview](#overview)
2. [Prompt Compression](#prompt-compression)
3. [Context Trimming](#context-trimming)
4. [Request Fusion](#request-fusion)
5. [Configuration](#configuration)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)

## Overview

The AI Cost Tracker now includes three powerful optimization techniques:

- **Prompt Compression**: Reduces token usage by compressing JSON data, removing repetitive patterns, and applying intelligent abbreviations
- **Context Trimming**: Optimizes conversation histories by removing irrelevant messages or summarizing older context
- **Request Fusion**: Detects and merges multiple related requests into single, efficient prompts

These optimizations work as a pre-processing step before requests are sent to AI providers, ensuring you get the same quality responses at a fraction of the cost.

## Prompt Compression

### How It Works

Prompt compression uses multiple techniques to reduce token count:

1. **JSON Compression**: Detects and compresses JSON objects by removing whitespace and using abbreviated keys
2. **Pattern Replacement**: Identifies repeated patterns and replaces them with references
3. **Abbreviation**: Replaces common phrases with standard abbreviations
4. **Deduplication**: Removes duplicate sentences and content

### Example Usage

```typescript
import { AICostTracker, AIProvider } from 'ai-cost-tracker';

const tracker = await AICostTracker.create({
  providers: [{ provider: AIProvider.OpenAI, apiKey: 'your-key' }],
  optimization: {
    enableCompression: true,
    compressionSettings: {
      minCompressionRatio: 0.7, // Only apply if we can compress to 70% or less
      jsonCompressionThreshold: 100 // Minimum JSON size to compress
    }
  }
});

const optimizer = tracker.getOptimizer();

// Compress a prompt with repetitive JSON data
const prompt = `
  Analyze these user records:
  {"id": 1, "firstName": "John", "lastName": "Doe", "email": "john@example.com", "preferences": {"theme": "dark"}}
  {"id": 2, "firstName": "Jane", "lastName": "Smith", "email": "jane@example.com", "preferences": {"theme": "light"}}
  // ... more similar records
`;

const result = await optimizer.optimizePrompt(prompt, 'gpt-4', AIProvider.OpenAI);
console.log(`Compression saved ${result.totalSavings}% tokens`);
```

### Compression Techniques

#### JSON Compression

```typescript
// Before: 245 characters
{
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "emailAddress": "john@example.com",
    "preferences": {
      "colorTheme": "dark",
      "notifications": true
    }
  }
}

// After: 89 characters (64% reduction)
[$JSON_REF_1$ = {"user":{"fn":"John","ln":"Doe","email":"john@example.com","prefs":{"theme":"dark","notif":true}}}]
```

#### Pattern Replacement

```typescript
// Before: Repeated patterns
"Process order #12345 for customer John Doe"
"Process order #12346 for customer Jane Smith"
"Process order #12347 for customer Bob Johnson"

// After: Pattern reference
[$PATTERN_1$ = "Process order #"]
$PATTERN_1$12345 for customer John Doe
$PATTERN_1$12346 for customer Jane Smith
$PATTERN_1$12347 for customer Bob Johnson
```

## Context Trimming

### How It Works

Context trimming optimizes conversation histories using four strategies:

1. **Sliding Window**: Keeps only the most recent N messages
2. **Relevance Filtering**: Removes filler messages and acknowledgments
3. **Summarization**: Uses AI to summarize older messages while preserving key information
4. **Importance Scoring**: Keeps messages based on content importance

### Example Usage

```typescript
import { ConversationMessage } from 'ai-cost-tracker';

const messages: ConversationMessage[] = [
  { role: 'user', content: 'Hi, I need help with Python' },
  { role: 'assistant', content: 'Hello! How can I help?' }
  // ... long conversation history
];

const result = await optimizer.optimizeConversation(messages, 'gpt-4', AIProvider.OpenAI);

// Access the trimmed conversation
const trimmedPrompt = result.suggestions[0].optimizedPrompt;
```

### Trimming Strategies

#### Sliding Window

Keeps only the most recent messages:

```typescript
// Configuration
contextTrimmingSettings: {
  maxContextLength: 4000,
  preserveRecentMessages: 5
}
```

#### Relevance Filtering

Automatically removes:

- Simple acknowledgments ("ok", "thanks", "got it")
- Filler words and phrases
- Redundant confirmations

#### AI-Powered Summarization

For long conversations, older messages are summarized:

```typescript
// Original: 10 messages (2000 tokens)
// After summarization: Summary + 3 recent messages (800 tokens)
"Previous conversation summary: User asked about Python sorting and received examples
for sorting lists and dictionaries by various keys.

Recent messages:
User: Now I need to filter the sorted data
Assistant: You can use list comprehension...
User: Can you show an example with lambda?"
```

## Request Fusion

### How It Works

Request fusion detects related requests that can be combined into a single, more efficient prompt. It supports three fusion strategies:

1. **Sequential Fusion**: Combines step-by-step requests
2. **Parallel Fusion**: Merges independent questions
3. **Hierarchical Fusion**: Groups related topics under a main query

### Example Usage

```typescript
import { FusionRequest } from 'ai-cost-tracker';

const requests: FusionRequest[] = [
  {
    id: '1',
    prompt: 'What is the capital of France?',
    timestamp: Date.now(),
    model: 'gpt-3.5-turbo',
    provider: AIProvider.OpenAI
  },
  {
    id: '2',
    prompt: 'What is the population of Paris?',
    timestamp: Date.now() + 1000,
    model: 'gpt-3.5-turbo',
    provider: AIProvider.OpenAI
  },
  {
    id: '3',
    prompt: 'What are famous landmarks in Paris?',
    timestamp: Date.now() + 2000,
    model: 'gpt-3.5-turbo',
    provider: AIProvider.OpenAI
  }
];

const result = await optimizer.optimizeRequests(requests);
// Result: Single fused request about Paris information
```

### Fusion Strategies

#### Sequential Fusion

For step-by-step processes:

```typescript
// Before: 3 separate requests
"First, extract the data from the CSV"
"Then, clean the extracted data"
"Finally, generate a summary report"

// After: 1 fused request
"Please complete the following tasks in order:
1. Extract the data from the CSV
2. Clean the extracted data
3. Generate a summary report
Provide results for each step clearly labeled."
```

#### Parallel Fusion

For independent questions:

```typescript
// Before: Multiple related queries
"What is machine learning?"
"What is deep learning?"
"What is neural networks?"

// After: Single comprehensive request
"Please answer the following questions:
1. What is machine learning?
2. What is deep learning?
3. What are neural networks?
Provide each answer in a clearly labeled section."
```

## Configuration

### Full Configuration Example

```typescript
const tracker = await AICostTracker.create({
  providers: [
    /* your providers */
  ],
  optimization: {
    // Global toggles
    enablePromptOptimization: true,
    enableCompression: true,
    enableContextTrimming: true,
    enableRequestFusion: true,

    // Compression settings
    compressionSettings: {
      minCompressionRatio: 0.7, // Only compress if result is 70% or smaller
      jsonCompressionThreshold: 100 // Min JSON length to trigger compression
    },

    // Context trimming settings
    contextTrimmingSettings: {
      maxContextLength: 4000, // Max tokens in context
      preserveRecentMessages: 3, // Always keep last N messages
      summarizationModel: 'claude-3-haiku' // Model for summarization
    },

    // Request fusion settings
    requestFusionSettings: {
      maxFusionBatch: 5, // Max requests to fuse together
      fusionWaitTime: 5000 // Time window for fusion (ms)
    },

    // Thresholds for optimization triggers
    thresholds: {
      highCostPerRequest: 0.01,
      highTokenUsage: 10000,
      frequencyThreshold: 1000
    }
  }
});
```

### Per-Request Configuration

You can also configure optimizations per request:

```typescript
const result = await optimizer.optimizePrompt(prompt, model, provider, {
  conversationHistory: messages,
  expectedOutput: 'code example',
  constraints: ['preserve_code_accuracy']
});
```

## API Reference

### PromptOptimizer Methods

#### optimizePrompt()

```typescript
async optimizePrompt(
  prompt: string,
  targetModel: string,
  targetProvider: AIProvider,
  context?: {
    conversationHistory?: ConversationMessage[];
    expectedOutput?: string;
    constraints?: string[];
  }
): Promise<OptimizationResult>
```

#### optimizeConversation()

```typescript
async optimizeConversation(
  messages: ConversationMessage[],
  targetModel: string,
  targetProvider: AIProvider
): Promise<OptimizationResult>
```

#### optimizeRequests()

```typescript
async optimizeRequests(
  requests: FusionRequest[]
): Promise<OptimizationResult>
```

### Types

#### OptimizationResult

```typescript
interface OptimizationResult {
  id: string;
  suggestions: OptimizationSuggestion[];
  totalSavings: number;
  appliedOptimizations: string[];
  metadata: {
    processingTime: number;
    originalTokens: number;
    optimizedTokens: number;
    techniques: string[];
  };
}
```

#### OptimizationSuggestion

```typescript
interface OptimizationSuggestion {
  type: 'prompt' | 'compression' | 'context_trimming' | 'request_fusion';
  optimizedPrompt?: string;
  estimatedSavings: number;
  confidence: number;
  explanation: string;
  compressionDetails?: CompressionDetails;
  contextTrimDetails?: ContextTrimDetails;
  fusionDetails?: RequestFusionDetails;
}
```

## Best Practices

### 1. Choose the Right Optimization

- **Use Compression for**:
  - Prompts with large JSON payloads
  - Repetitive data or patterns
  - Technical documentation with standard terms

- **Use Context Trimming for**:
  - Long conversation histories
  - Chat applications
  - Multi-turn interactions

- **Use Request Fusion for**:
  - Batch processing
  - Related queries
  - Sequential workflows

### 2. Monitor Performance

```typescript
// Always check the optimization results
const result = await optimizer.optimizePrompt(prompt, model, provider);

if (result.totalSavings > 20) {
  // Significant savings - apply optimization
  const optimizedPrompt = result.suggestions[0].optimizedPrompt;
} else {
  // Minimal savings - use original
  const originalPrompt = prompt;
}
```

### 3. Handle Edge Cases

```typescript
// Check for reversibility when needed
const compressionSuggestion = result.suggestions.find(s => s.type === 'compression');

if (compressionSuggestion?.compressionDetails?.reversible) {
  // Safe to use - can be reversed if needed
}
```

### 4. Combine with Caching

```typescript
// Cache optimization results for repeated prompts
const cacheKey = hashPrompt(prompt);
const cached = await cache.get(cacheKey);

if (cached) {
  return cached;
}

const result = await optimizer.optimizePrompt(prompt, model, provider);
await cache.set(cacheKey, result, 3600); // Cache for 1 hour
```

### 5. Test Optimization Quality

Always test that optimizations don't affect response quality:

```typescript
// A/B test optimizations
const originalResponse = await getResponse(originalPrompt);
const optimizedResponse = await getResponse(optimizedPrompt);

// Compare responses for quality
const similarity = compareSemantic(originalResponse, optimizedResponse);
if (similarity > 0.95) {
  // Optimization maintains quality
}
```

## Troubleshooting

### Common Issues

1. **Low compression ratio**: Adjust `minCompressionRatio` setting
2. **Important context removed**: Increase `preserveRecentMessages`
3. **Fusion not triggering**: Check `fusionWaitTime` and request timestamps
4. **Summarization errors**: Ensure Bedrock is configured with proper credentials

### Debug Mode

Enable detailed logging:

```typescript
const optimizer = tracker.getOptimizer();
// Access optimization details
const result = await optimizer.optimizePrompt(prompt, model, provider);
console.log('Optimization details:', result.metadata);
```

## Examples

See the [examples directory](../examples/advanced-optimization.ts) for complete working examples of all optimization features.
