import AICostTracker, {
    AIProvider,
    TrackerConfig
} from 'ai-cost-tracker';

// Example 1: Basic setup and cost estimation
async function basicExample() {
    // Configure the tracker
    const config: TrackerConfig = {
        providers: [
            {
                provider: AIProvider.OpenAI,
                apiKey: process.env.OPENAI_API_KEY!
            },
            {
                provider: AIProvider.AWSBedrock,
                region: 'us-east-1'
            }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        }
    };

    // Initialize the tracker
    const tracker = new AICostTracker(config);

    // Example 1: Estimate cost before making a request
    const prompt = "Explain quantum computing in simple terms";
    const costEstimate = await tracker.estimateCost(
        prompt,
        'gpt-3.5-turbo',
        AIProvider.OpenAI,
        150 // expected completion tokens
    );

    console.log('Estimated cost:', {
        promptCost: costEstimate.promptCost.toFixed(4),
        completionCost: costEstimate.completionCost.toFixed(4),
        totalCost: costEstimate.totalCost.toFixed(4),
        currency: costEstimate.currency
    });

    // Example 2: Make a tracked request
    const response = await tracker.makeRequest({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ],
        maxTokens: 150,
        temperature: 0.7
    }, 'user123');

    console.log('Response:', response.choices[0].message.content);

    // Example 3: Get usage analytics
    const analytics = await tracker.getAnalytics(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        new Date(),
        'user123'
    );

    console.log('Usage Analytics:', {
        totalCost: analytics.totalCost.toFixed(2),
        totalTokens: analytics.totalTokens,
        averageTokensPerRequest: analytics.averageTokensPerRequest.toFixed(0),
        mostUsedModel: analytics.mostUsedModels[0]?.model
    });
}

// Example 2: Cost comparison across models
async function compareModels() {
    const tracker = new AICostTracker({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! },
            { provider: AIProvider.AWSBedrock, region: 'us-east-1' }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        }
    });

    const prompt = "Write a comprehensive blog post about climate change solutions";
    const models = [
        { model: 'gpt-4', provider: AIProvider.OpenAI },
        { model: 'gpt-3.5-turbo', provider: AIProvider.OpenAI },
        { model: 'anthropic.claude-3-5-sonnet-20240620-v1:0', provider: AIProvider.AWSBedrock },
        { model: 'anthropic.claude-3-haiku-20240307-v1:0', provider: AIProvider.AWSBedrock }
    ];

    console.log('Cost comparison for prompt:', prompt.substring(0, 50) + '...');
    console.log('Expected output: ~500 tokens\n');

    for (const { model, provider } of models) {
        try {
            const estimate = await tracker.estimateCost(
                prompt,
                model,
                provider,
                500 // expected completion tokens
            );

            console.log(`${model}:`);
            console.log(`  Total cost: $${estimate.totalCost.toFixed(4)}`);
            console.log(`  Prompt tokens: ${estimate.breakdown.promptTokens}`);
            console.log(`  Cost breakdown: $${estimate.promptCost.toFixed(4)} (prompt) + $${estimate.completionCost.toFixed(4)} (completion)`);
            console.log('');
        } catch (error) {
            console.error(`Error estimating cost for ${model}:`, error);
        }
    }
}

// Example 3: Manual usage tracking (for existing integrations)
async function manualTracking() {
    const tracker = new AICostTracker({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'file' // persist to file
        }
    });

    // Track usage from your existing API calls
    await tracker.trackUsage({
        userId: 'user456',
        timestamp: new Date(),
        provider: AIProvider.OpenAI,
        model: 'gpt-4',
        promptTokens: 150,
        completionTokens: 350,
        totalTokens: 500,
        estimatedCost: 0.035, // You can calculate this or let the tracker do it
        prompt: "Analyze this data...",
        completion: "Based on the analysis...",
        duration: 2500,
        tags: ['analysis', 'data-science'],
        sessionId: 'session-789'
    });

    // Get user statistics
    const userStats = await tracker.getUserStats('user456');
    console.log('User Statistics:', {
        totalRequests: userStats.totalRequests,
        totalCost: userStats.totalCost.toFixed(2),
        averageCostPerRequest: userStats.averageCostPerRequest.toFixed(3),
        lastUsed: userStats.lastUsed
    });
}

// Example 4: Set up alerts
async function setupAlerts() {
    const tracker = new AICostTracker({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        },
        alerts: {
            costThreshold: 10, // Alert if daily cost exceeds $10
            tokenThreshold: 100000, // Alert if daily tokens exceed 100K
            emailNotifications: true,
            webhookUrl: 'https://your-webhook.com/alerts'
        }
    });

    // Simulate high usage
    for (let i = 0; i < 5; i++) {
        await tracker.makeRequest({
            model: 'gpt-4',
            prompt: "Complex analysis task...",
            maxTokens: 1000
        }, 'heavy-user');
    }

    // Check if alerts were triggered (check logs)
}

// Example 5: Export data
async function exportUsageData() {
    const tracker = new AICostTracker({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        }
    });

    // Add some usage data...
    // ... (make some requests)

    // Export as JSON
    const jsonData = await tracker.exportData('json');
    console.log('Exported JSON:', jsonData);

    // Export as CSV
    const csvData = await tracker.exportData('csv');
    console.log('Exported CSV:', csvData);
}

// Run examples
if (require.main === module) {
    (async () => {
        console.log('=== Basic Usage Example ===\n');
        await basicExample();

        console.log('\n=== Model Comparison Example ===\n');
        await compareModels();

        console.log('\n=== Manual Tracking Example ===\n');
        await manualTracking();

        // Uncomment to run alert example
        // console.log('\n=== Alerts Example ===\n');
        // await setupAlerts();

        console.log('\n=== Export Data Example ===\n');
        await exportUsageData();
    })().catch(console.error);
}