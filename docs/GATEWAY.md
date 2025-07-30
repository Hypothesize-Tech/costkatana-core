# CostKATANA AI Gateway Documentation

## Overview

The CostKATANA AI Gateway provides intelligent proxy functionality that sits between your application and AI providers, offering advanced features like caching, retries, workflow tracking, and cost optimization.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Gateway Client](#gateway-client)
- [Configuration](#configuration)
- [Features](#features)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Installation

```bash
npm install ai-cost-tracker
```

## Quick Start

### Environment Setup

```bash
# Required environment variables
COSTKATANA_API_KEY=your_api_key_here
# or
API_KEY=your_api_key_here

# Optional: Custom gateway URL
COSTKATANA_GATEWAY_URL=https://cost-katana-backend.store/api/gateway
```

### Basic Usage

```typescript
import { createGatewayClientFromEnv } from 'ai-cost-tracker';

// Create client using environment variables
const gateway = createGatewayClientFromEnv();

// Make a request through the gateway
const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Hello, world!' }
  ],
  max_tokens: 50
});

console.log(response.data.choices[0].message.content);
console.log('Cache Status:', response.metadata.cacheStatus);
```

## Gateway Client

### Creating a Gateway Client

#### Method 1: From Environment Variables

```typescript
import { createGatewayClientFromEnv } from 'ai-cost-tracker';

const gateway = createGatewayClientFromEnv({
  // Optional overrides
  enableCache: true,
  enableRetries: true,
  retryConfig: {
    count: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000
  }
});
```

#### Method 2: Manual Configuration

```typescript
import { createGatewayClient } from 'ai-cost-tracker';

const gateway = createGatewayClient({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  apiKey: 'your-api-key',
  enableCache: true,
  enableRetries: true,
  defaultTargetUrl: 'https://api.openai.com',
  defaultProperties: {
    application: 'my-app',
    version: '1.0.0'
  }
});
```

#### Method 3: Via AICostTracker

```typescript
import AICostTracker from 'ai-cost-tracker';

const tracker = await AICostTracker.create({
  providers: [{ provider: 'openai' }],
  optimization: { enablePromptOptimization: true },
  tracking: { enableAutoTracking: true }
});

const gateway = tracker.initializeGateway({
  baseUrl: 'https://cost-katana-backend.store/api/gateway',
  enableCache: true,
  enableRetries: true
});
```

## Configuration

### GatewayConfig Interface

```typescript
interface GatewayConfig {
  baseUrl: string;                    // Gateway server URL
  apiKey: string;                     // Authentication API key
  defaultTargetUrl?: string;          // Default AI provider URL
  enableCache?: boolean;              // Enable caching globally
  enableRetries?: boolean;            // Enable retries globally
  retryConfig?: RetryConfig;          // Default retry settings
  cacheConfig?: CacheConfig;          // Default cache settings
  defaultProperties?: Record<string, string>; // Default request properties
}
```

### RetryConfig Interface

```typescript
interface RetryConfig {
  count?: number;        // Max retry attempts (0-10, default: 3)
  factor?: number;       // Exponential backoff factor (1-5, default: 2)
  minTimeout?: number;   // Min wait time in ms (100-60000, default: 1000)
  maxTimeout?: number;   // Max wait time in ms (1000-300000, default: 10000)
}
```

### CacheConfig Interface

```typescript
interface CacheConfig {
  ttl?: number;          // Cache TTL in seconds (default: 604800 = 7 days)
  userScope?: string;    // User scope for cache isolation
  bucketMaxSize?: number; // Max responses for variety (1-10, default: 1)
}
```

## Features

### 1. Smart Caching

Reduce costs by caching responses with configurable TTL and user scoping.

```typescript
// Basic caching
const response = await gateway.openai(request, {
  cache: true
});

// Advanced caching
const response = await gateway.openai(request, {
  cache: {
    ttl: 3600,           // 1 hour
    userScope: 'user_123', // User-specific cache
    bucketMaxSize: 5     // Store 5 different responses
  }
});
```

### 2. Smart Retries

Automatic retry with exponential backoff for transient failures.

```typescript
const response = await gateway.openai(request, {
  retry: {
    count: 5,         // Max 5 attempts
    factor: 2.5,      // Aggressive backoff
    minTimeout: 2000, // Start with 2 seconds
    maxTimeout: 30000 // Cap at 30 seconds
  }
});
```

### 3. Workflow Tracking

Group related requests to understand end-to-end costs.

```typescript
const workflowId = `workflow-${Date.now()}`;

// Step 1
await gateway.openai(request1, {
  workflow: {
    workflowId,
    workflowName: 'DataProcessing',
    workflowStep: '/extract'
  }
});

// Step 2
await gateway.openai(request2, {
  workflow: {
    workflowId,
    workflowName: 'DataProcessing',
    workflowStep: '/analyze'
  }
});

// Get workflow details
const details = await gateway.getWorkflowDetails(workflowId);
```

### 4. Cost Attribution

Add custom properties for detailed cost tracking.

```typescript
const response = await gateway.openai(request, {
  properties: {
    feature: 'chat-bot',
    user: 'john-doe',
    priority: 'high',
    environment: 'production'
  },
  budgetId: 'project-abc-123'
});
```

### 5. Privacy Controls

Omit sensitive data from logs.

```typescript
const response = await gateway.openai(request, {
  omitRequest: true,  // Don't log request content
  omitResponse: true, // Don't log response content
  security: true      // Enable additional security scanning
});
```

## API Reference

### Gateway Client Methods

#### `openai(request, options?)`

Make OpenAI-compatible requests.

```typescript
const response = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
  max_tokens: 100
}, {
  targetUrl: 'https://api.openai.com',
  cache: true,
  retry: { count: 3 }
});
```

#### `anthropic(request, options?)`

Make Anthropic-compatible requests.

```typescript
const response = await gateway.anthropic({
  model: 'claude-3-haiku-20240307',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  targetUrl: 'https://api.anthropic.com'
});
```

#### `googleAI(model, request, options?)`

Make Google AI-compatible requests.

```typescript
const response = await gateway.googleAI('gemini-pro', {
  contents: [{
    parts: [{ text: 'Hello!' }]
  }]
}, {
  targetUrl: 'https://generativelanguage.googleapis.com'
});
```

#### `cohere(request, options?)`

Make Cohere-compatible requests.

```typescript
const response = await gateway.cohere({
  model: 'command',
  prompt: 'Hello!',
  max_tokens: 100
}, {
  targetUrl: 'https://api.cohere.ai'
});
```

#### `makeRequest(endpoint, data, options?)`

Make generic requests to any endpoint.

```typescript
const response = await gateway.makeRequest('/v1/chat/completions', {
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  targetUrl: 'https://api.openai.com',
  cache: true
});
```

### Management Methods

#### `getStats()`

Get gateway performance statistics.

```typescript
const stats = await gateway.getStats();
console.log('Total Requests:', stats.totalRequests);
console.log('Cache Hit Rate:', stats.cacheHitRate + '%');
console.log('Success Rate:', stats.successRate + '%');
```

#### `getCacheStats()`

Get detailed cache statistics.

```typescript
const cacheStats = await gateway.getCacheStats();
console.log('Cache Size:', cacheStats.singleResponseCache.size);
console.log('Bucket Cache Size:', cacheStats.bucketCache.size);
```

#### `clearCache(options?)`

Clear cache entries.

```typescript
// Clear all cache
await gateway.clearCache();

// Clear expired entries only
await gateway.clearCache({ expired: true });

// Clear user-specific cache
await gateway.clearCache({ userScope: 'user_123' });
```

#### `getWorkflows(options?)`

Get workflow summaries.

```typescript
const workflows = await gateway.getWorkflows({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
  workflowName: 'DataProcessing',
  limit: 100
});
```

#### `getWorkflowDetails(workflowId)`

Get detailed workflow information.

```typescript
const details = await gateway.getWorkflowDetails('workflow-123');
console.log('Total Cost:', details.totalCost);
console.log('Request Count:', details.requests.length);
```

#### `exportWorkflows(options?)`

Export workflow data as CSV.

```typescript
const csv = await gateway.exportWorkflows({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31')
});
```

#### `healthCheck()`

Check gateway health.

```typescript
const health = await gateway.healthCheck();
console.log('Status:', health.status);
```

## Examples

### Basic Request with Caching

```typescript
import { createGatewayClientFromEnv } from 'ai-cost-tracker';

const gateway = createGatewayClientFromEnv();

// First request - cache MISS
const response1 = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'What is 2+2?' }]
}, { cache: true });

console.log('First request:', response1.metadata.cacheStatus); // MISS

// Second identical request - cache HIT
const response2 = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'What is 2+2?' }]
}, { cache: true });

console.log('Second request:', response2.metadata.cacheStatus); // HIT
```

### Multi-Step Workflow

```typescript
const workflowId = `analysis-${Date.now()}`;

// Step 1: Extract data
const extractResponse = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Extract key points from this text...' }]
}, {
  workflow: {
    workflowId,
    workflowName: 'DocumentAnalysis',
    workflowStep: '/extract'
  },
  properties: {
    document_type: 'research_paper',
    priority: 'high'
  }
});

// Step 2: Analyze extracted data
const analyzeResponse = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Extract key points from this text...' },
    { role: 'assistant', content: extractResponse.data.choices[0].message.content },
    { role: 'user', content: 'Now analyze these key points...' }
  ]
}, {
  workflow: {
    workflowId,
    workflowName: 'DocumentAnalysis',
    workflowStep: '/analyze'
  }
});

// Step 3: Generate summary
const summaryResponse = await gateway.openai({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Create a summary based on this analysis...' }
  ]
}, {
  workflow: {
    workflowId,
    workflowName: 'DocumentAnalysis',
    workflowStep: '/summarize'
  }
});

// Get workflow analytics
const workflowDetails = await gateway.getWorkflowDetails(workflowId);
console.log('Workflow completed:');
console.log('- Total Cost:', workflowDetails.totalCost);
console.log('- Total Requests:', workflowDetails.requests.length);
console.log('- Duration:', workflowDetails.duration + 'ms');
```

### Error Handling with Retries

```typescript
try {
  const response = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello!' }]
  }, {
    retry: {
      count: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 30000
    }
  });

  console.log('Success after', response.metadata.retryAttempts, 'retries');
  
} catch (error) {
  console.error('Request failed after all retries:', error);
}
```

### Response Variety with Bucket Caching

```typescript
// Generate multiple creative responses for the same prompt
const responses = [];

for (let i = 0; i < 5; i++) {
  const response = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'Tell me a creative story idea' }],
    temperature: 0.8
  }, {
    cache: {
      bucketMaxSize: 5, // Store up to 5 different responses
      ttl: 3600        // Cache for 1 hour
    }
  });
  
  responses.push(response.data.choices[0].message.content);
}

// Each response will be different due to bucket caching
console.log('Generated', responses.length, 'unique responses');
```

## Best Practices

### 1. Cache Configuration

- Use appropriate TTL values based on content freshness requirements
- Use user scoping for personalized content
- Use bucket caching for creative tasks requiring variety
- Clear expired cache regularly in production

### 2. Retry Configuration

- Use conservative retry settings for rate-limited APIs
- Increase retry attempts for critical workflows
- Use longer timeouts for complex requests
- Monitor retry rates to identify provider issues

### 3. Workflow Organization

- Use descriptive workflow names and steps
- Group related requests logically
- Include relevant properties for cost attribution
- Export workflow data regularly for analysis

### 4. Performance Optimization

- Enable caching for repeated requests
- Use appropriate retry settings to avoid unnecessary delays
- Monitor gateway statistics to identify bottlenecks
- Use workflow tracking to optimize multi-step processes

### 5. Security

- Use `omitRequest` and `omitResponse` for sensitive data
- Implement proper API key management
- Use user scoping to prevent data leakage
- Enable security scanning for production environments

### 6. Cost Management

- Use custom properties for detailed cost attribution
- Set budget IDs for project-based tracking
- Monitor workflow costs to identify expensive operations
- Use caching to reduce redundant API calls

## Error Handling

The gateway client throws standard JavaScript errors. Common error types:

- **Authentication Error**: Invalid API key
- **Network Error**: Connection issues
- **Rate Limit Error**: Too many requests
- **Validation Error**: Invalid request parameters
- **Timeout Error**: Request timeout exceeded

```typescript
try {
  const response = await gateway.openai(request);
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Authentication failed');
  } else if (error.response?.status === 429) {
    console.error('Rate limit exceeded');
  } else if (error.code === 'ECONNRESET') {
    console.error('Network connection error');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## Support

For issues and questions:

- GitHub Issues: [ai-cost-optimizer-core/issues](https://github.com/Hypothesize-Tech/ai-cost-optimizer-core/issues)
- Documentation: [costkatana.com/docs](https://costkatana.com/docs)
- Email: support@costkatana.com