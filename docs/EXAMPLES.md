# Cost Katana Examples

Practical examples showing how to use Cost Katana in real applications.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Chat Applications](#chat-applications)
3. [Content Generation](#content-generation)
4. [Code Assistance](#code-assistance)
5. [Data Analysis](#data-analysis)
6. [Cost Optimization](#cost-optimization)
7. [Framework Integration](#framework-integration)
8. [Production Patterns](#production-patterns)

## Getting Started

### Hello World

```typescript
import { ai } from 'cost-katana';

const response = await ai('gpt-4', 'Hello, world!');
console.log(response.text);
console.log(`Cost: $${response.cost}`);
```

### Your First Chat

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');
await session.send('Hello!');
await session.send('How are you?');
console.log(`Total: $${session.totalCost}`);
```

### Configuration

```typescript
import { configure } from 'cost-katana';

await configure({
  apiKey: 'dak_your_key',
  cortex: true,  // 40-75% savings
  cache: true    // Smart caching
});
```

## Chat Applications

### Interactive Chat Bot

```typescript
import { chat } from 'cost-katana';

const bot = chat('gpt-3.5-turbo', {
  systemMessage: 'You are a helpful assistant.'
});

async function handleUserMessage(message: string) {
  const response = await bot.send(message);
  
  return {
    response,
    sessionCost: bot.totalCost,
    messageCount: bot.messages.length
  };
}

// Use it
await handleUserMessage('Hello');
await handleUserMessage('What can you help me with?');
await handleUserMessage('Tell me a joke');
```

### Customer Support

```typescript
import { chat } from 'cost-katana';

const supportBot = chat('gpt-4', {
  systemMessage: `You are a customer support agent for TechCorp.
    Be helpful, friendly, and professional.`
});

async function handleSupportTicket(customerId: string, message: string) {
  const response = await supportBot.send(message);
  
  // Log to your system
  console.log(`Customer ${customerId}: ${message}`);
  console.log(`Response: ${response}`);
  console.log(`Cost: $${supportBot.totalCost}`);
  
  return response;
}
```

### Multi-Language Support

```typescript
import { ai } from 'cost-katana';

async function translate(text: string, targetLanguage: string) {
  return await ai('gpt-3.5-turbo', 
    `Translate to ${targetLanguage}: ${text}`,
    { cache: true }  // Cache translations
  );
}

// Use it
const spanish = await translate('Hello, how are you?', 'Spanish');
const french = await translate('Hello, how are you?', 'French');
```

## Content Generation

### Blog Post Generator

```typescript
import { ai } from 'cost-katana';

async function generateBlogPost(topic: string, keywords: string[]) {
  const post = await ai('gpt-4', 
    `Write a blog post about ${topic}. Include these keywords: ${keywords.join(', ')}`,
    {
      cortex: true,      // Optimize for long content
      maxTokens: 2000
    }
  );
  
  return {
    content: post.text,
    cost: post.cost,
    wordCount: post.text.split(' ').length,
    estimated_reading_time: Math.ceil(post.text.split(' ').length / 200)
  };
}

// Use it
const article = await generateBlogPost('AI in Healthcare', ['ML', 'diagnosis', 'future']);
console.log(`Generated ${article.wordCount} words for $${article.cost}`);
```

### Social Media Posts

```typescript
import { ai } from 'cost-katana';

async function generateSocialPost(topic: string, platform: string) {
  const platforms = {
    twitter: { maxLength: 280, style: 'concise and engaging' },
    linkedin: { maxLength: 1300, style: 'professional' },
    instagram: { maxLength: 2200, style: 'visual and inspiring' }
  };
  
  const config = platforms[platform] || platforms.twitter;
  
  const post = await ai('gpt-3.5-turbo',
    `Write a ${config.style} ${platform} post about ${topic}. Max ${config.maxLength} characters.`,
    { cache: true }
  );
  
  return post.text;
}

// Generate posts for multiple platforms
const topic = 'Launch of our new product';
const twitter = await generateSocialPost(topic, 'twitter');
const linkedin = await generateSocialPost(topic, 'linkedin');
```

### Email Templates

```typescript
import { ai } from 'cost-katana';

async function generateEmail(purpose: string, recipient: string, details: any) {
  const email = await ai('claude-3-sonnet',
    `Write a professional email to ${recipient} about ${purpose}. Details: ${JSON.stringify(details)}`,
    { cache: true }
  );
  
  return {
    subject: extractSubject(email.text),
    body: email.text,
    cost: email.cost
  };
}

function extractSubject(emailText: string): string {
  const match = emailText.match(/Subject: (.+)/i);
  return match ? match[1] : 'No Subject';
}
```

## Code Assistance

### Code Review

```typescript
import { ai } from 'cost-katana';

async function reviewCode(code: string, language: string) {
  const review = await ai('claude-3-sonnet',
    `Review this ${language} code and suggest improvements:\n\n${code}`,
    { cache: true }  // Cache for repeated reviews
  );
  
  return review.text;
}

// Use it
const pythonCode = `
def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total = total + num
    return total
`;

const review = await reviewCode(pythonCode, 'Python');
console.log(review);
```

### Bug Fixing

```typescript
import { chat } from 'cost-katana';

const debugger = chat('gpt-4', {
  systemMessage: 'You are a debugging expert. Find and fix bugs efficiently.'
});

async function debugCode(code: string, error: string) {
  const analysis = await debugger.send(
    `Code:\n${code}\n\nError:\n${error}\n\nWhat's wrong and how to fix it?`
  );
  
  return analysis;
}
```

### Code Generation

```typescript
import { ai } from 'cost-katana';

async function generateCode(description: string, language: string) {
  const code = await ai('gpt-4',
    `Write ${language} code for: ${description}. Include error handling and comments.`,
    { maxTokens: 1000 }
  );
  
  return code.text;
}

// Use it
const code = await generateCode('Binary search algorithm', 'TypeScript');
console.log(code);
```

## Data Analysis

### Data Summarization

```typescript
import { ai } from 'cost-katana';

async function summarizeData(data: any[], context: string) {
  const summary = await ai('claude-3-sonnet',
    `Analyze this data and provide insights:\n\nContext: ${context}\n\nData: ${JSON.stringify(data)}`,
    { cortex: true }  // Optimize for large data
  );
  
  return summary.text;
}
```

### Report Generation

```typescript
import { ai } from 'cost-katana';

async function generateReport(metrics: any, period: string) {
  const report = await ai('gpt-4',
    `Generate an executive summary report for ${period} based on these metrics: ${JSON.stringify(metrics)}`,
    {
      cortex: true,
      maxTokens: 1500
    }
  );
  
  return {
    summary: report.text,
    cost: report.cost,
    generatedAt: new Date()
  };
}
```

## Cost Optimization

### Model Comparison

```typescript
import { ai } from 'cost-katana';

const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-haiku'];
const prompt = 'Explain machine learning';

for (const model of models) {
  const response = await ai(model, prompt);
  console.log(`${model}: $${response.cost.toFixed(4)}`);
}

// Output:
// gpt-4: $0.0120
// gpt-3.5-turbo: $0.0015
// claude-3-haiku: $0.0008
```

### Cortex Savings Calculator

```typescript
import { ai } from 'cost-katana';

async function calculateSavings(prompt: string) {
  // Without optimization
  const standard = await ai('gpt-4', prompt);
  
  // With Cortex optimization
  const optimized = await ai('gpt-4', prompt, { cortex: true });
  
  const savings = standard.cost - optimized.cost;
  const savingsPercent = (savings / standard.cost) * 100;
  
  return {
    standardCost: standard.cost,
    optimizedCost: optimized.cost,
    savings,
    savingsPercent
  };
}

// Test it
const result = await calculateSavings('Write a comprehensive guide to Python');
console.log(`Saved: $${result.savings} (${result.savingsPercent}%)`);
```

## Framework Integration

### Next.js API Route

```typescript
// app/api/chat/route.ts
import { ai } from 'cost-katana';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  const response = await ai('gpt-4', prompt, {
    cache: true,
    cortex: true
  });
  
  return Response.json(response);
}
```

### Express.js

```typescript
import express from 'express';
import { ai, chat } from 'cost-katana';

const app = express();
app.use(express.json());

// Simple endpoint
app.post('/api/ai', async (req, res) => {
  const response = await ai('gpt-4', req.body.prompt);
  res.json(response);
});

// Chat endpoint with sessions
const sessions = new Map();

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  
  let session = sessions.get(sessionId);
  if (!session) {
    session = chat('gpt-4');
    sessions.set(sessionId, session);
  }
  
  const response = await session.send(message);
  res.json({ response, cost: session.totalCost });
});
```

### NestJS

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ai } from 'cost-katana';

@Controller('api')
export class AiController {
  @Post('chat')
  async chat(@Body() body: { prompt: string }) {
    return await ai('gpt-4', body.prompt, {
      cache: true,
      cortex: true
    });
  }
}
```

## Production Patterns

### Rate Limiting

```typescript
import { ai } from 'cost-katana';

const userLimits = new Map();

async function rateLimitedAI(userId: string, prompt: string) {
  const userCost = userLimits.get(userId) || 0;
  const dailyLimit = 10; // $10 per day
  
  if (userCost >= dailyLimit) {
    throw new Error('Daily limit exceeded');
  }
  
  const response = await ai('gpt-4', prompt);
  userLimits.set(userId, userCost + response.cost);
  
  return response;
}
```

### Error Recovery

```typescript
import { ai } from 'cost-katana';

async function resilientAI(prompt: string) {
  const models = ['gpt-4', 'claude-3-sonnet', 'gemini-pro'];
  
  for (const model of models) {
    try {
      return await ai(model, prompt);
    } catch (error) {
      console.log(`${model} failed, trying next...`);
      continue;
    }
  }
  
  throw new Error('All models failed');
}
```

### Cost Monitoring

```typescript
import { chat } from 'cost-katana';

async function monitoredChat() {
  const session = chat('gpt-4');
  const costThreshold = 1.0; // $1 limit
  
  async function send(message: string) {
    if (session.totalCost >= costThreshold) {
      throw new Error(`Cost limit exceeded: $${session.totalCost}`);
    }
    
    const response = await session.send(message);
    console.log(`Session cost: $${session.totalCost}/${costThreshold}`);
    
    return response;
  }
  
  return { send, session };
}
```

### Batch Processing

```typescript
import { ai } from 'cost-katana';

async function batchProcess(items: string[]) {
  const results = [];
  let totalCost = 0;
  
  for (const item of items) {
    const response = await ai('gpt-3.5-turbo', 
      `Process this: ${item}`,
      { cache: true }  // Cache repeated items
    );
    
    results.push(response.text);
    totalCost += response.cost;
  }
  
  return {
    results,
    totalCost,
    avgCost: totalCost / items.length
  };
}
```

## Real-World Use Cases

### Translation Service

```typescript
import { ai } from 'cost-katana';

async function translate(text: string, to: string, from = 'English') {
  return await ai('gpt-3.5-turbo',
    `Translate from ${from} to ${to}: ${text}`,
    { cache: true }  // Cache common translations
  );
}

// Use it
const spanish = await translate('Hello world', 'Spanish');
const french = await translate('Good morning', 'French');
```

### Sentiment Analysis

```typescript
import { ai } from 'cost-katana';

async function analyzeSentiment(text: string) {
  const analysis = await ai('claude-3-haiku',  // Fast & cheap
    `Analyze the sentiment of this text. Respond with: positive, negative, or neutral.\n\nText: ${text}`,
    { cache: true }
  );
  
  return {
    sentiment: analysis.text.toLowerCase().trim(),
    cost: analysis.cost
  };
}
```

### Text Summarization

```typescript
import { ai } from 'cost-katana';

async function summarize(text: string, maxWords = 100) {
  const summary = await ai('gpt-4',
    `Summarize this text in ${maxWords} words or less:\n\n${text}`,
    { cortex: true }  // Optimize for long text
  );
  
  return summary.text;
}
```

### Q&A System

```typescript
import { ai } from 'cost-katana';

async function answerQuestion(question: string, context: string) {
  const answer = await ai('claude-3-sonnet',
    `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`,
    { cache: true }  // Cache FAQ answers
  );
  
  return answer.text;
}

// Use it
const answer = await answerQuestion(
  'What is your refund policy?',
  'Company policies and FAQ content...'
);
```

## Advanced Patterns

### Streaming Responses

```typescript
import { chat } from 'cost-katana';

async function streamingChat() {
  const session = chat('gpt-4');
  
  // Send message
  const response = await session.send('Tell me a long story');
  
  // Simulate streaming output
  const words = response.split(' ');
  for (const word of words) {
    process.stdout.write(word + ' ');
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log(`\nCost: $${session.totalCost}`);
}
```

### Parallel Processing

```typescript
import { ai } from 'cost-katana';

async function processInParallel(prompts: string[]) {
  const results = await Promise.all(
    prompts.map(prompt => 
      ai('gpt-3.5-turbo', prompt, { cache: true })
    )
  );
  
  const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
  
  return {
    results: results.map(r => r.text),
    totalCost,
    avgCost: totalCost / prompts.length
  };
}
```

### Fallback Strategy

```typescript
import { ai } from 'cost-katana';

async function aiWithFallback(prompt: string) {
  try {
    // Try premium model first
    return await ai('gpt-4', prompt);
  } catch (error) {
    console.log('GPT-4 failed, falling back to GPT-3.5');
    
    // Fallback to cheaper model
    return await ai('gpt-3.5-turbo', prompt);
  }
}
```

### Cost-Aware Routing

```typescript
import { ai } from 'cost-katana';

async function smartRoute(prompt: string) {
  const wordCount = prompt.split(' ').length;
  
  // Simple task - use cheap model
  if (wordCount < 20) {
    return await ai('gpt-3.5-turbo', prompt);
  }
  
  // Complex task - use powerful model with optimization
  return await ai('gpt-4', prompt, { cortex: true });
}
```

## Testing & Development

### Mock Responses for Testing

```typescript
import { ai } from 'cost-katana';

async function testAI() {
  // Use cache in tests for consistency
  const response = await ai('gpt-3.5-turbo', 'Test prompt', {
    cache: true,
    temperature: 0  // Deterministic responses
  });
  
  expect(response.text).toBeDefined();
  expect(response.cost).toBeGreaterThan(0);
}
```

### Cost Budget Testing

```typescript
import { chat } from 'cost-katana';

async function testWithBudget() {
  const session = chat('gpt-3.5-turbo');
  const budget = 0.10; // $0.10 limit
  
  for (let i = 0; i < 100; i++) {
    if (session.totalCost >= budget) {
      console.log(`Stopped at message ${i}, cost: $${session.totalCost}`);
      break;
    }
    
    await session.send(`Test message ${i}`);
  }
}
```

## Performance Optimization

### Cache Hit Rate Optimization

```typescript
import { ai } from 'cost-katana';

async function optimizeCaching() {
  const commonQueries = [
    'What are your business hours?',
    'What is your return policy?',
    'How do I contact support?'
  ];
  
  // First pass - populate cache
  for (const query of commonQueries) {
    await ai('gpt-3.5-turbo', query, { cache: true });
  }
  
  // Second pass - all from cache (free!)
  for (const query of commonQueries) {
    const response = await ai('gpt-3.5-turbo', query, { cache: true });
    console.log(response.cached); // true
  }
}
```

### Model Selection Optimization

```typescript
import { ai } from 'cost-katana';

async function optimizeModelSelection(tasks: Array<{prompt: string, complexity: string}>) {
  let totalCost = 0;
  
  for (const task of tasks) {
    const model = task.complexity === 'simple' 
      ? 'gpt-3.5-turbo'  // 10x cheaper
      : 'gpt-4';         // More capable
    
    const response = await ai(model, task.prompt);
    totalCost += response.cost;
  }
  
  console.log(`Total cost: $${totalCost}`);
}
```

## Monitoring & Analytics

### Session Tracking

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');

// Track session metrics
async function trackSession() {
  await session.send('Message 1');
  await session.send('Message 2');
  
  const metrics = {
    messages: session.messages.length,
    cost: session.totalCost,
    tokens: session.totalTokens,
    avgCostPerMessage: session.totalCost / session.messages.length
  };
  
  // Log to your analytics
  console.log('Session metrics:', metrics);
  
  // Also visible in dashboard: https://costkatana.com/dashboard
}
```

### Cost Alerts

```typescript
import { chat } from 'cost-katana';

const session = chat('gpt-4');
const alertThreshold = 5.0; // $5

async function sendWithAlert(message: string) {
  const response = await session.send(message);
  
  if (session.totalCost > alertThreshold) {
    console.warn(`⚠️ Cost alert: $${session.totalCost} exceeds threshold!`);
    // Send notification to your alert system
  }
  
  return response;
}
```

## Best Practices

1. **Enable caching for FAQ and common queries**
   ```typescript
   await ai('gpt-3.5-turbo', 'FAQ question', { cache: true });
   ```

2. **Use Cortex for long-form content**
   ```typescript
   await ai('gpt-4', 'Long article', { cortex: true });
   ```

3. **Choose appropriate models**
   ```typescript
   // Simple task
   await ai('gpt-3.5-turbo', 'Simple question');
   
   // Complex task
   await ai('gpt-4', 'Complex analysis');
   ```

4. **Use chat sessions for conversations**
```typescript
   const session = chat('gpt-4');
   // Reuse for related queries
   ```

5. **Monitor costs in production**
   ```typescript
   console.log(`Cost: $${response.cost}`);
   // Check dashboard: costkatana.com/dashboard
   ```

## Troubleshooting

### No Response
```typescript
try {
  const response = await ai('gpt-4', 'Hello');
} catch (error) {
  console.error('Error:', error.message);
  // Error includes helpful troubleshooting steps
}
```

### High Costs
```typescript
// Check if caching is enabled
const response = await ai('gpt-4', 'Prompt', { cache: true });
console.log(response.cached); // Should be true for repeated queries

// Use optimization
const optimized = await ai('gpt-4', 'Long prompt', { cortex: true });
console.log(optimized.optimized); // Should be true
```

### Rate Limits
```typescript
// Automatic retry is built-in
// If rate limited, Cost Katana automatically:
// 1. Waits and retries
// 2. Falls back to alternative provider if needed
// 3. Returns helpful error if all options exhausted
```

## Next Steps

- Explore [API Reference](./API.md)
- Try [Gateway Features](./GATEWAY.md)
- Join [Discord Community](https://discord.gg/costkatana)
- Visit [Dashboard](https://costkatana.com/dashboard)