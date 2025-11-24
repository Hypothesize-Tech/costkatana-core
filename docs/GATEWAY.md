# Cost Katana Gateway Guide

## Overview

The Cost Katana Gateway provides intelligent features like caching, retries, and optimization. With the simple API, these features work automatically.

## Quick Start

### Automatic Gateway (Recommended)

```typescript
import { ai } from 'cost-katana';

// Gateway features enabled automatically
const response = await ai('gpt-4', 'Hello', {
  cache: true,   // Smart caching
  cortex: true   // Optimization
});

console.log(response.cached); // true if from cache
console.log(response.optimized); // true if optimized
```

### Smart Caching

Save money by caching repeated requests:

```typescript
import { ai } from 'cost-katana';

// First request - costs money
const r1 = await ai('gpt-4', 'What is 2+2?', { cache: true });
console.log(r1.cached); // false
console.log(`Cost: $${r1.cost}`);

// Second identical request - free!
const r2 = await ai('gpt-4', 'What is 2+2?', { cache: true });
console.log(r2.cached); // true
console.log(`Cost: $${r2.cost}`); // $0.00
```

### Cortex Optimization

Reduce costs by 40-75%:

```typescript
import { ai } from 'cost-katana';

// Without optimization
const standard = await ai('gpt-4', 'Write a guide to Python');
console.log(`Standard cost: $${standard.cost}`);

// With Cortex optimization
const optimized = await ai('gpt-4', 'Write a guide to Python', {
  cortex: true
});
console.log(`Optimized cost: $${optimized.cost}`);
console.log(`Saved: ${(standard.cost - optimized.cost).toFixed(4)}`);
```

### Auto-Retry

Automatically retry on failures:

```typescript
import { ai } from 'cost-katana';

// Retries are automatic - no configuration needed
try {
  const response = await ai('gpt-4', 'Hello');
  // If OpenAI fails, automatically retries
  // If still failing, fails over to alternative provider
} catch (error) {
  // Only throws after all retry attempts exhausted
  console.error('Request failed:', error.message);
}
```

## Advanced Features

### Multiple Providers

Cost Katana automatically uses the best available provider:

```typescript
import { ai } from 'cost-katana';

// Will use OpenAI if available
// Falls back to Anthropic or Google if OpenAI is down
const response = await ai('gpt-4', 'Hello');
console.log(`Used provider: ${response.provider}`);
```

### Cost Tracking

Every request is automatically tracked:

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');
await session.send('Message 1');
await session.send('Message 2');
await session.send('Message 3');

// Automatic cost tracking
console.log(`Total cost: $${session.totalCost}`);
console.log(`Total tokens: ${session.totalTokens}`);
console.log(`Average cost/message: $${(session.totalCost / 3).toFixed(4)}`);

// View in dashboard: https://costkatana.com/dashboard
```

### Disable Auto-Tracking

You can disable automatic tracking while still using the gateway proxy:

```typescript
import { AICostTracker } from 'cost-katana';

const tracker = await AICostTracker.create({
  // ... config
});

// Initialize gateway with autoTrack disabled
const gateway = tracker.initializeGateway({
  autoTrack: false  // Gateway still proxies, but doesn't track usage
});

// Or disable per-request
const response = await gateway.openai(request, {
  autoTrack: false  // This request won't be tracked
});
```

When `autoTrack: false`, the gateway will still proxy requests to AI providers but will skip all tracking operations in the database.

### Cache Management

```typescript
import { ai, configure } from 'cost-katana';

// Enable caching globally
await configure({ cache: true });

// All requests now use cache
await ai('gpt-4', 'Repeated question 1');
await ai('gpt-4', 'Repeated question 2');

// Or enable per-request
await ai('gpt-4', 'One-time question', { cache: false });
```

## Configuration Options

### Global Configuration

```typescript
import { configure } from 'cost-katana';

await configure({
  apiKey: 'dak_your_key',    // Cost Katana key
  projectId: 'your_project', // Project ID
  cortex: true,              // Enable optimization
  cache: true,               // Enable caching
  firewall: true,            // Enable security
  providers: [
    { name: 'openai', apiKey: 'sk-...' },
    { name: 'anthropic', apiKey: 'sk-ant-...' }
  ]
});
```

### Per-Request Options

```typescript
import { ai } from 'cost-katana';

const response = await ai('gpt-4', 'Your prompt', {
  systemMessage: 'You are a helpful assistant',
  temperature: 0.7,     // Creativity (0-2)
  maxTokens: 500,       // Response length
  cache: true,          // Use caching
  cortex: true          // Use optimization
});
```

## Features

### 1. Smart Caching
- Automatic cache key generation
- Configurable TTL (default: 7 days)
- User-scoped caching available
- Zero-cost cached responses

### 2. Cortex Optimization
- 40-75% token reduction
- Maintains response quality
- Automatic semantic preservation
- Real-time analytics

### 3. Auto-Retry
- Exponential backoff
- Automatic provider failover
- Configurable retry limits
- Transient error handling

### 4. Cost Attribution
- Automatic project tracking
- Real-time cost calculation
- Dashboard integration
- Usage analytics

### 5. Security
- Prompt firewall (optional)
- PII detection and protection
- Rate limiting
- API key encryption

## Real-World Examples

### Customer Support Bot

```typescript
import { chat } from 'cost-katana';

const support = chat('gpt-3.5-turbo', {
  systemMessage: 'You are a helpful customer support agent.'
});

async function handleCustomer(userId: string, message: string) {
  const response = await support.send(message);
  
  console.log(`Response: ${response}`);
  console.log(`Session cost: $${support.totalCost}`);
  
  return response;
}
```

### Content Generator

```typescript
import { ai } from 'cost-katana';

async function generateBlogPost(topic: string) {
  const post = await ai('gpt-4', 
    `Write a comprehensive blog post about ${topic}`,
    {
      cortex: true,     // 40-75% savings on long content
      maxTokens: 2000,
      cache: true       // Cache for repeated topics
    }
  );
  
  return {
    content: post.text,
    cost: post.cost,
    wordCount: post.text.split(' ').length
  };
}
```

### Code Assistant

```typescript
import { chat } from 'cost-katana';

const codeAssistant = chat('claude-3-sonnet', {
  systemMessage: 'You are an expert programmer. Provide concise, working code.'
});

async function reviewCode(code: string) {
  const review = await codeAssistant.send(
    `Review this code and suggest improvements:\n\n${code}`
  );
  
  return review;
}

async function fixBug(code: string, error: string) {
  const fix = await codeAssistant.send(
    `Fix this bug:\nCode: ${code}\nError: ${error}`
  );
  
  return fix;
}

// Total cost for entire session
console.log(`Total cost: $${codeAssistant.totalCost}`);
```

## Dashboard Integration

All usage is automatically tracked in your dashboard at [costkatana.com](https://costkatana.com):

- Real-time cost tracking
- Usage by model
- Daily/weekly/monthly analytics
- Optimization recommendations
- Budget alerts
- Team usage breakdown

```typescript
import { ai } from 'cost-katana';

// Every request is tracked
const response = await ai('gpt-4', 'Hello');

// View at: https://costkatana.com/dashboard
// No additional code needed!
```

## Error Handling

```typescript
import { ai } from 'cost-katana';

try {
  const response = await ai('gpt-4', 'Hello');
} catch (error) {
  // Helpful error messages with solutions
  console.error(error.message);
  
  /*
  Example error:
  ❌ No API keys found!
  
  Please set up Cost Katana:
    export COST_KATANA_API_KEY="dak_your_key"
    Get your key: https://costkatana.com/settings
  
  Or use provider keys directly:
    export OPENAI_API_KEY="sk-..."
  */
}
```

## Best Practices

### 1. Enable Caching for FAQ/Common Queries
```typescript
const response = await ai('gpt-3.5-turbo', 'FAQ answer', {
  cache: true
});
```

### 2. Use Cortex for Long Content
```typescript
const response = await ai('gpt-4', 'Long article generation', {
  cortex: true,
  maxTokens: 2000
});
```

### 3. Choose Appropriate Models
```typescript
// Simple tasks - cheap model
await ai('gpt-3.5-turbo', 'Simple question');

// Complex tasks - powerful model
await ai('gpt-4', 'Complex analysis');
```

### 4. Use Chat Sessions for Conversations
```typescript
const session = chat('gpt-4');
// Reuse session for related queries
await session.send('Question 1');
await session.send('Follow-up 2');
```

### 5. Monitor Costs
```typescript
const session = chat('gpt-4');
await session.send('Message');

console.log(`Cost so far: $${session.totalCost}`);

// Check dashboard for detailed analytics
// https://costkatana.com/dashboard
```

## Migration from Old API

### Before (Complex)
```typescript
import { createGatewayClientFromEnv } from 'ai-cost-tracker';

const gateway = createGatewayClientFromEnv({
  enableCache: true,
  enableRetries: true
});

const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 50
}, {
  cache: true,
  retry: { count: 3 }
});
```

### After (Simple)
```typescript
import { ai } from 'cost-katana';

const response = await ai('gpt-4o-mini', 'Hello', {
  cache: true
});
```

## Support

- **Documentation**: https://docs.costkatana.com
- **Dashboard**: https://costkatana.com
- **GitHub**: https://github.com/Hypothesize-Tech/costkatana-core
- **Email**: support@costkatana.com