# Changelog

All notable changes to Cost Katana will be documented in this file.

## [2.0.0] - 2025-01-XX

### 🚀 Major Release: Complete Simplification

This is a **major breaking release** that completely redesigns Cost Katana to be the simplest AI SDK available.

### ✨ New Features

#### Ultra-Simple API
- **`ai()` function**: Just `await ai('gpt-4', 'Hello')` - that's it!
- **`chat()` function**: Multi-turn conversations with automatic cost tracking
- **`configure()` function**: Optional one-time configuration

#### Auto-Configuration
- Automatically detects API keys from multiple environment variable names
- Works with Cost Katana keys OR direct provider keys
- Intelligent provider detection from model names
- Zero setup required if env vars are set

#### Smart Defaults
- Automatic cost tracking by default
- Intelligent caching enabled
- Auto-failover to alternative providers
- Smart error messages with actionable steps

### 💥 Breaking Changes

#### Package Name
- **Old**: `ai-cost-tracker`
- **New**: `cost-katana`

**Migration**: Uninstall the old package and install the new one:
```bash
npm uninstall ai-cost-tracker
npm install cost-katana
```

#### API Changes
**Before (v1.x - Complex)**:
```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';

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

const response = await tracker.makeRequest({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Hello' }],
  maxTokens: 150
});
```

**After (v2.0 - Simple)**:
```typescript
import { ai } from 'cost-katana';

const response = await ai('gpt-3.5-turbo', 'Hello');
console.log(response.text);
console.log(`Cost: $${response.cost}`);
```

### 📚 Documentation

- **Completely rewritten README**: Focus on simplicity and quick wins
- **New examples**: Real-world use cases with simple API
- **Migration guide**: Help existing users upgrade
- **Framework integration**: Examples for Next.js, Express, etc.

### 🗑️ Removed

- Old complex examples (20+ files removed)
- Verbose configuration patterns
- Unnecessary abstraction layers

### 🎯 What Stays

All advanced features are still available for power users:
- Gateway functionality
- Cortex optimization
- Distributed tracing
- Firewall protection
- Proxy keys
- Failover
- Feedback tracking

**Access via**:
```typescript
import AICostTracker from 'cost-katana/advanced';
```

### 📦 Examples

New streamlined examples:
- `simple-usage.ts` - Basic patterns
- `chat-bot.ts` - Interactive conversations
- `cost-comparison.ts` - Compare models
- `framework-integration.ts` - Framework examples

### 🐛 Bug Fixes

- Fixed CortexConfig type compatibility
- Improved error messages
- Better environment variable detection

---

## [1.5.12] - 2024-XX-XX

### Added
- User feedback and value tracking
- Flexible authentication methods
- Enhanced failover capabilities

### Fixed
- Token calculation accuracy
- Cache hit rate improvements

---

## [1.5.0] - 2024-XX-XX

### Added
- Cortex meta-language support
- AI Gateway with caching
- Distributed tracing
- Prompt firewall

---

## [1.0.0] - 2024-XX-XX

### Initial Release
- Multi-provider support
- Cost tracking
- Basic optimization
- Usage analytics