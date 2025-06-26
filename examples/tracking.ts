/// <reference types="node" />

import AICostTracker, {
    AIProvider,
    CustomStorage,
    UsageMetadata
} from '../src';

// Example 1: Basic tracking with file storage
async function fileStorageExample() {
    const tracker = await AICostTracker.create({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true,
            thresholds: {
                highCostPerRequest: 0,
                highTokenUsage: 0,
                frequencyThreshold: 0
            }
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'file',
            retentionDays: 30 // Keep data for 30 days
        }
    });

    console.log('Tracking with file storage...\n');

    // Make some tracked requests
    for (let i = 0; i < 5; i++) {
        await tracker.makeRequest({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: `Question ${i + 1}: What is ${i + 1} + ${i + 1}?` }
            ],
            maxTokens: 50
        });

        console.log(`Request ${i + 1} tracked`);
    }

    // Retrieve usage history from local cache
    const history = await tracker.getAnalytics(
        new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        new Date()
    );

    console.log('\nUsage History (Local Cache):');
    console.log(`Total Requests: ${history.mostUsedModels[0]?.requestCount || 0}`);
    console.log(`Total Cost: $${history.totalCost.toFixed(4)}`);
    console.log(`Total Tokens: ${history.totalTokens}`);
}

// Example 2: Custom storage implementation
class MongoDBStorage implements CustomStorage {
    private collection: any; // Mock MongoDB collection

    constructor() {
        console.log('Initialized MongoDB storage (mock)');
        this.collection = [];
    }

    async save(data: UsageMetadata): Promise<void> {
        this.collection.push(data);
        console.log(`Saved usage data to MongoDB: ${data.model} - ${data.totalTokens} tokens`);
    }

    async load(filter?: any): Promise<UsageMetadata[]> {
        // In a real implementation, you might filter by dates or tags from the backend
        let results = [...this.collection];
        if (filter?.startDate) {
            results = results.filter(item => new Date(item.timestamp) >= filter.startDate);
        }
        if (filter?.endDate) {
            results = results.filter(item => new Date(item.timestamp) <= filter.endDate);
        }
        return results;
    }

    async clear(): Promise<void> {
        this.collection = [];
        console.log('Cleared MongoDB collection');
    }
}

async function customStorageExample() {
    const customStorage = new MongoDBStorage();

    const tracker = await AICostTracker.create({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true,
            thresholds: {
                highCostPerRequest: 0,  
                highTokenUsage: 0,
                frequencyThreshold: 0
            }
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'custom',
            customStorage: customStorage
        }
    });

    console.log('\nTracking with custom MongoDB storage...\n');

    // Track some usage
    await tracker.trackUsage({
        provider: AIProvider.OpenAI,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 200,
        totalTokens: 300,
        estimatedCost: 0.021,
        prompt: "Custom storage test",
        responseTime: 1500
    });

    console.log('Usage tracked successfully');
}

// Example 3: Real-time tracking dashboard
async function realtimeDashboard() {
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
                highCostPerRequest: 0,
                highTokenUsage: 0,
                frequencyThreshold: 0
            }
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        }
    });

    console.log('\nReal-time Usage Dashboard (Local Cache)\n');
    console.log('Simulating API usage...\n');

    // Simulate real-time usage
    const models = [
        { model: 'gpt-3.5-turbo', provider: AIProvider.OpenAI },
        { model: 'gpt-4', provider: AIProvider.OpenAI },
        { model: 'anthropic.claude-3-haiku-20240307-v1:0', provider: AIProvider.AWSBedrock }
    ];

    // Simulate 10 requests
    for (let i = 0; i < 10; i++) {
        const model = models[Math.floor(Math.random() * models.length)];
        const promptLength = Math.floor(Math.random() * 200) + 50;
        const completionLength = Math.floor(Math.random() * 300) + 100;

        await tracker.trackUsage({
            provider: model.provider,
            model: model.model,
            promptTokens: promptLength,
            completionTokens: completionLength,
            totalTokens: promptLength + completionLength,
            estimatedCost: (promptLength + completionLength) * 0.00002,
            prompt: `Request ${i + 1}`,
            responseTime: Math.floor(Math.random() * 2000) + 500
        });

        // Update dashboard
        const analytics = await tracker.getAnalytics();

        console.clear();
        console.log('=== Real-time Usage Dashboard (Local Cache) ===\n');
        console.log(`Total Requests: ${i + 1}`);
        console.log(`Total Cost: $${analytics.totalCost.toFixed(4)}`);
        console.log(`Total Tokens: ${analytics.totalTokens.toLocaleString()}`);
        console.log(`Average Cost/Request: $${(analytics.totalCost / (i + 1)).toFixed(4)}`);
        console.log('\nTop Models:');
        analytics.mostUsedModels.slice(0, 3).forEach(model => {
            console.log(`  ${model.model}: ${model.requestCount} requests ($${model.totalCost.toFixed(4)})`);
        });
        console.log('\nCost by Provider:');
        analytics.costByProvider.forEach(provider => {
            console.log(`  ${provider.provider}: $${provider.totalCost.toFixed(4)} (${provider.percentage.toFixed(1)}%)`);
        });

        // Wait before next update
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Example 4: Export and backup data
async function exportAndBackup() {
    const tracker = await AICostTracker.create({
        providers: [
            { provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY! }
        ],
        optimization: {
            enablePromptOptimization: true,
            enableModelSuggestions: true,
            enableCachingSuggestions: true,
            thresholds: {
                highCostPerRequest: 0,
                highTokenUsage: 0,
                frequencyThreshold: 0
            }
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        }
    });

    // Generate some data
    console.log('\nGenerating usage data for export...\n');

    for (let day = 0; day < 7; day++) {
        for (let request = 0; request < 10; request++) {
            await tracker.trackUsage({
                provider: AIProvider.OpenAI,
                model: 'gpt-3.5-turbo',
                promptTokens: 100 + Math.floor(Math.random() * 100),
                completionTokens: 200 + Math.floor(Math.random() * 200),
                totalTokens: 300 + Math.floor(Math.random() * 300),
                estimatedCost: 0.001 + Math.random() * 0.005,
                prompt: `Day ${day + 1}, Request ${request + 1}`,
                responseTime: 1000,
                tags: ['export-test', `day-${day + 1}`]
            });
        }
    }

    // Export in different formats
    console.log('Exporting data...\n');

    // JSON export
    const jsonExport = await tracker.exportData('json');
    console.log('JSON Export (first 200 chars):');
    console.log(jsonExport.substring(0, 200) + '...\n');

    // CSV export
    const csvExport = await tracker.exportData('csv');
    console.log('CSV Export (first 5 lines):');
    console.log(csvExport.split('\n').slice(0, 5).join('\n') + '\n...\n');

    // Save to files (in real implementation)
    console.log('Files would be saved as:');
    console.log('  - usage_backup_' + new Date().toISOString().split('T')[0] + '.json');
    console.log('  - usage_backup_' + new Date().toISOString().split('T')[0] + '.csv');
}

// Run examples
if (require.main === module) {
    (async () => {
        console.log('=== File Storage Example ===');
        await fileStorageExample();

        console.log('\n=== Custom Storage Example ===');
        await customStorageExample();

        console.log('\n=== Export and Backup Example ===');
        await exportAndBackup();

        // Uncomment to see real-time dashboard
        // console.log('\n=== Real-time Dashboard Example ===');
        // await realtimeDashboard();
    })().catch(console.error);
}