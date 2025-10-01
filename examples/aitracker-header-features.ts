/**
 * AICostTracker Header Features Example
 * 
 * This example demonstrates how to use project ID and authentication method headers
 * with the AICostTracker class for advanced request tracking and project management.
 */

import { AICostTracker, AIProvider } from 'ai-cost-tracker';

// Example 1: Initialize AICostTracker with Project ID
async function initializeTrackerWithProjectId() {
  console.log('🚀 Initialize AICostTracker with Project ID');
  
  // Set environment variables
  process.env.API_KEY = 'dak_your_api_key_here';
  process.env.PROJECT_ID = 'my-main-project';
  process.env.API_KEY = 'dak_your_api_key_here';

  try {
    const tracker = await AICostTracker.create({
      providers: [
        {
          provider: AIProvider.OpenAI,
          apiKey: 'sk-your-openai-key',
          baseUrl: 'https://api.openai.com/v1'
        }
      ],
      optimization: {
        enablePromptOptimization: true,
        enableContextTrimming: true,
        enableRequestFusion: false
      },
      tracking: {
        enableAutoTracking: true,
        trackTokenUsage: true,
        trackCosts: true
      }
    });

    // Initialize gateway for proxy functionality
    const gateway = tracker.initializeGateway();
    
    console.log('✅ AICostTracker initialized with gateway support');
    console.log('   Default Project ID:', process.env.PROJECT_ID);
    
    return tracker;
  } catch (error) {
    console.error('❌ Failed to initialize tracker:', error);
    throw error;
  }
}

// Example 2: Gateway Requests with Project ID Override
async function gatewayRequestsWithProjectId() {
  console.log('\n📊 Gateway Requests with Project ID Override');
  
  const tracker = await initializeTrackerWithProjectId();

  try {
    // Request 1: Use default project ID from environment
    console.log('Making request with default project ID...');
    const response1 = await tracker.gatewayOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello from default project!' }
      ]
    });

    console.log('✅ Default project request successful');
    console.log(`   Request ID: ${response1.metadata.requestId}`);

    // Request 2: Override project ID for specific request
    console.log('Making request with custom project ID...');
    const response2 = await tracker.gatewayOpenAI({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello from custom project!' }
      ]
    }, {
      projectId: 'custom-project-456', // Override project ID
      authMethodOverride: 'gateway',   // Explicitly use gateway auth
      properties: {
        'feature': 'chat-completion',
        'environment': 'development'
      }
    });

    console.log('✅ Custom project request successful');
    console.log(`   Request ID: ${response2.metadata.requestId}`);
    console.log(`   Project ID: custom-project-456`);

  } catch (error) {
    console.error('❌ Gateway requests failed:', error);
  }
}

// Example 3: Multi-Project Usage Tracking
async function multiProjectUsageTracking() {
  console.log('\n🏢 Multi-Project Usage Tracking');
  
  const tracker = await initializeTrackerWithProjectId();

  const projects = [
    { id: 'frontend-app', name: 'Frontend Application', model: 'gpt-3.5-turbo' },
    { id: 'backend-api', name: 'Backend API', model: 'gpt-4' },
    { id: 'mobile-app', name: 'Mobile Application', model: 'gpt-3.5-turbo' }
  ];

  try {
    for (const project of projects) {
      console.log(`\nProcessing project: ${project.name}`);
      
      const response = await tracker.gatewayOpenAI({
        model: project.model,
        messages: [
          { role: 'user', content: `Generate code for ${project.name}` }
        ]
      }, {
        projectId: project.id,
        properties: {
          'project-name': project.name,
          'request-type': 'code-generation',
          'model-tier': project.model.includes('gpt-4') ? 'premium' : 'standard'
        }
      });

      console.log(`✅ ${project.name} request completed`);
      console.log(`   Project ID: ${project.id}`);
      console.log(`   Model: ${project.model}`);
      console.log(`   Request ID: ${response.metadata.requestId}`);
    }
  } catch (error) {
    console.error('❌ Multi-project tracking failed:', error);
  }
}

// Example 4: Anthropic Requests with Project Tracking
async function anthropicRequestsWithProjectTracking() {
  console.log('\n🤖 Anthropic Requests with Project Tracking');
  
  const tracker = await initializeTrackerWithProjectId();

  try {
    const response = await tracker.gatewayAnthropic({
      model: 'claude-3-sonnet-20240229',
      messages: [
        { role: 'user', content: 'Explain quantum computing in simple terms' }
      ],
      max_tokens: 200
    }, {
      projectId: 'research-project',
      authMethodOverride: 'gateway',
      properties: {
        'department': 'research',
        'topic': 'quantum-computing',
        'audience': 'general'
      }
    });

    console.log('✅ Anthropic request successful');
    console.log(`   Project ID: research-project`);
    console.log(`   Request ID: ${response.metadata.requestId}`);
    console.log(`   Model: claude-3-sonnet-20240229`);
  } catch (error) {
    console.error('❌ Anthropic request failed:', error);
  }
}

// Example 5: Firewall Protected Requests with Project ID
async function firewallProtectedRequestsWithProjectId() {
  console.log('\n🛡️ Firewall Protected Requests with Project ID');
  
  const tracker = await initializeTrackerWithProjectId();

  try {
    const response = await tracker.gatewayOpenAIWithFirewall({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Help me write a secure authentication system' }
      ]
    }, {
      enabled: true,
      advanced: true,
      promptThreshold: 0.8,
      llamaThreshold: 0.7
    }, {
      projectId: 'security-project',
      authMethodOverride: 'gateway',
      properties: {
        'security-level': 'high',
        'request-type': 'code-generation',
        'domain': 'authentication'
      }
    });

    console.log('✅ Firewall protected request successful');
    console.log(`   Project ID: security-project`);
    console.log(`   Request ID: ${response.metadata.requestId}`);
    console.log(`   Firewall: Enabled with advanced protection`);
  } catch (error) {
    console.error('❌ Firewall protected request failed:', error);
  }
}

// Example 6: Proxy Key Requests with Project Tracking
async function proxyKeyRequestsWithProjectTracking() {
  console.log('\n🔑 Proxy Key Requests with Project Tracking');
  
  const tracker = await initializeTrackerWithProjectId();

  try {
    // Check if using proxy key
    const isUsingProxy = tracker.isUsingProxyKey();
    console.log(`Using proxy key: ${isUsingProxy}`);

    if (isUsingProxy) {
      const proxyInfo = await tracker.getProxyKeyInfo();
      console.log(`Proxy key info:`, proxyInfo);
    }

    // Make request with proxy key usage tracking
    const response = await tracker.makeProxyKeyRequest(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello from proxy key request!' }
        ]
      },
      {
        projectId: 'proxy-test-project',
        properties: {
          'proxy-usage': 'true',
          'request-type': 'chat'
        }
      }
    );

    console.log('✅ Proxy key request successful');
    console.log(`   Project ID: proxy-test-project`);
    console.log(`   Request ID: ${response.metadata.requestId}`);
  } catch (error) {
    console.error('❌ Proxy key request failed:', error);
  }
}

// Example 7: Mixed Authentication Methods by Project
async function mixedAuthMethodsByProject() {
  console.log('\n🔀 Mixed Authentication Methods by Project');
  
  const tracker = await initializeTrackerWithProjectId();

  const environments = [
    { 
      name: 'Development', 
      projectId: 'dev-env', 
      authMethod: 'gateway' as const,
      model: 'gpt-3.5-turbo'
    },
    { 
      name: 'Staging', 
      projectId: 'staging-env', 
      authMethod: 'standard' as const,
      model: 'gpt-3.5-turbo'
    },
    { 
      name: 'Production', 
      projectId: 'prod-env', 
      authMethod: 'gateway' as const,
      model: 'gpt-4'
    }
  ];

  try {
    for (const env of environments) {
      console.log(`\nTesting ${env.name} environment...`);
      
      const response = await tracker.gatewayOpenAI({
        model: env.model,
        messages: [
          { role: 'user', content: `Deploy to ${env.name} environment` }
        ]
      }, {
        projectId: env.projectId,
        authMethodOverride: env.authMethod,
        properties: {
          'environment': env.name.toLowerCase(),
          'deployment-type': 'automated',
          'auth-method': env.authMethod
        }
      });

      console.log(`✅ ${env.name} request successful`);
      console.log(`   Project ID: ${env.projectId}`);
      console.log(`   Auth Method: ${env.authMethod}`);
      console.log(`   Model: ${env.model}`);
      console.log(`   Request ID: ${response.metadata.requestId}`);
    }
  } catch (error) {
    console.error('❌ Mixed auth methods test failed:', error);
  }
}

// Example 8: Analytics and Reporting by Project
async function analyticsAndReportingByProject() {
  console.log('\n📈 Analytics and Reporting by Project');
  
  const tracker = await initializeTrackerWithProjectId();

  try {
    // Get overall analytics
    const analytics = await tracker.getAnalytics();
    console.log('Overall analytics:', analytics);

    // Get optimization suggestions
    const suggestions = await tracker.getOptimizationSuggestions();
    console.log('Optimization suggestions:', suggestions);

    // Generate comprehensive report
    const report = await tracker.generateReport();
    console.log('Generated report preview:', report.substring(0, 200) + '...');

    console.log('✅ Analytics and reporting completed');
  } catch (error) {
    console.error('❌ Analytics and reporting failed:', error);
  }
}

// Run all examples
async function runAllHeaderExamples() {
  console.log('🌟 AICostTracker Header Features Examples\n');
  
  try {
    await gatewayRequestsWithProjectId();
    await multiProjectUsageTracking();
    await anthropicRequestsWithProjectTracking();
    await firewallProtectedRequestsWithProjectId();
    await proxyKeyRequestsWithProjectTracking();
    await mixedAuthMethodsByProject();
    await analyticsAndReportingByProject();
    
    console.log('\n✨ All AICostTracker header feature examples completed!');
    console.log('\n📝 Key Benefits:');
    console.log('• Automatic project ID injection from environment or config');
    console.log('• Per-request project ID override for flexible tracking');
    console.log('• Authentication method control per request');
    console.log('• Multi-project usage tracking and analytics');
    console.log('• Backward compatibility with existing budgetId field');
    console.log('• Seamless integration with all gateway features');
  } catch (error) {
    console.error('❌ Examples failed:', error);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runAllHeaderExamples().catch(console.error);
}

export {
  initializeTrackerWithProjectId,
  gatewayRequestsWithProjectId,
  multiProjectUsageTracking,
  anthropicRequestsWithProjectTracking,
  firewallProtectedRequestsWithProjectId,
  proxyKeyRequestsWithProjectTracking,
  mixedAuthMethodsByProject,
  analyticsAndReportingByProject
};