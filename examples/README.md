# Cost Katana Examples

Simple, practical examples showing how to use Cost Katana with comprehensive tracking and analytics.

## Running Examples

```bash
# Install dependencies
npm install

# Set your API key (choose one)
export COST_KATANA_API_KEY="dak_your_key"
# OR
export OPENAI_API_KEY="sk-..."

# Optional: Set your tracking endpoint (defaults to localhost:3000)
export COST_KATANA_TRACKING_URL="https://api.costkatana.com/usage/track-comprehensive"

# Run an example
npx ts-node examples/simple-usage.ts
npx ts-node examples/comprehensive-tracking-demo.ts    # ⭐ NEW: Full tracking demo
npx ts-node examples/native-sdk-usage.ts
npx ts-node examples/chat-bot.ts
npx ts-node examples/cost-comparison.ts
```

## Examples

### 1. Simple Usage (`simple-usage.ts`)
Basic examples showing the simplest ways to use Cost Katana.

### 2. Comprehensive Tracking Demo (`comprehensive-tracking-demo.ts`) ⭐ NEW
**Complete demonstration of the new comprehensive tracking features:**

- ✅ **Real-time Performance Monitoring**: Network metrics, response times, client environment
- ✅ **User Context Tracking**: Personalized analytics with user profiles (demo: abdultrivial@gmail.com)
- ✅ **Multi-Model Comparison**: Cost and performance analysis across providers
- ✅ **Session Analytics**: Conversation tracking with detailed insights
- ✅ **Optimization Suggestions**: AI-powered cost reduction recommendations
- ✅ **Backend Integration**: Automatic data sync with your dashboard

**Features demonstrated:**
```typescript
// Enable comprehensive tracking
const tracker = new AICostTracker({
  comprehensiveTracking: true,
  sessionReplay: true,
  performanceMonitoring: true,
  user: { id: 'user_123', email: 'user@example.com' }
});

// Automatic tracking of all requests
const response = await tracker.chat('gpt-4', 'Your prompt');
// Data automatically sent to dashboard with:
// - Network performance metrics
// - Client environment details  
// - Optimization opportunities
// - Usage analytics
```

### 3. Native SDK Usage (`native-sdk-usage.ts`)
Complete guide to using OpenAI and Gemini native SDKs with automatic failover.
- Automatic SDK routing based on model name
- Manual provider configuration
- Chat conversations with native SDKs
- Cost comparison across providers
- Automatic failover to AWS Bedrock

### 4. Chat Bot (`chat-bot.ts`)
Build a conversational AI with cost tracking.

### 5. Cost Comparison (`cost-comparison.ts`)
Compare costs across different AI models.

### 6. Framework Integration (`framework-integration.ts`)
Examples for Next.js, Express, and other frameworks.

### 7. Logging & Templates (`logging-templates-example.ts`)
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
