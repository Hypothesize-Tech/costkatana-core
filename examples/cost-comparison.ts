/**
 * Cost Comparison Example - Compare AI models and providers
 * 
 * This example shows how to:
 * - Compare costs across different models
 * - Test response quality vs cost
 * - Find the best model for your use case
 * - Optimize spending
 */

import { ai } from '../src';

interface ComparisonResult {
  model: string;
  response: string;
  cost: number;
  tokens: number;
  provider: string;
  responseTime: number;
}

async function compareModels() {
  console.log('💰 Cost Comparison - Testing Multiple AI Models\n');
  console.log('=' .repeat(60) + '\n');
  
  // Models to compare
  const models = [
    'gpt-4',
    'gpt-3.5-turbo',
    'claude-3-sonnet',
    'claude-3-haiku',
    'gemini-pro'
  ];
  
  // Test prompts for different use cases
  const testCases = [
    {
      name: 'Simple Question',
      prompt: 'What is the capital of France?',
      maxTokens: 50
    },
    {
      name: 'Code Generation',
      prompt: 'Write a Python function to calculate fibonacci numbers',
      maxTokens: 200
    },
    {
      name: 'Creative Writing',
      prompt: 'Write a short poem about technology',
      maxTokens: 150
    }
  ];
  
  // Run comparisons
  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`Prompt: "${testCase.prompt}"\n`);
    
    const results: ComparisonResult[] = [];
    
    for (const model of models) {
      try {
        const startTime = Date.now();
        
        const response = await ai(model, testCase.prompt, {
          maxTokens: testCase.maxTokens,
          temperature: 0.7
        });
        
        const responseTime = Date.now() - startTime;
        
        results.push({
          model,
          response: response.text,
          cost: response.cost,
          tokens: response.tokens,
          provider: response.provider,
          responseTime
        });
        
        console.log(`✅ ${model}`);
        console.log(`   Cost: $${response.cost.toFixed(6)}`);
        console.log(`   Tokens: ${response.tokens}`);
        console.log(`   Time: ${responseTime}ms`);
        console.log(`   Response: ${response.text.substring(0, 100)}...`);
        console.log();
        
      } catch (error) {
        console.log(`❌ ${model}: ${(error as Error).message}\n`);
      }
    }
    
    // Show summary
    if (results.length > 0) {
      console.log('📊 Summary:');
      
      // Find cheapest
      const cheapest = results.reduce((min, r) => 
        r.cost < min.cost ? r : min
      );
      console.log(`   Cheapest: ${cheapest.model} ($${cheapest.cost.toFixed(6)})`);
      
      // Find fastest
      const fastest = results.reduce((min, r) => 
        r.responseTime < min.responseTime ? r : min
      );
      console.log(`   Fastest: ${fastest.model} (${fastest.responseTime}ms)`);
      
      // Calculate total if using most expensive vs cheapest
      const mostExpensive = results.reduce((max, r) => 
        r.cost > max.cost ? r : max
      );
      const savings = ((mostExpensive.cost - cheapest.cost) / mostExpensive.cost * 100);
      console.log(`   Potential savings: ${savings.toFixed(1)}% by choosing ${cheapest.model}`);
    }
    
    console.log('\n' + '=' .repeat(60) + '\n');
  }
}

async function calculateMonthlyCosts() {
  console.log('📊 Monthly Cost Projection\n');
  
  // Simulate usage patterns
  const usagePatterns = [
    { requests: 1000, model: 'gpt-3.5-turbo', avgTokens: 500, name: 'Light Usage' },
    { requests: 10000, model: 'gpt-4', avgTokens: 1000, name: 'Medium Usage' },
    { requests: 100000, model: 'gpt-3.5-turbo', avgTokens: 750, name: 'Heavy Usage' }
  ];
  
  for (const pattern of usagePatterns) {
    try {
      // Estimate with a sample request
      const sample = await ai(pattern.model, 'Test', { maxTokens: 50 });
      const estimatedCostPerRequest = sample.cost;
      const monthlyCost = estimatedCostPerRequest * pattern.requests;
      
      console.log(`${pattern.name}:`);
      console.log(`   ${pattern.requests.toLocaleString()} requests/month`);
      console.log(`   Model: ${pattern.model}`);
      console.log(`   Estimated monthly cost: $${monthlyCost.toFixed(2)}`);
      console.log();
      
    } catch (error) {
      console.log(`Could not estimate for ${pattern.name}\n`);
    }
  }
}

async function cortexComparison() {
  console.log('⚡ Cortex Optimization Comparison\n');
  
  const prompt = 'Write a comprehensive guide to machine learning algorithms';
  
  // Without Cortex
  console.log('Testing without Cortex optimization...');
  const standardResponse = await ai('gpt-4', prompt, {
    maxTokens: 500,
    cortex: false
  });
  
  console.log(`Standard cost: $${standardResponse.cost.toFixed(4)}`);
  console.log(`Tokens: ${standardResponse.tokens}\n`);
  
  // With Cortex
  console.log('Testing with Cortex optimization...');
  const optimizedResponse = await ai('gpt-4', prompt, {
    maxTokens: 500,
    cortex: true
  });
  
  console.log(`Optimized cost: $${optimizedResponse.cost.toFixed(4)}`);
  console.log(`Tokens: ${optimizedResponse.tokens}`);
  
  const savings = standardResponse.cost - optimizedResponse.cost;
  const savingsPercent = (savings / standardResponse.cost * 100);
  
  console.log(`\n💰 Savings: $${savings.toFixed(4)} (${savingsPercent.toFixed(1)}%)`);
}

// Run all comparisons
async function runAllComparisons() {
  try {
    await compareModels();
    await calculateMonthlyCosts();
    await cortexComparison();
    
    console.log('\n✅ Comparison complete!');
    console.log('\n💡 Tips:');
    console.log('- Use GPT-3.5-Turbo for simple tasks (10x cheaper than GPT-4)');
    console.log('- Enable Cortex for long-form content (70-95% savings)');
    console.log('- Use caching for repeated queries');
    console.log('- Check your dashboard at https://costkatana.com for detailed analytics');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllComparisons().catch(console.error);
}

export { compareModels, calculateMonthlyCosts, cortexComparison };
