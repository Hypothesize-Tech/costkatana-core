# Cost Katana

A comprehensive toolkit for optimizing AI model costs, tracking usage, and analyzing performance across multiple providers with centralized dashboard analytics.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, Google AI, AWS Bedrock, Cohere, and more
- **Cost Optimization**: Intelligent prompt compression, context trimming, and request fusion
- **Usage Tracking**: Detailed analytics and cost monitoring with dashboard integration
- **Project Management**: Organize usage by projects with budget tracking
- **Real-time Analytics**: Monitor costs, tokens, and performance metrics via web dashboard
- **Suggestion Engine**: AI-powered recommendations for cost reduction
- **🔍 Distributed Tracing**: Visualize AI workflows with hierarchical traces and timelines
- **🚀 AI Gateway**: Intelligent proxy with caching, retries, and cost optimization
- **💾 Smart Caching**: Reduce costs with configurable response caching
- **🔄 Smart Retries**: Automatic retry logic with exponential backoff
- **📊 Workflow Tracking**: Group related requests for end-to-end cost analysis
- **🎯 Session Analysis**: Track and visualize complete agent flows with cost attribution

## Documentation

- [API Reference](docs/API.md) - Detailed API documentation
- [Gateway Guide](docs/GATEWAY.md) - AI Gateway setup and configuration
- [Prompt Optimization](docs/PROMPT_OPTIMIZATION.md) - Techniques for optimizing prompts
- [Webhooks](docs/WEBHOOKS.md) - Real-time event notifications
- [Examples](docs/EXAMPLES.md) - Code examples and use cases

## Prerequisites

**⚠️ Important: Registration Required**

Before using this package, you **must**:

1. **Register at [costkatana.com](https://costkatana.com)**
2. **Create a project** in your Cost Katana dashboard
3. **Get your API Key and Project ID** from the dashboard settings

This package automatically syncs all usage data with your Cost Katana dashboard for comprehensive analytics and cost tracking.

## Installation

```bash
npm install ai-cost-tracker
```

## Environment Setup

Create a `.env` file in your project root:

```bash
# Required: Get these from your costkatana.com dashboard
API_KEY=dak_your_dashboard_api_key_here
PROJECT_ID=your_project_id_here

# Your AI provider API keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# ... other provider keys as needed
```

## Quick Start

```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';

// Initialize with your provider configuration
const tracker = await AICostTracker.create({
  providers: [
    {
      provider: AIProvider.OpenAI,
      apiKey: process.env.OPENAI_API_KEY
    }
  ],
  optimization: {
    enablePromptOptimization: true,
    enableModelSuggestions: true,
    enableCachingSuggestions: true
  },
  tracking: {
    enableAutoTracking: true
  }
});

// Make a tracked request (automatically syncs with costkatana.com dashboard)
const response = await tracker.makeRequest({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Your prompt here' }],
  maxTokens: 150
});

console.log('Response:', response.choices[0].message.content);
// Usage data is automatically sent to your costkatana.com dashboard
```

## 🔍 Sessions & Distributed Tracing

Cost Katana provides enterprise-grade distributed tracing for all your AI operations. Track every LLM call, tool execution, and API request with automatic parent-child relationships, latency metrics, and cost attribution.

### Tracing Features

- **🌳 Hierarchical Traces**: Automatic parent-child span relationships
- **⚡ Zero-Code Instrumentation**: Automatic tracing with our middleware
- **💰 Cost Attribution**: Per-span cost tracking with token counts
- **📊 Visual Timeline**: Interactive trace visualization in dashboard
- **🔒 PII Redaction**: Automatic server-side data sanitization
- **⏱️ Performance Metrics**: Latency, duration, and throughput analysis
- **🎯 Error Tracking**: Trace errors through your entire AI pipeline

### How It Works

```typescript
// 1. Add tracing middleware (Express example)
import { traceMiddleware } from 'ai-cost-tracker/trace';
app.use(traceMiddleware);

// 2. Use traced LLM wrapper
import { TrackedOpenAI } from 'ai-cost-tracker/providers';
const ai = new TrackedOpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 3. All calls are automatically traced!
const response = await ai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }]
});
// Creates: HTTP span → LLM span with tokens, cost, latency

// 4. View traces in dashboard
// Navigate to costkatana.com/sessions to see:
// - Hierarchical trace tree
// - Visual timeline
// - Cost breakdown per span
// - Token usage metrics
```

### Manual Instrumentation

For custom logic, tools, or database calls:

```typescript
import { traceService } from 'ai-cost-tracker/trace';

// Start a custom span
const span = await traceService.startSpan({
  name: 'database-query',
  type: 'tool',
  metadata: { query: 'SELECT * FROM users' }
});

// Your custom logic here
const result = await db.query('...');

// End the span with metrics
await traceService.endSpan(span.traceId, {
  status: 'ok',
  metadata: { rowCount: result.rows.length }
});
```

## 🚀 AI Gateway - Intelligent Proxy

The AI Gateway provides intelligent proxy functionality with caching, retries, and cost optimization. It acts as a smart layer between your application and AI providers.

### Gateway Features

- **🌐 Universal Proxy**: Works with any AI provider (OpenAI, Anthropic, Google AI, Cohere, etc.)
- **💾 Smart Caching**: Configurable response caching with TTL and user scoping
- **🔄 Smart Retries**: Exponential backoff with configurable parameters
- **📊 Workflow Tracking**: Group related requests for end-to-end cost analysis
- **🏷️ Cost Attribution**: Custom properties for detailed cost allocation
- **🔒 Privacy Controls**: Omit sensitive data from logs
- **📈 Performance Monitoring**: Detailed analytics and statistics

### Quick Gateway Start

```typescript
import { createGatewayClientFromEnv } from 'ai-cost-tracker';

// Create gateway client (uses environment variables)
const gateway = createGatewayClientFromEnv({
  baseUrl: 'https://cost-katana-backend.store/api/gateway', // Your gateway URL
  enableCache: true,
  enableRetries: true
});

// Make OpenAI request through gateway
const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
  max_tokens: 50
});

console.log('Response:', response.data.choices[0].message.content);
console.log('Cache Status:', response.metadata.cacheStatus); // HIT or MISS
console.log('Retry Attempts:', response.metadata.retryAttempts);
```

### Advanced Gateway Configuration

```typescript
import { createGatewayClient } from 'ai-cost-tracker';

const gateway = createGatewayClient({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  apiKey: process.env.API_KEY!,
  enableCache: true,
  enableRetries: true,
  // Custom retry configuration
  retryConfig: {
    count: 5,        // Max retry attempts
    factor: 2,       // Exponential backoff factor
    minTimeout: 1000, // Min wait time (ms)
    maxTimeout: 15000 // Max wait time (ms)
  },
  // Custom cache configuration
  cacheConfig: {
    ttl: 3600,       // Cache TTL in seconds
    userScope: 'user_123', // User-scoped caching
    bucketMaxSize: 3 // Multiple responses for variety
  },
  // Default properties for all requests
  defaultProperties: {
    application: 'my-ai-app',
    version: '1.0.0'
  }
});
```

### Multi-Provider Support

```typescript
// OpenAI
const openaiResponse = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  targetUrl: 'https://api.openai.com',
  cache: true,
  retry: { count: 3 }
});

// Anthropic
const anthropicResponse = await gateway.anthropic({
  model: 'claude-3-haiku-20240307',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  targetUrl: 'https://api.anthropic.com'
});

// Google AI
const googleResponse = await gateway.googleAI('gemini-pro', {
  contents: [{
    parts: [{ text: 'Hello!' }]
  }]
}, {
  targetUrl: 'https://generativelanguage.googleapis.com'
});

// Cohere
const cohereResponse = await gateway.cohere({
  model: 'command',
  prompt: 'Hello!',
  max_tokens: 100
}, {
  targetUrl: 'https://api.cohere.ai'
});
```

### Workflow Tracking

Group related requests to understand end-to-end costs:

```typescript
const workflowId = `workflow-${Date.now()}`;

// Step 1: Analysis
const analysisResponse = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Analyze this data...' }]
}, {
  workflow: {
    workflowId,
    workflowName: 'DataAnalysis',
    workflowStep: '/analyze'
  },
  properties: {
    step: 'data-analysis',
    priority: 'high'
  }
});

// Step 2: Summary
const summaryResponse = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Summarize the analysis...' }]
}, {
  workflow: {
    workflowId,
    workflowName: 'DataAnalysis',
    workflowStep: '/analyze/summarize'
  }
});

// Get workflow details
const workflowDetails = await gateway.getWorkflowDetails(workflowId);
console.log('Total Workflow Cost:', workflowDetails.totalCost);
console.log('Total Requests:', workflowDetails.requests.length);
```

### Smart Caching

Reduce costs with intelligent caching:

```typescript
// Basic caching
const response1 = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'What is 2+2?' }]
}, {
  cache: true // Uses default cache settings
});

// Custom cache settings
const response2 = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Generate a creative story' }]
}, {
  cache: {
    ttl: 7200,        // 2 hours
    userScope: 'user_456', // User-specific cache
    bucketMaxSize: 5  // Store 5 different responses
  }
});

// Cache management
const cacheStats = await gateway.getCacheStats();
console.log('Cache Hit Rate:', cacheStats.singleResponseCache.size);

// Clear cache
await gateway.clearCache({ expired: true }); // Clear expired only
await gateway.clearCache({ userScope: 'user_123' }); // Clear user cache
```

### Smart Retries

Automatic retry with exponential backoff:

```typescript
const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  retry: {
    count: 5,         // Max 5 retry attempts
    factor: 2.5,      // Aggressive backoff
    minTimeout: 2000, // Start with 2 seconds
    maxTimeout: 30000 // Cap at 30 seconds
  }
});

console.log('Retry Attempts:', response.metadata.retryAttempts);
```

### Integrated Tracker + Gateway

Combine full tracking with gateway functionality:

```typescript
import AICostTracker, { AIProvider } from 'ai-cost-tracker';

// Create tracker
const tracker = await AICostTracker.create({
  providers: [{ provider: AIProvider.OpenAI }],
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
  tracking: {
    enableAutoTracking: true
  }
});

// Initialize gateway
const gateway = tracker.initializeGateway({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  enableCache: true,
  enableRetries: true
});

// Make requests with automatic usage tracking
const response = await tracker.gatewayOpenAI({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Optimize my AI costs' }]
}, {
  properties: {
    feature: 'cost-optimization',
    user: 'john-doe'
  },
  workflow: {
    workflowId: 'cost-session-123',
    workflowName: 'CostOptimization'
  }
});

// Usage automatically tracked with gateway metadata
const analytics = await tracker.getAnalytics();
console.log('Total Cost:', analytics.totalCost);
```

### Gateway Statistics

Monitor performance and usage:

```typescript
// Get gateway statistics
const stats = await gateway.getStats();
console.log('Performance Metrics:', {
  totalRequests: stats.totalRequests,
  cacheHitRate: `${stats.cacheHitRate}%`,
  averageResponseTime: `${stats.averageResponseTime}ms`,
  successRate: `${stats.successRate}%`
});

// Provider-specific stats
Object.entries(stats.providerStats).forEach(([provider, stats]) => {
  console.log(`${provider} Stats:`, {
    requests: stats.requests,
    successRate: `${stats.successRate}%`,
    avgResponseTime: `${stats.averageResponseTime}ms`
  });
});

// Health check
const health = await gateway.healthCheck();
console.log('Gateway Status:', health.status);
```

## 🔐 Proxy Key Authentication

The CostKATANA Key Vault provides secure, controlled access to your AI provider keys through proxy keys. Instead of sharing your master API keys directly, you can create proxy keys with specific permissions, budgets, and restrictions.

### What are Proxy Keys?

Proxy keys (`ck-proxy-*`) are secure access tokens that:

- **Resolve to Master Keys**: Automatically use your stored provider API keys
- **Enforce Budgets**: Set spending limits (total, daily, monthly)
- **Control Permissions**: Limit access to read, write, or admin operations
- **Track Usage**: Monitor requests and costs per proxy key
- **Restrict Access**: Whitelist IP addresses and domains
- **Rate Limiting**: Control request frequency

### Quick Start with Proxy Keys

```typescript
import { createGatewayClient } from 'ai-cost-tracker';

// Create client with proxy key
const gateway = createGatewayClient({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  apiKey: 'ck-proxy-your-proxy-key-id', // Your proxy key
  enableCache: true,
  enableRetries: true
});

// Check if using proxy key
if (gateway.isUsingProxyKey()) {
  console.log('✅ Using secure proxy key authentication');
  
  // Get proxy key information
  const info = await gateway.getProxyKeyInfo();
  console.log('Proxy Key:', info?.name);
  console.log('Provider:', info?.provider);
  console.log('Budget Limit:', info?.budgetLimit);
}

// Make requests (proxy key automatically resolves to provider key)
const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello from proxy key!' }]
}, {
  targetUrl: 'https://api.openai.com'
});
```

### Budget Monitoring

Monitor spending and enforce limits:

```typescript
// Check budget status before making requests
const budgetStatus = await gateway.checkProxyKeyBudget();

if (budgetStatus) {
  console.log('Budget Status:', budgetStatus.budgetStatus); // 'good' | 'warning' | 'over'
  console.log('Message:', budgetStatus.message);
  
  if (!budgetStatus.withinBudget) {
    console.log('⚠️ Proxy key is over budget!');
    return;
  }
}

// Get current usage statistics
const usage = await gateway.getProxyKeyUsage();
if (usage) {
  console.log('Usage Stats:', {
    totalRequests: usage.totalRequests,
    totalCost: usage.totalCost,
    dailyCost: usage.dailyCost,
    monthlyCost: usage.monthlyCost
  });
}
```

### Permission Validation

Validate permissions before operations:

```typescript
// Check if proxy key has required permissions
const canRead = await gateway.validateProxyKeyPermissions('read');
const canWrite = await gateway.validateProxyKeyPermissions('write');
const canAdmin = await gateway.validateProxyKeyPermissions('admin');

console.log('Permissions:', { read: canRead, write: canWrite, admin: canAdmin });

if (!canWrite) {
  console.log('⚠️ This proxy key has read-only access');
}
```

### Advanced Usage Tracking

Track usage with detailed attribution:

```typescript
import { ProxyKeyUsageOptions } from 'ai-cost-tracker';

const usageOptions: ProxyKeyUsageOptions = {
  projectId: 'my-project-123',
  properties: {
    environment: 'production',
    feature: 'chat-bot',
    userId: 'user-456'
  },
  modelOverride: 'gpt-4o-mini',
  omitRequest: false,
  omitResponse: false
};

// Make request with detailed tracking
const response = await gateway.makeProxyKeyRequest(
  'https://api.openai.com',
  {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Tracked request' }],
    max_tokens: 100
  },
  usageOptions
);
```

### Integrated Tracker + Proxy Key

Use proxy keys with the main tracker:

```typescript
import AICostTracker from 'ai-cost-tracker';

// Initialize tracker
const tracker = new AICostTracker({
  apiKey: 'your-costkatana-api-key',
  tracking: { enableAutoTracking: true }
});

// Initialize gateway with proxy key
const gateway = tracker.initializeGateway({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  apiKey: 'ck-proxy-your-proxy-key-id',
  enableCache: true
});

// Check if using proxy key
if (tracker.isUsingProxyKey()) {
  const proxyInfo = await tracker.getProxyKeyInfo();
  const budgetStatus = await tracker.checkProxyKeyBudget();
  
  console.log('Proxy Key:', proxyInfo?.name);
  console.log('Budget:', budgetStatus?.message);
}

// Make requests (automatically uses proxy key)
const response = await tracker.gatewayOpenAI({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Integrated request' }]
}, {
  targetUrl: 'https://api.openai.com',
  properties: { source: 'integrated-tracker' }
});
```

### Environment Configuration

Configure proxy keys via environment variables:

```bash
# Set environment variables
export COSTKATANA_API_KEY="ck-proxy-your-proxy-key-id"
export COSTKATANA_GATEWAY_URL="https://cost-katana-backend.store/api/gateway"
```

```typescript
import { createGatewayClientFromEnv } from 'ai-cost-tracker';

// Create client from environment
const gateway = createGatewayClientFromEnv({
  enableCache: true,
  enableRetries: true,
  keyVault: {
    enabled: true,
    autoDetectProxyKey: true,
    fallbackToEnv: false
  }
});

console.log('Using proxy key:', gateway.isUsingProxyKey());
```

### Security Benefits

Proxy keys provide several security advantages:

1. **Key Isolation**: Master API keys never leave the secure vault
2. **Granular Control**: Set specific permissions and restrictions
3. **Budget Enforcement**: Automatic spending limits prevent overuse
4. **Access Tracking**: Monitor who uses what and when
5. **Instant Revocation**: Deactivate proxy keys immediately
6. **IP/Domain Restrictions**: Limit access to specific locations
7. **Rate Limiting**: Prevent abuse and control request frequency

## Project Integration

### Why Use Projects?

Projects help you:

- **Organize Usage**: Group AI requests by project, team, or client
- **Track Budgets**: Set spending limits and monitor utilization
- **Generate Reports**: Get detailed analytics per project
- **Control Access**: Manage team member permissions
- **Allocate Costs**: Understand spending across different initiatives

### Setting Up Projects

#### 1. Basic Project Configuration

```typescript
import { AICostOptimizer } from 'ai-cost-tracker';

const optimizer = new AICostOptimizer({
  apiKey: 'your-api-key',
  provider: 'openai',
  trackUsage: true,
  // Optional: Set default project for all requests
  defaultProjectId: 'project-123'
});
```

#### 2. Per-Request Project Assignment

```typescript
// Associate individual requests with projects
const result = await optimizer.optimize({
  prompt: 'Analyze this customer feedback',
  model: 'gpt-4',
  projectId: 'customer-analysis-2024',
  metadata: {
    department: 'marketing',
    team: 'customer-success',
    client: 'acme-corp'
  }
});
```

#### 3. Project-Based Usage Tracking

```typescript
// Track usage with detailed project information
const usageData = await optimizer.trackUsage({
  prompt: 'Generate product description',
  completion: 'AI-generated description...',
  model: 'gpt-3.5-turbo',
  cost: 0.002,
  tokens: 150,
  projectId: 'ecommerce-automation',
  costAllocation: {
    department: 'product',
    team: 'content',
    purpose: 'product-descriptions',
    client: 'internal'
  }
});
```

### Project Configuration Options

#### Project Metadata Structure

```typescript
interface ProjectConfig {
  projectId: string;
  name?: string;
  description?: string;
  budget?: {
    amount: number;
    currency: string;
    period: 'monthly' | 'quarterly' | 'yearly';
  };
  costAllocation?: {
    department?: string;
    team?: string;
    purpose?: string;
    client?: string;
    [key: string]: any;
  };
  tags?: string[];
}
```

#### Example: E-commerce Project Setup

```typescript
const ecommerceOptimizer = new AICostOptimizer({
  apiKey: 'your-api-key',
  provider: 'openai',
  trackUsage: true,
  defaultProjectId: 'ecommerce-platform',
  projectConfig: {
    projectId: 'ecommerce-platform',
    name: 'E-commerce AI Features',
    description: 'AI-powered product recommendations and descriptions',
    budget: {
      amount: 1000,
      currency: 'USD',
      period: 'monthly'
    },
    costAllocation: {
      department: 'product',
      team: 'ai-ml',
      purpose: 'customer-experience'
    },
    tags: ['production', 'customer-facing', 'revenue-generating']
  }
});

// Product description generation
const productDesc = await ecommerceOptimizer.optimize({
  prompt: 'Generate SEO-optimized description for wireless headphones',
  model: 'gpt-4',
  costAllocation: {
    purpose: 'product-descriptions',
    client: 'internal'
  }
});

// Customer support automation
const supportResponse = await ecommerceOptimizer.optimize({
  prompt: 'Help customer with return policy question',
  model: 'gpt-3.5-turbo',
  projectId: 'customer-support', // Override default project
  costAllocation: {
    purpose: 'customer-support',
    client: 'end-customer'
  }
});
```

### Advanced Project Features

#### 1. Multi-Project Analytics

```typescript
// Get analytics for specific project
const projectAnalytics = await optimizer.getProjectAnalytics('project-123', {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  groupBy: 'day'
});

// Compare multiple projects
const comparison = await optimizer.compareProjects(['project-123', 'project-456', 'project-789'], {
  metric: 'cost',
  period: 'last-30-days'
});
```

#### 2. Budget Monitoring

```typescript
// Set up budget alerts
const optimizer = new AICostOptimizer({
  apiKey: 'your-api-key',
  provider: 'openai',
  trackUsage: true,
  budgetAlerts: {
    thresholds: [50, 75, 90], // Alert at 50%, 75%, 90% of budget
    webhookUrl: 'https://your-app.com/budget-alerts',
    email: 'admin@yourcompany.com'
  }
});

// Check budget status
const budgetStatus = await optimizer.getBudgetStatus('project-123');
console.log(`Budget utilization: ${budgetStatus.utilizationPercentage}%`);
```

#### 3. Team Collaboration

```typescript
// Set up team-based project access
const optimizer = new AICostOptimizer({
  apiKey: 'your-api-key',
  provider: 'openai',
  trackUsage: true,
  teamConfig: {
    userId: 'user-123',
    teamId: 'ai-team',
    role: 'developer', // developer, admin, viewer
    accessibleProjects: ['project-123', 'project-456']
  }
});
```

### Integration with Cost Katana Dashboard

The npm package automatically syncs with the Cost Katana dashboard at [costkatana.com](https://costkatana.com):

```typescript
// All tracking happens automatically when you use the API
const tracker = await AICostTracker.create({
  providers: [
    {
      provider: AIProvider.OpenAI,
      apiKey: process.env.OPENAI_API_KEY
    }
  ],
  tracking: {
    enableAutoTracking: true // Data syncs automatically to costkatana.com
  }
});

// Every request is automatically tracked and sent to your dashboard
const response = await tracker.makeRequest({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Hello world' }]
});
```

### Environment Variables

Required environment variables from your Cost Katana dashboard:

```bash
# Get these from costkatana.com dashboard settings
API_KEY=dak_your_dashboard_api_key_here
PROJECT_ID=your_project_id_here

# Your AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# ... other provider keys as needed
```

### Best Practices for Project Integration

#### 1. Consistent Project Naming

```typescript
// Use consistent naming conventions
const PROJECT_IDS = {
  CUSTOMER_SUPPORT: 'customer-support-2024',
  PRODUCT_DESCRIPTIONS: 'product-desc-automation',
  MARKETING_CONTENT: 'marketing-content-gen',
  DATA_ANALYSIS: 'data-analysis-reports'
};

const result = await optimizer.optimize({
  prompt: 'Analyze sales data',
  model: 'gpt-4',
  projectId: PROJECT_IDS.DATA_ANALYSIS
});
```

#### 2. Hierarchical Project Structure

```typescript
// Use hierarchical project IDs for better organization
const projectId = `${department}.${team}.${initiative}.${year}`;
// Example: 'marketing.content.blog-automation.2024'

const result = await optimizer.optimize({
  prompt: 'Write blog post about AI trends',
  model: 'gpt-4',
  projectId: 'marketing.content.blog-automation.2024',
  costAllocation: {
    department: 'marketing',
    team: 'content',
    purpose: 'blog-content',
    client: 'internal'
  }
});
```

#### 3. Environment-Based Configuration

```typescript
// Different configurations for different environments
const config = {
  development: {
    projectId: 'dev-experiments',
    budget: { amount: 100, currency: 'USD', period: 'monthly' }
  },
  staging: {
    projectId: 'staging-tests',
    budget: { amount: 500, currency: 'USD', period: 'monthly' }
  },
  production: {
    projectId: 'prod-customer-features',
    budget: { amount: 5000, currency: 'USD', period: 'monthly' }
  }
};

const optimizer = new AICostOptimizer({
  apiKey: process.env.OPENAI_API_KEY,
  provider: 'openai',
  trackUsage: true,
  dashboardApiKey: process.env.API_KEY, // Cost Katana Dashboard API Key
  ...config[process.env.NODE_ENV || 'development']
});
```

## API Reference

### Core Methods

- `optimize(options)` - Optimize and execute AI requests
- `trackUsage(data)` - Track usage data with project information
- `getProjectAnalytics(projectId, filters)` - Get project-specific analytics
- `compareProjects(projectIds, options)` - Compare multiple projects
- `getBudgetStatus(projectId)` - Check budget utilization

### Configuration Options

- `projectId` - Associate requests with specific projects
- `costAllocation` - Detailed cost allocation metadata
- `budgetAlerts` - Set up budget monitoring and alerts
- `teamConfig` - Configure team access and permissions
- `dashboardConfig` - Sync with external dashboard

## 🛡️ Prompt Firewall & Cost Shield

Protect your AI applications from malicious prompts and save costs with the built-in security firewall.

### Quick Start

```typescript
import { createGatewayClient } from '@ai-cost-optimizer/core';

const gateway = createGatewayClient({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  apiKey: 'your-costkatana-api-key',
  firewall: {
    enabled: true,        // Enable basic firewall (Prompt Guard)
    advanced: true,       // Enable advanced firewall (Llama Guard)
    promptThreshold: 0.5, // Prompt injection threshold (0.0-1.0)
    llamaThreshold: 0.8   // Content safety threshold (0.0-1.0)
  }
});

// Make a request - firewall automatically protects against threats
try {
  const response = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Your prompt here' }]
  });
  console.log('✅ Safe request processed:', response.data);
} catch (error) {
  if (error.response?.data?.error?.code === 'PROMPT_BLOCKED_BY_FIREWALL') {
    console.log('🛡️ Malicious prompt blocked - Cost saved!');
    console.log('Threat:', error.response.data.threat);
  }
}
```

### Two-Stage Protection

**Stage 1: Prompt Guard (Fast Detection)**
- Detects prompt injection and jailbreak attempts
- Uses Meta's Prompt Guard model via AWS Bedrock
- Lightning-fast response for common attack patterns
- Configurable confidence thresholds

**Stage 2: Llama Guard (Deep Analysis)**
- Analyzes content against 14 safety categories
- Uses Meta's Llama Guard model via AWS Bedrock
- Comprehensive threat detection including:
  - Violence and Hate
  - Sexual Content
  - Criminal Planning
  - Data Exfiltration
  - Phishing Attempts
  - And 9 more categories

### Per-Request Configuration

```typescript
// Override firewall settings for specific requests
const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Sensitive content here' }]
}, {
  firewall: {
    enabled: true,
    advanced: true,
    promptThreshold: 0.3,  // More sensitive
    llamaThreshold: 0.9    // Less sensitive
  }
});
```

### Analytics & Cost Savings

```typescript
// Get firewall analytics
const analytics = await gateway.getFirewallAnalytics();

console.log('📊 Firewall Performance:');
console.log(`Requests processed: ${analytics.totalRequests}`);
console.log(`Threats blocked: ${analytics.blockedRequests}`);
console.log(`Cost saved: $${analytics.costSaved.toFixed(4)}`);
console.log('Threat categories:', analytics.threatsByCategory);
```

### Integrated Tracker + Firewall

```typescript
import { AICostTracker } from '@ai-cost-optimizer/core';

const tracker = new AICostTracker({
  apiKey: 'your-api-key',
  projectId: 'secure-project'
});

// Initialize gateway with firewall
tracker.initializeGateway({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  apiKey: 'your-costkatana-api-key',
  firewall: { enabled: true, advanced: true }
});

// Use firewall-protected methods with automatic tracking
const response = await tracker.gatewayOpenAIWithFirewall({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello world' }]
}, {
  enabled: true,
  advanced: true
}, {
  properties: { feature: 'chat', user: 'john' }
});
```

### Security Benefits

- **Cost Protection**: Block expensive API calls from malicious prompts
- **Data Security**: Prevent data exfiltration and prompt injection attacks
- **Compliance**: Meet security requirements with automated threat detection
- **Zero Downtime**: Fail-open design ensures service availability
- **Multi-Provider**: Works with OpenAI, Anthropic, Google AI, Cohere, and more

## 📊 User Feedback & Value Tracking

Move beyond cost tracking to measure **Return on AI Spend** by connecting every dollar spent to actual user value.

### Quick Start

```typescript
import AICostTracker from 'ai-cost-tracker';

const tracker = new AICostTracker({
  apiKey: 'your-costkatana-api-key'
});

// 1. Make a request and capture the request ID
const requestId = crypto.randomUUID();
const response = await tracker.gatewayOpenAI({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'How do I return an item?' }]
}, { requestId });

// 2. Submit user feedback
await tracker.submitFeedback(requestId, {
  rating: true, // true = positive, false = negative
  comment: 'Very helpful response!',
  implicitSignals: {
    copied: true,
    conversationContinued: false,
    sessionDuration: 45000
  }
});

// 3. Analyze Return on AI Spend
const analytics = await tracker.getEnhancedFeedbackAnalytics();
console.log(`Wasted Spend: ${analytics.insights.wastedSpendPercentage}%`);
console.log(`ROI Score: ${analytics.insights.returnOnAISpend * 100}%`);
```

### Key Features

#### Explicit + Implicit Feedback
- **Explicit**: User clicks thumbs up/down (rare but accurate)
- **Implicit**: Track copy behavior, session duration, conversation flow (scale)

#### Cost-Value Correlation
- See exactly how much you spend on positive vs negative responses
- Calculate cost per positive rating
- Identify wasted spending on unhelpful responses

#### Actionable Insights
```typescript
const analytics = await tracker.getEnhancedFeedbackAnalytics();

// Get automatic recommendations
analytics.insights.recommendations.forEach(rec => {
  console.log(rec);
  // "You're spending 30% of budget on negatively-rated responses"
  // "Model X has low satisfaction - consider switching"
  // "Feature Y needs optimization - poor user feedback"
});
```

#### Business Intelligence
Answer critical questions:
- "What percentage of our AI spend is wasted on unhelpful responses?"
- "Which features have the highest ROI?"
- "Should we switch AI models based on user satisfaction?"
- "How much money could we save by improving prompts?"

### Advanced Usage

```typescript
// Track behavioral signals automatically
await tracker.updateImplicitSignals(requestId, {
  copied: true,              // User copied the response
  conversationContinued: false, // No follow-up questions
  immediateRephrase: false,  // Didn't rephrase query
  sessionDuration: 45000,    // 45 seconds engaged
  codeAccepted: true         // Accepted code suggestion
});

// Get feature-specific ROI analysis
const analytics = await tracker.getFeedbackAnalytics();
Object.entries(analytics.ratingsByFeature).forEach(([feature, stats]) => {
  const satisfaction = stats.positive / (stats.positive + stats.negative);
  console.log(`${feature}: ${satisfaction * 100}% satisfaction, $${stats.cost} spent`);
});
```

## Examples

See the [examples](./examples) directory for complete implementation examples:

- [Basic Usage](./examples/basic-usage.ts)
- [Advanced Optimization](./examples/advanced-optimization.ts)
- [Project Management](./examples/project-management.ts)
- [Team Collaboration](./examples/team-collaboration.ts)
- [Proxy Key Usage](./examples/proxy-key-usage.ts)
- [Firewall Usage](./examples/firewall-usage.ts)
- [Feedback & Value Tracking](./examples/feedback-usage.ts)

## Support

For questions and support:

- [Documentation](./docs)
- [GitHub Issues](https://github.com/your-repo/ai-cost-optimizer/issues)
- [Discord Community](https://discord.gg/your-community)

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Observability & OpenTelemetry

The core library emits OpenTelemetry spans/metrics for AI requests, tools, and HTTP operations. It integrates with the backend’s OTel setup and any OTLP-compatible vendor.

### Emitted Telemetry
- LLM spans with token counts and per-span cost attribution
- HTTP spans for gateway/proxy calls
- Custom spans (tools, DB) via helper APIs
- Metrics: request rate, error rate, duration percentiles; GenAI cost/tokens

### Environment
```env
# OTLP exporters (example)
OTLP_HTTP_TRACES_URL=https://tempo-prod-us-central1.grafana.net/tempo/api/push
OTLP_HTTP_METRICS_URL=https://prometheus-prod-us-central1.grafana.net/api/prom/push
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <YOUR_TOKEN>

# Privacy (optional)
CK_CAPTURE_MODEL_TEXT=false
```

### Frontend Dashboard Coverage
The telemetry dashboard surfaces these from your data:
- KPIs (RPM, Error %, Avg & P95 latency)
- Cost Analytics by model
- Recent Errors and Top Errors
- Top Operations
- Telemetry Explorer (filters + pagination)
- Trace Viewer (hierarchical)
- Service Dependency Graph

See backend `OBSERVABILITY.md` for vendor-specific setup and local collector instructions.
