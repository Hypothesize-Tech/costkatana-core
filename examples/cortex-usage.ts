/**
 * CostKATANA Cortex Usage Examples
 * Demonstrates Cortex meta-language processing and SAST optimization
 */

import {
  createGatewayClient,
  createGatewayClientFromEnv,
  AICostTracker,
  AIProvider
} from '../src';

async function basicCortexUsage() {
  console.log('=== Basic Cortex Usage ===');
  
  const gateway = createGatewayClientFromEnv({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    enableCache: true,
    enableRetries: true
  });

  // Basic Cortex optimization
  const response = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Write a detailed explanation of machine learning algorithms' }
    ],
    max_tokens: 500
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

  console.log('Cortex Optimized Response:', response.data);
  console.log('Processing Time:', response.metadata.processingTime);
}

async function sastOptimization() {
  console.log('=== SAST (Semantic Abstract Syntax Tree) Optimization ===');
  
  const gateway = createGatewayClientFromEnv();

  // SAST optimization with semantic primitives
  const response = await gateway.withSast('/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'The quick brown fox jumps over the lazy dog and then runs through the forest to find food.' }
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

  console.log('SAST Optimized Response:', response.data);
  console.log('SAST Processing Time:', response.metadata.processingTime);
}

async function sastComparison() {
  console.log('=== SAST vs Traditional Optimization Comparison ===');
  
  const gateway = createGatewayClientFromEnv();

  const testPrompt = 'Analyze the complex relationship between artificial intelligence, machine learning, and deep learning technologies in modern software development.';

  // Compare traditional vs SAST optimization
  const comparison = await gateway.compareSast('/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: testPrompt }
    ],
    max_tokens: 300
  });

  console.log('Traditional Response Length:', comparison.traditional.data.choices[0].message.content.length);
  console.log('SAST Response Length:', comparison.sast.data.choices[0].message.content.length);
  console.log('Token Reduction:', `${comparison.comparison.tokenReduction.toFixed(2)}%`);
  console.log('Processing Time Difference:', `${comparison.comparison.processingTimeDiff}ms`);
  console.log('Recommended Approach:', comparison.comparison.recommendedApproach);
}

async function crossLingualSemantics() {
  console.log('=== Cross-Lingual Semantic Processing ===');
  
  const gateway = createGatewayClientFromEnv();

  const testPrompt = 'Explain the concept of artificial intelligence in simple terms.';

  // Test universal semantic compatibility across languages
  const responses = await gateway.testUniversalSemantics('/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: testPrompt }
    ],
    max_tokens: 200
  }, ['en', 'es', 'fr'], {
    properties: {
      test: 'cross-lingual-semantics'
    }
  });

  responses.forEach((response, index) => {
    const languages = ['English', 'Spanish', 'French'];
    console.log(`${languages[index]} Response:`, response.data.choices[0].message.content.substring(0, 100) + '...');
  });
}

async function sastVocabularyExploration() {
  console.log('=== SAST Vocabulary and Semantic Primitives ===');
  
  const gateway = createGatewayClientFromEnv();

  // Get SAST vocabulary statistics
  const vocabularyStats = await gateway.getSastVocabulary();
  console.log('SAST Vocabulary Stats:', vocabularyStats.data);

  // Search semantic primitives
  const searchResults = await gateway.searchSemanticPrimitives({
    term: 'intelligence',
    category: 'concept',
    language: 'en',
    limit: 5
  });

  console.log('Semantic Primitives Search Results:');
  searchResults.data.results.forEach((result: any, index: number) => {
    console.log(`${index + 1}. ${result.primitive.baseForm} (${result.primitive.category})`);
    console.log(`   Definition: ${result.primitive.definition}`);
    console.log(`   Relevance: ${result.relevanceScore.toFixed(3)}`);
  });

  // Get telescope ambiguity resolution demo
  const telescopeDemo = await gateway.getTelescopeDemo();
  console.log('Telescope Ambiguity Resolution Demo:', telescopeDemo.data);

  // Get SAST performance statistics
  const sastStats = await gateway.getSastStats();
  console.log('SAST Performance Stats:', sastStats.data);
}

async function advancedCortexConfiguration() {
  console.log('=== Advanced Cortex Configuration ===');
  
  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: process.env.API_KEY!,
    enableCache: true,
    enableRetries: true
  });

  // Advanced Cortex with custom SAST configuration
  const response = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Create a comprehensive analysis of renewable energy technologies and their environmental impact.' }
    ],
    max_tokens: 600
  }, {
    cortex: {
      enabled: true,
      operation: 'sast',
      style: 'formal',
      format: 'markdown',
      semanticCache: true,
      preserveSemantics: true,
      intelligentRouting: true,
      sast: {
        enabled: true,
        language: 'en',
        ambiguityResolution: true,
        crossLingualMode: true,
        disambiguationStrategy: 'strict',
        preserveAmbiguity: false,
        maxPrimitives: 100,
        semanticThreshold: 0.9
      }
    },
    properties: {
      analysis_type: 'comprehensive',
      domain: 'renewable_energy',
      complexity: 'high'
    }
  });

  console.log('Advanced Cortex Response:', response.data.choices[0].message.content);
}

async function cortexWithWorkflowTracking() {
  console.log('=== Cortex with Workflow Tracking ===');
  
  const gateway = createGatewayClientFromEnv();
  const workflowId = `cortex-workflow-${Date.now()}`;

  // Step 1: Initial analysis with Cortex
  const analysisResponse = await gateway.openai({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Analyze the key components of a successful AI implementation strategy.' }
    ],
    max_tokens: 300
  }, {
    cortex: {
      enabled: true,
      operation: 'optimize',
      style: 'technical',
      format: 'structured'
    },
    workflow: {
      workflowId,
      workflowName: 'AIStrategyAnalysis',
      workflowStep: '/analyze'
    },
    properties: {
      step: 'initial-analysis',
      method: 'cortex-optimization'
    }
  });

  // Step 2: SAST optimization for refinement
  const refinedResponse = await gateway.withSast('/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: `Based on this analysis: ${analysisResponse.data.choices[0].message.content}, provide specific implementation recommendations.` }
    ],
    max_tokens: 400
  }, {
    language: 'en',
    ambiguityResolution: true,
    disambiguationStrategy: 'hybrid'
  }, {
    workflow: {
      workflowId,
      workflowName: 'AIStrategyAnalysis',
      workflowStep: '/analyze/refine'
    },
    properties: {
      step: 'refinement',
      method: 'sast-optimization'
    }
  });

  console.log('Analysis Step:', analysisResponse.data.choices[0].message.content.substring(0, 150) + '...');
  console.log('Refinement Step:', refinedResponse.data.choices[0].message.content.substring(0, 150) + '...');

  // Get workflow details
  const workflowDetails = await gateway.getWorkflowDetails(workflowId);
  console.log('Cortex Workflow Total Cost:', workflowDetails.totalCost);
  console.log('Total Steps:', workflowDetails.requests.length);
}

async function integratedTrackerWithCortex() {
  console.log('=== Integrated Tracker with Cortex ===');
  
  // Create tracker with Cortex capabilities
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

  // Initialize gateway with Cortex support
  const gateway = tracker.initializeGateway({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    enableCache: true,
    enableRetries: true,
    defaultProperties: {
      application: 'cortex-integration',
      version: '1.0.0'
    }
  });

  // Make Cortex-optimized request with automatic tracking
  const response = await tracker.gatewayOpenAI({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Design a scalable microservices architecture for an AI-powered e-commerce platform.' }
    ],
    max_tokens: 500
  }, {
    cortex: {
      enabled: true,
      operation: 'sast',
      style: 'technical',
      format: 'structured',
      sast: {
        enabled: true,
        language: 'en',
        ambiguityResolution: true,
        maxPrimitives: 75,
        semanticThreshold: 0.85
      }
    },
    properties: {
      feature: 'architecture-design',
      complexity: 'high',
      domain: 'e-commerce'
    },
    workflow: {
      workflowId: 'architecture-design-session',
      workflowName: 'MicroservicesArchitecture'
    }
  });

  console.log('Cortex-Optimized Architecture Design:', response.data.choices[0].message.content);
  console.log('Usage automatically tracked with Cortex metadata');

  // Get analytics including Cortex usage
  const analytics = await tracker.getAnalytics();
  console.log('Total requests with Cortex:', analytics.totalRequests);
  console.log('Total cost with optimization:', analytics.totalCost);
}

async function cortexPerformanceAnalysis() {
  console.log('=== Cortex Performance Analysis ===');
  
  const gateway = createGatewayClientFromEnv();

  const testPrompts = [
    'Explain quantum computing principles',
    'Analyze market trends in renewable energy',
    'Design a machine learning pipeline for image recognition',
    'Create a comprehensive business strategy for AI adoption'
  ];

  const results: Array<{
    prompt: string;
    traditionalTime: number;
    cortexTime: number;
    traditionalLength: number;
    cortexLength: number;
    timeImprovement: string;
  }> = [];

  for (const prompt of testPrompts) {
    console.log(`Testing prompt: "${prompt.substring(0, 50)}..."`);
    
    // Traditional request
    const traditionalStart = Date.now();
    const traditionalResponse = await gateway.openai({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    });
    const traditionalTime = Date.now() - traditionalStart;

    // Cortex-optimized request
    const cortexStart = Date.now();
    const cortexResponse = await gateway.openai({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300
    }, {
      cortex: {
        enabled: true,
        operation: 'optimize',
        style: 'technical',
        format: 'structured'
      }
    });
    const cortexTime = Date.now() - cortexStart;

    results.push({
      prompt: prompt.substring(0, 30),
      traditionalTime,
      cortexTime,
      traditionalLength: traditionalResponse.data.choices[0].message.content.length,
      cortexLength: cortexResponse.data.choices[0].message.content.length,
      timeImprovement: ((traditionalTime - cortexTime) / traditionalTime * 100).toFixed(2)
    });
  }

  console.log('\nPerformance Analysis Results:');
  console.table(results);

  const avgTimeImprovement = results.reduce((sum, r) => sum + parseFloat(r.timeImprovement), 0) / results.length;
  console.log(`Average Time Improvement: ${avgTimeImprovement.toFixed(2)}%`);
}

// Run all Cortex examples
async function runAllCortexExamples() {
  try {
    await basicCortexUsage();
    await sastOptimization();
    await sastComparison();
    await crossLingualSemantics();
    await sastVocabularyExploration();
    await advancedCortexConfiguration();
    await cortexWithWorkflowTracking();
    await integratedTrackerWithCortex();
    await cortexPerformanceAnalysis();
    
    console.log('\n=== All Cortex Examples Completed Successfully! ===');
  } catch (error) {
    console.error('Cortex example failed:', error);
  }
}

// Export for use in other files
export {
  basicCortexUsage,
  sastOptimization,
  sastComparison,
  crossLingualSemantics,
  sastVocabularyExploration,
  advancedCortexConfiguration,
  cortexWithWorkflowTracking,
  integratedTrackerWithCortex,
  cortexPerformanceAnalysis,
  runAllCortexExamples
};

// Run if this file is executed directly
if (require.main === module) {
  runAllCortexExamples();
}
