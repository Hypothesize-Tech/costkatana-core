# Cost Katana Examples

Simple, practical examples showing how to use Cost Katana.

## Running Examples

```bash
# Install dependencies
npm install

# Set your API key (choose one)
export COST_KATANA_API_KEY="dak_your_key"
# OR
export OPENAI_API_KEY="sk-..."

# Run an example
npx ts-node examples/simple-usage.ts
npx ts-node examples/native-sdk-usage.ts    # NEW: Native SDK examples
npx ts-node examples/chat-bot.ts
npx ts-node examples/cost-comparison.ts
```

## Examples

### 1. Simple Usage (`simple-usage.ts`)
Basic examples showing the simplest ways to use Cost Katana.

### 2. Native SDK Usage (`native-sdk-usage.ts`) ⭐ NEW
Complete guide to using OpenAI and Gemini native SDKs with automatic failover.
- Automatic SDK routing based on model name
- Manual provider configuration
- Chat conversations with native SDKs
- Cost comparison across providers
- Automatic failover to AWS Bedrock

### 3. Chat Bot (`chat-bot.ts`)
Build a conversational AI with cost tracking.

### 4. Cost Comparison (`cost-comparison.ts`)
Compare costs across different AI models.

### 5. Framework Integration (`framework-integration.ts`)
Examples for Next.js, Express, and other frameworks.

### 6. Logging & Templates (`logging-templates-example.ts`)
Advanced logging and template management.

## Quick Reference

```typescript
import { ai, chat, configure } from 'cost-katana';

// Simple request
const response = await ai('gpt-4', 'Hello');

// Chat session
const session = chat('gpt-4');
await session.send('Hello');

// Configuration
await configure({
  apiKey: 'dak_your_key',
  cortex: true,
  cache: true
});
```

## Support

- Documentation: https://docs.costkatana.com
- Dashboard: https://costkatana.com
- GitHub: https://github.com/Hypothesize-Tech/costkatana-backend
