/**
 * Cost Katana SDK - Logging & Templates Example
 * Demonstrates how to use AI logging and templates
 */

import { ai, chat, configure, AILogger, TemplateManager, logger } from 'cost-katana';

async function main() {
  // ============================================================================
  // 1. CONFIGURATION
  // ============================================================================
  
  await configure({
    apiKey: 'dak_your_key_here',
    projectId: 'your_project_id',
    enableAILogging: true,  // Enable AI operation logging
    logLevel: 'debug'        // Set console log level
  });

  logger.info('Cost Katana configured with logging and templates');

  // ============================================================================
  // 2. BASIC AI LOGGING
  // ============================================================================
  
  console.log('\n=== Basic AI Logging ===\n');
  
  // All AI calls are automatically logged to Cost Katana dashboard
  const response1 = await ai('gpt-4', 'Explain quantum computing in one sentence');
  console.log('Response:', response1.text);
  console.log('Cost:', response1.cost);
  // Check your dashboard at https://costkatana.com/ai-logs

  // ============================================================================
  // 3. DISABLE LOGGING FOR SPECIFIC CALLS
  // ============================================================================
  
  console.log('\n=== Disable Logging ===\n');
  
  // Disable logging for sensitive/private calls
  const response2 = await ai('gpt-4', 'Private query', {
    enableAILogging: false
  });
  console.log('Response (not logged):', response2.text);

  // ============================================================================
  // 4. TEMPLATE USAGE - LOCAL TEMPLATES
  // ============================================================================
  
  console.log('\n=== Local Template Usage ===\n');
  
  const templateMgr = new TemplateManager();
  
  // Define a local template
  templateMgr.defineTemplate({
    id: 'greeting',
    name: 'Personalized Greeting',
    description: 'Generate a personalized greeting',
    content: 'Generate a {{style}} greeting for {{name}} who works as a {{profession}}.',
    variables: [
      { name: 'style', required: true },
      { name: 'name', required: true },
      { name: 'profession', required: false, defaultValue: 'professional' }
    ]
  });
  
  // Use the template
  const response3 = await ai('gpt-4', '', {
    templateId: 'greeting',
    templateVariables: {
      style: 'warm and friendly',
      name: 'Alice',
      profession: 'software engineer'
    }
  });
  
  console.log('Template Response:', response3.text);
  console.log('Template Used:', response3.templateUsed);

  // ============================================================================
  // 5. TEMPLATE USAGE - BACKEND TEMPLATES
  // ============================================================================
  
  console.log('\n=== Backend Template Usage ===\n');
  
  // List available templates from backend
  const templates = await templateMgr.listTemplates();
  console.log(`Found ${templates.length} templates`);
  
  // Fetch and use a specific template from backend
  // Replace 'template_id_here' with an actual template ID from your dashboard
  // const backendTemplate = await templateMgr.getTemplate('template_id_here');
  // if (backendTemplate) {
  //   const response4 = await ai('gpt-4', '', {
  //     templateId: backendTemplate.id,
  //     templateVariables: { /* your variables */ }
  //   });
  //   console.log('Backend Template Response:', response4.text);
  // }

  // ============================================================================
  // 6. CHAT WITH TEMPLATES
  // ============================================================================
  
  console.log('\n=== Chat with Templates ===\n');
  
  const session = chat('claude-3-sonnet', {
    systemMessage: 'You are a helpful assistant',
    enableAILogging: true
  });
  
  // Regular message
  await session.send('Hello!');
  
  // Message with template
  await session.send('', {
    templateId: 'greeting',
    templateVariables: {
      style: 'professional',
      name: 'Bob'
    }
  });
  
  console.log('Total cost:', session.totalCost);
  console.log('Total tokens:', session.totalTokens);

  // ============================================================================
  // 7. CUSTOM AI LOGGER
  // ============================================================================
  
  console.log('\n=== Custom AI Logger ===\n');
  
  const customLogger = new AILogger({
    apiKey: 'dak_your_key',
    projectId: 'your_project',
    enableLogging: true,
    batchSize: 10,        // Flush after 10 logs
    flushInterval: 2000   // Or flush every 2 seconds
  });
  
  // Log custom AI operations
  await customLogger.logAICall({
    service: 'openai',
    operation: 'completion',
    aiModel: 'gpt-4',
    statusCode: 200,
    responseTime: 1234,
    prompt: 'Test prompt',
    result: 'Test result',
    inputTokens: 10,
    outputTokens: 20,
    totalTokens: 30,
    cost: 0.001,
    success: true
  });
  
  console.log('Custom log added to buffer');
  
  // Manual flush
  await customLogger.flush();
  console.log('Logs flushed to backend');

  // ============================================================================
  // 8. TEMPLATE MANAGER ADVANCED
  // ============================================================================
  
  console.log('\n=== Template Manager Advanced ===\n');
  
  // Define complex template
  templateMgr.defineTemplate({
    id: 'code-review',
    name: 'Code Review Template',
    content: `Review the following {{language}} code and provide:
1. Code quality assessment
2. Potential bugs or issues
3. Performance improvements
4. Best practices suggestions

Code:
{{code}}

Focus on: {{focus_areas}}`,
    variables: [
      { name: 'language', required: true },
      { name: 'code', required: true },
      { name: 'focus_areas', defaultValue: 'general quality' }
    ]
  });
  
  // Resolve template manually
  const resolution = await templateMgr.resolveTemplate('code-review', {
    language: 'TypeScript',
    code: 'function add(a, b) { return a + b; }',
    focus_areas: 'type safety and error handling'
  });
  
  console.log('Resolved prompt:', resolution.prompt);
  console.log('Variables used:', resolution.resolvedVariables);
  
  // Use resolved prompt
  const reviewResponse = await ai('gpt-4', resolution.prompt);
  console.log('Review:', reviewResponse.text);

  // ============================================================================
  // 9. CONSOLE LOGGING
  // ============================================================================
  
  console.log('\n=== Console Logging ===\n');
  
  logger.debug('This is a debug message');
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.error('This is an error message', new Error('Test error'));
  
  // Performance timing
  const timer = logger.startTimer('API Call');
  await new Promise(resolve => setTimeout(resolve, 100));
  timer(); // Logs duration

  // Change log level
  logger.setLevel('warn');
  logger.debug('This will not be shown');
  logger.warn('This will be shown');

  logger.info('\n✅ Example completed! Check your Cost Katana dashboard for AI logs.');
}

// Run the example
main().catch(console.error);

