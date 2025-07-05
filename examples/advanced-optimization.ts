import AICostTracker, {
    AIProvider,
    ConversationMessage,
    FusionRequest,
    OptimizationResult
} from 'ai-cost-tracker';

/**
 * Advanced Optimization Example
 * 
 * This example demonstrates the new prompt optimization features:
 * 1. Prompt Compression - Compress JSON and repetitive data
 * 2. Context Trimming - Optimize conversation histories
 * 3. Request Fusion - Merge multiple related requests
 */

async function main() {
    // Initialize the tracker with optimization features enabled
    const tracker = await AICostTracker.create({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY },
            { provider: AIProvider.AWSBedrock, region: 'us-east-1' }
        ],
        tracking: { enableAutoTracking: true },
        optimization: {
            enablePromptOptimization: true,
            enableCompression: true,
            enableContextTrimming: true,
            enableRequestFusion: true,
            bedrockConfig: {
                region: 'us-east-1',
                modelId: 'anthropic.claude-3-haiku-20240307-v1:0'
            },
            compressionSettings: {
                minCompressionRatio: 0.7,
                jsonCompressionThreshold: 100
            },
            contextTrimmingSettings: {
                maxContextLength: 4000,
                preserveRecentMessages: 3
            },
            requestFusionSettings: {
                maxFusionBatch: 5,
                fusionWaitTime: 5000
            },
            thresholds: {
                highCostPerRequest: 0.01,
                highTokenUsage: 10000,
                frequencyThreshold: 1000
            }
        }
    });

    const optimizer = tracker.getOptimizer();

    // Example 1: Prompt Compression
    console.log('\n=== Example 1: Prompt Compression ===');

    const jsonHeavyPrompt = `
    Analyze the following user data and provide insights:
    {
      "users": [
        {"id": 1, "name": "John Doe", "email": "john@example.com", "age": 30, "country": "USA", "preferences": {"theme": "dark", "notifications": true}},
        {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "age": 25, "country": "UK", "preferences": {"theme": "light", "notifications": false}},
        {"id": 3, "name": "Bob Johnson", "email": "bob@example.com", "age": 35, "country": "Canada", "preferences": {"theme": "dark", "notifications": true}},
        {"id": 4, "name": "Alice Brown", "email": "alice@example.com", "age": 28, "country": "Australia", "preferences": {"theme": "light", "notifications": true}},
        {"id": 5, "name": "Charlie Wilson", "email": "charlie@example.com", "age": 32, "country": "USA", "preferences": {"theme": "dark", "notifications": false}}
      ],
      "metadata": {
        "timestamp": "2024-01-01T00:00:00Z",
        "version": "1.0",
        "source": "user_database"
      }
    }
    
    Please analyze the user demographics and preferences patterns.
  `;

    const compressionResult: OptimizationResult = await optimizer.optimizePrompt(
        jsonHeavyPrompt,
        'gpt-4',
        AIProvider.OpenAI
    );

    console.log('Original prompt length:', jsonHeavyPrompt.length);
    console.log('Compression suggestions:', compressionResult.suggestions.length);
    console.log('Best compression savings:', compressionResult.totalSavings.toFixed(1) + '%');

    if (compressionResult.suggestions[0]?.compressionDetails) {
        console.log('Compression technique:', compressionResult.suggestions[0].compressionDetails.technique);
        console.log('Compression ratio:', (compressionResult.suggestions[0].compressionDetails.compressionRatio * 100).toFixed(1) + '%');
    }

    // Example 2: Context Trimming
    console.log('\n=== Example 2: Context Trimming ===');

    const conversationHistory: ConversationMessage[] = [
        { role: 'user', content: 'Hi, I need help with my Python code' },
        { role: 'assistant', content: 'Hello! I\'d be happy to help you with your Python code. What specific issue are you facing?' },
        { role: 'user', content: 'I\'m trying to sort a list of dictionaries' },
        { role: 'assistant', content: 'I can help you sort a list of dictionaries. Could you share the structure of your dictionaries and how you want to sort them?' },
        { role: 'user', content: 'Each dict has name and age keys' },
        { role: 'assistant', content: 'Great! Here\'s how you can sort a list of dictionaries by age:\n\n```python\npeople = [\n    {"name": "Alice", "age": 30},\n    {"name": "Bob", "age": 25},\n    {"name": "Charlie", "age": 35}\n]\n\n# Sort by age\nsorted_people = sorted(people, key=lambda x: x["age"])\nprint(sorted_people)\n```' },
        { role: 'user', content: 'Thanks, that works!' },
        { role: 'assistant', content: 'You\'re welcome! Is there anything else you need help with?' },
        { role: 'user', content: 'Actually, can you show me how to sort by name instead?' },
        { role: 'assistant', content: 'Of course! To sort by name, you just need to change the key:\n\n```python\nsorted_by_name = sorted(people, key=lambda x: x["name"])\nprint(sorted_by_name)\n```' },
        { role: 'user', content: 'Perfect! Now I need to filter the list to only show people over 30' }
    ];

    const contextResult = await optimizer.optimizeConversation(
        conversationHistory,
        'gpt-4',
        AIProvider.OpenAI
    );

    console.log('Original conversation messages:', conversationHistory.length);
    console.log('Context trimming savings:', contextResult.totalSavings.toFixed(1) + '%');

    const contextSuggestion = contextResult.suggestions.find(s => s.type === 'context_trimming');
    if (contextSuggestion?.contextTrimDetails) {
        console.log('Trimming technique:', contextSuggestion.contextTrimDetails.technique);
        console.log('Messages after trimming:', contextSuggestion.contextTrimDetails.trimmedMessages);
    }

    // Example 3: Request Fusion
    console.log('\n=== Example 3: Request Fusion ===');

    const relatedRequests: FusionRequest[] = [
        {
            id: '1',
            prompt: 'What is the capital of France?',
            timestamp: Date.now(),
            model: 'gpt-3.5-turbo',
            provider: AIProvider.OpenAI
        },
        {
            id: '2',
            prompt: 'What is the population of Paris?',
            timestamp: Date.now() + 1000,
            model: 'gpt-3.5-turbo',
            provider: AIProvider.OpenAI
        },
        {
            id: '3',
            prompt: 'What are the main tourist attractions in Paris?',
            timestamp: Date.now() + 2000,
            model: 'gpt-3.5-turbo',
            provider: AIProvider.OpenAI
        },
        {
            id: '4',
            prompt: 'What is the weather like in Paris in summer?',
            timestamp: Date.now() + 3000,
            model: 'gpt-3.5-turbo',
            provider: AIProvider.OpenAI
        }
    ];

    const fusionResult = await optimizer.optimizeRequests(relatedRequests);

    console.log('Original requests:', relatedRequests.length);
    console.log('Request fusion savings:', fusionResult.totalSavings.toFixed(1) + '%');

    const fusionSuggestion = fusionResult.suggestions.find(s => s.type === 'request_fusion');
    if (fusionSuggestion?.fusionDetails) {
        console.log('Fusion strategy:', fusionSuggestion.fusionDetails.fusionStrategy);
        console.log('Time reduction:', fusionSuggestion.fusionDetails.estimatedTimeReduction + 'ms');
        console.log('\nFused prompt preview:');
        console.log(fusionSuggestion.optimizedPrompt?.substring(0, 200) + '...');
    }

    // Example 4: Combined Optimization
    console.log('\n=== Example 4: Combined Optimization ===');

    const complexPrompt = `
    Based on our previous conversation about user preferences, I need you to analyze the following data:
    
    User Activity Logs:
    [{"userId": 1, "action": "login", "timestamp": "2024-01-01T10:00:00Z", "device": "mobile"},
     {"userId": 1, "action": "view_product", "timestamp": "2024-01-01T10:01:00Z", "device": "mobile"},
     {"userId": 1, "action": "add_to_cart", "timestamp": "2024-01-01T10:02:00Z", "device": "mobile"},
     {"userId": 2, "action": "login", "timestamp": "2024-01-01T11:00:00Z", "device": "desktop"},
     {"userId": 2, "action": "view_product", "timestamp": "2024-01-01T11:01:00Z", "device": "desktop"},
     {"userId": 2, "action": "purchase", "timestamp": "2024-01-01T11:05:00Z", "device": "desktop"}]
    
    Please provide insights on user behavior patterns and device preferences.
  `;

    const combinedResult = await optimizer.optimizePrompt(
        complexPrompt,
        'gpt-4',
        AIProvider.OpenAI,
        {
            conversationHistory: conversationHistory.slice(-5), // Last 5 messages
            expectedOutput: 'user behavior analysis',
            constraints: ['preserve data accuracy', 'maintain context']
        }
    );

    console.log('Combined optimization techniques:', combinedResult.appliedOptimizations.join(', '));
    console.log('Total token reduction:', combinedResult.metadata.originalTokens - combinedResult.metadata.optimizedTokens);
    console.log('Processing time:', combinedResult.metadata.processingTime + 'ms');

    // Example 5: Real-world Usage with Tracking
    console.log('\n=== Example 5: Real-world Usage ===');

    // Optimize and make request
    const userQuery = "Summarize the key features of TypeScript and explain why it's popular";
    const optimized = await optimizer.optimizePrompt(userQuery, 'gpt-4', AIProvider.OpenAI);

    if (optimized.suggestions.length > 0 && optimized.suggestions[0].optimizedPrompt) {
        // Make the optimized request
        const response = await tracker.makeRequest({
            model: 'gpt-4',
            prompt: optimized.suggestions[0].optimizedPrompt,
            maxTokens: 150,
            temperature: 0.7
        });

        console.log('Response received, usage tracked automatically');
        console.log('Estimated savings:', optimized.totalSavings.toFixed(1) + '%');
    }

    // Check optimization opportunities
    const opportunities = await tracker.getOptimizationSuggestions();
    console.log('\nOptimization opportunities found:', opportunities.length);
}

// Helper function to display optimization details
function displayOptimizationDetails(result: OptimizationResult) {
    console.log('\n--- Optimization Details ---');
    console.log('Total savings potential:', result.totalSavings.toFixed(1) + '%');
    console.log('Techniques applied:', result.appliedOptimizations.join(', '));
    console.log('Processing time:', result.metadata.processingTime + 'ms');
    console.log('Token reduction:', result.metadata.originalTokens - result.metadata.optimizedTokens);

    result.suggestions.forEach((suggestion, index) => {
        console.log(`\nSuggestion ${index + 1}:`);
        console.log('  Type:', suggestion.type);
        console.log('  Savings:', suggestion.estimatedSavings.toFixed(1) + '%');
        console.log('  Confidence:', (suggestion.confidence * 100).toFixed(0) + '%');
        console.log('  Explanation:', suggestion.explanation);
    });
}

// Run the examples
main().catch(console.error); 