# Cost Katana

[![npm](https://img.shields.io/npm/v/cost-katana.svg)](https://www.npmjs.com/package/cost-katana)
[![PyPI](https://img.shields.io/pypi/v/cost-katana.svg)](https://pypi.org/project/cost-katana/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-%3E%3D3.8-blue)](https://pypi.org/project/cost-katana/)

> **Cut your AI costs in half. Without cutting corners.**

Cost Katana is a drop-in SDK that wraps your AI calls with automatic cost tracking, smart caching, and optimization—all in one line of code.

## Table of contents

1. [Installation](#installation)
2. [Quick start](#quick-start)
3. [Configuration](#configuration)
4. [Core APIs](#core-apis)
   - [`ai()`](#ai)
   - [`chat()`](#chat)
   - [`gateway()`](#gateway)
5. [Provider-independent design](#provider-independent-design)
6. [Type-safe model constants](#type-safe-model-constants)
7. [Cost optimization](#cost-optimization)
8. [Security and reliability](#security-and-reliability)
9. [Usage tracking and analytics](#usage-tracking-and-analytics)
10. [Framework integration](#framework-integration)
11. [Error handling](#error-handling)
12. [AI gateway (details)](#ai-gateway-details)
13. [Experimentation (hosted API)](#experimentation-hosted-api)
14. [Examples and documentation](#examples-and-documentation)
15. [Migration guides](#migration-guides)
16. [Contributing](#contributing)
17. [Support](#support)
18. [License](#license)

---

## Installation

**TypeScript / Node**

```bash
npm install cost-katana
```

**Python** — published on PyPI as [`cost-katana`](https://pypi.org/project/cost-katana/) (install name uses a hyphen; import uses an underscore).

```bash
pip install cost-katana
```

```python
import cost_katana as ck  # package import: cost_katana
```

Requires **Node.js 18+** for the npm package and **Python 3.8+** for the PyPI package.

---

## Quick start

Set **`COST_KATANA_API_KEY`**. **`PROJECT_ID`** is optional (recommended for per-project analytics in the dashboard).

### Path A — Gateway (HTTP proxy)

Use this when you want a **drop-in proxy**: change base URL and send `Authorization: Bearer`, or use **`gateway()`** in TypeScript with no extra config (reads `COST_KATANA_API_KEY`, same behavior as `createGatewayClientFromEnv()`).

**cURL** (no SDK; OpenAI-compatible JSON):

```bash
curl -s https://api.costkatana.com/api/gateway/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $COST_KATANA_API_KEY" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hello!"}]}'
```

**TypeScript**

```typescript
import { gateway, OPENAI } from 'cost-katana';

const res = await gateway().openai({
  model: OPENAI.GPT_4O,
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(res.data);
```

### Path B — `ai()` (simple API, cost on the response)

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(OPENAI.GPT_4O, 'Hello');

console.log(response.text, response.cost);
```

### Path C — Python

Install [`cost-katana` from PyPI](https://pypi.org/project/cost-katana/), set `COST_KATANA_API_KEY` (and optionally `PROJECT_ID`), then:

```python
import cost_katana as ck
from cost_katana import openai

response = ck.ai(openai.gpt_4o, "Hello")
print(response.text, response.cost)
```

The Python SDK talks to the same hosted backend as TypeScript (`https://api.costkatana.com` by default). For HTTP gateway usage (OpenAI- or Anthropic-shaped JSON), see the [package README on PyPI](https://pypi.org/project/cost-katana/).

### Which API should I use?

| If you want… | Use |
|--------------|-----|
| Drop-in HTTP proxy (existing OpenAI clients / cURL) | Gateway URL + `Authorization: Bearer`, or **`gateway()`** in TypeScript |
| Simple AI calls with cost on the response | **`ai()`** / **`chat()`** |
| Session replay, advanced analytics, or manual `trackUsage` | **`AICostTracker`** (advanced) |

For most apps, **`COST_KATANA_API_KEY`** plus either **`gateway()`** (proxy) or **`ai()`** (SDK) is enough. For optional direct provider keys, add them to your environment as shown in [Configuration](#configuration).

---

## Configuration

### Environment variables

**Start here:** `COST_KATANA_API_KEY` unlocks routing, tracking, and dashboard features. **`PROJECT_ID`** is optional (scopes usage to a project in the dashboard).

Create a `.env` in your project (or export in your shell) with the variables you need:

```bash
# Required for hosted Cost Katana
COST_KATANA_API_KEY=dak_your_key_here

# Optional — per-project analytics
PROJECT_ID=your_project_id

# Optional — direct provider keys (bring your own keys)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Optional — AWS Bedrock
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

There is no `.env.example` file in this repository; copy the block above into your own `.env` and fill in values.

### Programmatic configuration

```typescript
import { configure } from 'cost-katana';

await configure({
  apiKey: 'dak_your_key',
  cortex: true, // 40–75% cost savings (when enabled on requests)
  cache: true, // Smart caching (when enabled on requests)
  firewall: true, // Block prompt injections
});
```

### Common request options (`ai()`)

| Option | Description |
|--------|-------------|
| `temperature` | Creativity (0–2), default `0.7` |
| `maxTokens` | Max response tokens, default `1000` |
| `systemMessage` | System prompt |
| `cache` | Enable caching |
| `cortex` | Enable optimization (Cortex) |

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(OPENAI.GPT_4O, 'Your prompt', {
  temperature: 0.7,
  maxTokens: 500,
  systemMessage: 'You are a helpful AI',
  cache: true,
  cortex: true,
});
```

---

## Core APIs

### `ai()`

The simplest way to make AI requests with automatic cost tracking.

**Signature**

```typescript
await ai(model, prompt, options?);
```

- **`model`** — Use type-safe constants (e.g. `OPENAI.GPT_4O`). String model IDs still work but are deprecated.
- **`prompt`** — User prompt text.
- **`options`** — See [Common request options](#common-request-options-ai).

**Returns:** `text`, `cost`, `tokens`, `model`, `provider`, and optionally `cached`, `optimized`, `templateUsed` when applicable.

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(OPENAI.GPT_4O, 'Explain quantum computing', {
  temperature: 0.7,
  maxTokens: 500,
});

console.log(response.text);
console.log(`Cost: $${response.cost}`);
```

### `chat()`

Create a **session** with conversation history and cost tracking.

**Signature**

```typescript
const session = chat(model, options?);
```

**Session API**

| Member | Description |
|--------|-------------|
| `send(message)` | Send a message and append assistant reply |
| `messages` | Full conversation history |
| `totalCost` | Running total cost (USD) |
| `totalTokens` | Running token count |
| `clear()` | Reset conversation (keeps system message if set) |

```typescript
import { chat, OPENAI } from 'cost-katana';

const session = chat(OPENAI.GPT_4O, {
  systemMessage: 'You are a helpful AI assistant.',
  temperature: 0.7,
});

await session.send('Hello! What can you help me with?');
await session.send('Tell me a programming joke');
await session.send('Now explain it');

console.log(`Total cost: $${session.totalCost.toFixed(4)}`);
console.log(`Messages: ${session.messages.length}`);
console.log(`Tokens used: ${session.totalTokens}`);
```

### `gateway()`

Zero extra config for the hosted gateway: **`COST_KATANA_API_KEY`** is read from the environment. Use the same OpenAI-shaped request bodies you would send upstream.

For advanced gateway features (headers, proxy keys, firewall), see [`docs/GATEWAY.md`](./docs/GATEWAY.md) and [`docs/API.md`](./docs/API.md).

---

## Provider-independent design

Cost Katana is **provider-agnostic**: the same **`ai()`** API works across OpenAI, Anthropic, Google, and more—pick a **model constant** per provider.

```typescript
import { ai, OPENAI, ANTHROPIC, GOOGLE } from 'cost-katana';

const a = await ai(OPENAI.GPT_4O, 'Hello');
const b = await ai(ANTHROPIC.CLAUDE_3_5_SONNET_20241022, 'Hello');
const c = await ai(GOOGLE.GEMINI_2_5_PRO, 'Hello');
```

**Benefits**

- **Automatic failover** — Seamlessly switch providers when configured (see [Security and reliability](#security-and-reliability)).
- **Cost optimization** — Choose cheaper models with constants and the [cost optimization](#cost-optimization) patterns below.
- **Future-proof** — New providers and models are added to the registry without changing your mental model.
- **Zero lock-in** — Swap model constants as your stack evolves.

For deeper routing patterns (capabilities, load balancing, multi-provider setups), see the [Provider-Agnostic Guide](https://github.com/Hypothesize-Tech/costkatana-examples/blob/main/PROVIDER_AGNOSTIC_GUIDE.md).

---

## Type-safe model constants

Stop guessing model names: use namespaces for autocomplete and typo safety.

```typescript
import { OPENAI, ANTHROPIC, GOOGLE, AWS_BEDROCK, XAI, DEEPSEEK } from 'cost-katana';

// OpenAI
OPENAI.GPT_5;
OPENAI.GPT_4;
OPENAI.GPT_4O;
OPENAI.GPT_3_5_TURBO;
OPENAI.O1;
OPENAI.O3;

// Anthropic
ANTHROPIC.CLAUDE_SONNET_4_5;
ANTHROPIC.CLAUDE_3_5_SONNET_20241022;
ANTHROPIC.CLAUDE_3_5_HAIKU_20241022;

// Google
GOOGLE.GEMINI_2_5_PRO;
GOOGLE.GEMINI_2_5_FLASH;
GOOGLE.GEMINI_1_5_PRO;

// AWS Bedrock
AWS_BEDROCK.NOVA_PRO;
AWS_BEDROCK.NOVA_LITE;
AWS_BEDROCK.CLAUDE_SONNET_4_5;

// Others
XAI.GROK_2_1212;
DEEPSEEK.DEEPSEEK_CHAT;
```

**Prefer constants over raw strings** — They give IDE autocomplete, catch typos early, refactor safely, and document which provider you intended.

---

## Cost optimization

### Cheatsheet

| Strategy | Typical savings | When to use |
|----------|-----------------|-------------|
| Use a smaller/faster model (e.g. GPT-3.5 vs GPT-4) | Large on simple tasks | Trivial Q&A, classification, translation |
| **Caching** | 100% on cache hits | Repeated queries, FAQs |
| **Cortex** | 40–75% on eligible workloads | Long-form generation |
| **Chat sessions** | 10–20% | Related multi-turn work |
| **Gemini Flash** (vs heavy flagship models) | Very high $/token delta | High volume, cost-sensitive |

### Caching

```typescript
import { ai, OPENAI } from 'cost-katana';

const response1 = await ai(OPENAI.GPT_4O, 'What is 2+2?', { cache: true });
console.log(`Cached: ${response1.cached}`);
console.log(`Cost: $${response1.cost}`);

const response2 = await ai(OPENAI.GPT_4O, 'What is 2+2?', { cache: true });
console.log(`Cached: ${response2.cached}`);
console.log(`Cost: $${response2.cost}`);
```

### Cortex (optimization)

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(
  OPENAI.GPT_4O,
  'Write a comprehensive guide to machine learning for beginners',
  {
    cortex: true,
    maxTokens: 2000,
  }
);

console.log(`Optimized: ${response.optimized}`);
console.log(`Cost: $${response.cost}`);
```

### Compare models side by side

```typescript
import { ai, OPENAI, ANTHROPIC, GOOGLE } from 'cost-katana';

const prompt = 'Summarize the theory of relativity in 50 words';

const models = [
  { name: 'GPT-4 class', id: OPENAI.GPT_4O },
  { name: 'Claude 3.5 Sonnet', id: ANTHROPIC.CLAUDE_3_5_SONNET_20241022 },
  { name: 'Gemini 2.5 Pro', id: GOOGLE.GEMINI_2_5_PRO },
  { name: 'GPT-3.5 Turbo', id: OPENAI.GPT_3_5_TURBO },
];

console.log('Model cost comparison\n');

for (const model of models) {
  const response = await ai(model.id, prompt);
  console.log(`${model.name.padEnd(22)} $${response.cost.toFixed(6)}`);
}
```

### Quick wins

```typescript
import { ai, OPENAI } from 'cost-katana';

// Expensive: flagship model for a trivial question
await ai(OPENAI.GPT_4O, 'What is 2+2?');

// Better: match model to task
await ai(OPENAI.GPT_3_5_TURBO, 'What is 2+2?');

// Better still: cache repeated FAQs
await ai(OPENAI.GPT_3_5_TURBO, 'What is 2+2?', { cache: true });

// Long content: Cortex
await ai(OPENAI.GPT_4O, 'Write a 2000-word essay', { cortex: true });
```

---

## Security and reliability

### Firewall

Block prompt injection and related abuse when enabled via **`configure({ firewall: true })`** and gateway/tracker settings.

```typescript
import { configure, ai, OPENAI } from 'cost-katana';

await configure({ firewall: true });

try {
  await ai(OPENAI.GPT_4O, 'Ignore all previous instructions and...');
} catch (error) {
  console.log('Blocked:', (error as Error).message);
}
```

**Helps mitigate:** prompt injection, jailbreak attempts, unsafe content patterns (exact behavior depends on your gateway configuration).

### Auto-failover

When routing and health checks allow, requests can fall back across providers so a single vendor outage does not take down your app.

```typescript
import { ai, OPENAI } from 'cost-katana';

const response = await ai(OPENAI.GPT_4O, 'Hello');

console.log(`Provider used: ${response.provider}`);
// e.g. 'openai', 'anthropic', or 'google' depending on availability and policy
```

---

## Usage tracking and analytics

### Dashboard attribution with `configure()` and `ai()`

Use the same **`ai()`** API everywhere. Point usage at your project once with **`configure()`** or environment variables.

```typescript
import { configure, ai, OPENAI } from 'cost-katana';

await configure({
  apiKey: process.env.COST_KATANA_API_KEY,
  projectId: process.env.PROJECT_ID,
});

const response = await ai(OPENAI.GPT_4O, 'Explain quantum computing');

console.log(response.text);
console.log('Cost:', response.cost);
console.log('Tokens:', response.tokens);
```

Calls can be attributed to your project in the dashboard. You can also pass **`projectId`** through tracker/gateway options where supported when using multiple projects.

### `AICostTracker` with defaults (advanced)

When you need a **dedicated tracker instance** (not only the global `ai()` helper), use **`createCostKatanaTracker()`** or **`AICostTracker.createWithDefaults()`**. They populate **`TrackerConfig`** from the same environment rules as auto-config:

- If you set **direct** provider keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, or AWS Bedrock credentials), those providers are registered.
- If you **only** have **`COST_KATANA_API_KEY`** and **no** direct provider keys, the default is **Cost Katana hosted models** via the gateway: inference can route through the hosted API without embedding vendor keys in your app.

```typescript
import { createCostKatanaTracker, AIProvider } from 'cost-katana';

const tracker = await createCostKatanaTracker();

const custom = await createCostKatanaTracker({
  optimization: { enablePromptOptimization: false },
  providers: [{ provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }],
});

// Same idea: await AICostTracker.createWithDefaults({ ... })
// Short alias: import { tracker as costKatana } from 'cost-katana';
```

Requires **`COST_KATANA_API_KEY`** in the environment (same as `AICostTracker.create()`). **`PROJECT_ID`** remains optional.

### Dedicated per-provider trackers

For a **small `complete()`-style API** on top of `AICostTracker`, use **`createOpenAITracker`**, **`createAnthropicTracker`**, etc.

```typescript
import { createOpenAITracker, OPENAI } from 'cost-katana';

const t = await createOpenAITracker({ model: OPENAI.GPT_4O });
const response = await t.complete({ prompt: 'Explain quantum computing' });

console.log(response.text);
console.log('Total cost (USD):', response.cost.totalCost);
console.log('Response time (ms):', response.responseTime);
```

For **gateway proxying**, **manual `trackUsage`**, or a fully custom **`AICostTracker`**, see [`docs/API.md`](./docs/API.md) and [`examples/`](./examples/).

### View analytics in the dashboard

With tracking enabled, you can inspect:

- **Network performance** — DNS, TCP, total response time
- **Client environment** — User agent, platform, IP geolocation (where collected)
- **Request/response data** — Payloads (sanitized)
- **Optimization opportunities** — Suggestions to reduce cost
- **Performance metrics** — Monitoring and anomaly signals

### Manual usage tracking

```typescript
import { createCostKatanaTracker } from 'cost-katana';

const tracker = await createCostKatanaTracker();

await tracker.trackUsage({
  model: 'gpt-4o',
  provider: 'openai',
  prompt: 'Hello, world!',
  completion: 'Hello! How can I help you today?',
  promptTokens: 3,
  completionTokens: 9,
  totalTokens: 12,
  cost: 0.00036,
  responseTime: 850,
  userId: 'user_123',
  sessionId: 'session_abc',
  tags: ['chat', 'greeting'],
  requestMetadata: {
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    clientIP: await fetch('https://api.ipify.org').then((r) => r.text()),
    feature: 'chat-interface',
  },
});
```

### Session replay and distributed tracing

The **`trace`** submodule provides session graphs, spans, and middleware. See [`src/trace/README.md`](./src/trace/README.md) for exports such as `TraceClient`, `LocalTraceService`, and `createTraceMiddleware`.

---

## Framework integration

### Next.js App Router

```typescript
// app/api/chat/route.ts
import { ai, OPENAI } from 'cost-katana';

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const response = await ai(OPENAI.GPT_4O, prompt);
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
  const response = await ai(OPENAI.GPT_4O, req.body.prompt);
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
  return await ai(OPENAI.GPT_4O, prompt);
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
    return await ai(OPENAI.GPT_4O, body.prompt);
  }
}
```

---

## Error handling

```typescript
import { ai, OPENAI } from 'cost-katana';

try {
  const response = await ai(OPENAI.GPT_4O, 'Hello');
  console.log(response.text);
} catch (error) {
  const err = error as Error & { code?: string; availableModels?: string[] };
  switch (err.code) {
    case 'NO_API_KEY':
      console.log('Set COST_KATANA_API_KEY or a provider API key');
      break;
    case 'RATE_LIMIT':
      console.log('Rate limited. Retry with backoff.');
      break;
    case 'INVALID_MODEL':
      console.log('Model not found. Available:', err.availableModels);
      break;
    default:
      console.log('Error:', err.message);
  }
}
```

Exact **`code`** values depend on the failure path (gateway vs direct provider). Always log **`message`** for support.

---

## AI gateway (details)

The gateway is an **HTTP proxy**: call Cost Katana’s URL with your API key; the service forwards to OpenAI, Anthropic, Google, Cohere, and others, and can attach caching, retries, firewall, and tracking.

- **Quick start:** [Quick start — Path A](#path-a--gateway-http-proxy) (`gateway()` or cURL).
- **`CostKatana-Target-Url`:** Use for non-default upstream URLs (Azure OpenAI, private endpoints). For standard routes (`/v1/chat/completions`, `/v1/messages`, …), **`gateway()`** often uses `inferTargetUrl: true` and omits it.
- **Anthropic on hosted gateway:** `gateway.anthropic(...)` / `/v1/messages` may not require an Anthropic key in your app; the service may use Bedrock when no server `ANTHROPIC_API_KEY` is set (see docs for streaming limitations).
- **Dashboard vs custom tracking:** Gateway traffic reflects **proxied** bodies; `AICostTracker` / `trackUsage` supports **custom** structured logging. For multi-turn and token nuances, see [`examples/GATEWAY_USAGE_AND_TRACKING.md`](./examples/GATEWAY_USAGE_AND_TRACKING.md) and [costkatana-examples `2-gateway`](https://github.com/Hypothesize-Tech/costkatana-examples/tree/main/2-gateway).

---

## Experimentation (hosted API)

The Cost Katana backend ([`costkatana-backend-nest`](https://github.com/Hypothesize-Tech/costkatana-backend-nest)) exposes **experimentation** REST endpoints under **`/api/experimentation`** on the hosted API (same origin as the gateway, e.g. `https://api.costkatana.com`). The dashboard **Experimentation** UI uses these APIs; you can also integrate them directly.

**What it covers**

- **Model comparison** — Run side-by-side comparisons across providers (`POST /api/experimentation/model-comparison`).
- **Real-time comparison** — Start a comparison job (`POST /api/experimentation/real-time-comparison`) and stream progress over **SSE** at `GET /api/experimentation/comparison-progress/:sessionId` (session token validated). Poll or reconnect via `GET /api/experimentation/comparison-job/:sessionId` when authenticated.
- **Catalog** — `GET /api/experimentation/available-models` returns router-registered models (active/inactive) for picking candidates.
- **Cost estimate** — `POST /api/experimentation/estimate-cost` (public) for experiment cost estimates before you run.
- **What-if scenarios** — List/create/analyze/delete scenarios (`/api/experimentation/what-if-scenarios`, `.../:scenarioName/analyze`, lifecycle updates).
- **Real-time simulation** — `POST /api/experimentation/real-time-simulation` (public) for what-if style simulations.
- **History and insights** — `GET /api/experimentation/history`, `GET /api/experimentation/recommendations`, `GET /api/experimentation/fine-tuning-analysis`.
- **Exports** — `GET /api/experimentation/:experimentId/export?format=json|csv` for results.

**Auth**

- Most write/read routes require a **dashboard user JWT** (`JwtAuthGuard`).
- Several routes are marked **public** (estimate cost, available models, real-time simulation, SSE progress with a valid session id). See the controller for the exact list: [`experimentation.controller.ts` in costkatana-backend-nest](https://github.com/Hypothesize-Tech/costkatana-backend-nest/blob/main/src/modules/experimentation/experimentation.controller.ts).

**Server configuration**

- Real model execution for comparisons may require backend flags such as **`ENABLE_REAL_MODEL_COMPARISON=true`** where your deployment enables live API calls to providers.

---

## Examples and documentation

**In this repo**

| Resource | Description |
|----------|-------------|
| [`docs/API.md`](./docs/API.md) | API reference |
| [`docs/EXAMPLES.md`](./docs/EXAMPLES.md) | Examples index |
| [`docs/GATEWAY.md`](./docs/GATEWAY.md) | Gateway |
| [`docs/PROMPT_OPTIMIZATION.md`](./docs/PROMPT_OPTIMIZATION.md) | Prompt optimization |
| [`docs/WEBHOOKS.md`](./docs/WEBHOOKS.md) | Webhooks |
| [`examples/`](./examples/) | Runnable TypeScript examples |

**External examples repo** — 45+ complete examples:

**[github.com/Hypothesize-Tech/costkatana-examples](https://github.com/Hypothesize-Tech/costkatana-examples)**

| Category | Topics |
|----------|--------|
| **Cost tracking** | Budgets, alerts |
| **Gateway** | Routing, load balancing, failover |
| **Optimization** | Cortex, caching, compression |
| **Observability** | OpenTelemetry, tracing, metrics |
| **Security** | Firewall, rate limiting, moderation |
| **Workflows** | Multi-step orchestration |
| **Frameworks** | Express, Next.js, Fastify, NestJS, FastAPI |

---

## Migration guides

### From OpenAI SDK

```typescript
// Before
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: 'sk-...' });
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello' }],
});
console.log(completion.choices[0].message.content);

// After
import { ai, OPENAI } from 'cost-katana';
const response = await ai(OPENAI.GPT_4, 'Hello');
console.log(response.text);
console.log(`Cost: $${response.cost}`);
```

### From Anthropic SDK

```typescript
// Before
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: 'sk-ant-...' });
const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20241022',
  messages: [{ role: 'user', content: 'Hello' }],
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

## Contributing

We welcome contributions. See [Contributing Guide](./CONTRIBUTING.md).

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

## Support

| Channel | Link |
|---------|------|
| **Dashboard** | [costkatana.com](https://costkatana.com) |
| **Documentation** | [docs.costkatana.com](https://docs.costkatana.com) |
| **GitHub** | [github.com/Hypothesize-Tech](https://github.com/Hypothesize-Tech) |
| **Discord** | [discord.gg/D8nDArmKbY](https://discord.gg/D8nDArmKbY) |
| **Email** | support@costkatana.com |

---

## License

MIT © Cost Katana

---

<div align="center">

**Start cutting AI costs today**

```bash
npm install cost-katana
```

```typescript
import { ai, OPENAI } from 'cost-katana';
await ai(OPENAI.GPT_4, 'Hello, world!');
```

</div>
