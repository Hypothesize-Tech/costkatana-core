# Cost Katana 🥷

> **Cut your AI costs in half. Without cutting corners.**

Cost Katana is a drop-in SDK that wraps your AI calls with automatic cost tracking, smart caching, and optimization—all in one line of code.

---

## 🚀 Get Started in 60 Seconds

### Step 1: Install

```bash
npm install cost-katana
```

### Step 2: Make Your First AI Call

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(OPENAI.GPT_4, 'Explain quantum computing in one sentence');

console.log(response.text);   // "Quantum computing uses qubits to perform..."
console.log(response.cost);   // 0.0012
console.log(response.tokens); // 47
```

**That's it.** No configuration files. No complex setup. Just results.

---

## 🌍 Provider-Independent by Design

Cost Katana is **completely provider-agnostic**. Never lock yourself into a single vendor.

### ✅ Use Capability-Based Routing

```typescript
import { ai, ModelCapability } from 'cost-katana';

// Automatically selects best model for each task
const code = await ai(ModelCapability.CODE_GENERATION, 'Write a React component');
const chat = await ai(ModelCapability.CONVERSATION, 'Hello!');
const vision = await ai(ModelCapability.VISION, 'Describe this image', { image });
```

### ✅ Optimize by Performance Characteristics

```typescript
import { ai } from 'cost-katana';

// Fastest model available
const fast = await ai({ speed: 'fastest' }, prompt);

// Cheapest model available
const cheap = await ai({ cost: 'cheapest' }, prompt);

// Best quality model
const best = await ai({ quality: 'best' }, prompt);

// Balanced approach
const balanced = await ai({ speed: 'fast', cost: 'cheap' }, prompt);
```

**Benefits:**
- 🔄 **Automatic Failover** - Seamlessly switch providers if one goes down
- 💰 **Cost Optimization** - Routes to the cheapest provider automatically
- 🚀 **Future-Proof** - New providers added without code changes
- 🔓 **Zero Lock-In** - Switch providers anytime, no refactoring needed

[Read the full Provider-Agnostic Guide →](https://github.com/Hypothesize-Tech/costkatana-examples/blob/main/PROVIDER_AGNOSTIC_GUIDE.md)

---

## 📖 Tutorial: Build a Cost-Aware Chatbot

Let's build something real. In this tutorial, you'll create a chatbot that:
- ✅ Tracks every dollar spent
- ✅ Caches repeated questions (saving 100% on duplicates)
- ✅ Optimizes long responses (40-75% savings)

### Part 1: Basic Chat Session

```typescript
import { chat, OPENAI } from 'cost-katana';

// Create a persistent chat session
const session = chat(OPENAI.GPT_4);

// Send messages and track costs
await session.send('Hello! What can you help me with?');
await session.send('Tell me a programming joke');
await session.send('Now explain it');

// See exactly what you spent
console.log(`💰 Total cost: $${session.totalCost.toFixed(4)}`);
console.log(`📊 Messages: ${session.messages.length}`);
console.log(`🎯 Tokens used: ${session.totalTokens}`);
```

### Part 2: Add Smart Caching

Cache identical questions to avoid paying twice:

```typescript
import { ai, OPENAI } from 'cost-katana';

// First call - hits the API
const response1 = await ai(OPENAI.GPT_4, 'What is 2+2?', { cache: true });
console.log(`Cached: ${response1.cached}`);  // false
console.log(`Cost: $${response1.cost}`);     // $0.0008

// Second call - served from cache (FREE!)
const response2 = await ai(OPENAI.GPT_4, 'What is 2+2?', { cache: true });
console.log(`Cached: ${response2.cached}`);  // true
console.log(`Cost: $${response2.cost}`);     // $0.0000 🎉
```

### Part 3: Enable Cortex Optimization

For long-form content, Cortex compresses prompts intelligently:

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(
  OPENAI.GPT_4,
  'Write a comprehensive guide to machine learning for beginners',
  { 
    cortex: true,      // Enable 40-75% cost reduction
    maxTokens: 2000 
  }
);

console.log(`Optimized: ${response.optimized}`);
console.log(`Saved: $${response.savedAmount}`);
```

### Part 4: Compare Models Side-by-Side

Find the best price-to-quality ratio for your use case:

```typescript
import { ai, OPENAI, ANTHROPIC, GOOGLE } from 'cost-katana';

const prompt = 'Summarize the theory of relativity in 50 words';

const models = [
  { name: 'GPT-4', id: OPENAI.GPT_4 },
  { name: 'Claude 3.5 Sonnet', id: ANTHROPIC.CLAUDE_3_5_SONNET_20241022 },
  { name: 'Gemini 2.5 Pro', id: GOOGLE.GEMINI_2_5_PRO },
  { name: 'GPT-3.5 Turbo', id: OPENAI.GPT_3_5_TURBO }
];

console.log('📊 Model Cost Comparison\n');

for (const model of models) {
  const response = await ai(model.id, prompt);
  console.log(`${model.name.padEnd(20)} $${response.cost.toFixed(6)}`);
}
```

**Sample Output:**
```
📊 Model Cost Comparison

GPT-4                $0.001200
Claude 3.5 Sonnet    $0.000900
Gemini 2.5 Pro       $0.000150
GPT-3.5 Turbo        $0.000080
```

---

## 🎯 Type-Safe Model Selection

Stop guessing model names. Get autocomplete and catch typos at compile time:

```typescript
import { OPENAI, ANTHROPIC, GOOGLE, AWS_BEDROCK, XAI, DEEPSEEK } from 'cost-katana';

// OpenAI
OPENAI.GPT_5
OPENAI.GPT_4
OPENAI.GPT_4O
OPENAI.GPT_3_5_TURBO
OPENAI.O1
OPENAI.O3

// Anthropic
ANTHROPIC.CLAUDE_SONNET_4_5
ANTHROPIC.CLAUDE_3_5_SONNET_20241022
ANTHROPIC.CLAUDE_3_5_HAIKU_20241022

// Google
GOOGLE.GEMINI_2_5_PRO
GOOGLE.GEMINI_2_5_FLASH
GOOGLE.GEMINI_1_5_PRO

// AWS Bedrock
AWS_BEDROCK.NOVA_PRO
AWS_BEDROCK.NOVA_LITE
AWS_BEDROCK.CLAUDE_SONNET_4_5

// Others
XAI.GROK_2_1212
DEEPSEEK.DEEPSEEK_CHAT
```

**Why constants over strings?**
| Feature | String `'gpt-4'` | Constant `OPENAI.GPT_4` |
|---------|------------------|-------------------------|
| Autocomplete | ❌ | ✅ |
| Typo protection | ❌ | ✅ |
| Refactor safely | ❌ | ✅ |
| Self-documenting | ❌ | ✅ |

---

## ⚙️ Configuration

### Environment Variables

```bash
# Recommended: Use Cost Katana API key for all features
COST_KATANA_API_KEY=dak_your_key_here

# Or use provider keys directly
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# For AWS Bedrock
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

### Programmatic Configuration

```typescript
import { configure } from 'cost-katana';

await configure({
  apiKey: 'dak_your_key',
  cortex: true,     // 40-75% cost savings
  cache: true,      // Smart caching
  firewall: true    // Block prompt injections
});
```

### Request Options

```typescript
const response = await ai(OPENAI.GPT_4, 'Your prompt', {
  temperature: 0.7,                        // Creativity (0-2)
  maxTokens: 500,                          // Response limit
  systemMessage: 'You are a helpful AI',   // System prompt
  cache: true,                             // Enable caching
  cortex: true,                            // Enable optimization
  retry: true                              // Auto-retry on failures
});
```

---

## 🔌 Framework Integration

### Next.js App Router

```typescript
// app/api/chat/route.ts
import { ai, OPENAI } from 'cost-katana';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const response = await ai(OPENAI.GPT_4, prompt);
  return Response.json(response);
}
```

### Express.js

```typescript
import express from 'express';
import { ai, OPENAI } from 'cost-katana';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const response = await ai(OPENAI.GPT_4, req.body.prompt);
  res.json(response);
});

app.listen(3000);
```

### Fastify

```typescript
import fastify from 'fastify';
import { ai, OPENAI } from 'cost-katana';

const app = fastify();

app.post('/api/chat', async (request) => {
  const { prompt } = request.body as { prompt: string };
  return await ai(OPENAI.GPT_4, prompt);
});

app.listen({ port: 3000 });
```

### NestJS

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ai, OPENAI } from 'cost-katana';

@Controller('api')
export class ChatController {
  @Post('chat')
  async chat(@Body() body: { prompt: string }) {
    return await ai(OPENAI.GPT_4, body.prompt);
  }
}
```

---

## 🛡️ Built-in Security

### Firewall Protection

Block prompt injection attacks automatically:

```typescript
import { configure, ai, OPENAI } from 'cost-katana';

await configure({ firewall: true });

try {
  await ai(OPENAI.GPT_4, 'Ignore all previous instructions and...');
} catch (error) {
  console.log('🛡️ Blocked:', error.message);
}
```

**Protects against:**
- Prompt injection attacks
- Jailbreak attempts
- Data exfiltration
- Malicious content generation

---

## 🔄 Auto-Failover

Never let provider outages break your app:

```typescript
import { ai, OPENAI } from 'cost-katana';

// If OpenAI is down, automatically switches to Claude or Gemini
const response = await ai(OPENAI.GPT_4, 'Hello');

console.log(`Provider used: ${response.provider}`);
// Could be 'openai', 'anthropic', or 'google' depending on availability
```

---

## 📊 Session Replay & Tracing

### Record AI Sessions

```typescript
import { SessionReplayClient } from 'cost-katana/trace';

const replay = new SessionReplayClient({
  apiKey: process.env.COST_KATANA_API_KEY
});

// Start recording
const { sessionId } = await replay.startRecording({
  userId: 'user123',
  feature: 'chat',
  label: 'Support Conversation'
});

// Record interactions
await replay.recordInteraction({
  sessionId,
  interaction: {
    timestamp: new Date(),
    model: 'gpt-4',
    prompt: 'How do I reset my password?',
    response: 'To reset your password...',
    tokens: { input: 8, output: 45 },
    cost: 0.0012,
    latency: 850
  }
});

// End and retrieve
await replay.endRecording(sessionId);
const session = await replay.getSessionReplay(sessionId);
```

### Distributed Tracing

```typescript
import { TraceClient, createTraceMiddleware } from 'cost-katana/trace';
import express from 'express';

const app = express();
const trace = new TraceClient({ apiKey: process.env.COST_KATANA_API_KEY });

app.use(createTraceMiddleware({ traceService: trace }));

// All routes automatically traced
app.post('/api/chat', async (req, res) => {
  const response = await ai(OPENAI.GPT_4, req.body.message);
  res.json(response);
});
```

---

## 💡 Cost Optimization Cheatsheet

| Strategy | Savings | When to Use |
|----------|---------|-------------|
| **Use GPT-3.5 over GPT-4** | 90% | Simple tasks, translations |
| **Enable caching** | 100% on hits | Repeated queries, FAQs |
| **Enable Cortex** | 40-75% | Long-form content |
| **Batch in sessions** | 10-20% | Related queries |
| **Use Gemini Flash** | 95% vs GPT-4 | High-volume, cost-sensitive |

### Quick Wins

```typescript
// ❌ Expensive: Using GPT-4 for everything
await ai(OPENAI.GPT_4, 'What is 2+2?');  // $0.001

// ✅ Smart: Match model to task
await ai(OPENAI.GPT_3_5_TURBO, 'What is 2+2?');  // $0.0001

// ✅ Smarter: Cache common queries
await ai(OPENAI.GPT_3_5_TURBO, 'What is 2+2?', { cache: true });  // $0 on repeat

// ✅ Smartest: Cortex for long content
await ai(OPENAI.GPT_4, 'Write a 2000-word essay', { cortex: true });  // 40-75% off
```

---

## 🔧 Error Handling

```typescript
import { ai, OPENAI } from 'cost-katana';

try {
  const response = await ai(OPENAI.GPT_4, 'Hello');
  console.log(response.text);
} catch (error) {
  switch (error.code) {
    case 'NO_API_KEY':
      console.log('Set COST_KATANA_API_KEY or OPENAI_API_KEY');
      break;
    case 'RATE_LIMIT':
      console.log('Rate limited. Retrying...');
      break;
    case 'INVALID_MODEL':
      console.log('Model not found. Available:', error.availableModels);
      break;
    default:
      console.log('Error:', error.message);
  }
}
```

---

## 📚 More Examples

Explore 45+ complete examples in our examples repository:

**🔗 [github.com/Hypothesize-Tech/costkatana-examples](https://github.com/Hypothesize-Tech/costkatana-examples)**

| Category | Examples |
|----------|----------|
| **Cost Tracking** | Basic tracking, budgets, alerts |
| **Gateway** | Routing, load balancing, failover |
| **Optimization** | Cortex, caching, compression |
| **Observability** | OpenTelemetry, tracing, metrics |
| **Security** | Firewall, rate limiting, moderation |
| **Workflows** | Multi-step AI orchestration |
| **Frameworks** | Express, Next.js, Fastify, NestJS, FastAPI |

---

## 🔄 Migration Guides

### From OpenAI SDK

```typescript
// Before
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: 'sk-...' });
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }]
});
console.log(completion.choices[0].message.content);

// After
import { ai, OPENAI } from 'cost-katana';
const response = await ai(OPENAI.GPT_4, 'Hello');
console.log(response.text);
console.log(`Cost: $${response.cost}`);  // Bonus: cost tracking!
```

### From Anthropic SDK

```typescript
// Before
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: 'sk-ant-...' });
const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20241022',
  messages: [{ role: 'user', content: 'Hello' }]
});

// After
import { ai, ANTHROPIC } from 'cost-katana';
const response = await ai(ANTHROPIC.CLAUDE_3_5_SONNET_20241022, 'Hello');
```

### From LangChain

```typescript
// Before
import { ChatOpenAI } from 'langchain/chat_models/openai';
const model = new ChatOpenAI({ modelName: 'gpt-4' });
const response = await model.call([{ content: 'Hello' }]);

// After
import { ai, OPENAI } from 'cost-katana';
const response = await ai(OPENAI.GPT_4, 'Hello');
```

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md).

```bash
git clone https://github.com/Hypothesize-Tech/costkatana-core.git
cd costkatana-core
npm install

npm run lint        # Check code style
npm run lint:fix    # Auto-fix issues
npm run format      # Format code
npm test            # Run tests
npm run build       # Build
```

---

## 📞 Support

| Channel | Link |
|---------|------|
| **Dashboard** | [costkatana.com](https://costkatana.com) |
| **Documentation** | [docs.costkatana.com](https://docs.costkatana.com) |
| **GitHub** | [github.com/Hypothesize-Tech](https://github.com/Hypothesize-Tech) |
| **Discord** | [discord.gg/D8nDArmKbY](https://discord.gg/D8nDArmKbY) |
| **Email** | support@costkatana.com |

---

## 📄 License

MIT © Cost Katana

---

<div align="center">

**Start cutting AI costs today** 🥷

```bash
npm install cost-katana
```

```typescript
import { ai, OPENAI } from 'cost-katana';
await ai(OPENAI.GPT_4, 'Hello, world!');
```

</div>
