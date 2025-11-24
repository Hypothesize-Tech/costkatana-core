/**
 * Simple Usage Examples - The easiest way to use Cost Katana
 *
 * These examples show how simple it is to get started with Cost Katana.
 * No complex setup, no boilerplate - just AI that works!
 */

import { ai, chat, configure, OPENAI, ANTHROPIC, GOOGLE } from '../src';

// ============================================================================
// EXAMPLE 1: Zero Config - Just Works!
// ============================================================================

async function zeroConfigExample() {
  console.log('=== 🚀 Zero Config Example ===\n');

  // NEW: Type-safe model selection with constants (recommended)
  // This prevents typos and provides autocomplete in your IDE
  const response = await ai(OPENAI.GPT_4, 'Explain quantum computing in one sentence');

  console.log('Response:', response.text);
  console.log(`Cost: $${response.cost.toFixed(4)}`);
  console.log(`Tokens: ${response.tokens}`);
  console.log();

  // Old way still works but shows deprecation warning:
  // const response = await ai('gpt-4', 'Explain quantum computing');
}

// ============================================================================
// EXAMPLE 2: Compare Multiple Models
// ============================================================================

async function compareModelsExample() {
  console.log('=== 🔍 Compare Models Example ===\n');

  // NEW: Type-safe model constants provide better developer experience
  const models = [
    { name: 'GPT-4', constant: OPENAI.GPT_4 },
    { name: 'GPT-3.5 Turbo', constant: OPENAI.GPT_3_5_TURBO },
    { name: 'Claude 3.5 Sonnet', constant: ANTHROPIC.CLAUDE_3_5_SONNET_20241022 },
    { name: 'Gemini 2.5 Pro', constant: GOOGLE.GEMINI_2_5_PRO }
  ];
  const prompt = 'What is the meaning of life?';

  console.log(`Prompt: "${prompt}"\n`);

  for (const { name, constant } of models) {
    try {
      const response = await ai(constant, prompt, { maxTokens: 100 });
      console.log(`${name}:`);
      console.log(`  Response: ${response.text.substring(0, 100)}...`);
      console.log(`  Cost: $${response.cost.toFixed(4)}`);
      console.log(`  Tokens: ${response.tokens}`);
      console.log();
    } catch (error) {
      console.log(`${name}: Not available (${(error as Error).message})\n`);
    }
  }
}

// ============================================================================
// EXAMPLE 3: Chat Session with Cost Tracking
// ============================================================================

async function chatSessionExample() {
  console.log('=== 💬 Chat Session Example ===\n');

  // NEW: Type-safe model selection in chat sessions
  const session = chat(OPENAI.GPT_3_5_TURBO, {
    systemMessage: 'You are a helpful AI assistant.',
    temperature: 0.7
  });

  // Have a conversation
  console.log('User: Hello!');
  const response1 = await session.send('Hello!');
  console.log('AI:', response1);
  console.log();

  console.log('User: What can you help me with?');
  const response2 = await session.send('What can you help me with?');
  console.log('AI:', response2);
  console.log();

  console.log('User: Tell me a joke');
  const response3 = await session.send('Tell me a joke');
  console.log('AI:', response3);
  console.log();

  // Show conversation stats
  console.log('--- Session Stats ---');
  console.log(`Total messages: ${session.messages.length}`);
  console.log(`Total cost: $${session.totalCost.toFixed(4)}`);
  console.log(`Total tokens: ${session.totalTokens}`);
  console.log();
}

// ============================================================================
// EXAMPLE 4: Enable Advanced Features
// ============================================================================

async function advancedFeaturesExample() {
  console.log('=== ⚡ Advanced Features Example ===\n');

  // Configure advanced features
  await configure({
    cortex: true, // Enable 40-75% cost reduction
    cache: true, // Enable smart caching
    firewall: true // Enable security
  });

  // First request - will be cached
  console.log('First request (will be cached):');
  const response1 = await ai('gpt-4', 'What is 2+2?', { cache: true });
  console.log('Response:', response1.text);
  console.log('Cached:', response1.cached || false);
  console.log();

  // Second identical request - should hit cache
  console.log('Second identical request (should hit cache):');
  const response2 = await ai('gpt-4', 'What is 2+2?', { cache: true });
  console.log('Response:', response2.text);
  console.log('Cached:', response2.cached || false);
  console.log('Cost saved by caching!');
  console.log();

  // Use Cortex optimization for complex tasks
  console.log('Complex task with Cortex optimization:');
  const response3 = await ai(
    'gpt-4',
    'Write a comprehensive guide to machine learning algorithms',
    { cortex: true, maxTokens: 500 }
  );
  console.log('Response length:', response3.text.length);
  console.log('Optimized:', response3.optimized || false);
  console.log(`Cost with optimization: $${response3.cost.toFixed(4)}`);
  console.log();
}

// ============================================================================
// EXAMPLE 5: Error Handling
// ============================================================================

async function errorHandlingExample() {
  console.log('=== 🛡️ Error Handling Example ===\n');

  try {
    // Try with an invalid model name
    await ai('invalid-model-name', 'Hello');
  } catch (error) {
    console.log('Error caught:', (error as Error).message);
    console.log('The error message provides helpful troubleshooting steps!');
  }
  console.log();
}

// ============================================================================
// EXAMPLE 6: Manual Configuration
// ============================================================================

async function manualConfigurationExample() {
  console.log('=== ⚙️ Manual Configuration Example ===\n');

  // Configure with specific settings
  await configure({
    apiKey: process.env.COST_KATANA_API_KEY,
    projectId: process.env.PROJECT_ID,
    providers: [
      { name: 'openai', apiKey: process.env.OPENAI_API_KEY },
      { name: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY }
    ]
  });

  console.log('✅ Configured with custom settings');

  // Now use as normal
  const response = await ai('gpt-4', 'Hello, configured world!');
  console.log('Response:', response.text);
  console.log();
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  console.log('🥷 Cost Katana - Simple Usage Examples\n');
  console.log(`${'='.repeat(50)}\n`);

  try {
    // Check if we have any API keys configured
    const hasKeys =
      process.env.COST_KATANA_API_KEY ||
      process.env.API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY;

    if (!hasKeys) {
      console.log('⚠️  No API keys found in environment!\n');
      console.log('To run these examples, you need to set up API keys:\n');
      console.log('Option 1: Cost Katana (Recommended - includes all features)');
      console.log('  export COST_KATANA_API_KEY="dak_your_key"');
      console.log('  export PROJECT_ID="your_project_id"');
      console.log('  Get your keys at: https://costkatana.com/settings\n');
      console.log('Option 2: Direct provider keys (Limited features)');
      console.log('  export OPENAI_API_KEY="sk-..."');
      console.log('  export ANTHROPIC_API_KEY="sk-ant-..."\n');
      return;
    }

    // Run examples
    await zeroConfigExample();
    await compareModelsExample();
    await chatSessionExample();
    await advancedFeaturesExample();
    await errorHandlingExample();

    // Only run manual config if we have the keys
    if (process.env.COST_KATANA_API_KEY && process.env.PROJECT_ID) {
      await manualConfigurationExample();
    }

    console.log('='.repeat(50));
    console.log('\n✅ All examples completed successfully!');
    console.log('\n💡 Tips:');
    console.log('- The simple API auto-detects your configuration');
    console.log('- Use chat() for conversations with cost tracking');
    console.log('- Enable cortex for 40-75% cost savings');
    console.log('- Check your dashboard at https://costkatana.com for analytics');
  } catch (error) {
    console.error('\n❌ Example failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure you have API keys configured');
    console.log('2. Check your internet connection');
    console.log('3. Verify your Cost Katana account is active');
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

// Export examples for testing
export {
  zeroConfigExample,
  compareModelsExample,
  chatSessionExample,
  advancedFeaturesExample,
  errorHandlingExample,
  manualConfigurationExample
};
