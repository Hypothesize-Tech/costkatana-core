/**
 * Email Tracking Example
 * 
 * This example demonstrates how to use CostKatana's email tracking functionality
 * to capture both user email (developer/integrator) and customer email (end user)
 * for enhanced analytics and business intelligence.
 */

import { AICostTracker, AIProvider } from '../src/index';

async function emailTrackingExample() {
  console.log('🚀 Starting Email Tracking Example...\n');

  try {
    // 1. Initialize the tracker
    const tracker = await AICostTracker.create({
      providers: [{
        provider: AIProvider.OpenAI,
        apiKey: process.env.OPENAI_API_KEY
      }],
      tracking: {
        enableAutoTracking: true
      }
    });

    console.log('✅ Tracker initialized successfully');

    // 2. Basic usage tracking with email information
    console.log('\n📊 Example 1: Basic Usage Tracking with Emails');
    
    await tracker.trackUsage({
      provider: 'openai',
      model: 'gpt-4',
      promptTokens: 150,
      completionTokens: 50,
      totalTokens: 200,
      estimatedCost: 0.008,
      prompt: 'Help me optimize this React component',
      completion: 'Here are several optimization strategies...',
      userEmail: 'developer@yourcompany.com',      // Developer email
      customerEmail: 'client@clientcompany.com'    // End customer email
    });

    console.log('✅ Usage tracked with both emails');

    // 3. Gateway usage with email tracking
    console.log('\n🌐 Example 2: Gateway Requests with Email Tracking');
    
    const gateway = tracker.initializeGateway({
      baseUrl: 'https://cost-katana-backend.store/api/gateway',
      apiKey: process.env.COSTKATANA_API_KEY
    });

    const response = await tracker.gatewayRequest('/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Explain TypeScript generics' }]
    }, {
      userEmail: 'senior-dev@yourcompany.com',
      customerEmail: 'junior-dev@clientcompany.com',
      projectId: 'typescript-training'
    });

    console.log('✅ Gateway request completed with email tracking');
    console.log('Response:', response.data.choices[0].message.content);

    // 4. OpenAI-specific gateway with email tracking
    console.log('\n🤖 Example 3: OpenAI Gateway with Email Tracking');
    
    const openaiResponse = await tracker.gatewayOpenAI({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Write a Python function to sort a list' }]
    }, {
      userEmail: 'python-dev@yourcompany.com',
      customerEmail: 'student@university.edu',
      properties: {
        'course': 'CS101',
        'assignment': 'sorting-algorithms'
      }
    });

    console.log('✅ OpenAI gateway request completed with email tracking');

    // 5. Workflow tracking with email information
    console.log('\n🔄 Example 4: Workflow Tracking with Emails');
    
    const workflowId = `workflow-${Date.now()}`;
    
    // Step 1: Initial analysis
    await tracker.gatewayRequest('/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Analyze this customer feedback data...' }]
    }, {
      workflow: {
        workflowId,
        workflowName: 'CustomerFeedbackAnalysis',
        workflowStep: 'data-analysis'
      },
      userEmail: 'data-scientist@yourcompany.com',
      customerEmail: 'product-manager@clientcompany.com'
    });

    // Step 2: Generate insights
    await tracker.gatewayRequest('/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Generate actionable insights from the analysis...' }]
    }, {
      workflow: {
        workflowId,
        workflowName: 'CustomerFeedbackAnalysis',
        workflowStep: 'insights-generation'
      },
      userEmail: 'data-scientist@yourcompany.com',
      customerEmail: 'product-manager@clientcompany.com'
    });

    console.log('✅ Workflow tracking completed with email information');

    // 6. Batch usage tracking with different customer emails
    console.log('\n📦 Example 5: Batch Usage Tracking with Multiple Customers');
    
    const customers = [
      'customer1@company.com',
      'customer2@company.com',
      'customer3@company.com'
    ];

    for (const customerEmail of customers) {
      await tracker.trackUsage({
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        promptTokens: 50,
        completionTokens: 25,
        totalTokens: 75,
        estimatedCost: 0.002,
        prompt: 'Generate a product description',
        completion: 'This amazing product...',
        userEmail: 'content-writer@yourcompany.com',
        customerEmail: customerEmail,
        tags: ['product-description', 'batch-generation']
      });
    }

    console.log('✅ Batch usage tracking completed for multiple customers');

    // 7. Error tracking with email information
    console.log('\n⚠️ Example 6: Error Tracking with Emails');
    
    try {
      // Simulate an error scenario
      await tracker.trackUsage({
        provider: 'openai',
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 0,
        totalTokens: 100,
        estimatedCost: 0.004,
        prompt: 'This will cause an error',
        errorOccurred: true,
        errorMessage: 'Simulated error for testing',
        userEmail: 'test-dev@yourcompany.com',
        customerEmail: 'test-client@clientcompany.com'
      });
    } catch (error) {
      console.log('✅ Error tracking with emails completed');
    }

    // 8. Get analytics with email-based insights
    console.log('\n📈 Example 7: Analytics with Email-Based Insights');
    
    try {
      const analytics = await tracker.getAnalytics();
      console.log('✅ Analytics retrieved successfully');
      console.log('Total cost:', analytics.totalCost);
      console.log('Total tokens:', analytics.totalTokens);
    } catch (error) {
      console.log('⚠️ Analytics retrieval failed (may need backend setup)');
    }

    console.log('\n🎉 Email Tracking Example Completed Successfully!');
    console.log('\n📋 Summary of what was demonstrated:');
    console.log('• Basic usage tracking with userEmail and customerEmail');
    console.log('• Gateway requests with email tracking');
    console.log('• OpenAI-specific gateway with email support');
    console.log('• Workflow tracking with email information');
    console.log('• Batch processing with multiple customer emails');
    console.log('• Error tracking with email context');
    console.log('• Analytics retrieval with email-based data');

  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Helper function to demonstrate different email scenarios
async function demonstrateEmailScenarios() {
  console.log('\n🔍 Demonstrating Different Email Scenarios...\n');

  const tracker = await AICostTracker.create({
    providers: [{
      provider: AIProvider.OpenAI,
      apiKey: process.env.OPENAI_API_KEY
    }],
    tracking: {
      enableAutoTracking: true
    }
  });

  // Scenario 1: Internal development team
  await tracker.trackUsage({
    provider: 'openai',
    model: 'gpt-4',
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150,
    estimatedCost: 0.006,
    prompt: 'Debug this JavaScript code',
    completion: 'The issue is in line 15...',
    userEmail: 'frontend-dev@yourcompany.com',
    customerEmail: 'internal@yourcompany.com',  // Internal usage
    tags: ['internal', 'development', 'debugging']
  });

  // Scenario 2: Client project
  await tracker.trackUsage({
    provider: 'openai',
    model: 'gpt-4',
    promptTokens: 200,
    completionTokens: 100,
    totalTokens: 300,
    estimatedCost: 0.012,
    prompt: 'Generate marketing copy for a new product',
    completion: 'Introducing our revolutionary new product...',
    userEmail: 'marketing-dev@yourcompany.com',
    customerEmail: 'marketing@clientcompany.com',  // External client
    tags: ['client-project', 'marketing', 'copy-generation']
  });

  // Scenario 3: SaaS application usage
  await tracker.trackUsage({
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    promptTokens: 75,
    completionTokens: 40,
    totalTokens: 115,
    estimatedCost: 0.003,
    prompt: 'Help me understand this error message',
    completion: 'This error typically occurs when...',
    userEmail: 'saas-dev@yourcompany.com',
    customerEmail: 'enduser@saasapp.com',  // End user of your SaaS
    tags: ['saas', 'user-support', 'error-help']
  });

  console.log('✅ Email scenarios demonstrated successfully');
}

// Run the examples
if (require.main === module) {
  emailTrackingExample()
    .then(() => demonstrateEmailScenarios())
    .then(() => {
      console.log('\n✨ All examples completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Examples failed:', error);
      process.exit(1);
    });
}

export { emailTrackingExample, demonstrateEmailScenarios };
