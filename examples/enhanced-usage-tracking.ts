/**
 * Enhanced Usage Tracking Example
 * 
 * This example demonstrates the enhanced request/response tracking functionality
 * in CostKatana, including support for:
 * - Chat messages and conversation history
 * - System prompts and instructions
 * - Enhanced metadata for comprehensive tracking
 * - User and customer email identification
 */

import { AICostTracker } from '../src/index';

// Initialize the tracker
const tracker = new AICostTracker({
  apiKey: 'your-api-key',
  projectId: 'your-project-id',
  endpoint: 'https://cost-katana-backend.store'
});

/**
 * Example 1: Basic Usage Tracking with Enhanced Data
 */
async function basicEnhancedTracking() {
  console.log('=== Basic Enhanced Usage Tracking ===');
  
  try {
    const result = await tracker.trackUsage({
      provider: 'openai',
      model: 'gpt-4',
      prompt: 'Explain quantum computing in simple terms',
      completion: 'Quantum computing is a type of computation that harnesses the collective properties of quantum states to perform calculations.',
      promptTokens: 15,
      completionTokens: 25,
      totalTokens: 40,
      estimatedCost: 0.002,
      responseTime: 1200,
      userEmail: 'developer@company.com',
      customerEmail: 'client@client.com',
      tags: ['quantum', 'education', 'ai']
    });

    console.log('✅ Basic tracking successful:', result);
  } catch (error) {
    console.error('❌ Basic tracking failed:', error);
  }
}

/**
 * Example 2: Chat Model Usage with Message History
 */
async function chatModelTracking() {
  console.log('\n=== Chat Model Usage Tracking ===');
  
  try {
    const result = await tracker.trackUsage({
      provider: 'anthropic',
      model: 'claude-3-sonnet',
      prompt: 'You are a helpful coding assistant. Help me debug this Python code.',
      completion: 'I can help you debug your Python code. Please share the code and any error messages you\'re seeing.',
      promptTokens: 20,
      completionTokens: 30,
      totalTokens: 50,
      estimatedCost: 0.003,
      responseTime: 1500,
      userEmail: 'coder@company.com',
      customerEmail: 'client@client.com',
      // Enhanced chat data
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding assistant with expertise in Python, JavaScript, and other programming languages.'
        },
        {
          role: 'user',
          content: 'Help me debug this Python code'
        },
        {
          role: 'assistant',
          content: 'I can help you debug your Python code. Please share the code and any error messages you\'re seeing.'
        }
      ],
      system: 'You are a helpful coding assistant with expertise in Python, JavaScript, and other programming languages.',
      // Enhanced metadata
      requestMetadata: {
        messages: [
          {
            role: 'system',
            content: 'You are a helpful coding assistant with expertise in Python, JavaScript, and other programming languages.'
          },
          {
            role: 'user',
            content: 'Help me debug this Python code'
          }
        ],
        system: 'You are a helpful coding assistant with expertise in Python, JavaScript, and other programming languages.',
        input: 'Help me debug this Python code',
        prompt: 'Help me debug this Python code'
      },
      responseMetadata: {
        completion: 'I can help you debug your Python code. Please share the code and any error messages you\'re seeing.',
        output: 'I can help you debug your Python code. Please share the code and any error messages you\'re seeing.',
        choices: [
          {
            message: {
              content: 'I can help you debug your Python code. Please share the code and any error messages you\'re seeing.',
              role: 'assistant'
            }
          }
        ]
      }
    });

    console.log('✅ Chat model tracking successful:', result);
  } catch (error) {
    console.error('❌ Chat model tracking failed:', error);
  }
}

/**
 * Example 3: Gateway Usage with Enhanced Headers
 */
async function gatewayEnhancedTracking() {
  console.log('\n=== Gateway Enhanced Usage Tracking ===');
  
  try {
    const result = await tracker.trackGatewayUsage({
      provider: 'openai',
      model: 'gpt-4-turbo',
      prompt: 'Write a professional email to schedule a meeting',
      completion: 'Subject: Meeting Request\n\nDear [Name],\n\nI hope this email finds you well. I would like to schedule a meeting to discuss [topic].\n\nBest regards,\n[Your Name]',
      promptTokens: 25,
      completionTokens: 45,
      totalTokens: 70,
      responseTime: 2000,
      // Enhanced options
      userEmail: 'manager@company.com',
      customerEmail: 'partner@client.com',
      projectId: 'project-123',
      sessionId: 'session-456',
      properties: {
        purpose: 'business-communication',
        urgency: 'medium',
        department: 'sales'
      }
    });

    console.log('✅ Gateway tracking successful:', result);
  } catch (error) {
    console.error('❌ Gateway tracking failed:', error);
  }
}

/**
 * Example 4: Workflow Usage Tracking
 */
async function workflowTracking() {
  console.log('\n=== Workflow Usage Tracking ===');
  
  try {
    const result = await tracker.trackUsage({
      provider: 'google-ai',
      model: 'gemini-pro',
      prompt: 'Analyze this customer feedback and suggest improvements',
      completion: 'Based on the customer feedback, I recommend focusing on response time, product quality, and customer service training.',
      promptTokens: 30,
      completionTokens: 35,
      totalTokens: 65,
      estimatedCost: 0.004,
      responseTime: 1800,
      userEmail: 'analyst@company.com',
      customerEmail: 'feedback@client.com',
      // Workflow information
      metadata: {
        workflowId: 'feedback-analysis-001',
        workflowName: 'Customer Feedback Analysis',
        workflowStep: 'sentiment-analysis',
        workflowSequence: 3,
        // Enhanced request/response data
        messages: [
          {
            role: 'system',
            content: 'You are a customer experience analyst. Analyze feedback and provide actionable insights.'
          },
          {
            role: 'user',
            content: 'Analyze this customer feedback and suggest improvements'
          }
        ],
        system: 'You are a customer experience analyst. Analyze feedback and provide actionable insights.',
        input: 'Analyze this customer feedback and suggest improvements',
        // Enhanced metadata
        requestMetadata: {
          messages: [
            {
              role: 'system',
              content: 'You are a customer experience analyst. Analyze feedback and provide actionable insights.'
            },
            {
              role: 'user',
              content: 'Analyze this customer feedback and suggest improvements'
            }
          ],
          system: 'You are a customer experience analyst. Analyze feedback and provide actionable insights.',
          input: 'Analyze this customer feedback and suggest improvements',
          prompt: 'Analyze this customer feedback and suggest improvements'
        },
        responseMetadata: {
          completion: 'Based on the customer feedback, I recommend focusing on response time, product quality, and customer service training.',
          output: 'Based on the customer feedback, I recommend focusing on response time, product quality, and customer service training.'
        }
      }
    });

    console.log('✅ Workflow tracking successful:', result);
  } catch (error) {
    console.error('❌ Workflow tracking failed:', error);
  }
}

/**
 * Example 5: Error Tracking with Enhanced Data
 */
async function errorTracking() {
  console.log('\n=== Error Usage Tracking ===');
  
  try {
    const result = await tracker.trackUsage({
      provider: 'openai',
      model: 'gpt-4',
      prompt: 'Generate a complex report',
      promptTokens: 20,
      completionTokens: 0,
      totalTokens: 20,
      estimatedCost: 0.001,
      responseTime: 5000,
      userEmail: 'developer@company.com',
      customerEmail: 'client@client.com',
      // Error information
      metadata: {
        errorOccurred: true,
        errorMessage: 'Request timeout after 5 seconds',
        httpStatusCode: 408,
        errorType: 'timeout',
        errorDetails: {
          code: 'TIMEOUT',
          type: 'request_timeout',
          statusText: 'Request Timeout',
          timestamp: new Date().toISOString(),
          endpoint: '/v1/chat/completions',
          method: 'POST'
        },
        // Enhanced request data for debugging
        messages: [
          {
            role: 'user',
            content: 'Generate a complex report'
          }
        ],
        system: 'You are a helpful assistant that generates detailed reports.',
        input: 'Generate a complex report',
        requestMetadata: {
          messages: [
            {
              role: 'user',
              content: 'Generate a complex report'
            }
          ],
          system: 'You are a helpful assistant that generates detailed reports.',
          input: 'Generate a complex report',
          prompt: 'Generate a complex report'
        }
      }
    });

    console.log('✅ Error tracking successful:', result);
  } catch (error) {
    console.error('❌ Error tracking failed:', error);
  }
}

/**
 * Example 6: Batch Usage Tracking
 */
async function batchTracking() {
  console.log('\n=== Batch Usage Tracking ===');
  
  const batchResults = [];
  
  const prompts = [
    'Explain machine learning',
    'What is artificial intelligence?',
    'How does deep learning work?'
  ];

  for (let i = 0; i < prompts.length; i++) {
    try {
      const result = await tracker.trackUsage({
        provider: 'anthropic',
        model: 'claude-3-haiku',
        prompt: prompts[i],
        completion: `Response to: ${prompts[i]}`,
        promptTokens: 10 + i * 2,
        completionTokens: 20 + i * 3,
        totalTokens: 30 + i * 5,
        estimatedCost: 0.001 + (i * 0.0005),
        responseTime: 800 + (i * 100),
        userEmail: 'batch@company.com',
        customerEmail: 'client@client.com',
        metadata: {
          batchId: 'batch-001',
          batchIndex: i,
          batchSize: prompts.length,
          // Enhanced data for each batch item
          messages: [
            {
              role: 'user',
              content: prompts[i]
            }
          ],
          system: 'You are a helpful AI assistant.',
          input: prompts[i],
          requestMetadata: {
            messages: [
              {
                role: 'user',
                content: prompts[i]
              }
            ],
            system: 'You are a helpful AI assistant.',
            input: prompts[i],
            prompt: prompts[i]
          },
          responseMetadata: {
            completion: `Response to: ${prompts[i]}`,
            output: `Response to: ${prompts[i]}`
          }
        }
      });

      batchResults.push(result);
      console.log(`✅ Batch item ${i + 1} tracked successfully`);
    } catch (error) {
      console.error(`❌ Batch item ${i + 1} failed:`, error);
    }
  }

  console.log(`\n📊 Batch tracking completed: ${batchResults.length}/${prompts.length} successful`);
  return batchResults;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Enhanced Usage Tracking Examples...\n');

  try {
    await basicEnhancedTracking();
    await chatModelTracking();
    await gatewayEnhancedTracking();
    await workflowTracking();
    await errorTracking();
    await batchTracking();

    console.log('\n🎉 All examples completed successfully!');
    console.log('\n📋 Summary of Enhanced Features:');
    console.log('✅ Enhanced request/response data tracking');
    console.log('✅ Chat messages and conversation history');
    console.log('✅ System prompts and instructions');
    console.log('✅ User and customer email identification');
    console.log('✅ Comprehensive metadata support');
    console.log('✅ Workflow and batch tracking');
    console.log('✅ Error tracking with detailed information');
    
  } catch (error) {
    console.error('\n💥 Example execution failed:', error);
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export {
  basicEnhancedTracking,
  chatModelTracking,
  gatewayEnhancedTracking,
  workflowTracking,
  errorTracking,
  batchTracking
};
