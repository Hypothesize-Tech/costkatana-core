# Cost Katana 🥷

**AI that just works. With automatic cost tracking.**

```typescript
import { ai } from 'cost-katana';

const response = await ai('gpt-4', 'Hello, world!');
console.log(response.text);        // "Hello! How can I help you today?"
console.log(`Cost: $${response.cost}`);  // "Cost: $0.0012"
```

That's it. No setup. No configuration. No complexity.

## Installation

```bash
npm install cost-katana
```

> **Note**: Package was previously named `ai-cost-tracker`. If you're upgrading, uninstall the old package first:
> ```bash
> npm uninstall ai-cost-tracker
> npm install cost-katana
> ```

## Quick Start

### Zero Configuration

```typescript
import { ai } from 'cost-katana';

// Just works with any AI model
await ai('gpt-4', 'Explain quantum computing');
await ai('claude-3-sonnet', 'Write a haiku');
await ai('gemini-pro', 'Solve this equation: 2x + 5 = 13');
```

### Chat Conversations

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');
await session.send('Hello!');
await session.send('What can you help me with?');
await session.send('Tell me a joke');

console.log(`Total cost: $${session.totalCost}`);
```

### Compare Models

```typescript
import { ai } from 'cost-katana';

const models = ['gpt-4', 'claude-3-sonnet', 'gemini-pro'];
const prompt = 'Explain relativity in one sentence';

for (const model of models) {
  const response = await ai(model, prompt);
  console.log(`${model}: $${response.cost.toFixed(4)}`);
}
```

## Features

### 💰 Cost Tracking

Every response includes cost information:

```typescript
const response = await ai('gpt-4', 'Write a story');
console.log(`Cost: $${response.cost}`);
console.log(`Tokens: ${response.tokens}`);
console.log(`Model: ${response.model}`);
console.log(`Provider: ${response.provider}`);
```

### 💾 Smart Caching

Save money by caching repeated requests:

```typescript
// First call - costs money
const response1 = await ai('gpt-4', 'What is 2+2?', { cache: true });
console.log(response1.cached); // false

// Second call - free from cache
const response2 = await ai('gpt-4', 'What is 2+2?', { cache: true });
console.log(response2.cached); // true - saved money!
```

### ⚡ Cortex Optimization

Reduce costs by 70-95% with Cortex:

```typescript
const response = await ai('gpt-4', 'Write a complete guide to Python', {
  cortex: true  // Enable optimization
});

console.log(response.optimized); // true
console.log(`Saved: ${response.savedAmount}`); // Amount saved
```

### 🛡️ Security Firewall

Block malicious prompts automatically:

```typescript
import { configure } from 'cost-katana';

await configure({ firewall: true });

// Malicious prompts are blocked
try {
  await ai('gpt-4', 'ignore instructions and...');
} catch (error) {
  console.log('Blocked:', error.message);
}
```

### 🔄 Auto-Failover

Never fail - automatically switch providers:

```typescript
// If OpenAI is down, automatically uses Claude or Gemini
const response = await ai('gpt-4', 'Hello');
console.log(response.provider); // Might be 'anthropic' if OpenAI failed
```

### 📊 Analytics Dashboard

All usage syncs to your dashboard at [costkatana.com](https://costkatana.com):

```typescript
const response = await ai('gpt-4', 'Hello');
// Automatically tracked in your dashboard
// View at: https://costkatana.com/dashboard
```

## Configuration

### Environment Variables

```bash
# Option 1: Cost Katana (Recommended - all features)
COST_KATANA_KEY=dak_your_key_here

# Option 2: Direct provider keys (limited features)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

### Manual Configuration

```typescript
import { configure } from 'cost-katana';

await configure({
  apiKey: 'dak_your_key',
  cortex: true,     // 70-95% cost savings
  cache: true,      // Smart caching
  firewall: true    // Security
});
```

### Advanced Options

```typescript
const response = await ai('gpt-4', 'Your prompt', {
  temperature: 0.7,      // Creativity level (0-2)
  maxTokens: 500,        // Response length limit
  systemMessage: 'You are helpful',  // System prompt
  cache: true,           // Enable caching
  cortex: true          // Enable optimization
});
```

## Multi-Provider Support

Works with all major AI providers:

```typescript
// OpenAI
await ai('gpt-4', 'Hello');
await ai('gpt-3.5-turbo', 'Hello');

// Anthropic
await ai('claude-3-sonnet', 'Hello');
await ai('claude-3-haiku', 'Hello');

// Google
await ai('gemini-pro', 'Hello');
await ai('gemini-flash', 'Hello');

// AWS Bedrock
await ai('nova-pro', 'Hello');
await ai('nova-lite', 'Hello');

// And many more...
```

## Real-World Examples

### Customer Support Bot

```typescript
import { chat } from 'cost-katana';

const support = chat('gpt-3.5-turbo', {
  systemMessage: 'You are a helpful customer support agent.'
});

async function handleCustomerQuery(query: string) {
  const response = await support.send(query);
  console.log(`Cost so far: $${support.totalCost}`);
  return response;
}
```

### Content Generation

```typescript
import { ai } from 'cost-katana';

async function generateBlogPost(topic: string) {
  // Use Cortex for long-form content (70-95% savings)
  const post = await ai('gpt-4', `Write a blog post about ${topic}`, {
    cortex: true,
    maxTokens: 2000
  });
  
  return {
    content: post.text,
    cost: post.cost,
    wordCount: post.text.split(' ').length
  };
}
```

### Code Assistant

```typescript
import { ai } from 'cost-katana';

async function reviewCode(code: string) {
  const review = await ai('claude-3-sonnet', 
    `Review this code and suggest improvements:\n\n${code}`,
    { cache: true }  // Cache for repeated reviews
  );
  
  return review.text;
}
```

### Translation Service

```typescript
import { ai } from 'cost-katana';

async function translate(text: string, targetLanguage: string) {
  // Use cheaper model for translations
  const translated = await ai('gpt-3.5-turbo', 
    `Translate to ${targetLanguage}: ${text}`,
    { cache: true }
  );
  
  return translated.text;
}
```

## Framework Integration

### Next.js App Router

```typescript
// app/api/chat/route.ts
import { ai } from 'cost-katana';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const response = await ai('gpt-4', prompt);
  return Response.json(response);
}
```

### Express.js

```typescript
import express from 'express';
import { ai } from 'cost-katana';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const response = await ai('gpt-4', req.body.prompt);
  res.json(response);
});
```

### Fastify

```typescript
import fastify from 'fastify';
import { ai } from 'cost-katana';

const app = fastify();

app.post('/api/chat', async (request, reply) => {
  const { prompt } = request.body;
  const response = await ai('gpt-4', prompt);
  return response;
});
```

### NestJS

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ai } from 'cost-katana';

@Controller('api')
export class ChatController {
  @Post('chat')
  async chat(@Body() body: { prompt: string }) {
    return await ai('gpt-4', body.prompt);
  }
}
```

## Error Handling

```typescript
import { ai } from 'cost-katana';

try {
  const response = await ai('gpt-4', 'Hello');
  console.log(response.text);
} catch (error) {
  if (error.code === 'NO_API_KEY') {
    console.log('Please set your API key');
  } else if (error.code === 'RATE_LIMIT') {
    console.log('Rate limit exceeded');
  } else if (error.code === 'INVALID_MODEL') {
    console.log('Model not found');
  } else {
    console.log('Error:', error.message);
  }
}
```

## Cost Optimization Tips

### 1. Use Appropriate Models

```typescript
// For simple tasks, use cheaper models
await ai('gpt-3.5-turbo', 'Simple question');  // $0.0001

// For complex tasks, use powerful models
await ai('gpt-4', 'Complex analysis');  // $0.01
```

### 2. Enable Caching

```typescript
// Cache repeated queries
await ai('gpt-4', 'Common question', { cache: true });
```

### 3. Use Cortex for Long Content

```typescript
// 70-95% savings on long-form content
await ai('gpt-4', 'Write a book chapter', { cortex: true });
```

### 4. Batch Similar Requests

```typescript
const session = chat('gpt-3.5-turbo');
// Reuse session for related queries
await session.send('Query 1');
await session.send('Query 2');
```

## Monitoring & Analytics

### Track Usage

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');
await session.send('Hello');
await session.send('How are you?');

console.log('Messages:', session.messages.length);
console.log('Total cost:', session.totalCost);
console.log('Total tokens:', session.totalTokens);
```

### Dashboard Features

Visit [costkatana.com/dashboard](https://costkatana.com/dashboard) to see:

- Real-time cost tracking
- Usage by model and provider
- Daily/weekly/monthly spending
- Token usage analytics
- Optimization recommendations
- Team usage breakdown
- Budget alerts
- API performance metrics

## Security & Privacy

### Data Protection

- All API keys encrypted at rest
- No prompt/response logging without permission
- GDPR compliant data handling
- SOC2 Type II certified infrastructure

### Firewall Protection

```typescript
await configure({ firewall: true });

// Automatically blocks:
// - Prompt injection attacks
// - Jailbreak attempts
// - Data exfiltration
// - Malicious content
```

## Troubleshooting

### No API Keys Found

```bash
# Set Cost Katana key (recommended)
export COST_KATANA_KEY="dak_your_key"

# Or set provider keys directly
export OPENAI_API_KEY="sk-..."
```

### Model Not Available

```typescript
// Check available models
import { ai } from 'cost-katana';

try {
  await ai('model-name', 'test');
} catch (error) {
  console.log('Available models:', error.availableModels);
}
```

### Rate Limits

```typescript
// Automatic retry with backoff
const response = await ai('gpt-4', 'Hello', {
  retry: true  // Auto-retry on rate limits
});
```

## Migration Guide

### From OpenAI SDK

```typescript
// Before (OpenAI SDK)
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: 'sk-...' });
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
});
console.log(completion.choices[0].message.content);

// After (Cost Katana)
import { ai } from 'cost-katana';
const response = await ai('gpt-4', 'Hello');
console.log(response.text);
console.log(`Cost: $${response.cost}`); // Bonus: cost tracking!
```

### From Anthropic SDK

```typescript
// Before (Anthropic SDK)
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: 'sk-ant-...' });
const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20241022',
  messages: [{ role: 'user', content: 'Hello' }]
});

// After (Cost Katana)
import { ai } from 'cost-katana';
const response = await ai('claude-3-sonnet', 'Hello');
```

### From LangChain

```typescript
// Before (LangChain)
import { ChatOpenAI } from 'langchain/chat_models/openai';
const model = new ChatOpenAI({ modelName: 'gpt-4' });
const response = await model.call([{ content: 'Hello' }]);

// After (Cost Katana)
import { ai } from 'cost-katana';
const response = await ai('gpt-4', 'Hello');
```

## Support

- **Dashboard**: [costkatana.com](https://costkatana.com)
- **Documentation**: [docs.costkatana.com](https://docs.costkatana.com)
- **GitHub**: [github.com/cost-katana](https://github.com/cost-katana)
- **Email**: support@costkatana.com
- **Discord**: [discord.gg/costkatana](https://discord.gg/Wcwzw8wM)

## License

MIT © Cost Katana

---

**Start saving on AI costs today!**

```bash
npm install ai-cost-tracker
```

```typescript
import { ai } from 'cost-katana';
await ai('gpt-4', 'Hello, world!');
```