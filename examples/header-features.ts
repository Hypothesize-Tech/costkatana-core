/**
 * CostKATANA Header Features Example
 * 
 * This example demonstrates how to use project ID and authentication method headers
 * for advanced request tracking and authentication control.
 */

import { createGatewayClient, createCostKatanaGatewayClient } from 'ai-cost-tracker';

// Example 1: Project ID Header for Request Tracking
async function projectIdTrackingExample() {
  console.log('📋 Project ID Tracking Example');
  
  const gateway = createCostKatanaGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.API_KEY!
  });

  try {
    // Multiple requests with different project IDs
    const projects = [
      { id: 'frontend-app', name: 'Frontend Application' },
      { id: 'backend-api', name: 'Backend API' },
      { id: 'mobile-app', name: 'Mobile Application' }
    ];

    for (const project of projects) {
      const response = await gateway.openai({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: `Generate code for ${project.name}` }
        ]
      }, {
        // Set project ID for cost allocation and tracking
        projectId: project.id,
        properties: {
          'project-name': project.name,
          'request-type': 'code-generation'
        }
      });

      console.log(`✅ Request tracked for project: ${project.name}`);
      console.log(`   Project ID: ${project.id}`);
      console.log(`   Request ID: ${response.metadata.requestId}`);
    }
  } catch (error) {
    console.error('❌ Project tracking failed:', error);
  }
}

// Example 2: Authentication Method Override per Request
async function authMethodOverrideExample() {
  console.log('\n🔐 Authentication Method Override Example');
  
  const gateway = createGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.API_KEY!,
    authMethod: 'gateway' // Default to gateway auth
  });

  try {
    // Request 1: Use default gateway authentication
    console.log('Making request with default gateway auth...');
    const response1 = await gateway.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello with gateway auth!' }
      ]
    }, {
      projectId: 'auth-test-1'
      // No authMethodOverride - uses default 'gateway'
    });

    console.log('✅ Gateway auth request successful');
    console.log(`   Request ID: ${response1.metadata.requestId}`);

    // Request 2: Override to standard authentication for this request
    console.log('Making request with standard auth override...');
    const response2 = await gateway.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello with standard auth override!' }
      ]
    }, {
      projectId: 'auth-test-2',
      authMethodOverride: 'standard' // Override to standard auth for this request
    });

    console.log('✅ Standard auth override request successful');
    console.log(`   Request ID: ${response2.metadata.requestId}`);
  } catch (error) {
    console.error('❌ Auth method override failed:', error);
  }
}

// Example 3: Combined Project and Auth Headers
async function combinedHeadersExample() {
  console.log('\n🎯 Combined Project ID and Auth Method Headers Example');
  
  const gateway = createCostKatanaGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.API_KEY!
  });

  try {
    // Simulate different environments with different auth requirements
    const environments = [
      { 
        name: 'Development', 
        projectId: 'dev-environment', 
        authMethod: 'gateway' as const,
        description: 'Development environment using gateway auth'
      },
      { 
        name: 'Production', 
        projectId: 'prod-environment', 
        authMethod: 'standard' as const,
        description: 'Production environment using standard auth'
      },
      { 
        name: 'Staging', 
        projectId: 'staging-environment', 
        authMethod: 'gateway' as const,
        description: 'Staging environment using gateway auth'
      }
    ];

    for (const env of environments) {
      console.log(`\nTesting ${env.name} environment...`);
      
      const response = await gateway.openai({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: `Deploy to ${env.name} environment` }
        ]
      }, {
        projectId: env.projectId,
        authMethodOverride: env.authMethod,
        properties: {
          'environment': env.name.toLowerCase(),
          'deployment-type': 'automated'
        }
      });

      console.log(`✅ ${env.name} deployment request successful`);
      console.log(`   Project ID: ${env.projectId}`);
      console.log(`   Auth Method: ${env.authMethod}`);
      console.log(`   Request ID: ${response.metadata.requestId}`);
      console.log(`   Description: ${env.description}`);
    }
  } catch (error) {
    console.error('❌ Combined headers example failed:', error);
  }
}

// Example 4: Multi-tenant Application with Project Isolation
async function multiTenantExample() {
  console.log('\n🏢 Multi-tenant Application Example');
  
  const gateway = createCostKatanaGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.API_KEY!
  });

  try {
    // Simulate different tenants/customers
    const tenants = [
      { id: 'tenant-acme-corp', name: 'Acme Corporation', tier: 'enterprise' },
      { id: 'tenant-startup-inc', name: 'Startup Inc', tier: 'basic' },
      { id: 'tenant-mid-company', name: 'Mid Company', tier: 'professional' }
    ];

    for (const tenant of tenants) {
      // Different features based on tier
      const features = tenant.tier === 'enterprise' 
        ? ['advanced-analytics', 'custom-models', 'priority-support']
        : tenant.tier === 'professional'
        ? ['analytics', 'standard-models']
        : ['basic-features'];

      const response = await gateway.openai({
        model: tenant.tier === 'enterprise' ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: `Generate report for ${tenant.name}` }
        ]
      }, {
        projectId: tenant.id,
        properties: {
          'tenant-name': tenant.name,
          'tenant-tier': tenant.tier,
          'features': features.join(','),
          'billing-type': 'usage-based'
        }
      });

      console.log(`✅ Request processed for ${tenant.name}`);
      console.log(`   Tenant ID: ${tenant.id}`);
      console.log(`   Tier: ${tenant.tier}`);
      console.log(`   Features: ${features.join(', ')}`);
      console.log(`   Request ID: ${response.metadata.requestId}`);
    }
  } catch (error) {
    console.error('❌ Multi-tenant example failed:', error);
  }
}

// Example 5: A/B Testing with Project Headers
async function abTestingExample() {
  console.log('\n🧪 A/B Testing with Project Headers Example');
  
  const gateway = createCostKatanaGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.API_KEY!
  });

  try {
    const experiments = [
      { 
        variant: 'A', 
        projectId: 'experiment-prompt-style-a',
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are a helpful assistant. Be concise.'
      },
      { 
        variant: 'B', 
        projectId: 'experiment-prompt-style-b',
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are a detailed assistant. Provide comprehensive answers.'
      },
      { 
        variant: 'C', 
        projectId: 'experiment-model-comparison',
        model: 'gpt-4',
        systemPrompt: 'You are a helpful assistant. Be concise.'
      }
    ];

    const userQuery = 'Explain machine learning in simple terms';

    for (const experiment of experiments) {
      console.log(`\nRunning experiment variant ${experiment.variant}...`);
      
      const response = await gateway.openai({
        model: experiment.model,
        messages: [
          { role: 'system', content: experiment.systemPrompt },
          { role: 'user', content: userQuery }
        ]
      }, {
        projectId: experiment.projectId,
        properties: {
          'experiment-variant': experiment.variant,
          'experiment-type': 'prompt-optimization',
          'user-query': 'ml-explanation',
          'model-comparison': experiment.model
        }
      });

      console.log(`✅ Variant ${experiment.variant} completed`);
      console.log(`   Project ID: ${experiment.projectId}`);
      console.log(`   Model: ${experiment.model}`);
      console.log(`   Request ID: ${response.metadata.requestId}`);
      console.log(`   Response length: ${response.data.choices[0].message.content.length} chars`);
    }

    console.log('\n📊 A/B test data can now be analyzed by project ID for cost and performance comparison');
  } catch (error) {
    console.error('❌ A/B testing example failed:', error);
  }
}

// Run all header feature examples
async function runAllHeaderExamples() {
  console.log('🌟 CostKATANA Header Features Examples\n');
  
  await projectIdTrackingExample();
  await authMethodOverrideExample();
  await combinedHeadersExample();
  await multiTenantExample();
  await abTestingExample();
  
  console.log('\n✨ All header feature examples completed!');
  console.log('\n📝 Key Benefits:');
  console.log('• Project-based cost allocation and tracking');
  console.log('• Flexible authentication method control per request');
  console.log('• Multi-tenant application support');
  console.log('• A/B testing and experimentation tracking');
  console.log('• Environment-specific configurations');
  console.log('• Detailed analytics and reporting by project');
}

// Run if this file is executed directly
if (require.main === module) {
  runAllHeaderExamples().catch(console.error);
}

export {
  projectIdTrackingExample,
  authMethodOverrideExample,
  combinedHeadersExample,
  multiTenantExample,
  abTestingExample
};