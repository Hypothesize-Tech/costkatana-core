# Cost Katana Examples

Simple, practical examples showing how to use Cost Katana.

## Running Examples

```bash
# Install dependencies
npm install

# Set your API key (choose one)
export COST_KATANA_KEY="dak_your_key"
# OR
export OPENAI_API_KEY="sk-..."

# Run an example
npx ts-node examples/simple-usage.ts
npx ts-node examples/chat-bot.ts
npx ts-node examples/cost-comparison.ts
```

## Examples

### 1. Simple Usage (`simple-usage.ts`)
Basic examples showing the simplest ways to use Cost Katana.

### 2. Chat Bot (`chat-bot.ts`)
Build a conversational AI with cost tracking.

### 3. Cost Comparison (`cost-comparison.ts`)
Compare costs across different AI models.

### 4. Framework Integration (`framework-integration.ts`)
Examples for Next.js, Express, and other frameworks.

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
