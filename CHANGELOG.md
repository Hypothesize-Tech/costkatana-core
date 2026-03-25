# Changelog

All notable changes to Cost Katana will be documented in this file.

## [Unreleased]

### Changed

- **Trace client** (`src/trace/client.ts`): request paths use `/api/sessions`, `/api/sessions/summary`, `/api/traces/ingest`, etc., matching the NestJS API (no `/api/v1` prefix).
- **Feedback client** (`src/feedback/client.ts`): paths use `/api/request-feedback/...` on the configured API base (default `https://api.costkatana.com/api`).

## [2.4.0] - 2025-03-25

### Added

- **`gateway()`**: alias for `createGatewayClientFromEnv()` for minimal gateway setup in docs and examples.
- **Default tracker setup**: `createDefaultTrackerConfig()`, `detectProvidersFromEnv()`, **`createCostKatanaTracker()`**, **`tracker()`** (alias), and **`AICostTracker.createWithDefaults()`** — env-based providers + package defaults with optional partial `TrackerConfig` overrides.
- **Hosted models default**: `COST_KATANA_HOSTED_MODELS_PROXY_KEY`, **`costKatanaHostedModelsProviderEntry()`**, **`hasCostKatanaApiKeyInEnv()`**, **`hasDirectProviderApiKeysInEnv()`** — when there are **no** direct provider API keys, defaults target **Cost Katana hosted models** through the gateway (`costkatana-backend-nest`); document this explicitly (same `proxy` provider slot as before).

### Changed

- **`PROJECT_ID`** is optional for `AICostTracker.create()` and for `ai()` auto-configuration. When omitted, a warning is logged; usage is still authenticated with `COST_KATANA_API_KEY`.
- Auto-configure (`ai()` path): full Cost Katana mode runs when **`COST_KATANA_API_KEY`** is set, even if **`PROJECT_ID`** is missing (previously fell through to limited provider-only mode). Full-mode tracker config now uses **`createDefaultTrackerConfig()`** (same defaults as `createCostKatanaTracker()`).

## [2.2.0] - 2025-01-31

### Changed

- **Tracking is always on**: Usage and cost tracking can no longer be disabled. There is no `enableAutoTracking`, `autoTrack`, or any configuration to turn tracking off. This ensures usage and token/cost attribution are never lost.
- Removed `enableAutoTracking` from `TrackingConfig` (core and gateway).
- Removed `autoTrack` from gateway config and request options; backend always tracks gateway requests.
- `TrackingConfig` now only supports optional `retentionDays`; tracking itself is always enabled.

### Migration

- If you previously passed `tracking: { enableAutoTracking: false }` or `autoTrack: false`, remove those options; tracking is always on and the options are ignored/removed.

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
  tracking: {}
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