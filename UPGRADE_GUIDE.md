# Upgrade Guide: v1.x to v2.0

Welcome to Cost Katana v2.0! This version is a complete simplification that makes using AI as easy as possible.

## What Changed?

### Package Name
```bash
# Old
npm install ai-cost-tracker

# New
npm install cost-katana
```

### API Simplicity
We've reduced the complexity by **90%** while keeping all the power.

## Quick Migration

### 1. Update Package

```bash
# Remove old package
npm uninstall ai-cost-tracker

# Install new package
npm install cost-katana
```

### 2. Update Imports

**Before**:
```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';
```

**After**:
```typescript
import { ai, chat, configure } from 'cost-katana';
```

### 3. Simplify Your Code

#### Simple Request

**Before** (10 lines):
```typescript
const tracker = await AICostTracker.create({
  providers: [{ provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY }],
  optimization: { enablePromptOptimization: true },
  tracking: { enableAutoTracking: true }
});

const response = await tracker.makeRequest({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Hello' }]
});
console.log(response.choices[0].message.content);
```

**After** (2 lines):
```typescript
const response = await ai('gpt-3.5-turbo', 'Hello');
console.log(response.text);
```

#### Chat Session

**Before**:
```typescript
const tracker = await AICostTracker.create({...});
// Complex session management
```

**After**:
```typescript
const session = chat('gpt-4');
await session.send('Hello');
await session.send('How are you?');
console.log(`Total: $${session.totalCost}`);
```

## Feature Parity

All v1.x features are still available!

### Gateway (Caching, Retries, etc.)

**v1.x**:
```typescript
const tracker = await AICostTracker.create({...});
const gateway = tracker.initializeGateway({...});
const response = await tracker.gatewayOpenAI({...}, {...});
```

**v2.0**:
```typescript
const response = await ai('gpt-4', 'Hello', { 
  cache: true,
  cortex: true 
});
```

### Cortex Optimization

**v1.x**:
```typescript
const gateway = tracker.initializeGateway({...});
const response = await gateway.openai({...}, {
  cortex: { enabled: true, operation: 'optimize' }
});
```

**v2.0**:
```typescript
const response = await ai('gpt-4', 'Hello', { cortex: true });
```

### Configuration

**v1.x**:
```typescript
const tracker = await AICostTracker.create({
  providers: [...],
  optimization: {...},
  tracking: {...},
  alerts: {...}
});
```

**v2.0**:
```typescript
await configure({
  apiKey: 'dak_your_key',
  cortex: true,
  cache: true,
  firewall: true
});
```

## Advanced Features

Need the full API? Import from `/advanced`:

```typescript
import AICostTracker from 'cost-katana/advanced';

const tracker = await AICostTracker.create({
  // Full v1.x API available
});
```

## Environment Variables

More flexible in v2.0!

**v1.x** (Required exactly these names):
```bash
API_KEY=dak_...
PROJECT_ID=proj_...
OPENAI_API_KEY=sk-...
```

**v2.0** (Accepts multiple variations):
```bash
# Any of these work for Cost Katana
COST_KATANA_API_KEY=dak_...
COST_KATANA_API_KEY=dak_...
API_KEY=dak_...
COSTKATANA_KEY=dak_...

# Provider keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
# etc.
```

## Examples

### Before & After: Customer Support Bot

**v1.x** (30+ lines):
```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';

const tracker = await AICostTracker.create({
  providers: [
    { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY }
  ],
  optimization: {
    enablePromptOptimization: true,
    enableModelSuggestions: true,
    enableCachingSuggestions: true,
    thresholds: {
      highCostPerRequest: 0.01,
      highTokenUsage: 1000,
      frequencyThreshold: 10
    }
  },
  tracking: { enableAutoTracking: true }
});

async function handleQuery(userQuery: string) {
  const response = await tracker.makeRequest({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a support agent' },
      { role: 'user', content: userQuery }
    ],
    temperature: 0.7,
    maxTokens: 500
  });
  
  return response.choices[0].message.content;
}
```

**v2.0** (5 lines):
```typescript
import { chat } from 'cost-katana';

const support = chat('gpt-3.5-turbo', {
  systemMessage: 'You are a support agent'
});

async function handleQuery(userQuery: string) {
  return await support.send(userQuery);
}
```

### Before & After: Model Comparison

**v1.x**:
```typescript
// ~50 lines of setup and comparison logic
```

**v2.0**:
```typescript
import { ai } from 'cost-katana';

const models = ['gpt-4', 'claude-3-sonnet', 'gemini-pro'];
for (const model of models) {
  const response = await ai(model, 'Test prompt');
  console.log(`${model}: $${response.cost}`);
}
```

## Troubleshooting

### "Module not found: cost-katana"
```bash
npm uninstall ai-cost-tracker
npm install cost-katana
```

### "API_KEY not found"
v2.0 accepts multiple names:
```bash
export COST_KATANA_API_KEY="dak_..."
# OR
export OPENAI_API_KEY="sk-..."
```

### "Cannot find module 'cost-katana/advanced'"
This will be available in the published package. For now, use:
```typescript
import AICostTracker from 'cost-katana';
```

### Need help?
- Documentation: https://docs.costkatana.com
- Discord: https://discord.gg/Wcwzw8wM
- Email: support@costkatana.com

## Why Upgrade?

### Developer Experience
- **90% less code** for common use cases
- **Zero configuration** to get started
- **Better error messages** with solutions
- **Auto-detection** of API keys

### Performance
- **Faster initialization** (no complex setup)
- **Smarter defaults** (caching, optimization)
- **Better caching** (automatic)

### Maintenance
- **Simpler API** = fewer bugs
- **Better documentation** = faster onboarding
- **More examples** = easier learning

## Feedback

We'd love to hear about your upgrade experience!
- GitHub: https://github.com/cost-katana/core/issues
- Discord: https://discord.gg/Wcwzw8wM

Thank you for using Cost Katana! 🥷
