# Cost Katana API Reference

## Simple API (Recommended)

### `ai()` Function

The simplest way to make AI requests with automatic cost tracking.

```typescript
import { ai } from 'cost-katana';

const response = await ai(model, prompt, options?);
```

**Parameters:**
- `model` (string): AI model name (e.g., 'gpt-4', 'claude-3-sonnet')
- `prompt` (string): Your prompt text
- `options` (object, optional):
  - `systemMessage` (string): System prompt
  - `temperature` (number): 0-2, default 0.7
  - `maxTokens` (number): Max response tokens, default 1000
  - `cache` (boolean): Enable caching, default false
  - `cortex` (boolean): Enable 40-75% optimization, default false

**Returns:**
```typescript
{
  text: string;           // AI response
  cost: number;           // Cost in USD
  tokens: number;         // Total tokens used
  model: string;          // Model used
  provider: string;       // Provider name
  cached?: boolean;       // Whether response was cached
  optimized?: boolean;    // Whether Cortex was used
}
```

**Example:**
```typescript
const response = await ai('gpt-4', 'Explain quantum computing', {
  temperature: 0.7,
  maxTokens: 500,
  cache: true,
  cortex: true
});

console.log(response.text);
console.log(`Cost: $${response.cost}`);
```

---

### `chat()` Function

Create a chat session with conversation history and cost tracking.

```typescript
import { chat } from 'cost-katana';

const session = chat(model, options?);
```

**Parameters:**
- `model` (string): AI model name
- `options` (object, optional):
  - `systemMessage` (string): System prompt for the session
  - `temperature` (number): 0-2, default 0.7
  - `maxTokens` (number): Max tokens per response

**Returns:** Session object with methods:
- `send(message: string)`: Send a message and get response
- `messages`: Array of all messages in the conversation
- `totalCost`: Total cost of the session
- `totalTokens`: Total tokens used in the session
- `clear()`: Reset the conversation

**Example:**
```typescript
const session = chat('gpt-4', {
  systemMessage: 'You are a helpful coding assistant.'
});

await session.send('Hello!');
await session.send('Help me with Python');
await session.send('Show me an example');

console.log(`Total cost: $${session.totalCost}`);
console.log(`Messages: ${session.messages.length}`);
```

---

### `configure()` Function

Optional manual configuration.

```typescript
import { configure } from 'cost-katana';

await configure(options);
```

**Parameters:**
- `apiKey` (string): Cost Katana API key
- `projectId` (string): Project ID
- `cortex` (boolean): Enable Cortex optimization globally
- `cache` (boolean): Enable caching globally
- `firewall` (boolean): Enable security firewall
- `providers` (array): Provider configurations
  - `name` (string): Provider name ('openai', 'anthropic', etc.)
  - `apiKey` (string): Provider API key

**Example:**
```typescript
await configure({
  apiKey: 'dak_your_key',
  projectId: 'your_project',
  cortex: true,
  cache: true,
  firewall: true,
  providers: [
    { name: 'openai', apiKey: 'sk-...' },
    { name: 'anthropic', apiKey: 'sk-ant-...' }
  ]
});
```

---

## Environment Variables

Cost Katana auto-detects configuration from environment variables:

### Cost Katana Credentials
```bash
# Any of these work:
COST_KATANA_API_KEY=dak_your_key
COST_KATANA_API_KEY=dak_your_key
API_KEY=dak_your_key
COSTKATANA_KEY=dak_your_key

# Project ID
COST_KATANA_PROJECT=your_project
PROJECT_ID=your_project
COSTKATANA_PROJECT_ID=your_project
```

### Provider API Keys
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
```

### Gateway Configuration
```bash
COSTKATANA_GATEWAY_URL=https://cost-katana-backend.store/api/gateway
GATEWAY_URL=...
```

---

## Supported Models

### OpenAI
- `gpt-4`, `gpt-4-turbo`, `gpt-4o`, `gpt-4o-mini`
- `gpt-3.5-turbo`, `gpt-3.5-turbo-16k`

### Anthropic
- `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
- `claude-3-5-sonnet`

### Google
- `gemini-pro`, `gemini-ultra`, `gemini-flash`
- `gemini-2.0-flash`, `gemini-2.5-pro`

### AWS Bedrock
- `nova-pro`, `nova-lite`, `nova-micro`
- Any Bedrock model ID

### Others
- Cohere, Grok, DeepSeek, Mistral, xAI (Grok)

---

## Error Handling

```typescript
import { ai } from 'cost-katana';

try {
  const response = await ai('gpt-4', 'Hello');
} catch (error) {
  // Error includes helpful troubleshooting steps
  console.error(error.message);
  
  // Error codes:
  // - NO_API_KEY: No API keys configured
  // - INVALID_MODEL: Model not found
  // - RATE_LIMIT: Rate limit exceeded
  // - BUDGET_EXCEEDED: Budget limit reached
  // - NETWORK_ERROR: Connection failed
}
```

---

## Advanced API (For Power Users)

If you need full control, the complete API is still available:

```typescript
import AICostTracker, { AIProvider } from 'cost-katana';

const tracker = await AICostTracker.create({
  providers: [
    { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY }
  ],
  optimization: {
    enablePromptOptimization: true,
    enableModelSuggestions: true,
    enableCachingSuggestions: true
  },
  tracking: { enableAutoTracking: true }
});

// Full API methods available
const response = await tracker.makeRequest({...});
const analytics = await tracker.getAnalytics();
const suggestions = await tracker.getOptimizationSuggestions();
```

See [Advanced API Documentation](./ADVANCED_API.md) for details.

---

## Common Patterns

### Cost Comparison
```typescript
const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-haiku'];
for (const model of models) {
  const response = await ai(model, 'Test prompt');
  console.log(`${model}: $${response.cost}`);
}
```

### Caching for Repeated Queries
```typescript
// First call - costs money
const r1 = await ai('gpt-4', 'FAQ question', { cache: true });

// Second call - free from cache
const r2 = await ai('gpt-4', 'FAQ question', { cache: true });
```

### Cortex Optimization
```typescript
// 40-75% cost reduction on long content
const response = await ai('gpt-4', 'Write a comprehensive guide', {
  cortex: true,
  maxTokens: 2000
});
```

### Multi-turn Conversation
```typescript
const session = chat('gpt-4');
const response1 = await session.send('What is AI?');
const response2 = await session.send('Tell me more');
console.log(`Total: $${session.totalCost}`);
```

---

## Support

- **Documentation**: https://docs.costkatana.com
- **Dashboard**: https://costkatana.com
- **GitHub**: https://github.com/Hypothesize-Tech/costkatana-core
- **Discord**: https://discord.gg/D8nDArmKbY
- **Email**: support@costkatana.com