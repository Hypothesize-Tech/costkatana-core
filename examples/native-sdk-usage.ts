/**
 * Native SDK Usage Examples
 *
 * This example demonstrates how to use Cost Katana's native SDK support
 * for OpenAI and Google Gemini with automatic failover to AWS Bedrock.
 */

import { ai, OpenAIProvider, GoogleProvider, OPENAI, GOOGLE, ANTHROPIC } from '../src';

// ============================================================================
// AUTOMATIC SDK ROUTING
// ============================================================================

async function automaticRouting() {
  console.log('=== Automatic SDK Routing ===\n');

  // Cost Katana automatically uses native SDKs based on model name

  // NEW: Type-safe model constants provide autocomplete and prevent typos

  // This uses OpenAI native SDK
  const openaiResponse = await ai(OPENAI.GPT_4, 'Explain quantum computing in one sentence');
  console.log('OpenAI Response:', openaiResponse.text);
  console.log(`Provider: ${openaiResponse.provider}`);
  console.log(`Cost: $${openaiResponse.cost}\n`);

  // This uses Google Gemini native SDK
  const geminiResponse = await ai(GOOGLE.GEMINI_1_5_PRO, 'Write a haiku about AI');
  console.log('Gemini Response:', geminiResponse.text);
  console.log(`Provider: ${geminiResponse.provider}`);
  console.log(`Cost: $${geminiResponse.cost}\n`);

  // This uses Anthropic API
  const claudeResponse = await ai(
    ANTHROPIC.CLAUDE_3_5_SONNET_20241022,
    'Translate "hello" to Spanish'
  );
  console.log('Claude Response:', claudeResponse.text);
  console.log(`Provider: ${claudeResponse.provider}`);
  console.log(`Cost: $${claudeResponse.cost}\n`);
}

// ============================================================================
// OPENAI NATIVE SDK - MANUAL CONFIGURATION
// ============================================================================

async function openaiNativeSDK() {
  console.log('=== OpenAI Native SDK ===\n');

  // Option 1: Use environment variable (OPENAI_API_KEY) with type-safe constants
  const simpleResponse = await ai(OPENAI.GPT_4_TURBO, 'What is 2+2?');
  console.log('Simple Response:', simpleResponse.text);
  console.log(`Tokens: ${simpleResponse.tokens}\n`);

  // Option 2: Manual provider configuration
  const openai = new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
    provider: 'openai'
  });

  const result = await openai.makeRequest({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful math tutor' },
      { role: 'user', content: 'Explain the Pythagorean theorem' }
    ],
    maxTokens: 200,
    temperature: 0.7
  });

  console.log('Manual Config Response:', result.choices[0].message?.content);
  console.log(`Input Tokens: ${result.usage.prompt_tokens}`);
  console.log(`Output Tokens: ${result.usage.completion_tokens}`);
  console.log(`Total Tokens: ${result.usage.total_tokens}\n`);
}

// ============================================================================
// GOOGLE GEMINI NATIVE SDK - MANUAL CONFIGURATION
// ============================================================================

async function geminiNativeSDK() {
  console.log('=== Google Gemini Native SDK ===\n');

  // Option 1: Use environment variable (GOOGLE_API_KEY) with type-safe constants
  const simpleResponse = await ai(GOOGLE.GEMINI_1_5_FLASH, 'What is machine learning?');
  console.log('Simple Response:', simpleResponse.text);
  console.log(`Tokens: ${simpleResponse.tokens}\n`);

  // Option 2: Manual provider configuration
  const gemini = new GoogleProvider({
    apiKey: process.env.GOOGLE_API_KEY || 'your-api-key',
    provider: 'google'
  });

  const result = await gemini.makeRequest({
    model: 'gemini-1.5-pro',
    messages: [{ role: 'user', content: 'Explain neural networks in simple terms' }],
    maxTokens: 300,
    temperature: 0.8
  });

  console.log('Manual Config Response:', result.choices[0].message?.content);
  console.log(`Prompt Tokens: ${result.usage.promptTokenCount}`);
  console.log(`Completion Tokens: ${result.usage.candidatesTokenCount}`);
  console.log(`Total Tokens: ${result.usage.totalTokenCount}\n`);
}

// ============================================================================
// AUTOMATIC FAILOVER
// ============================================================================

async function automaticFailover() {
  console.log('=== Automatic Failover to AWS Bedrock ===\n');

  try {
    // If OpenAI SDK fails, automatically falls back to AWS Bedrock
    const response = await ai('gpt-4', 'Tell me a joke', {
      fallback: true
    });

    console.log('Response:', response.text);
    console.log(`Provider Used: ${response.provider}`);
    console.log('Note: If OpenAI is unavailable, this will show "aws-bedrock"\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================================================
// COST COMPARISON ACROSS PROVIDERS
// ============================================================================

async function costComparison() {
  console.log('=== Cost Comparison Across Providers ===\n');

  const prompt = 'Write a short poem about technology';

  // NEW: Type-safe model constants for comparison
  const models = [
    { name: 'GPT-4', constant: OPENAI.GPT_4 },
    { name: 'GPT-3.5 Turbo', constant: OPENAI.GPT_3_5_TURBO },
    { name: 'Gemini 1.5 Pro', constant: GOOGLE.GEMINI_1_5_PRO },
    { name: 'Gemini 1.5 Flash', constant: GOOGLE.GEMINI_1_5_FLASH },
    { name: 'Claude 3.5 Sonnet', constant: ANTHROPIC.CLAUDE_3_5_SONNET_20241022 }
  ];

  for (const { name, constant } of models) {
    try {
      const response = await ai(constant, prompt);
      console.log(`Model: ${name}`);
      console.log(`Provider: ${response.provider}`);
      console.log(`Cost: $${response.cost.toFixed(6)}`);
      console.log(`Tokens: ${response.tokens}`);
      console.log('---');
    } catch (error) {
      console.error(`Failed for ${name}:`, error);
    }
  }
}

// ============================================================================
// CHAT WITH NATIVE SDKs
// ============================================================================

async function chatWithNativeSDKs() {
  console.log('=== Chat Conversations with Native SDKs ===\n');

  // OpenAI Chat
  const openaiProvider = new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
    provider: 'openai'
  });

  const chatMessages = [
    { role: 'system', content: 'You are a friendly assistant' },
    { role: 'user', content: 'Hi there!' }
  ];

  const response1 = await openaiProvider.makeRequest({
    model: 'gpt-4',
    messages: chatMessages,
    maxTokens: 100
  });

  console.log('User: Hi there!');
  console.log('Assistant:', response1.choices[0].message?.content);

  // Add assistant response to history
  chatMessages.push({
    role: 'assistant',
    content: response1.choices[0].message?.content || ''
  });

  // Continue conversation
  chatMessages.push({
    role: 'user',
    content: 'What can you help me with?'
  });

  const response2 = await openaiProvider.makeRequest({
    model: 'gpt-4',
    messages: chatMessages,
    maxTokens: 100
  });

  console.log('User: What can you help me with?');
  console.log('Assistant:', response2.choices[0].message?.content);
  console.log(
    `\nTotal tokens used: ${response1.usage.total_tokens + response2.usage.total_tokens}\n`
  );
}

// ============================================================================
// STREAMING (FUTURE FEATURE)
// ============================================================================

async function streamingExample() {
  console.log('=== Streaming Response (Conceptual) ===\n');

  // Note: Streaming support is coming soon for native SDKs
  console.log('Streaming will be supported in a future version');
  console.log('For now, use regular requests which are still very fast!\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    await automaticRouting();
    await openaiNativeSDK();
    await geminiNativeSDK();
    await automaticFailover();
    await costComparison();
    await chatWithNativeSDKs();
    await streamingExample();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples
if (require.main === module) {
  main();
}

export {
  automaticRouting,
  openaiNativeSDK,
  geminiNativeSDK,
  automaticFailover,
  costComparison,
  chatWithNativeSDKs
};
