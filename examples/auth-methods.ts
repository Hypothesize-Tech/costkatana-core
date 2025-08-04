/**
 * CostKATANA Authentication Methods Example
 * 
 * This example demonstrates how to use both CostKatana-Auth and standard Authorization headers
 * for different use cases.
 */

import { 
  createGatewayClient, 
  createStandardGatewayClient, 
  createCostKatanaGatewayClient,
  createGatewayClientFromEnv 
} from '@ai-cost-optimizer/core';

// Example 1: Default Gateway Client (uses CostKatana-Auth header)
// This is the recommended approach for gateway requests
async function gatewayAuthExample() {
  console.log('🔐 Gateway Authentication Example (CostKatana-Auth)');
  
  const gateway = createGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.COSTKATANA_API_KEY!,
    authMethod: 'gateway' // Uses CostKatana-Auth header
  });

  try {
    const response = await gateway.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello from gateway auth!' }
      ]
    });

    console.log('✅ Gateway auth successful');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Gateway auth failed:', error);
  }
}

// Example 2: Standard Authorization Header
// Use this for direct API calls that expect standard Authorization header
async function standardAuthExample() {
  console.log('\n🔑 Standard Authentication Example (Authorization header)');
  
  const client = createStandardGatewayClient({
    baseUrl: 'https://api.yourservice.com',
    apiKey: process.env.COSTKATANA_API_KEY!
    // authMethod: 'standard' is automatically set
  });

  try {
    const response = await client.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello from standard auth!' }
      ]
    });

    console.log('✅ Standard auth successful');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Standard auth failed:', error);
  }
}

// Example 3: Explicit CostKatana-Auth Header
// Use this helper for clarity when you specifically want CostKatana-Auth
async function explicitCostKatanaAuthExample() {
  console.log('\n🌟 Explicit CostKatana-Auth Example');
  
  const client = createCostKatanaGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.COSTKATANA_API_KEY!
    // authMethod: 'gateway' is automatically set
  });

  try {
    const response = await client.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello from explicit CostKatana auth!' }
      ]
    });

    console.log('✅ Explicit CostKatana auth successful');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Explicit CostKatana auth failed:', error);
  }
}

// Example 4: Environment-based Configuration
// This automatically uses CostKatana-Auth by default
async function environmentAuthExample() {
  console.log('\n🌍 Environment-based Authentication Example');
  
  try {
    // Automatically uses CostKatana-Auth header
    const gateway = createGatewayClientFromEnv();

    const response = await gateway.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Hello from environment auth!' }
      ]
    });

    console.log('✅ Environment auth successful');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Environment auth failed:', error);
  }
}

// Example 5: Mixed Authentication for Different Services
async function mixedAuthExample() {
  console.log('\n🔀 Mixed Authentication Example');
  
  // Gateway client for CostKATANA gateway
  const gatewayClient = createCostKatanaGatewayClient({
    baseUrl: 'https://gateway.costkatana.com',
    apiKey: process.env.COSTKATANA_API_KEY!
  });

  // Standard client for direct API calls
  const directClient = createStandardGatewayClient({
    baseUrl: 'https://api.openai.com',
    apiKey: process.env.OPENAI_API_KEY!
  });

  try {
    console.log('Making request through CostKATANA gateway...');
    const gatewayResponse = await gatewayClient.openai({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello via gateway!' }]
    });

    console.log('Making direct API request...');
    const directResponse = await directClient.openai({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello direct!' }]
    });

    console.log('✅ Both requests successful');
    console.log('Gateway response:', gatewayResponse.data.choices[0].message.content);
    console.log('Direct response:', directResponse.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Mixed auth failed:', error);
  }
}

// Example 6: Usage Tracking with Project ID and Auth Method Headers
async function usageTrackingExample() {
  console.log('\n📊 Usage Tracking with Project ID and Auth Method Headers');
  
  // For usage tracking, both auth methods work
  const clients = [
    {
      name: 'Gateway Auth with Project ID',
      client: createCostKatanaGatewayClient({
        baseUrl: 'https://gateway.costkatana.com',
        apiKey: process.env.COSTKATANA_API_KEY!
      })
    },
    {
      name: 'Standard Auth with Project ID',
      client: createStandardGatewayClient({
        baseUrl: 'https://cost-katana-backend.store',
        apiKey: process.env.COSTKATANA_API_KEY!
      })
    }
  ];

  for (const { name, client } of clients) {
    try {
      console.log(`Testing ${name}...`);
      
      const response = await client.openai({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: `Track this usage via ${name}!` }
        ]
      }, {
        // Add project ID for tracking
        projectId: 'example-project-123',
        // Override auth method for this request
        authMethodOverride: name.includes('Gateway') ? 'gateway' : 'standard',
        // Add tracking properties
        properties: {
          'auth-method': name.toLowerCase().replace(' ', '-'),
          'example': 'usage-tracking'
        }
      });

      console.log(`✅ ${name} tracking successful`);
      console.log(`Request ID: ${response.metadata.requestId}`);
      console.log(`Project ID sent: example-project-123`);
    } catch (error) {
      console.error(`❌ ${name} tracking failed:`, error);
    }
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🚀 CostKATANA Authentication Methods Examples\n');
  
  await gatewayAuthExample();
  await standardAuthExample();
  await explicitCostKatanaAuthExample();
  await environmentAuthExample();
  await mixedAuthExample();
  await usageTrackingExample();
  
  console.log('\n✨ All authentication examples completed!');
  console.log('\n📝 Key Takeaways:');
  console.log('• Use CostKatana-Auth header for gateway requests (default)');
  console.log('• Use Authorization header for direct API calls');
  console.log('• Both methods support API keys and JWT tokens');
  console.log('• Usage tracking works with both authentication methods');
  console.log('• Environment-based setup defaults to gateway authentication');
}

// Run if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  gatewayAuthExample,
  standardAuthExample,
  explicitCostKatanaAuthExample,
  environmentAuthExample,
  mixedAuthExample,
  usageTrackingExample
};