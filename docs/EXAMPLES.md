# AI Cost Tracker Examples

This document provides comprehensive examples for using the AI Cost Tracker NPM package.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Cost Estimation](#cost-estimation)
3. [Making Tracked Requests](#making-tracked-requests)
4. [Manual Usage Tracking](#manual-usage-tracking)
5. [Analytics and Reporting](#analytics-and-reporting)
6. [Prompt Optimization](#prompt-optimization)
7. [Storage Options](#storage-options)
8. [Alert Configuration](#alert-configuration)
9. [Batch Processing](#batch-processing)
10. [Advanced Scenarios](#advanced-scenarios)

## Basic Setup

### Simple Configuration

```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';

const tracker = new AICostTracker({
  providers: [
    {
      provider: AIProvider.OpenAI,
      apiKey: process.env.OPENAI_API_KEY
    }
  ],
  tracking: {
    enableAutoTracking: true,
    storageType: 'memory'
  }
});
```

### Multi-Provider Configuration

```typescript
const tracker = new AICostTracker({
  providers: [
    {
      provider: AIProvider.OpenAI,
      apiKey: process.env.OPENAI_API_KEY,
      customPricing: {
        'gpt-4': {
          promptPrice: 0.03,
          completionPrice: 0.06,
          unit: 'per-1k-tokens'
        }
      }
    },
    {
      provider: AIProvider.AWSBedrock,
      region: 'us-east-1'
      // Uses AWS credentials from environment or IAM role
    },
    {
      provider: AIProvider.Anthropic,
      apiKey: process.env.ANTHROPIC_API_KEY
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
    retentionDays: 90
  },
  alerts: {
    costThreshold: 100,
    tokenThreshold: 1000000,
    emailNotifications: true
  }
});
```

## Cost Estimation

### Basic Cost Estimation

```typescript
// Estimate cost for a simple prompt
const estimate = await tracker.estimateCost(
  'What is the capital of France?',
  'gpt-3.5-turbo',
  AIProvider.OpenAI,
  20 // expected completion tokens
);

console.log(`Estimated cost: $${estimate.totalCost.toFixed(4)}`);
console.log(`Breakdown:`, estimate.breakdown);
```

### Comparing Model Costs

```typescript
import { compareCosts, MODELS } from 'ai-cost-tracker';

const prompt = 'Write a detailed analysis of climate change impacts';
const promptTokens = 15;
const completionTokens = 500;

const models = [
  MODELS['gpt-4'],
  MODELS['gpt-3.5-turbo'],
  MODELS['anthropic.claude-3-5-sonnet-20240620-v1:0'],
  MODELS['anthropic.claude-3-haiku-20240307-v1:0']
];

const comparison = compareCosts(promptTokens, completionTokens, models);

comparison.forEach(result => {
  console.log(
    `${result.model}: $${result.cost.totalCost.toFixed(4)} (${result.savingsVsHighest.toFixed(1)}% savings)`
  );
});
```

### Monthly Cost Projection

```typescript
import { estimateMonthlyCost, MODELS } from 'ai-cost-tracker';

const projection = estimateMonthlyCost(
  100, // daily requests
  200, // avg prompt tokens
  300, // avg completion tokens
  MODELS['gpt-3.5-turbo']
);

console.log('Cost Projections:');
console.log(`Daily: $${projection.daily.toFixed(2)}`);
console.log(`Weekly: $${projection.weekly.toFixed(2)}`);
console.log(`Monthly: $${projection.monthly.toFixed(2)}`);
console.log(`Yearly: $${projection.yearly.toFixed(2)}`);
```

## Making Tracked Requests

### OpenAI Chat Completion

```typescript
const response = await tracker.makeRequest(
  {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Explain quantum computing in simple terms' }
    ],
    maxTokens: 150,
    temperature: 0.7,
    metadata: {
      tags: ['education', 'physics'],
      sessionId: 'session-123'
    }
  },
  'user-456'
);

console.log('Response:', response.choices[0].message.content);
```

### AWS Bedrock Request

```typescript
const response = await tracker.makeRequest(
  {
    model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    prompt: 'Write a haiku about programming',
    maxTokens: 100,
    temperature: 0.8,
    stopSequences: ['\n\n']
  },
  'user-789'
);

console.log('Haiku:', response.choices[0].text);
```

### Streaming Requests (if supported)

```typescript
const response = await tracker.makeRequest(
  {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    maxTokens: 500,
    stream: true,
    metadata: {
      streamProcessing: true
    }
  },
  'user-123'
);

// Handle streaming response
for await (const chunk of response) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

## Manual Usage Tracking

### Track Existing API Calls

```typescript
// If you're already using OpenAI SDK directly
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Make your API call
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
});

// Track the usage
await tracker.trackUsage({
  userId: 'user-123',
  timestamp: new Date(),
  provider: AIProvider.OpenAI,
  model: 'gpt-4',
  promptTokens: completion.usage.prompt_tokens,
  completionTokens: completion.usage.completion_tokens,
  totalTokens: completion.usage.total_tokens,
  estimatedCost: 0.0, // Will be calculated automatically
  prompt: 'Hello!',
  completion: completion.choices[0].message.content,
  duration: 1500, // milliseconds
  tags: ['greeting'],
  sessionId: 'session-456'
});
```

### Batch Tracking

```typescript
const usageDataBatch = [
  {
    userId: 'user-1',
    timestamp: new Date(),
    provider: AIProvider.OpenAI,
    model: 'gpt-3.5-turbo',
    promptTokens: 50,
    completionTokens: 100,
    totalTokens: 150,
    estimatedCost: 0.0003,
    prompt: 'Task 1',
    duration: 1000
  }
  // ... more usage data
];

for (const usage of usageDataBatch) {
  await tracker.trackUsage(usage);
}
```

## Analytics and Reporting

### Basic Analytics

```typescript
// Get analytics for the last 7 days
const analytics = await tracker.getAnalytics(
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  new Date()
);

console.log('7-Day Analytics:');
console.log(`Total Cost: $${analytics.totalCost.toFixed(2)}`);
console.log(`Total Tokens: ${analytics.totalTokens.toLocaleString()}`);
console.log(`Average Tokens/Request: ${analytics.averageTokensPerRequest.toFixed(0)}`);

console.log('\nMost Used Models:');
analytics.mostUsedModels.forEach(model => {
  console.log(`- ${model.model}: ${model.requestCount} requests ($${model.totalCost.toFixed(2)})`);
});

console.log('\nCost by Provider:');
analytics.costByProvider.forEach(provider => {
  console.log(
    `- ${provider.provider}: $${provider.totalCost.toFixed(2)} (${provider.percentage.toFixed(1)}%)`
  );
});
```

### User-Specific Analytics

```typescript
const userAnalytics = await tracker.getAnalytics(
  undefined, // all time
  undefined,
  'user-123'
);

const userStats = await tracker.getUserStats('user-123');

console.log('User Statistics:');
console.log(`Total Requests: ${userStats.totalRequests}`);
console.log(`Total Cost: $${userStats.totalCost.toFixed(2)}`);
console.log(`Average Cost/Request: $${userStats.averageCostPerRequest.toFixed(4)}`);
console.log(`Last Active: ${userStats.lastUsed?.toLocaleDateString()}`);
```

### Model Performance Analysis

```typescript
const modelStats = await tracker.getModelStats('gpt-4');

console.log('GPT-4 Statistics:');
console.log(`Total Requests: ${modelStats.totalRequests}`);
console.log(`Total Cost: $${modelStats.totalCost.toFixed(2)}`);
console.log(`Unique Users: ${modelStats.uniqueUsers}`);
console.log(`Average Response Time: ${modelStats.averageResponseTime.toFixed(0)}ms`);
```

### Generating Reports

```typescript
// Generate a comprehensive markdown report
const report = await tracker.generateReport(
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
  new Date(),
  'user-123'
);

// Save to file
import fs from 'fs';
fs.writeFileSync('monthly-report.md', report);
```

## Prompt Optimization

### Basic Prompt Optimization

```typescript
const verbosePrompt = `
  I would really appreciate it if you could help me understand 
  what machine learning is. I'm just a beginner and I'm pretty 
  confused about all the different concepts.
`;

const suggestions = await tracker.optimizePrompt(verbosePrompt, 'gpt-3.5-turbo', AIProvider.OpenAI);

suggestions.forEach(suggestion => {
  console.log('\nOptimization Suggestion:');
  console.log(`Type: ${suggestion.type}`);
  console.log(`Confidence: ${(suggestion.confidence * 100).toFixed(0)}%`);
  console.log(`Estimated Savings: ${suggestion.estimatedSavings.toFixed(1)}%`);
  console.log(`Explanation: ${suggestion.explanation}`);

  if (suggestion.optimizedPrompt) {
    console.log(`Optimized: "${suggestion.optimizedPrompt}"`);
  }
});
```

### Context-Aware Optimization

```typescript
const optimizations = await tracker.optimizePrompt(
  'Generate a comprehensive report about AI trends',
  'gpt-4',
  AIProvider.OpenAI,
  {
    previousPrompts: ['What are the latest AI developments?', 'Explain transformer architecture'],
    expectedOutput: 'markdown',
    constraints: ['max 1000 words', 'include statistics']
  }
);
```

### Batch Optimization

```typescript
import { PromptOptimizer } from 'ai-cost-tracker';

const optimizer = new PromptOptimizer({
  region: 'us-east-1',
  modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0'
});

const prompts = [
  'What is the weather today?',
  "What's the current temperature?",
  'Is it raining right now?',
  'Should I bring an umbrella?'
];

const batchSuggestion = await optimizer.suggestBatching(
  prompts,
  'gpt-3.5-turbo',
  AIProvider.OpenAI
);

console.log(
  `Batching ${prompts.length} requests could save ${batchSuggestion.estimatedSavings.toFixed(1)}%`
);
```

## Storage Options

### Memory Storage (Default)

```typescript
const tracker = new AICostTracker({
  providers: [
    /* ... */
  ],
  tracking: {
    enableAutoTracking: true,
    storageType: 'memory'
  }
});
```

### File Storage

```typescript
const tracker = new AICostTracker({
  providers: [
    /* ... */
  ],
  tracking: {
    enableAutoTracking: true,
    storageType: 'file',
    retentionDays: 90 // Keep data for 90 days
  }
});
```

### Custom MongoDB Storage

```typescript
import { CustomStorage, UsageMetadata } from 'ai-cost-tracker';
import { MongoClient, Db, Collection } from 'mongodb';

class MongoDBStorage implements CustomStorage {
  private db: Db;
  private collection: Collection<UsageMetadata>;

  constructor(connectionString: string) {
    const client = new MongoClient(connectionString);
    this.db = client.db('ai-cost-tracker');
    this.collection = this.db.collection<UsageMetadata>('usage');
  }

  async save(data: UsageMetadata): Promise<void> {
    await this.collection.insertOne(data);
  }

  async load(filter?: any): Promise<UsageMetadata[]> {
    const query: any = {};

    if (filter?.userId) query.userId = filter.userId;
    if (filter?.startDate) query.timestamp = { $gte: filter.startDate };
    if (filter?.endDate) query.timestamp = { ...query.timestamp, $lte: filter.endDate };

    const results = await this.collection
      .find(query)
      .limit(filter?.limit || 1000)
      .toArray();

    return results;
  }

  async clear(): Promise<void> {
    await this.collection.deleteMany({});
  }
}

// Use custom storage
const tracker = new AICostTracker({
  providers: [
    /* ... */
  ],
  tracking: {
    enableAutoTracking: true,
    storageType: 'custom',
    customStorage: new MongoDBStorage('mongodb://localhost:27017')
  }
});
```

### Redis Storage Example

```typescript
import Redis from 'ioredis';

class RedisStorage implements CustomStorage {
  private redis: Redis;
  private keyPrefix = 'ai-cost-tracker:';

  constructor() {
    this.redis = new Redis();
  }

  async save(data: UsageMetadata): Promise<void> {
    const key = `${this.keyPrefix}${data.userId}:${Date.now()}`;
    await this.redis.set(key, JSON.stringify(data), 'EX', 7776000); // 90 days
  }

  async load(filter?: any): Promise<UsageMetadata[]> {
    const pattern = filter?.userId ? `${this.keyPrefix}${filter.userId}:*` : `${this.keyPrefix}*`;

    const keys = await this.redis.keys(pattern);
    const results: UsageMetadata[] = [];

    for (const key of keys) {
      const data = await this.redis.get(key);
      if (data) {
        const usage = JSON.parse(data);
        usage.timestamp = new Date(usage.timestamp);

        if (filter?.startDate && usage.timestamp < filter.startDate) continue;
        if (filter?.endDate && usage.timestamp > filter.endDate) continue;

        results.push(usage);
      }
    }

    return results.slice(0, filter?.limit || 1000);
  }

  async clear(): Promise<void> {
    const keys = await this.redis.keys(`${this.keyPrefix}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

## Alert Configuration

### Cost Alerts

```typescript
const tracker = new AICostTracker({
  providers: [
    /* ... */
  ],
  alerts: {
    costThreshold: 50, // Alert when daily cost exceeds $50
    emailNotifications: true
  }
});

// The tracker will automatically check thresholds after each request
// You can also manually check
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const todayAnalytics = await tracker.getAnalytics(todayStart, new Date());
if (todayAnalytics.totalCost > 50) {
  console.log('⚠️ Daily cost threshold exceeded!');
}
```

### Token Usage Alerts

```typescript
const tracker = new AICostTracker({
  providers: [
    /* ... */
  ],
  alerts: {
    tokenThreshold: 500000, // Alert when daily tokens exceed 500K
    webhookUrl: 'https://your-slack-webhook.com/alerts'
  }
});
```

### Custom Alert Handler

```typescript
// Extend the tracker for custom alerts
class CustomAICostTracker extends AICostTracker {
  protected async checkAlerts(metadata: UsageMetadata): Promise<void> {
    await super.checkAlerts(metadata);

    // Add custom alert logic
    if (metadata.estimatedCost > 1.0) {
      // Send notification for expensive single requests
      await this.sendAlert('High cost request', metadata);
    }

    if (metadata.duration && metadata.duration > 5000) {
      // Alert for slow requests
      await this.sendAlert('Slow API response', metadata);
    }
  }

  private async sendAlert(type: string, data: any): Promise<void> {
    // Implement your alert mechanism
    console.log(`ALERT: ${type}`, data);
  }
}
```

## Batch Processing

### Batching Similar Requests

```typescript
// Instead of multiple individual requests
const questions = [
  'What is the capital of France?',
  'What is the capital of Germany?',
  'What is the capital of Italy?',
  'What is the capital of Spain?'
];

// Batch them into a single request
const batchedRequest = {
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'user',
      content: `Please answer these questions:
1. ${questions[0]}
2. ${questions[1]}
3. ${questions[2]}
4. ${questions[3]}

Format: Question number: Answer`
    }
  ],
  maxTokens: 200
};

const response = await tracker.makeRequest(batchedRequest, 'user-123');

// Parse batched response
const answers = response.choices[0].message.content.split('\n').filter(line => line.trim());
```

### Parallel Processing with Rate Limiting

```typescript
import pLimit from 'p-limit';

// Limit to 3 concurrent requests
const limit = pLimit(3);

const prompts = Array.from(
  { length: 20 },
  (_, i) => `Generate a creative name for a ${['cafe', 'restaurant', 'bakery'][i % 3]} #${i + 1}`
);

const requests = prompts.map(prompt =>
  limit(() =>
    tracker.makeRequest(
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 50
      },
      'user-123'
    )
  )
);

const responses = await Promise.all(requests);
console.log(`Processed ${responses.length} requests`);
```

## Advanced Scenarios

### Multi-Model Routing

```typescript
class SmartRouter {
  constructor(private tracker: AICostTracker) {}

  async route(prompt: string, userId: string) {
    // Analyze prompt complexity
    const wordCount = prompt.split(' ').length;
    const hasCodeRequest = /code|function|implement|debug/i.test(prompt);
    const isCreative = /story|poem|creative|imagine/i.test(prompt);

    let model: string;
    let provider: AIProvider;

    if (hasCodeRequest || wordCount > 100) {
      // Complex or code-related tasks
      model = 'gpt-4';
      provider = AIProvider.OpenAI;
    } else if (isCreative) {
      // Creative tasks
      model = 'anthropic.claude-3-5-sonnet-20240620-v1:0';
      provider = AIProvider.AWSBedrock;
    } else {
      // Simple tasks
      model = 'gpt-3.5-turbo';
      provider = AIProvider.OpenAI;
    }

    console.log(`Routing to ${model} for: "${prompt.substring(0, 50)}..."`);

    return this.tracker.makeRequest(
      {
        model,
        prompt,
        maxTokens: 200
      },
      userId
    );
  }
}

const router = new SmartRouter(tracker);
await router.route('Write a haiku about coding', 'user-123');
await router.route('Implement a binary search algorithm', 'user-123');
```

### Caching Implementation

```typescript
import { createHash } from 'crypto';

class CachedTracker {
  private cache = new Map<string, any>();
  private cacheTTL = 3600000; // 1 hour

  constructor(private tracker: AICostTracker) {}

  private getCacheKey(request: any): string {
    const normalized = {
      model: request.model,
      messages: request.messages || request.prompt,
      temperature: request.temperature || 0.7,
      maxTokens: request.maxTokens
    };
    return createHash('md5').update(JSON.stringify(normalized)).digest('hex');
  }

  async makeRequest(request: any, userId: string): Promise<any> {
    const cacheKey = this.getCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('Cache hit!');
      // Track the cached usage with zero cost
      await this.tracker.trackUsage({
        userId,
        timestamp: new Date(),
        provider: AIProvider.OpenAI,
        model: request.model,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCost: 0,
        prompt: request.prompt || 'Cached request',
        completion: cached.response.choices[0].text,
        duration: 0,
        tags: ['cached']
      });

      return cached.response;
    }

    const response = await this.tracker.makeRequest(request, userId);

    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });

    return response;
  }
}
```

### Cost Budget Management

```typescript
class BudgetManager {
  private dailyBudget: number;
  private monthlyBudget: number;

  constructor(
    private tracker: AICostTracker,
    dailyBudget: number,
    monthlyBudget: number
  ) {
    this.dailyBudget = dailyBudget;
    this.monthlyBudget = monthlyBudget;
  }

  async canMakeRequest(
    estimatedCost: number,
    userId: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    dailySpent: number;
    monthlySpent: number;
  }> {
    // Check daily budget
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayAnalytics = await this.tracker.getAnalytics(todayStart, new Date(), userId);

    if (todayAnalytics.totalCost + estimatedCost > this.dailyBudget) {
      return {
        allowed: false,
        reason: 'Daily budget exceeded',
        dailySpent: todayAnalytics.totalCost,
        monthlySpent: 0
      };
    }

    // Check monthly budget
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthAnalytics = await this.tracker.getAnalytics(monthStart, new Date(), userId);

    if (monthAnalytics.totalCost + estimatedCost > this.monthlyBudget) {
      return {
        allowed: false,
        reason: 'Monthly budget exceeded',
        dailySpent: todayAnalytics.totalCost,
        monthlySpent: monthAnalytics.totalCost
      };
    }

    return {
      allowed: true,
      dailySpent: todayAnalytics.totalCost,
      monthlySpent: monthAnalytics.totalCost
    };
  }

  async makeRequestWithBudget(request: any, userId: string): Promise<any> {
    // Estimate cost first
    const estimate = await this.tracker.estimateCost(
      request.prompt || request.messages[0].content,
      request.model,
      AIProvider.OpenAI,
      request.maxTokens
    );

    const budgetCheck = await this.canMakeRequest(estimate.totalCost, userId);

    if (!budgetCheck.allowed) {
      throw new Error(
        `Budget exceeded: ${budgetCheck.reason}. ` +
          `Daily: $${budgetCheck.dailySpent.toFixed(2)}/${this.dailyBudget}, ` +
          `Monthly: $${budgetCheck.monthlySpent.toFixed(2)}/${this.monthlyBudget}`
      );
    }

    return this.tracker.makeRequest(request, userId);
  }
}

// Usage
const budgetManager = new BudgetManager(tracker, 10, 200); // $10/day, $200/month

try {
  const response = await budgetManager.makeRequestWithBudget(
    {
      model: 'gpt-4',
      prompt: 'Write a blog post',
      maxTokens: 1000
    },
    'user-123'
  );
} catch (error) {
  console.error('Budget error:', error.message);
}
```

### Export and Backup

```typescript
// Export data in different formats
async function exportAndBackup() {
  // JSON export
  const jsonData = await tracker.exportData('json');
  fs.writeFileSync('backup-data.json', jsonData);

  // CSV export
  const csvData = await tracker.exportData('csv');
  fs.writeFileSync('backup-data.csv', csvData);

  // Custom export with filtering
  const lastWeekData = await tracker.exportData(
    'json',
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  );

  // Upload to S3 for backup
  import AWS from 'aws-sdk';
  const s3 = new AWS.S3();

  await s3
    .putObject({
      Bucket: 'my-ai-cost-backups',
      Key: `backup-${new Date().toISOString()}.json`,
      Body: jsonData,
      ContentType: 'application/json'
    })
    .promise();
}
```

### Integration with Express.js

```typescript
import express from 'express';

const app = express();
app.use(express.json());

// Middleware for tracking API usage
app.use('/api/ai/*', async (req, res, next) => {
  const userId = req.user?.id || 'anonymous';
  req.tracker = tracker;
  req.userId = userId;
  next();
});

// Endpoint for AI requests
app.post('/api/ai/complete', async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo', maxTokens = 150 } = req.body;

    const response = await req.tracker.makeRequest(
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        maxTokens
      },
      req.userId
    );

    res.json({
      success: true,
      response: response.choices[0].message.content,
      usage: response.usage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/ai/analytics', async (req, res) => {
  const analytics = await tracker.getAnalytics(
    req.query.startDate ? new Date(req.query.startDate) : undefined,
    req.query.endDate ? new Date(req.query.endDate) : undefined,
    req.userId
  );

  res.json(analytics);
});

// Optimization endpoint
app.post('/api/ai/optimize', async (req, res) => {
  const { prompt, model, provider } = req.body;

  const suggestions = await tracker.optimizePrompt(prompt, model, provider);

  res.json({ suggestions });
});

app.listen(3000, () => {
  console.log('AI Cost Tracker API running on port 3000');
});
```

## Best Practices

1. **Always estimate costs before expensive operations**
2. **Use appropriate models for different tasks**
3. **Implement caching for repeated queries**
4. **Set up alerts to avoid bill surprises**
5. **Regularly review optimization suggestions**
6. **Export and backup usage data periodically**
7. **Use batch processing when possible**
8. **Monitor token usage patterns**
9. **Implement rate limiting for production**
10. **Keep your API keys secure**

## Troubleshooting

### Common Issues

```typescript
// Handle provider errors
try {
  await tracker.makeRequest(request, userId);
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 5000));
    return tracker.makeRequest(request, userId);
  }

  if (error.message.includes('invalid API key')) {
    console.error('Check your API key configuration');
  }

  throw error;
}

// Debug token counting
import { TokenCounter } from 'ai-cost-tracker';

const text = 'Your text here';
const tokens = await TokenCounter.countTokens(text, AIProvider.OpenAI, 'gpt-3.5-turbo');
console.log(`Token count: ${tokens}`);

// Verify model support
import { getModelById, getAllModels } from 'ai-cost-tracker';

const model = getModelById('gpt-4');
if (!model) {
  console.log('Model not found. Available models:');
  getAllModels().forEach(m => console.log(`- ${m.id}`));
}
```

## Next Steps

1. Explore the [API Reference](./API.md) for detailed documentation
2. Check out the [example files](../examples/) for runnable code
3. Contribute to the project on [GitHub](https://github.com/yourusername/ai-cost-tracker)
