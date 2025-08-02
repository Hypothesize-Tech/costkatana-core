/// <reference types="node" />

import { 
  createTracker,
  createOpenAITracker,
  createAnthropicTracker, 
  createBedrockTracker,
  createGoogleTracker,
  createCohereTracker,
  createGroqTracker,
  createDeepSeekTracker,
  createMistralTracker,
  createXAITracker,
  AIProvider,
  type OpenAIModels,
  type AnthropicModels,
  type AWSBedrockModels,
  type GoogleModels,
  type CohereModels,
  type GroqModels,
  type DeepSeekModels,
  type MistralModels,
  type XAIModels
} from '../src';

// =============================================================================
// SIMPLIFIED API EXAMPLES - EASY INTEGRATION FOR ALL PROVIDERS
// =============================================================================

console.log('🚀 AI Cost Tracker - Simplified Provider Examples\n');
console.log('These examples show how easy it is to integrate with any AI provider!\n');

// =============================================================================
// OpenAI Examples
// =============================================================================

async function openAIExamples() {
  console.log('=== 🤖 OpenAI Examples ===\n');

  // Method 1: Using provider-specific helper
  const gpt4oModel: OpenAIModels = 'gpt-4o';
  const openaiTracker = await createOpenAITracker({
    model: gpt4oModel,
    apiKey: process.env.OPENAI_API_KEY, // Optional if OPENAI_API_KEY is set
    enableOptimization: true
  });

  console.log('✅ OpenAI tracker created with GPT-4o');

  // Simple completion
  const response = await openaiTracker.complete({
    prompt: 'Explain quantum computing in simple terms',
    maxTokens: 200,
    temperature: 0.7,
    systemMessage: 'You are a helpful science teacher',
    tags: ['education', 'physics'],
    userId: 'user-123'
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log('📊 Tokens:', response.usage.totalTokens);
  console.log();

  // Cost estimation before request
  const estimate = await openaiTracker.estimateCost(
    'Write a detailed analysis of machine learning trends', 
    500 // expected completion tokens
  );
  
  console.log('💡 Estimated cost:', `$${estimate.estimatedCost.toFixed(4)}`);
  console.log();

  // Method 2: Using generic createTracker
  const gpt35Model: OpenAIModels = 'gpt-3.5-turbo';
  const gpt35Tracker = await createTracker({
    provider: AIProvider.OpenAI,
    model: gpt35Model, // Type-safe model selection
    enableAutoTracking: true,
    projectId: 'my-openai-project'
  });

  console.log('✅ GPT-3.5 Turbo tracker created');
  console.log();
}

// =============================================================================
// Anthropic Examples
// =============================================================================

async function anthropicExamples() {
  console.log('=== 🧠 Anthropic Claude Examples ===\n');

  const claudeSonnetModel: AnthropicModels = 'claude-3-5-sonnet-20241022';
  const claudeTracker = await createAnthropicTracker({
    model: claudeSonnetModel,
    apiKey: process.env.ANTHROPIC_API_KEY,
    enableOptimization: true,
    projectId: 'claude-analysis-project'
  });

  console.log('✅ Claude 3.5 Sonnet tracker created');

  const response = await claudeTracker.complete({
    prompt: 'Analyze the pros and cons of renewable energy adoption',
    maxTokens: 300,
    temperature: 0.5,
    systemMessage: 'You are an expert environmental analyst',
    metadata: { analysisType: 'environmental', priority: 'high' }
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log('⚡ Response time:', `${response.responseTime}ms`);
  console.log();

  // Different Claude model
  const haikuTracker = await createAnthropicTracker({
    model: 'claude-3-5-haiku-20241022',
    enableAutoTracking: true
  });

  console.log('✅ Claude 3.5 Haiku tracker created for faster responses');
  console.log();
}

// =============================================================================
// AWS Bedrock Examples
// =============================================================================

async function bedrockExamples() {
  console.log('=== ☁️ AWS Bedrock Examples ===\n');

  // Claude on Bedrock
  const bedrockClaudeModel: AWSBedrockModels = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
  const bedrockClaudeTracker = await createBedrockTracker({
    model: bedrockClaudeModel,
    region: 'us-east-1',
    enableOptimization: true,
    projectId: 'bedrock-claude-project'
  });

  console.log('✅ Bedrock Claude 3.5 Sonnet tracker created');

  const claudeResponse = await bedrockClaudeTracker.complete({
    prompt: 'Create a strategic business plan outline for a tech startup',
    maxTokens: 400,
    temperature: 0.6,
    sessionId: 'business-planning-session'
  });

  console.log('📝 Claude response:', claudeResponse.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${claudeResponse.cost.totalCost.toFixed(4)}`);
  console.log();

  // Amazon Nova on Bedrock
  const novaTracker = await createBedrockTracker({
    model: 'amazon.nova-pro-v1:0',
    region: 'us-east-1',
    enableAutoTracking: true
  });

  console.log('✅ Amazon Nova Pro tracker created');

  const novaResponse = await novaTracker.complete({
    prompt: 'Summarize the key benefits of cloud computing',
    maxTokens: 200,
    temperature: 0.4
  });

  console.log('📝 Nova response:', novaResponse.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${novaResponse.cost.totalCost.toFixed(4)}`);
  console.log();

  // Llama on Bedrock
  const llamaTracker = await createBedrockTracker({
    model: 'meta.llama3-2-90b-instruct-v1:0',
    region: 'us-west-2',
    enableOptimization: false // Disable for faster responses
  });

  console.log('✅ Llama 3.2 90B tracker created');
  console.log();
}

// =============================================================================
// Google AI Examples
// =============================================================================

async function googleExamples() {
  console.log('=== 🔍 Google AI Examples ===\n');

  const geminiTracker = await createGoogleTracker({
    model: 'gemini-1.5-pro',
    apiKey: process.env.GOOGLE_API_KEY,
    enableOptimization: true,
    projectId: 'gemini-research-project'
  });

  console.log('✅ Gemini 1.5 Pro tracker created');

  const response = await geminiTracker.complete({
    prompt: 'Explain the latest developments in artificial general intelligence',
    maxTokens: 350,
    temperature: 0.3,
    systemMessage: 'You are an AI research expert',
    tags: ['research', 'AGI', 'technology']
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log();

  // Gemini Flash for faster responses
  const flashTracker = await createGoogleTracker({
    model: 'gemini-1.5-flash',
    enableAutoTracking: true
  });

  console.log('✅ Gemini 1.5 Flash tracker created for speed');
  console.log();
}

// =============================================================================
// Cohere Examples
// =============================================================================

async function cohereExamples() {
  console.log('=== 🔗 Cohere Examples ===\n');

  const cohereTracker = await createCohereTracker({
    model: 'command-r-plus',
    apiKey: process.env.COHERE_API_KEY,
    enableOptimization: true
  });

  console.log('✅ Cohere Command R+ tracker created');

  const response = await cohereTracker.complete({
    prompt: 'Generate a comprehensive marketing strategy for a new AI product',
    maxTokens: 400,
    temperature: 0.8,
    metadata: { department: 'marketing', urgency: 'high' }
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log();

  // Cohere Command for lighter tasks
  const commandTracker = await createCohereTracker({
    model: 'command',
    enableAutoTracking: true
  });

  console.log('✅ Cohere Command tracker created');
  console.log();
}

// =============================================================================
// Groq Examples  
// =============================================================================

async function groqExamples() {
  console.log('=== ⚡ Groq Examples (Ultra-fast inference) ===\n');

  const groqTracker = await createGroqTracker({
    model: 'llama-3.1-70b-versatile',
    apiKey: process.env.GROQ_API_KEY,
    enableOptimization: true,
    projectId: 'groq-speed-project'
  });

  console.log('✅ Groq Llama 3.1 70B tracker created');

  const startTime = Date.now();
  const response = await groqTracker.complete({
    prompt: 'Write a Python function to calculate fibonacci numbers efficiently',
    maxTokens: 300,
    temperature: 0.2,
    tags: ['coding', 'python', 'algorithms']
  });
  const responseTime = Date.now() - startTime;

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log('⚡ Ultra-fast response time:', `${responseTime}ms`);
  console.log();

  // Groq Mixtral for complex reasoning
  const mixtralTracker = await createGroqTracker({
    model: 'mixtral-8x7b-32768',
    enableAutoTracking: true
  });

  console.log('✅ Groq Mixtral 8x7B tracker created');
  console.log();
}

// =============================================================================
// Mistral AI Examples
// =============================================================================

async function mistralExamples() {
  console.log('=== 🔮 Mistral AI Examples ===\n');

  const mistralLargeModel: MistralModels = 'mistral-large-latest';
  const mistralTracker = await createMistralTracker({
    model: mistralLargeModel,
    apiKey: process.env.MISTRAL_API_KEY,
    enableOptimization: true,
    projectId: 'mistral-analysis-project'
  });

  console.log('✅ Mistral Large tracker created');

  const response = await mistralTracker.complete({
    prompt: 'Explain the future of artificial intelligence in Europe',
    maxTokens: 300,
    temperature: 0.6,
    systemMessage: 'You are an expert AI researcher',
    tags: ['research', 'AI', 'Europe']
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log();

  // Mistral Small for lighter tasks
  const mistralSmallModel: MistralModels = 'mistral-small-latest';
  const smallTracker = await createMistralTracker({
    model: mistralSmallModel,
    enableAutoTracking: true
  });

  console.log('✅ Mistral Small tracker created');
  console.log();
}

// =============================================================================
// xAI Grok Examples
// =============================================================================

async function xaiExamples() {
  console.log('=== 🤖 xAI Grok Examples ===\n');

  const grokModel: XAIModels = 'grok-beta';
  const grokTracker = await createXAITracker({
    model: grokModel,
    apiKey: process.env.XAI_API_KEY,
    enableOptimization: true,
    projectId: 'grok-experiments'
  });

  console.log('✅ Grok Beta tracker created');

  const response = await grokTracker.complete({
    prompt: 'What are the most interesting developments in space exploration recently?',
    maxTokens: 400,
    temperature: 0.8,
    systemMessage: 'You are Grok, a witty AI assistant with real-time knowledge',
    tags: ['space', 'exploration', 'current-events']
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log();

  // Grok Vision for image analysis
  const grokVisionModel: XAIModels = 'grok-vision-beta';
  const visionTracker = await createXAITracker({
    model: grokVisionModel,
    enableAutoTracking: true
  });

  console.log('✅ Grok Vision tracker created');
  console.log();
}

// =============================================================================
// DeepSeek Examples
// =============================================================================

async function deepSeekExamples() {
  console.log('=== 🔍 DeepSeek Examples ===\n');

  const deepSeekTracker = await createDeepSeekTracker({
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    enableOptimization: true
  });

  console.log('✅ DeepSeek Chat tracker created');

  const response = await deepSeekTracker.complete({
    prompt: 'Explain advanced machine learning concepts in a beginner-friendly way',
    maxTokens: 350,
    temperature: 0.4,
    systemMessage: 'You are an expert ML educator',
    tags: ['education', 'machine-learning']
  });

  console.log('📝 Response:', response.text.substring(0, 100) + '...');
  console.log('💰 Cost:', `$${response.cost.totalCost.toFixed(4)}`);
  console.log();

  // DeepSeek Coder for programming tasks
  const coderTracker = await createDeepSeekTracker({
    model: 'deepseek-coder',
    enableAutoTracking: true,
    projectId: 'coding-assistant'
  });

  console.log('✅ DeepSeek Coder tracker created');
  console.log();
}

// =============================================================================
// Multi-Provider Cost Comparison
// =============================================================================

async function multiProviderComparison() {
  console.log('=== 💰 Multi-Provider Cost Comparison ===\n');

  const prompt = 'Write a detailed explanation of blockchain technology and its applications';
  const expectedTokens = 400;

  const providers = [
    { name: 'OpenAI GPT-4o', create: () => createOpenAITracker({ model: 'gpt-4o' }) },
    { name: 'OpenAI GPT-3.5', create: () => createOpenAITracker({ model: 'gpt-3.5-turbo' }) },
    { name: 'Claude 3.5 Sonnet', create: () => createAnthropicTracker({ model: 'claude-3-5-sonnet-20241022' }) },
    { name: 'Claude 3.5 Haiku', create: () => createAnthropicTracker({ model: 'claude-3-5-haiku-20241022' }) },
    { name: 'Bedrock Claude', create: () => createBedrockTracker({ model: 'anthropic.claude-3-5-sonnet-20241022-v2:0', region: 'us-east-1' }) },
    { name: 'Amazon Nova Pro', create: () => createBedrockTracker({ model: 'amazon.nova-pro-v1:0', region: 'us-east-1' }) },
    { name: 'Gemini 1.5 Pro', create: () => createGoogleTracker({ model: 'gemini-1.5-pro' }) },
    { name: 'Cohere Command R+', create: () => createCohereTracker({ model: 'command-r-plus' }) },
    { name: 'Groq Llama 3.1', create: () => createGroqTracker({ model: 'llama-3.1-70b-versatile' }) },
    { name: 'DeepSeek Chat', create: () => createDeepSeekTracker({ model: 'deepseek-chat' }) }
  ];

  console.log(`Comparing costs for prompt: "${prompt.substring(0, 50)}..."`);
  console.log(`Expected completion tokens: ${expectedTokens}\n`);

  for (const provider of providers) {
    try {
      const tracker = await provider.create();
      const estimate = await tracker.estimateCost(prompt, expectedTokens);
      
      console.log(`${provider.name}:`);
      console.log(`  💰 Estimated cost: $${estimate.estimatedCost.toFixed(6)}`);
      console.log(`  📊 Prompt tokens: ${estimate.tokens.promptTokens}`);
      console.log(`  💡 Cost breakdown: $${estimate.breakdown.promptCost.toFixed(6)} + $${estimate.breakdown.estimatedCompletionCost.toFixed(6)}`);
      console.log();
    } catch (error) {
      console.log(`${provider.name}: ❌ ${(error as Error).message}`);
      console.log();
    }
  }
}

// =============================================================================
// Usage Analytics Example
// =============================================================================

async function analyticsExample() {
  console.log('=== 📊 Usage Analytics Example ===\n');

  // Create a tracker with some usage
  const tracker = await createOpenAITracker({
    model: 'gpt-3.5-turbo',
    enableAutoTracking: true,
    projectId: 'analytics-demo'
  });

  // Make several requests to generate usage data
  console.log('Generating usage data...');
  
  for (let i = 0; i < 3; i++) {
    await tracker.complete({
      prompt: `Example request ${i + 1}: Explain AI concept number ${i + 1}`,
      maxTokens: 100,
      tags: [`example-${i + 1}`, 'demo'],
      userId: `user-${i + 1}`
    });
  }

  // Get analytics
  const analytics = await tracker.getAnalytics(
    new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24 hours
    new Date()
  );

  console.log('📈 Usage Analytics:');
  console.log(`  💰 Total cost: $${analytics.totalCost.toFixed(4)}`);
  console.log(`  📊 Total tokens: ${analytics.totalTokens}`);
  console.log(`  📝 Total requests: ${analytics.totalRequests}`);
  console.log(`  📊 Avg tokens/request: ${analytics.averageTokensPerRequest.toFixed(0)}`);
  console.log(`  🤖 Most used model: ${analytics.mostUsedModels[0]?.model || 'N/A'}`);
  console.log();

  // Export data
  const exportData = await tracker.exportUsageData('json');
  console.log('📁 Export data sample:', JSON.stringify(exportData, null, 2).substring(0, 200) + '...');
  console.log();
}

// =============================================================================
// Run All Examples
// =============================================================================

async function runAllExamples() {
  try {
    // Check for required environment variables
    const requiredEnvVars = ['API_KEY', 'PROJECT_ID'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Required Environment Variables Missing\n');
      console.log('To run these examples, you need:');
      console.log('1. Register at https://costkatana.com');
      console.log('2. Create a project and get your credentials');
      console.log('3. Set these environment variables:\n');
      console.log('   API_KEY=dak_your_api_key_here');
      console.log('   PROJECT_ID=your_project_id_here\n');
      console.log('📧 Provider API keys are optional if already set in environment\n');
      return;
    }

    await openAIExamples();
    await anthropicExamples();
    await bedrockExamples();
    await googleExamples();
    await cohereExamples();
    await groqExamples();
    await mistralExamples();
    await xaiExamples();
    await deepSeekExamples();
    await multiProviderComparison();
    await analyticsExample();

    console.log('🎉 All examples completed successfully!');
    console.log('🔗 View detailed analytics at https://costkatana.com');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

export {
  openAIExamples,
  anthropicExamples,
  bedrockExamples,
  googleExamples,
  cohereExamples,
  groqExamples,
  mistralExamples,
  xaiExamples,
  deepSeekExamples,
  multiProviderComparison,
  analyticsExample
};