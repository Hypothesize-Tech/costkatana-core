# AI Cost Optimizer

A comprehensive toolkit for optimizing AI model costs, tracking usage, and analyzing performance across multiple providers.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, Google AI, AWS Bedrock, Cohere, and more
- **Cost Optimization**: Intelligent prompt compression, context trimming, and request fusion
- **Usage Tracking**: Detailed analytics and cost monitoring
- **Project Management**: Organize usage by projects with budget tracking
- **Real-time Analytics**: Monitor costs, tokens, and performance metrics
- **Suggestion Engine**: AI-powered recommendations for cost reduction

## Installation

```bash
npm install ai-cost-optimizer
```

## Quick Start

```typescript
import { AICostOptimizer } from 'ai-cost-optimizer';

const optimizer = new AICostOptimizer({
  apiKey: 'your-api-key',
  provider: 'openai',
  trackUsage: true
});

const result = await optimizer.optimize({
  prompt: 'Your prompt here',
  model: 'gpt-4',
  projectId: 'project-123' // Optional: Associate with a project
});
```

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
import { AICostOptimizer } from 'ai-cost-optimizer';

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

### Integration with Backend Dashboard

The npm package automatically syncs with the AI Cost Tracker dashboard when configured:

```typescript
const optimizer = new AICostOptimizer({
  apiKey: 'your-api-key',
  provider: 'openai',
  trackUsage: true,
  dashboardConfig: {
    endpoint: 'https://your-dashboard.com/api',
    apiKey: 'dashboard-api-key', // Your dashboard API key from the AI Cost Optimizer dashboard
    syncInterval: 60000, // Sync every minute
    batchSize: 100 // Batch requests for efficiency
  }
});
```

### Environment Variables

Set up your environment variables:

```bash
# Your AI Cost Optimizer Dashboard API Key
API_KEY=dak_your_dashboard_api_key_here

# Your AI Provider API Key (OpenAI, Anthropic, etc.)
OPENAI_API_KEY=your_openai_api_key_here
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
  dashboardApiKey: process.env.API_KEY, // AI Cost Optimizer Dashboard API Key
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

## Examples

See the [examples](./examples) directory for complete implementation examples:

- [Basic Usage](./examples/basic-usage.ts)
- [Advanced Optimization](./examples/advanced-optimization.ts)
- [Project Management](./examples/project-management.ts)
- [Team Collaboration](./examples/team-collaboration.ts)

## Support

For questions and support:

- [Documentation](./docs)
- [GitHub Issues](https://github.com/your-repo/ai-cost-optimizer/issues)
- [Discord Community](https://discord.gg/your-community)

## License

MIT License - see [LICENSE](./LICENSE) file for details.
