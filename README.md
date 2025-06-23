# AI Cost Tracker 🚀💰

> Track, analyze, and optimize your AI API costs across multiple providers with intelligent insights powered by AWS Bedrock.

[![npm version](https://img.shields.io/npm/v/ai-cost-tracker.svg)](https://www.npmjs.com/package/ai-cost-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🌟 Features

- **Multi-Provider Support**: Track costs across OpenAI, AWS Bedrock, Anthropic, Google, and Cohere
- **Real-time Cost Estimation**: Calculate costs before making API calls
- **Automatic Usage Tracking**: Seamlessly track all API requests and responses
- **AI-Powered Optimization**: Get intelligent suggestions to reduce costs using AWS Bedrock
- **Prompt Optimization**: Automatically optimize prompts to reduce token usage
- **Usage Analytics**: Comprehensive analytics and insights about your AI usage
- **Multiple Storage Options**: Memory, file, or custom storage implementations
- **Cost Alerts**: Set thresholds and get notified when costs exceed limits
- **Export & Reporting**: Export data in JSON/CSV formats with detailed reports

## 📦 Installation

```bash
npm install ai-cost-tracker
```

or

```bash
yarn add ai-cost-tracker
```

## 🚀 Quick Start

```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';

// Initialize the tracker
const tracker = new AICostTracker({
  providers: [
    {
      provider: AIProvider.OpenAI,
      apiKey: process.env.OPENAI_API_KEY
    },
    {
      provider: AIProvider.AWSBedrock,
      region: 'us-east-1'
    }
  ],
  tracking: {
    enableAutoTracking: true,
    storageType: 'memory'
  }
});

// Estimate cost before making a request
const estimate = await tracker.estimateCost(
  "Explain quantum computing",
  "gpt-3.5-turbo",
  AIProvider.OpenAI,
  150 // expected completion tokens
);
console.log(`Estimated cost: $${estimate.totalCost.toFixed(4)}`);

// Make a tracked request
const response = await tracker.makeRequest({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'user', content: 'Explain quantum computing' }
  ],
  maxTokens: 150
}, 'user123');

// Get analytics
const analytics = await tracker.getAnalytics();
console.log(`Total cost: $${analytics.totalCost.toFixed(2)}`);
```

## 🔧 Configuration

### Basic Configuration

```typescript
const config = {
  providers: [
    {
      provider: AIProvider.OpenAI,
      apiKey: 'your-api-key',
      customPricing: {
        'gpt-4': {
          promptPrice: 0.03,
          completionPrice: 0.06,
          unit: 'per-1k-tokens'
        }
      }
    }
  ],
  optimization: {
    enablePromptOptimization: true,
    enableModelSuggestions: true,
    enableCachingSuggestions: true,
    bedrockConfig: {
      region: 'us-east-1',
      modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0'
    }
  },
  tracking: {
    enableAutoTracking: true,
    storageType: 'file',
    retentionDays: 30
  },
  alerts: {
    costThreshold: 100, // $100 per day
    tokenThreshold: 1000000, // 1M tokens per day
    webhookUrl: 'https://your-webhook.com/alerts'
  }
};
```

### Storage Options

#### Memory Storage (Default)
```typescript
tracking: {
  storageType: 'memory'
}
```

#### File Storage
```typescript
tracking: {
  storageType: 'file'
}
```

#### Custom Storage
```typescript
tracking: {
  storageType: 'custom',
  customStorage: {
    save: async (data) => { /* your implementation */ },
    load: async (filter) => { /* your implementation */ },
    clear: async () => { /* your implementation */ }
  }
}
```

## 📊 Analytics & Reporting

### Get Usage Analytics

```typescript
const analytics = await tracker.getAnalytics(
  startDate,
  endDate,
  userId
);

console.log(analytics);
// {
//   totalCost: 45.23,
//   totalTokens: 1234567,
//   averageTokensPerRequest: 543,
//   mostUsedModels: [...],
//   costByProvider: [...],
//   usageOverTime: [...],
//   topExpensivePrompts: [...]
// }
```

### Generate Optimization Report

```typescript
const report = await tracker.generateReport();
console.log(report);
// Markdown report with optimization suggestions
```

### Export Data

```typescript
// Export as JSON
const jsonData = await tracker.exportData('json');

// Export as CSV
const csvData = await tracker.exportData('csv');
```

## 🧠 AI-Powered Optimization

### Optimize Prompts

```typescript
const suggestions = await tracker.optimizePrompt(
  "Your verbose prompt here...",
  "gpt-3.5-turbo",
  AIProvider.OpenAI
);

suggestions.forEach(suggestion => {
  console.log(`${suggestion.explanation}`);
  console.log(`Potential savings: ${suggestion.estimatedSavings}%`);
  if (suggestion.optimizedPrompt) {
    console.log(`Optimized: ${suggestion.optimizedPrompt}`);
  }
});
```

### Get Optimization Suggestions

```typescript
const suggestions = await tracker.getOptimizationSuggestions();

// Suggestions include:
// - Prompt optimization
// - Model downgrade recommendations
// - Batching opportunities
// - Caching suggestions
```

## 📈 Supported Models & Pricing

### OpenAI Models
- GPT-4, GPT-4 Turbo
- GPT-3.5 Turbo
- Custom GPT-4.5, GPT-4.1

### AWS Bedrock Models
- Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- Amazon Titan Text
- Llama 3 (8B, 70B)
- Command R, Command R+

### Other Providers
- Google: Gemini 1.5 Pro, Gemini 1.5 Flash
- Anthropic: Claude models (direct API)
- Cohere: Command models

## 🛠️ Advanced Features

### Batch Processing

```typescript
const prompts = ["Question 1", "Question 2", "Question 3"];
const batchingSuggestion = await optimizer.suggestBatching(
  prompts,
  "gpt-3.5-turbo",
  AIProvider.OpenAI
);
```

### Token Counting

```typescript
import { TokenCounter } from 'ai-cost-tracker';

const tokens = await TokenCounter.countTokens(
  "Your text here",
  AIProvider.OpenAI,
  "gpt-3.5-turbo"
);
```

### Cost Comparison

```typescript
import { compareCosts, MODELS } from 'ai-cost-tracker';

const comparison = compareCosts(
  100, // prompt tokens
  200, // completion tokens
  [MODELS['gpt-4'], MODELS['gpt-3.5-turbo'], MODELS['claude-3-haiku']]
);
```

## 🔒 Security & Privacy

- API keys are never logged or transmitted
- Local storage options for sensitive data
- Configurable data retention policies
- Support for custom storage implementations

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name]

## 🙏 Acknowledgments

- Built with TypeScript
- Powered by AWS Bedrock for AI optimization
- Inspired by the need for better AI cost management

## 📞 Support

- [Documentation](https://github.com/yourusername/ai-cost-tracker/wiki)
- [Issues](https://github.com/yourusername/ai-cost-tracker/issues)
- [Discussions](https://github.com/yourusername/ai-cost-tracker/discussions)# ai-cost-optimizer-core
