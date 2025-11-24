# Cost Optimization Guide

Learn how to reduce AI costs by up to 95% with Cost Katana.

## Quick Wins

### 1. Enable Cortex Optimization (40-75% savings)

```typescript
import { ai } from 'cost-katana';

// Without optimization
const standard = await ai('gpt-4', 'Write a comprehensive guide');
console.log(`Cost: $${standard.cost}`); // e.g., $0.15

// With Cortex optimization
const optimized = await ai('gpt-4', 'Write a comprehensive guide', {
  cortex: true
});
console.log(`Cost: $${optimized.cost}`); // e.g., $0.02
console.log(`Saved: ${((standard.cost - optimized.cost) / standard.cost * 100).toFixed(1)}%`);
```

### 2. Use Smart Caching (50-90% savings)

```typescript
import { ai } from 'cost-katana';

// Enable caching for FAQ and common queries
const response = await ai('gpt-3.5-turbo', 'What is your refund policy?', {
  cache: true
});

// Repeat queries are free from cache
const cached = await ai('gpt-3.5-turbo', 'What is your refund policy?', {
  cache: true
});
console.log(cached.cached); // true - saved money!
```

### 3. Choose the Right Model (10x cost difference)

```typescript
import { ai } from 'cost-katana';

// For simple tasks - use cheap model
const simple = await ai('gpt-3.5-turbo', 'What is 2+2?');
console.log(`Cost: $${simple.cost}`); // ~$0.0001

// For complex tasks - use powerful model  
const complex = await ai('gpt-4', 'Analyze this complex data...');
console.log(`Cost: $${complex.cost}`); // ~$0.01
```

## Optimization Strategies

### Strategy 1: Model Selection

Use the right model for the right task:

```typescript
import { ai } from 'cost-katana';

async function smartModelSelection(task: string, complexity: 'simple' | 'complex') {
  const models = {
    simple: 'gpt-3.5-turbo',  // $0.0005/1K tokens
    complex: 'gpt-4'           // $0.03/1K tokens
  };
  
  return await ai(models[complexity], task);
}

// Simple task - save 60x cost
await smartModelSelection('What is the capital of France?', 'simple');

// Complex task - use powerful model
await smartModelSelection('Analyze market trends and predict...', 'complex');
```

### Strategy 2: Prompt Engineering

Shorter, clearer prompts = lower costs:

```typescript
import { ai } from 'cost-katana';

// ❌ Verbose prompt (150 tokens)
const verbose = await ai('gpt-4', 
  `I would really appreciate it if you could help me understand what machine learning is. 
   I'm just a beginner and confused about all the different concepts and would love 
   a simple explanation that a non-technical person could understand.`
);

// ✅ Concise prompt (10 tokens)
const concise = await ai('gpt-4', 
  'Explain machine learning simply'
);

// Same quality, 93% cost reduction!
```

### Strategy 3: Batch Processing

Combine multiple requests:

```typescript
import { ai } from 'cost-katana';

// ❌ Multiple requests (expensive)
const q1 = await ai('gpt-4', 'Capital of France?');
const q2 = await ai('gpt-4', 'Capital of Germany?');
const q3 = await ai('gpt-4', 'Capital of Italy?');

// ✅ Single batched request (cheap)
const batched = await ai('gpt-4', 
  `Answer these questions:
   1. Capital of France?
   2. Capital of Germany?
   3. Capital of Italy?`
);
// 60% cost reduction from batching
```

### Strategy 4: Context Management

Keep conversations focused:

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');

// ❌ Including entire conversation history
// Costs grow with each message

// ✅ Clear context when switching topics
await session.send('Help with Python');
await session.send('More Python questions');

session.clear(); // Reset context

await session.send('Now help with JavaScript');
// New topic, fresh context, lower costs
```

## Cortex Optimization Deep Dive

### What is Cortex?

Cortex is our revolutionary meta-language that reduces token usage by 40-75% while maintaining quality.

**How it works:**
1. Encodes your prompt into optimized format
2. Processes with minimal tokens
3. Decodes back to natural language
4. You get the same quality at fraction of cost

### When to Use Cortex

**Best for:**
- Long-form content generation
- Comprehensive guides and documentation
- Detailed analysis tasks
- Multi-step instructions

```typescript
import { ai } from 'cost-katana';

// Perfect use cases for Cortex
await ai('gpt-4', 'Write a complete user manual', { cortex: true });
await ai('gpt-4', 'Generate API documentation', { cortex: true });
await ai('gpt-4', 'Create comprehensive report', { cortex: true });
```

**Not ideal for:**
- Very short responses (<50 tokens)
- Real-time chat where latency matters
- Creative tasks where exact phrasing matters

### Cortex Performance

```typescript
import { ai } from 'cost-katana';

async function measureCortexSavings(prompt: string) {
  // Standard
  const standard = await ai('gpt-4', prompt);
  
  // Cortex optimized
  const cortex = await ai('gpt-4', prompt, { cortex: true });
  
  return {
    standardCost: standard.cost,
    cortexCost: cortex.cost,
    savings: standard.cost - cortex.cost,
    savingsPercent: ((standard.cost - cortex.cost) / standard.cost * 100).toFixed(1)
  };
}

// Test it
const result = await measureCortexSavings('Write a guide to TypeScript');
console.log(`Saved: ${result.savingsPercent}% ($${result.savings})`);
```

## Caching Strategies

### Cache FAQ Responses

```typescript
import { ai } from 'cost-katana';

const faqQuestions = [
  'What are your business hours?',
  'What is your return policy?',
  'How do I contact support?',
  'Do you ship internationally?'
];

// First load - populate cache
for (const q of faqQuestions) {
  await ai('gpt-3.5-turbo', q, { cache: true });
}

// Subsequent requests - all free from cache!
const cached = await ai('gpt-3.5-turbo', 'What are your business hours?', {
  cache: true
});
console.log(cached.cached); // true
```

### Cache with Expiry

```typescript
import { ai, configure } from 'cost-katana';

// Configure cache behavior
await configure({
  cache: true,
  cacheExpiry: 3600  // 1 hour
});

// News/dynamic content - short cache
await ai('gpt-4', 'Latest AI news', { cache: true });

// Static content - long cache (default 7 days)
await ai('gpt-4', 'Explain photosynthesis', { cache: true });
```

## Cost Monitoring

### Track Session Costs

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');

async function monitoredChat(messages: string[]) {
  for (const message of messages) {
    await session.send(message);
    
    console.log(`Messages: ${session.messages.length}`);
    console.log(`Cost: $${session.totalCost}`);
    console.log(`Tokens: ${session.totalTokens}`);
    
    // Alert if approaching budget
    if (session.totalCost > 1.0) {
      console.warn('⚠️ Session exceeding $1 budget!');
      break;
    }
  }
}
```

### Compare Model Costs

```typescript
import { ai } from 'cost-katana';

async function findCheapestModel(prompt: string) {
  const models = [
    'gpt-4',
    'gpt-3.5-turbo', 
    'claude-3-sonnet',
    'claude-3-haiku',
    'gemini-pro'
  ];
  
  const results = [];
  
  for (const model of models) {
    try {
      const response = await ai(model, prompt);
      results.push({
        model,
        cost: response.cost,
        quality: response.text.length  // Simple quality metric
      });
    } catch (error) {
      console.log(`${model} not available`);
    }
  }
  
  // Sort by cost
  results.sort((a, b) => a.cost - b.cost);
  
  console.log('Models by cost:');
  results.forEach(r => {
    console.log(`${r.model}: $${r.cost.toFixed(6)}`);
  });
  
  return results[0]; // Cheapest option
}
```

## Production Best Practices

### 1. Set Budget Limits

```typescript
import { configure } from 'cost-katana';

await configure({
  apiKey: 'dak_your_key',
  budget: {
    daily: 100,    // $100/day
    monthly: 2000  // $2000/month
  }
});
```

### 2. Enable All Optimizations

```typescript
import { configure } from 'cost-katana';

await configure({
  cortex: true,    // 40-75% savings
  cache: true,     // 50-90% savings on repeated queries
  firewall: true   // Block malicious prompts (saves cost)
});
```

### 3. Use Chat Sessions

```typescript
import { chat } from 'cost-katana';

// ✅ Good - reuse session
const session = chat('gpt-4');
await session.send('Question 1');
await session.send('Question 2');

// ❌ Bad - new session each time
await ai('gpt-4', 'Question 1');
await ai('gpt-4', 'Question 2');
```

### 4. Monitor and Alert

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');

async function sendWithMonitoring(message: string) {
  const response = await session.send(message);
  
  // Check cost after each message
  if (session.totalCost > 5.0) {
    throw new Error('Session budget exceeded');
  }
  
  return response;
}
```

## Cost Reduction Checklist

- [ ] Enable Cortex for long-form content
- [ ] Enable caching for FAQ/common queries
- [ ] Use appropriate models (cheap for simple, powerful for complex)
- [ ] Batch similar requests together
- [ ] Write concise, clear prompts
- [ ] Use chat sessions for conversations
- [ ] Monitor costs in dashboard
- [ ] Set budget alerts
- [ ] Review optimization suggestions weekly

## Real-World Savings

### Example 1: Content Platform

```typescript
// Before optimization
Monthly cost: $5,000
- 10,000 blog posts × $0.50

// After Cost Katana
Monthly cost: $500
- Cortex enabled: 70% savings = $1,500
- Caching enabled: 30% repeat content = $1,050
- Better model selection = $500

💰 Savings: $4,500/month (90%)
```

### Example 2: Customer Support

```typescript
// Before optimization  
Monthly cost: $3,000
- 50,000 support queries × $0.06

// After Cost Katana
Monthly cost: $450
- Cache FAQ (40% of queries): $1,200 saved
- Cheaper model for simple queries: $750 saved
- Cortex for complex queries: $600 saved

💰 Savings: $2,550/month (85%)
```

## Dashboard Analytics

View detailed cost analytics at [costkatana.com/dashboard](https://costkatana.com/dashboard):

- Cost trends over time
- Top expensive prompts
- Model usage breakdown
- Cache hit rates
- Optimization opportunities
- Budget tracking
- Team usage

```typescript
import { ai } from 'cost-katana';

// All usage auto-tracked
await ai('gpt-4', 'Hello');

// View analytics:
// https://costkatana.com/dashboard
```

## Support

- **Documentation**: https://docs.costkatana.com
- **Dashboard**: https://costkatana.com
- **Optimization Tips**: https://costkatana.com/optimization-tips
- **Email**: support@costkatana.com