/**
 * CostKATANA Proxy Key Usage Examples
 * 
 * This file demonstrates how to use proxy keys with the CostKATANA
 * AI Cost Optimizer core package for secure, controlled access to AI providers.
 */

import AICostTracker, { 
  createGatewayClient, 
  createGatewayClientFromEnv,
  ProxyKeyInfo,
  ProxyKeyUsageOptions 
} from '../src/index';

// ============================================
// BASIC PROXY KEY USAGE
// ============================================

async function basicProxyKeyUsage() {
  console.log('=== Basic Proxy Key Usage ===');

  // Create gateway client with proxy key
  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: 'ck-proxy-4cc76c313710d9abe6a68103aa6bd4cb', // Your proxy key
    enableCache: true,
    enableRetries: true
  });

  // Check if using proxy key
  if (gateway.isUsingProxyKey()) {
    console.log('✅ Using proxy key authentication');

    // Get proxy key information
    const proxyKeyInfo = await gateway.getProxyKeyInfo();
    if (proxyKeyInfo) {
      console.log('📊 Proxy Key Info:', {
        name: proxyKeyInfo.name,
        provider: proxyKeyInfo.provider,
        permissions: proxyKeyInfo.permissions,
        budgetLimit: proxyKeyInfo.budgetLimit,
        usageStats: proxyKeyInfo.usageStats
      });
    }
  }

  // Make a request using the proxy key
  try {
    const response = await gateway.openai({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Hello! This request is using a CostKATANA proxy key.' }
      ],
      max_tokens: 100
    }, {
      targetUrl: 'https://api.openai.com'
    });

    console.log('🤖 Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

// ============================================
// PROXY KEY WITH USAGE TRACKING
// ============================================

async function proxyKeyWithUsageTracking() {
  console.log('\n=== Proxy Key with Usage Tracking ===');

  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: 'ck-proxy-4cc76c313710d9abe6a68103aa6bd4cb'
  });

  // Usage options for better tracking
  const usageOptions: ProxyKeyUsageOptions = {
    projectId: 'my-project-123',
    properties: {
      environment: 'production',
      feature: 'chat-bot',
      userId: 'user-456'
    },
    modelOverride: 'gpt-4o-mini'
  };

  try {
    const response = await gateway.makeProxyKeyRequest(
      'https://api.openai.com',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: 'This request includes detailed usage tracking.' }
        ],
        max_tokens: 50
      },
      usageOptions
    );

    console.log('🎯 Tracked Response:', response.data.choices[0].message.content);

    // Get updated usage statistics
    const usage = await gateway.getProxyKeyUsage();
    if (usage) {
      console.log('📈 Updated Usage Stats:', usage);
    }
  } catch (error) {
    console.error('❌ Tracked request failed:', error);
  }
}

// ============================================
// BUDGET MONITORING
// ============================================

async function budgetMonitoring() {
  console.log('\n=== Budget Monitoring ===');

  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: 'ck-proxy-4cc76c313710d9abe6a68103aa6bd4cb'
  });

  // Check budget status before making requests
  const budgetStatus = await gateway.checkProxyKeyBudget();
  if (budgetStatus) {
    console.log('💰 Budget Status:', budgetStatus);

    if (!budgetStatus.withinBudget) {
      console.log('⚠️ Warning: Proxy key is over budget!');
      return;
    }

    if (budgetStatus.budgetStatus === 'warning') {
      console.log('⚠️ Warning: Approaching budget limit');
    }
  }

  // Get current usage
  const usage = await gateway.getProxyKeyUsage();
  if (usage) {
    console.log('📊 Current Usage:', {
      totalRequests: usage.totalRequests,
      totalCost: `$${usage.totalCost.toFixed(4)}`,
      dailyCost: `$${usage.dailyCost.toFixed(4)}`,
      monthlyCost: `$${usage.monthlyCost.toFixed(4)}`
    });
  }
}

// ============================================
// PERMISSION VALIDATION
// ============================================

async function permissionValidation() {
  console.log('\n=== Permission Validation ===');

  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: 'ck-proxy-4cc76c313710d9abe6a68103aa6bd4cb'
  });

  // Check permissions before operations
  const canRead = await gateway.validateProxyKeyPermissions('read');
  const canWrite = await gateway.validateProxyKeyPermissions('write');
  const canAdmin = await gateway.validateProxyKeyPermissions('admin');

  console.log('🔐 Permissions:', {
    read: canRead ? '✅' : '❌',
    write: canWrite ? '✅' : '❌',
    admin: canAdmin ? '✅' : '❌'
  });

  if (!canWrite) {
    console.log('⚠️ This proxy key has read-only access');
  }
}

// ============================================
// INTEGRATED TRACKER + PROXY KEY
// ============================================

async function integratedTrackerWithProxyKey() {
  console.log('\n=== Integrated Tracker + Proxy Key ===');

  // Initialize the main tracker
  const tracker = new AICostTracker({
    apiKey: 'your-costkatana-api-key',
    tracking: {
      enableAutoTracking: true,
      enableCostEstimation: true
    }
  });

  // Initialize gateway with proxy key
  const gateway = tracker.initializeGateway({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: 'ck-proxy-4cc76c313710d9abe6a68103aa6bd4cb',
    enableCache: true,
    enableRetries: true
  });

  // Check if using proxy key
  if (tracker.isUsingProxyKey()) {
    console.log('🔑 Tracker is using proxy key authentication');

    // Get proxy key info through tracker
    const proxyInfo = await tracker.getProxyKeyInfo();
    if (proxyInfo) {
      console.log('📋 Proxy Key:', proxyInfo.name);
    }

    // Check budget through tracker
    const budget = await tracker.checkProxyKeyBudget();
    if (budget) {
      console.log('💰 Budget:', budget.message);
    }
  }

  // Make requests through tracker (will use proxy key automatically)
  try {
    const response = await tracker.gatewayOpenAI({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'This is using the integrated tracker with proxy key.' }
      ],
      max_tokens: 50
    }, {
      targetUrl: 'https://api.openai.com',
      properties: {
        source: 'integrated-example'
      }
    });

    console.log('🔗 Integrated Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ Integrated request failed:', error);
  }
}

// ============================================
// ENVIRONMENT-BASED CONFIGURATION
// ============================================

async function environmentBasedConfiguration() {
  console.log('\n=== Environment-Based Configuration ===');

  // Set environment variables
  process.env.API_KEY = 'ck-proxy-4cc76c313710d9abe6a68103aa6bd4cb';
  process.env.COSTKATANA_GATEWAY_URL = 'https://cost-katana-backend.store/api/gateway';

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

  console.log('🌍 Gateway created from environment variables');
  console.log('🔑 Using proxy key:', gateway.isUsingProxyKey());

  // Get proxy key info
  if (gateway.isUsingProxyKey()) {
    const info = await gateway.getProxyKeyInfo();
    if (info) {
      console.log('📊 Environment Proxy Key:', {
        name: info.name,
        provider: info.provider,
        isActive: info.isActive
      });
    }
  }
}

// ============================================
// ERROR HANDLING WITH PROXY KEYS
// ============================================

async function errorHandlingWithProxyKeys() {
  console.log('\n=== Error Handling with Proxy Keys ===');

  const gateway = createGatewayClient({
    baseUrl: 'https://cost-katana-backend.store/api/gateway',
    apiKey: 'ck-proxy-invalid-key-for-testing'
  });

  try {
    // This should fail with invalid proxy key
    const response = await gateway.openai({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Test' }]
    }, {
      targetUrl: 'https://api.openai.com'
    });
  } catch (error: any) {
    console.log('❌ Expected error with invalid proxy key:', error.message);
  }

  // Test with deactivated proxy key scenario
  try {
    const info = await gateway.getProxyKeyInfo();
    if (info && !info.isActive) {
      console.log('⚠️ Proxy key is deactivated');
    }
  } catch (error) {
    console.log('❌ Failed to get proxy key info:', (error as Error).message);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🚀 CostKATANA Proxy Key Usage Examples\n');

  try {
    await basicProxyKeyUsage();
    await proxyKeyWithUsageTracking();
    await budgetMonitoring();
    await permissionValidation();
    await integratedTrackerWithProxyKey();
    await environmentBasedConfiguration();
    await errorHandlingWithProxyKeys();
  } catch (error) {
    console.error('💥 Example execution failed:', error);
  }

  console.log('\n✅ All proxy key examples completed!');
}

// Run examples if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  basicProxyKeyUsage,
  proxyKeyWithUsageTracking,
  budgetMonitoring,
  permissionValidation,
  integratedTrackerWithProxyKey,
  environmentBasedConfiguration,
  errorHandlingWithProxyKeys
};