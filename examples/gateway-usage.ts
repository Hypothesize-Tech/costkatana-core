/**
 * CostKATANA AI Gateway Usage Examples
 * Demonstrates all gateway features including caching, retries, and workflow tracking
 */

import {
  AICostTracker,
  createGatewayClientFromEnv,
  createGatewayClient,
  AIProvider
} from '../src';

async function basicGatewayUsage() {
  console.log('=== Basic Gateway Usage ===');
  
  // Method 1: Using standalone gateway client
  const gateway = createGatewayClientFromEnv({
    baseUrl: 'https://cost-katana-backend.store/api/gateway', // Your gateway URL
    enableCache: true,
    enableRetries: true
  });

  // Make an OpenAI request through the gateway
  const openaiResponse = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'What is the capital of France?' }
    ],
    max_tokens: 50
  });

  console.log('OpenAI Response:', openaiResponse.data);
  console.log('Cache Status:', openaiResponse.metadata.cacheStatus);
  console.log('Retry Attempts:', openaiResponse.metadata.retryAttempts);
}

async function advancedGatewayFeatures() {
  console.log('=== Advanced Gateway Features ===');
  
  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: process.env.API_KEY!,
    enableCache: true,
    enableRetries: true,
    retryConfig: {
      count: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 15000
    },
    cacheConfig: {
      ttl: 3600, // 1 hour
      userScope: 'user_123',
      bucketMaxSize: 3
    }
  });

  // Request with custom options
  const response = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Generate a creative story idea' }
    ],
    max_tokens: 200,
    temperature: 0.8
  }, {
    // Custom cache settings for this request
    cache: {
      ttl: 7200, // 2 hours
      bucketMaxSize: 5 // Multiple responses for variety
    },
    // Custom retry settings
    retry: {
      count: 3,
      factor: 2.5,
      minTimeout: 2000,
      maxTimeout: 20000
    },
    // Custom properties for cost attribution
    properties: {
      feature: 'story-generator',
      priority: 'high',
      environment: 'production'
    },
    // Budget allocation
    budgetId: 'project-xyz-123'
  });

  console.log('Creative Story Response:', response.data);
  console.log('Processing Time:', response.metadata.processingTime);
}

async function workflowTracking() {
  console.log('=== Workflow Tracking ===');
  
  const gateway = createGatewayClientFromEnv();
  const workflowId = `workflow-${Date.now()}`;

  // Step 1: Initial analysis
  const analysisResponse = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Analyze the sentiment of this text: "I love this product!"' }
    ],
    max_tokens: 100
  }, {
    workflow: {
      workflowId,
      workflowName: 'SentimentAnalysis',
      workflowStep: '/analyze'
    },
    properties: {
      step: 'sentiment-analysis'
    }
  });

  // Step 2: Generate summary
  const summaryResponse = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: `Based on this sentiment analysis: ${analysisResponse.data.choices[0].message.content}, create a brief summary.` }
    ],
    max_tokens: 50
  }, {
    workflow: {
      workflowId,
      workflowName: 'SentimentAnalysis',
      workflowStep: '/analyze/summarize'
    },
    properties: {
      step: 'summary-generation'
    }
  });

  console.log('Analysis:', analysisResponse.data.choices[0].message.content);
  console.log('Summary:', summaryResponse.data.choices[0].message.content);
  console.log('Workflow ID:', workflowId);

  // Get workflow details
  const workflowDetails = await gateway.getWorkflowDetails(workflowId);
  console.log('Workflow Total Cost:', workflowDetails.totalCost);
}

async function multiProviderSupport() {
  console.log('=== Multi-Provider Support ===');
  
  const gateway = createGatewayClientFromEnv();

  // OpenAI request
  const openaiResponse = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Explain quantum computing in simple terms' }
    ],
    max_tokens: 150
  }, {
    targetUrl: 'https://api.openai.com',
    properties: { provider: 'openai' }
  });

  // Anthropic request
  const anthropicResponse = await gateway.anthropic({
    model: 'claude-3-haiku-20240307',
    max_tokens: 150,
    messages: [
      { role: 'user', content: 'Explain quantum computing in simple terms' }
    ]
  }, {
    targetUrl: 'https://api.anthropic.com',
    properties: { provider: 'anthropic' }
  });

  // Google AI request
  const googleResponse = await gateway.googleAI('gemini-pro', {
    contents: [{
      parts: [{
        text: 'Explain quantum computing in simple terms'
      }]
    }]
  }, {
    targetUrl: 'https://generativelanguage.googleapis.com',
    properties: { provider: 'google' }
  });

  console.log('OpenAI Response Length:', openaiResponse.data.choices[0].message.content.length);
  console.log('Anthropic Response Length:', anthropicResponse.data.content[0].text.length);
  console.log('Google Response Length:', googleResponse.data.candidates[0].content.parts[0].text.length);
}

async function cacheManagement() {
  console.log('=== Cache Management ===');
  
  const gateway = createGatewayClientFromEnv();

  // Get cache statistics
  const cacheStats = await gateway.getCacheStats();
  console.log('Cache Statistics:', {
    singleCacheSize: cacheStats.singleResponseCache.size,
    bucketCacheSize: cacheStats.bucketCache.size,
    defaultTTL: cacheStats.config.defaultTTLHours + ' hours'
  });

  // Clear expired cache entries
  await gateway.clearCache({ expired: true });
  console.log('Expired cache entries cleared');

  // Clear cache for specific user scope
  await gateway.clearCache({ userScope: 'user_123' });
  console.log('User-scoped cache cleared');
}

async function integratedTrackerUsage() {
  console.log('=== Integrated Tracker Usage ===');
  
  // Create tracker with gateway functionality
  const tracker = await AICostTracker.create({
    providers: [
      { provider: AIProvider.OpenAI }
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
    tracking: {
      enableAutoTracking: true
    }
  });

  // Initialize gateway with custom configuration
  const gateway = tracker.initializeGateway({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    enableCache: true,
    enableRetries: true,
    defaultProperties: {
      application: 'my-ai-app',
      version: '1.0.0'
    }
  });

  // Make requests through the gateway with automatic usage tracking
  const response = await tracker.gatewayOpenAI({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Help me optimize my AI costs' }
    ],
    max_tokens: 200
  }, {
    properties: {
      feature: 'cost-optimization',
      user: 'john-doe'
    },
    workflow: {
      workflowId: 'cost-optimization-session',
      workflowName: 'CostOptimization',
      workflowStep: '/analyze'
    }
  });

  console.log('Response:', response.data.choices[0].message.content);
  console.log('Usage automatically tracked with gateway metadata');

  // Get analytics including gateway usage
  const analytics = await tracker.getAnalytics();
  console.log('Total requests:', analytics.totalRequests);
  console.log('Total cost:', analytics.totalCost);
}

async function cortexIntegration() {
  console.log('=== Cortex Integration ===');
  
  const gateway = createGatewayClientFromEnv();

  // Basic Cortex optimization
  const cortexResponse = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Explain machine learning algorithms in detail' }
    ],
    max_tokens: 300
  }, {
    cortex: {
      enabled: true,
      operation: 'optimize',
      style: 'technical',
      format: 'structured',
      semanticCache: true,
      preserveSemantics: true,
      intelligentRouting: true
    }
  });

  console.log('Cortex Optimized Response:', cortexResponse.data.choices[0].message.content);

  // SAST optimization
  const sastResponse = await gateway.withSast('/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'The artificial intelligence system processes natural language data efficiently.' }
    ],
    max_tokens: 200
  }, {
    language: 'en',
    ambiguityResolution: true,
    crossLingualMode: false,
    disambiguationStrategy: 'hybrid',
    preserveAmbiguity: false,
    maxPrimitives: 50,
    semanticThreshold: 0.8
  });

  console.log('SAST Optimized Response:', sastResponse.data.choices[0].message.content);

  // Compare traditional vs SAST
  const comparison = await gateway.compareSast('/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Analyze the relationship between AI, ML, and deep learning.' }
    ],
    max_tokens: 250
  });

  console.log('Token Reduction:', `${comparison.comparison.tokenReduction.toFixed(2)}%`);
  console.log('Recommended Approach:', comparison.comparison.recommendedApproach);
}

async function errorHandlingAndRetries() {
  console.log('=== Error Handling and Retries ===');
  
  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: process.env.API_KEY!,
    enableRetries: true,
    retryConfig: {
      count: 5,
      factor: 3,
      minTimeout: 2000,
      maxTimeout: 30000
    }
  });

  try {
    // This request will demonstrate retry behavior if the target fails
    const response = await gateway.openai({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'This request tests retry functionality' }
      ],
      max_tokens: 100
    }, {
      targetUrl: 'https://api.openai.com',
      retry: {
        count: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 10000
      }
    });

    console.log('Request succeeded after retries:', response.metadata.retryAttempts);
    
  } catch (error) {
    console.error('Request failed after all retries:', error);
  }
}

async function performanceMonitoring() {
  console.log('=== Performance Monitoring ===');
  
  const gateway = createGatewayClientFromEnv();

  // Get gateway statistics
  const stats = await gateway.getStats();
  console.log('Gateway Performance:', {
    totalRequests: stats.totalRequests,
    cacheHitRate: `${stats.cacheHitRate}%`,
    averageResponseTime: `${stats.averageResponseTime}ms`,
    successRate: `${stats.successRate}%`
  });

  // Provider-specific statistics
  Object.entries(stats.providerStats).forEach(([provider, stats]) => {
    console.log(`${provider} Stats:`, {
      requests: stats.requests,
      successRate: `${stats.successRate}%`,
      avgResponseTime: `${stats.averageResponseTime}ms`
    });
  });
}

// Run all examples
async function runAllExamples() {
  try {
    await basicGatewayUsage();
    await advancedGatewayFeatures();
    await workflowTracking();
    await multiProviderSupport();
    await cacheManagement();
    await integratedTrackerUsage();
    await cortexIntegration();
    await errorHandlingAndRetries();
    await performanceMonitoring();
    
    console.log('\n=== All Gateway Examples Completed Successfully! ===');
  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Export for use in other files
export {
  basicGatewayUsage,
  advancedGatewayFeatures,
  workflowTracking,
  multiProviderSupport,
  cacheManagement,
  integratedTrackerUsage,
  cortexIntegration,
  errorHandlingAndRetries,
  performanceMonitoring,
  runAllExamples
};

// Run if this file is executed directly
if (require.main === module) {
  runAllExamples();
}