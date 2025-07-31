/**
 * CostKATANA High-Availability Gateway & Failover Example
 * 
 * This example demonstrates how to use the High-Availability Gateway
 * to automatically failover between AI providers for maximum uptime.
 */

import { createGatewayClient, FailoverPolicy } from '@ai-cost-optimizer/core';

// Initialize the gateway client
const gateway = createGatewayClient({
  baseUrl: 'https://gateway.costkatana.com',
  apiKey: process.env.COSTKATANA_API_KEY!,
  
  // Optional: Configure default failover policy
  failover: {
    enabled: true,
    globalTimeout: 120000, // 2 minutes
    defaultPolicy: {
      targets: [
        {
          'target-url': 'https://api.openai.com/v1',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          onCodes: [{ from: 400, to: 599 }] // Failover on any client/server error
        },
        {
          'target-url': 'https://api.anthropic.com/v1',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01'
          },
          onCodes: [{ from: 400, to: 599 }]
        }
      ]
    }
  }
});

async function basicFailoverExample() {
  console.log('🔄 Basic Failover Example');
  
  try {
    // Make a request with automatic failover
    const response = await gateway.openai({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'Explain the concept of high availability in simple terms.' }
      ]
    }, {
      // Enable failover using the default policy
      failover: true
    });

    console.log('✅ Request succeeded!');
    console.log('Response:', response.data.choices[0].message.content);
    
    // Check which provider was used
    if (response.metadata.failoverProviderIndex !== undefined) {
      console.log(`🎯 Provider used: Index ${response.metadata.failoverProviderIndex}`);
      if (response.metadata.failoverProviderIndex === 0) {
        console.log('   → OpenAI (primary)');
      } else if (response.metadata.failoverProviderIndex === 1) {
        console.log('   → Anthropic (backup)');
      }
    }
    
  } catch (error) {
    console.error('❌ All providers failed:', error);
  }
}

async function customFailoverPolicyExample() {
  console.log('\n🎯 Custom Failover Policy Example');
  
  // Define a custom failover policy for this specific request
  const customPolicy: FailoverPolicy = {
    targets: [
      {
        // Primary: OpenAI GPT-4
        'target-url': 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        onCodes: [429, 500, 502, 503] // Specific error codes to trigger failover
      },
      {
        // Backup: Groq with model translation
        'target-url': 'https://api.groq.com/openai/v1',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        // Translate the model name for Groq
        bodyKeyOverride: {
          'model': 'llama3-8b-8192'
        },
        onCodes: [{ from: 400, to: 599 }]
      },
      {
        // Final backup: Anthropic Claude
        'target-url': 'https://api.anthropic.com/v1',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        onCodes: [{ from: 400, to: 599 }]
      }
    ],
    globalTimeout: 90000 // 90 seconds for this specific request
  };

  try {
    const response = await gateway.openai({
      model: 'gpt-4', // This will be translated to 'llama3-8b-8192' for Groq
      messages: [
        { role: 'user', content: 'What are the benefits of using multiple AI providers?' }
      ]
    }, {
      failover: {
        enabled: true,
        policy: customPolicy
      }
    });

    console.log('✅ Request succeeded with custom policy!');
    console.log('Response:', response.data.choices[0].message.content);
    console.log(`🎯 Provider used: Index ${response.metadata.failoverProviderIndex}`);
    
  } catch (error) {
    console.error('❌ Custom failover failed:', error);
  }
}

async function rateLimitFailoverExample() {
  console.log('\n⏱️  Rate Limit Failover Example');
  
  const rateLimitPolicy: FailoverPolicy = {
    targets: [
      {
        // Primary: OpenAI (might hit rate limits)
        'target-url': 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        onCodes: [429] // Only failover on rate limit errors
      },
      {
        // Backup: Alternative provider for rate limit scenarios
        'target-url': 'https://api.groq.com/openai/v1',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        bodyKeyOverride: {
          'model': 'llama3-70b-8192' // Use a different model
        },
        onCodes: [{ from: 400, to: 599 }]
      }
    ]
  };

  try {
    const response = await gateway.openai({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'How do you handle API rate limits effectively?' }
      ]
    }, {
      failover: {
        enabled: true,
        policy: rateLimitPolicy
      }
    });

    console.log('✅ Rate limit failover succeeded!');
    console.log('Response:', response.data.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Rate limit failover failed:', error);
  }
}

async function costOptimizedFailoverExample() {
  console.log('\n💰 Cost-Optimized Failover Example');
  
  const costOptimizedPolicy: FailoverPolicy = {
    targets: [
      {
        // Primary: Premium model (expensive but high quality)
        'target-url': 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        onCodes: [{ from: 400, to: 599 }]
      },
      {
        // Backup: Cost-effective alternative
        'target-url': 'https://api.groq.com/openai/v1',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        bodyKeyOverride: {
          'model': 'llama3-8b-8192' // Much cheaper alternative
        },
        onCodes: [{ from: 400, to: 599 }]
      }
    ]
  };

  try {
    const response = await gateway.openai({
      model: 'gpt-4', // Expensive primary choice
      messages: [
        { role: 'user', content: 'Explain cost optimization strategies for AI applications.' }
      ]
    }, {
      failover: {
        enabled: true,
        policy: costOptimizedPolicy
      },
      // Track cost attribution
      properties: {
        'use-case': 'cost-optimization-demo',
        'strategy': 'premium-with-fallback'
      }
    });

    console.log('✅ Cost-optimized failover succeeded!');
    console.log('Response:', response.data.choices[0].message.content);
    
    if (response.metadata.failoverProviderIndex === 0) {
      console.log('💎 Used premium provider (GPT-4)');
    } else {
      console.log('💡 Fell back to cost-effective provider (Llama3)');
    }
    
  } catch (error) {
    console.error('❌ Cost-optimized failover failed:', error);
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🚀 CostKATANA High-Availability Gateway & Failover Examples\n');
  
  await basicFailoverExample();
  await customFailoverPolicyExample();
  await rateLimitFailoverExample();
  await costOptimizedFailoverExample();
  
  console.log('\n✨ All examples completed!');
}

// Run if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  basicFailoverExample,
  customFailoverPolicyExample,
  rateLimitFailoverExample,
  costOptimizedFailoverExample
};