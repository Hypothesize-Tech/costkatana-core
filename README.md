# Cost Katana 🥷

**AI that just works. With automatic cost tracking.**

```typescript
import { ai, OPENAI } from 'cost-katana';

// NEW: Type-safe model selection (recommended)
const response = await ai(OPENAI.GPT_4, 'Hello, world!');
console.log(response.text);        // "Hello! How can I help you today?"
console.log(`Cost: $${response.cost}`);  // "Cost: $0.0012"
```

That's it. No setup. No configuration. No complexity. **And no typos!**

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

### 🎯 Type-Safe Model Selection (Recommended)

```typescript
import { ai, OPENAI, ANTHROPIC, GOOGLE } from 'cost-katana';

// Type-safe model constants with autocomplete
await ai(OPENAI.GPT_4, 'Explain quantum computing');
await ai(ANTHROPIC.CLAUDE_3_5_SONNET_20241022, 'Write a haiku');
await ai(GOOGLE.GEMINI_2_5_PRO, 'Solve this equation: 2x + 5 = 13');
```

**Benefits:**
- ✅ **Autocomplete** - Your IDE suggests all available models
- ✅ **No typos** - Compile-time errors catch mistakes
- ✅ **Refactor safely** - Update model names with confidence
- ✅ **Self-documenting** - See exactly which model you're using

### Chat Conversations

```typescript
import { chat, OPENAI } from 'cost-katana';

const session = chat(OPENAI.GPT_4);
await session.send('Hello!');
await session.send('What can you help me with?');
await session.send('Tell me a joke');

console.log(`Total cost: $${session.totalCost}`);
```

---

## 📚 **More Examples**

**Looking for more comprehensive examples?** Check out our complete examples repository 

**🔗 [github.com/Hypothesize-Tech/costkatana-examples](https://github.com/Hypothesize-Tech/costkatana-examples)**

**What's included:**
- ✅ 44 feature sections covering every Cost Katana capability
- ✅ HTTP REST API examples (`.http` files)
- ✅ TypeScript/Node.js examples
- ✅ Python SDK examples
- ✅ Framework integrations (Express, Next.js, Fastify, NestJS, FastAPI)
- ✅ Real-world use cases with best practices
- ✅ Production-ready code with full error handling

**Popular examples:**
- [Cost Tracking](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/1-cost-tracking) - Track costs across all providers
- [Webhooks](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/10-webhooks) - Real-time notifications
- [Workflows](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/13-workflows) - Multi-step AI orchestration
- [Semantic Caching](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/14-cache) - 30-40% cost reduction
- [OpenTelemetry](https://github.com/Hypothesize-Tech/costkatana-examples/tree/master/11-observability) - Distributed tracing

---

### Compare Models

```typescript
import { ai, OPENAI, ANTHROPIC, GOOGLE } from 'cost-katana';

const models = [
  { name: 'GPT-4', constant: OPENAI.GPT_4 },
  { name: 'Claude 3.5 Sonnet', constant: ANTHROPIC.CLAUDE_3_5_SONNET_20241022 },
  { name: 'Gemini 2.5 Pro', constant: GOOGLE.GEMINI_2_5_PRO }
];
const prompt = 'Explain relativity in one sentence';

for (const { name, constant } of models) {
  const response = await ai(constant, prompt);
  console.log(`${name}: $${response.cost.toFixed(4)}`);
}
```

### 🔄 Migration Guide (from string model names)

**Old way (deprecated, still works):**
```typescript
// String model names (shows deprecation warning)
await ai('gpt-4', 'Hello');
await ai('claude-3-sonnet', 'Hello');
```

**New way (recommended):**
```typescript
import { ai, OPENAI, ANTHROPIC } from 'cost-katana';

// Type-safe constants with autocomplete
await ai(OPENAI.GPT_4, 'Hello');
await ai(ANTHROPIC.CLAUDE_3_5_SONNET_20241022, 'Hello');
```

**Available Model Constants:**

```typescript
// OpenAI Models
OPENAI.GPT_5, OPENAI.GPT_5_MINI, OPENAI.GPT_4, OPENAI.GPT_4_TURBO,
OPENAI.GPT_4O, OPENAI.GPT_3_5_TURBO, OPENAI.O1, OPENAI.O3, ...

// Anthropic Models  
ANTHROPIC.CLAUDE_SONNET_4_5, ANTHROPIC.CLAUDE_HAIKU_4_5,
ANTHROPIC.CLAUDE_3_5_SONNET_20241022, ANTHROPIC.CLAUDE_3_5_HAIKU_20241022, ...

// Google Models
GOOGLE.GEMINI_2_5_PRO, GOOGLE.GEMINI_2_5_FLASH, GOOGLE.GEMINI_1_5_PRO,
GOOGLE.GEMINI_1_5_FLASH, ...

// AWS Bedrock Models
AWS_BEDROCK.NOVA_PRO, AWS_BEDROCK.NOVA_LITE, AWS_BEDROCK.CLAUDE_SONNET_4_5, ...

// Other Providers
XAI.GROK_2_1212, DEEPSEEK.DEEPSEEK_CHAT, MISTRAL.MISTRAL_LARGE_LATEST,
COHERE.COMMAND_R_PLUS, GROQ.LLAMA_3_3_70B_VERSATILE, META.LLAMA_3_3_70B_INSTRUCT, ...
```

> **Note**: String model names will continue to work but show a deprecation warning. They will be removed in a future major version.

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
COST_KATANA_API_KEY=dak_your_key_here

# Option 2: Direct provider keys (uses native SDKs)
OPENAI_API_KEY=sk-...              # For OpenAI models (native SDK) - USER PROVIDED
GEMINI_API_KEY=...                 # For Gemini models (native SDK) - USER PROVIDED
ANTHROPIC_API_KEY=sk-ant-...       # For Claude models
AWS_ACCESS_KEY_ID=...              # For AWS Bedrock
AWS_SECRET_ACCESS_KEY=...          # For AWS Bedrock
AWS_REGION=us-east-1               # For AWS Bedrock
```

> **⚠️ Important for Self-Hosted Users**: 
> - **OpenAI and Gemini providers require YOUR OWN API keys** 
> - Cost Katana **does not provide** OpenAI or Google API keys
> - Without `OPENAI_API_KEY`, OpenAI models (GPT-*) will not be available
> - Without `GEMINI_API_KEY`, Gemini models will not be available
> - Only AWS Bedrock models (Claude, Nova, etc.) work with AWS credentials
> 
> **With direct provider keys, Cost Katana automatically uses:**
> - Native OpenAI SDK for GPT models (if OPENAI_API_KEY provided)
> - Native Google Gemini SDK for Gemini models (if GEMINI_API_KEY provided)
> - AWS Bedrock as fallback for both

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

Works with all major AI providers with **native SDK support** for optimal performance:

```typescript
// OpenAI (Native SDK)
await ai('gpt-4', 'Hello');
await ai('gpt-3.5-turbo', 'Hello');
await ai('gpt-4-turbo', 'Hello');

// Google Gemini (Native SDK)
await ai('gemini-pro', 'Hello');
await ai('gemini-1.5-flash', 'Hello');
await ai('gemini-1.5-pro', 'Hello');

// Anthropic
await ai('claude-3-sonnet', 'Hello');
await ai('claude-3-haiku', 'Hello');

// AWS Bedrock
await ai('nova-pro', 'Hello');
await ai('nova-lite', 'Hello');

// And many more...
```

### Native SDK Integration

Cost Katana uses **native SDKs** for OpenAI and Google Gemini, providing:
- ✅ **Better Performance** - Direct API calls, no middleman
- ✅ **Lower Latency** - Optimized request/response handling  
- ✅ **Automatic Failover** - Falls back to AWS Bedrock if native SDK fails
- ✅ **Full Feature Support** - Access to all provider-specific features

#### OpenAI Native SDK

```typescript
import { ai, OpenAIProvider } from 'cost-katana';

// Option 1: Automatic (uses OPENAI_API_KEY from env)
const response = await ai('gpt-4', 'Explain quantum computing');

// Option 2: Manual configuration
const openai = new OpenAIProvider({
  apiKey: 'sk-your-openai-key',
  provider: 'openai'
});

const result = await openai.makeRequest({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'You are a helpful assistant' },
    { role: 'user', content: 'Hello!' }
  ],
  maxTokens: 500,
  temperature: 0.7
});

console.log(result.choices[0].message.content);
console.log(`Tokens: ${result.usage.total_tokens}`);
```

#### Google Gemini Native SDK

```typescript
import { ai, GoogleProvider } from 'cost-katana';

// Option 1: Automatic (uses GOOGLE_API_KEY from env)
const response = await ai('gemini-1.5-pro', 'Write a haiku about AI');

// Option 2: Manual configuration
const gemini = new GoogleProvider({
  apiKey: 'your-google-ai-key',
  provider: 'google'
});

const result = await gemini.makeRequest({
  model: 'gemini-1.5-flash',
  messages: [
    { role: 'user', content: 'Explain machine learning' }
  ],
  maxTokens: 1000,
  temperature: 0.8
});

console.log(result.choices[0].message.content);
console.log(`Tokens: ${result.usage.totalTokenCount}`);
```

#### Provider Auto-Detection

Cost Katana automatically detects the right provider based on the model name:

```typescript
// Auto-routes to OpenAI SDK
await ai('gpt-4', 'Hello');

// Auto-routes to Google Gemini SDK
await ai('gemini-pro', 'Hello');  

// Auto-routes to Anthropic
await ai('claude-3-sonnet', 'Hello');

// Auto-routes to AWS Bedrock
await ai('nova-pro', 'Hello');
```

#### Failover & Reliability

If a native SDK fails, Cost Katana automatically falls back to AWS Bedrock:

```typescript
// Primary: OpenAI SDK
// Fallback: AWS Bedrock (if OpenAI fails)
const response = await ai('gpt-4', 'Hello', {
  fallback: true  // Enable automatic failover
});

console.log(`Provider used: ${response.provider}`);
// Output might be 'openai' or 'aws-bedrock' depending on availability
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
  // Use Cortex for long-form content (40-75% savings)
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

### Session Replay & Recording

Record and replay AI interactions for debugging and analysis:

```typescript
import { SessionReplayClient } from 'cost-katana/trace';

const replayClient = new SessionReplayClient({
  apiKey: process.env.COST_KATANA_API_KEY
});

// Start recording a chat session
const { sessionId } = await replayClient.startRecording({
  userId: 'user123',
  feature: 'chat',
  label: 'Customer Support Chat'
});

// Record AI interactions
await replayClient.recordInteraction({
  sessionId,
  interaction: {
    timestamp: new Date(),
    model: 'gpt-4',
    prompt: 'How can I help you?',
    response: 'I need assistance with...',
    tokens: { input: 10, output: 20 },
    cost: 0.0015,
    latency: 850,
    provider: 'openai'
  }
});

// Record user actions
await replayClient.recordUserAction({
  sessionId,
  action: {
    timestamp: new Date(),
    action: 'button_click',
    target: 'send_message'
  }
});

// End recording
await replayClient.endRecording(sessionId);

// Later, retrieve the replay
const replay = await replayClient.getSessionReplay(sessionId);
console.log('Total interactions:', replay.replayData.aiInteractions.length);
console.log('Total cost:', replay.summary.totalCost);
```

### Distributed Tracing

Track AI operations across microservices:

```typescript
import { TraceClient, createTraceMiddleware } from 'cost-katana/trace';
import express from 'express';

const app = express();
const traceClient = new TraceClient({
  apiKey: process.env.COST_KATANA_API_KEY
});

// Add tracing middleware
app.use(createTraceMiddleware({ traceService: traceClient }));

// Your routes automatically get traced
app.post('/api/chat', async (req, res) => {
  const response = await ai('gpt-4', req.body.message);
  res.json(response);
});

// View traces in your dashboard at costkatana.com/sessions
```

### Dashboard Features

Visit [costkatana.com/dashboard](https://costkatana.com/dashboard) to see:

- **Session Replays**: Timeline playback of AI interactions
- **Debug Traces**: Span-level distributed tracing  
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
export COST_KATANA_API_KEY="dak_your_key"

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
- **Discord**: [discord.gg/costkatana](https://discord.gg/D8nDArmKbY)

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development setup and workflow
- Code quality standards (linting, formatting, testing)
- Pre-commit hooks and CI/CD pipeline
- Commit message conventions
- How to submit pull requests

### Quick Development Start

```bash
# Clone and install
git clone https://github.com/Hypothesize-Tech/costkatana-core.git
cd costkatana-core
npm install

# Development commands
npm run lint        # Check linting
npm run lint:fix    # Auto-fix linting errors
npm run format      # Format code
npm test            # Run tests
npm run build       # Build the project
```

**Code Quality**: We maintain **0 linting errors** with automatic pre-commit hooks. All commits are checked for code quality before merging.

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