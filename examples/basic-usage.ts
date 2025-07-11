/// <reference types="node" />

import AICostTracker, {
    AIProvider,
    TrackerConfig
} from '../src';

// Example 0: Cost Katana Dashboard Integration
async function dashboardIntegrationExample() {
    console.log('=== Cost Katana Dashboard Integration Example ===\n');
    console.log('📊 This example demonstrates automatic syncing with costkatana.com\n');

    // Configure the tracker with dashboard integration
    const config: TrackerConfig = {
        providers: [
            {
                provider: AIProvider.OpenAI,
                apiKey: process.env.OPENAI_API_KEY!
            }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true,
            thresholds: {
                highCostPerRequest: 0.1,
                highTokenUsage: 2000,
                frequencyThreshold: 10
            }
        },
        tracking: {
            enableAutoTracking: true
        }
        // No additional config needed - automatically syncs with costkatana.com
    };

    // Initialize the tracker - uses API_KEY and PROJECT_ID from environment
    const tracker = await AICostTracker.create(config);

    console.log('✅ Successfully connected to Cost Katana dashboard at costkatana.com');
    console.log('🔑 Using API_KEY and PROJECT_ID from environment variables\n');

    // Make a tracked request that will automatically sync with costkatana.com
    const response = await tracker.makeRequest({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'What is the capital of France?' }
        ],
        maxTokens: 50,
        temperature: 0.7
    });

    console.log('Response:', response.choices[0].message.content);
    console.log('✅ Usage data automatically synced with your costkatana.com dashboard');
    console.log('📈 View detailed analytics at https://costkatana.com\n');
}

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
            enableCachingSuggestions: true,
            thresholds: {
                highCostPerRequest: 0.1,
                highTokenUsage: 2000,
                frequencyThreshold: 10
            }
        },
        tracking: {
            enableAutoTracking: true
        }
    };

    // Initialize the tracker
    const tracker = await AICostTracker.create(config);

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
    });

    console.log('Response:', response.choices[0].message.content);

    // Example 3: Get usage analytics from local cache
    const analytics = await tracker.getAnalytics(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        new Date()
    );

    console.log('Usage Analytics (Local Cache):', {
        totalCost: analytics.totalCost.toFixed(2),
        totalTokens: analytics.totalTokens,
        averageTokensPerRequest: analytics.averageTokensPerRequest.toFixed(0),
        mostUsedModel: analytics.mostUsedModels[0]?.model
    });
}

// Example 2: Cost comparison across models
async function compareModels() {
    const tracker = await AICostTracker.create({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! },
            { provider: AIProvider.AWSBedrock, region: 'us-east-1' }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true,
            thresholds: {
                highCostPerRequest: 0.1,
                highTokenUsage: 2000,
                frequencyThreshold: 10
            }
        },
        tracking: {
            enableAutoTracking: true
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
    const tracker = await AICostTracker.create({
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
        provider: AIProvider.OpenAI,
        model: 'gpt-4',
        promptTokens: 150,
        completionTokens: 350,
        totalTokens: 500,
        estimatedCost: 0.035, // You can calculate this or let the tracker do it
        prompt: "Analyze this data...",
        completion: "Based on the analysis...",
        responseTime: 2500,
        tags: ['analysis', 'data-science'],
        sessionId: 'session-789',
        projectId: 'project-analytics-dashboard'  // Track usage for specific project
    });

    console.log('Usage tracked manually with projectId.');
}

// Example 4: Set up alerts
async function setupAlerts() {
    const tracker = await AICostTracker.create({
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
        });
    }

    console.log('Alerts example finished. Check logs for potential alerts.');
}

// Example 5: Export data
async function exportUsageData() {
    const tracker = await AICostTracker.create({
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
    await tracker.makeRequest({
        model: 'gpt-3.5-turbo',
        prompt: 'Export test prompt'
    });

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
        // Check if required environment variables are set
        const hasApiKey = process.env.API_KEY;
        const hasProjectId = process.env.PROJECT_ID;

        if (hasApiKey && hasProjectId) {
            await dashboardIntegrationExample();
            console.log('\n');
        } else {
            console.log('⚠️  Cost Katana Dashboard Integration Required\n');
            console.log('To use this package, you need to:');
            console.log('1. Register at https://costkatana.com');
            console.log('2. Create a project in your dashboard');
            console.log('3. Get your API_KEY and PROJECT_ID from dashboard settings');
            console.log('4. Set them in your environment variables:\n');
            console.log('   API_KEY=dak_your_api_key_here');
            console.log('   PROJECT_ID=your_project_id_here\n');
            console.log('💡 Without these credentials, the package cannot track usage or sync data.\n');
        }

        console.log('=== Basic Usage Example ===\n');
        await basicExample();

        console.log('\n=== Model Comparison Example ===\n');
        await compareModels();

        console.log('\n=== Manual Tracking Example ===\n');
        await manualTracking();

        console.log('\n=== Alerts Example ===\n');
        await setupAlerts();

        console.log('\n=== Export Data Example ===\n');
        await exportUsageData();
    })().catch(console.error);
}