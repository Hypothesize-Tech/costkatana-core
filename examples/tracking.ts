import AICostTracker, {
    AIProvider,
    CustomStorage,
    UsageMetadata
} from 'ai-cost-tracker';

// Example 1: Basic tracking with file storage
async function fileStorageExample() {
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
        }, 'user-file-test');

        console.log(`Request ${i + 1} tracked`);
    }

    // Retrieve usage history
    const history = await tracker.getAnalytics(
        new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        new Date(),
        'user-file-test'
    );

    console.log('\nUsage History:');
    console.log(`Total Requests: ${history.mostUsedModels[0]?.requestCount || 0}`);
    console.log(`Total Cost: $${history.totalCost.toFixed(4)}`);
    console.log(`Total Tokens: ${history.totalTokens}`);
}

// Example 2: Custom storage implementation
class MongoDBStorage implements CustomStorage {
    private collection: any; // MongoDB collection

    constructor() {
        // In real implementation, initialize MongoDB connection
        console.log('Initialized MongoDB storage (mock)');
        this.collection = [];
    }

    async save(data: UsageMetadata): Promise<void> {
        // In real implementation, save to MongoDB
        this.collection.push(data);
        console.log(`Saved usage data to MongoDB: ${data.model} - ${data.totalTokens} tokens`);
    }

    async load(filter?: any): Promise<UsageMetadata[]> {
        // In real implementation, query MongoDB
        let results = [...this.collection];

        if (filter?.userId) {
            results = results.filter(item => item.userId === filter.userId);
        }
        if (filter?.startDate) {
            results = results.filter(item => item.timestamp >= filter.startDate);
        }
        if (filter?.endDate) {
            results = results.filter(item => item.timestamp <= filter.endDate);
        }

        return results;
    }

    async clear(): Promise<void> {
        // In real implementation, clear collection
        this.collection = [];
        console.log('Cleared MongoDB collection');
    }
}

async function customStorageExample() {
    const customStorage = new MongoDBStorage();

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
            storageType: 'custom',
            customStorage: customStorage
        }
    });

    console.log('\nTracking with custom MongoDB storage...\n');

    // Track some usage
    await tracker.trackUsage({
        userId: 'mongodb-user',
        timestamp: new Date(),
        provider: AIProvider.OpenAI,
        model: 'gpt-4',
        promptTokens: 100,
        completionTokens: 200,
        totalTokens: 300,
        estimatedCost: 0.021,
        prompt: "Custom storage test",
        duration: 1500
    });

    console.log('Usage tracked successfully');
}

// Example 3: Real-time tracking dashboard
async function realtimeDashboard() {
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

    console.log('\nReal-time Usage Dashboard\n');
    console.log('Simulating API usage...\n');

    // Simulate real-time usage
    const models = [
        { model: 'gpt-3.5-turbo', provider: AIProvider.OpenAI },
        { model: 'gpt-4', provider: AIProvider.OpenAI },
        { model: 'anthropic.claude-3-haiku-20240307-v1:0', provider: AIProvider.AWSBedrock }
    ];

    const users = ['user-a', 'user-b', 'user-c'];

    // Simulate 10 requests
    for (let i = 0; i < 10; i++) {
        const model = models[Math.floor(Math.random() * models.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const promptLength = Math.floor(Math.random() * 200) + 50;
        const completionLength = Math.floor(Math.random() * 300) + 100;

        await tracker.trackUsage({
            userId: user,
            timestamp: new Date(),
            provider: model.provider,
            model: model.model,
            promptTokens: promptLength,
            completionTokens: completionLength,
            totalTokens: promptLength + completionLength,
            estimatedCost: (promptLength + completionLength) * 0.00002,
            prompt: `Request ${i + 1}`,
            duration: Math.floor(Math.random() * 2000) + 500
        });

        // Update dashboard
        const analytics = await tracker.getAnalytics();

        console.clear();
        console.log('=== Real-time Usage Dashboard ===\n');
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

// Example 4: User analytics and insights
async function userAnalytics() {
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

    // Simulate usage for different users
    const users = [
        { id: 'power-user', requests: 50, avgTokens: 500 },
        { id: 'regular-user', requests: 20, avgTokens: 200 },
        { id: 'occasional-user', requests: 5, avgTokens: 100 }
    ];

    console.log('\nGenerating user analytics...\n');

    for (const user of users) {
        for (let i = 0; i < user.requests; i++) {
            const promptTokens = Math.floor(user.avgTokens * 0.4);
            const completionTokens = Math.floor(user.avgTokens * 0.6);

            await tracker.trackUsage({
                userId: user.id,
                timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
                provider: AIProvider.OpenAI,
                model: Math.random() > 0.7 ? 'gpt-4' : 'gpt-3.5-turbo',
                promptTokens,
                completionTokens,
                totalTokens: promptTokens + completionTokens,
                estimatedCost: (promptTokens + completionTokens) * (Math.random() > 0.7 ? 0.00006 : 0.000002),
                prompt: `User request ${i + 1}`,
                duration: 1000 + Math.random() * 2000
            });
        }
    }

    // Get analytics for each user
    console.log('User Analytics Report:\n');

    for (const user of users) {
        const stats = await tracker.getUserStats(user.id);
        const analytics = await tracker.getAnalytics(undefined, undefined, user.id);

        console.log(`User: ${user.id}`);
        console.log(`  Total Requests: ${stats.totalRequests}`);
        console.log(`  Total Cost: $${stats.totalCost.toFixed(2)}`);
        console.log(`  Average Cost/Request: $${stats.averageCostPerRequest.toFixed(4)}`);
        console.log(`  Average Tokens/Request: ${stats.averageTokensPerRequest.toFixed(0)}`);
        console.log(`  Most Used Model: ${analytics.mostUsedModels[0]?.model || 'N/A'}`);
        console.log(`  Last Active: ${stats.lastUsed?.toLocaleDateString() || 'N/A'}`);
        console.log('');
    }
}

// Example 5: Export and backup data
async function exportAndBackup() {
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

    // Generate some data
    console.log('\nGenerating usage data for export...\n');

    for (let day = 0; day < 7; day++) {
        for (let request = 0; request < 10; request++) {
            await tracker.trackUsage({
                userId: `user-${request % 3}`,
                timestamp: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
                provider: AIProvider.OpenAI,
                model: 'gpt-3.5-turbo',
                promptTokens: 100 + Math.floor(Math.random() * 100),
                completionTokens: 200 + Math.floor(Math.random() * 200),
                totalTokens: 300 + Math.floor(Math.random() * 300),
                estimatedCost: 0.001 + Math.random() * 0.005,
                prompt: `Day ${day + 1}, Request ${request + 1}`,
                duration: 1000,
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

        console.log('\n=== User Analytics Example ===');
        await userAnalytics();

        console.log('\n=== Export and Backup Example ===');
        await exportAndBackup();

        // Uncomment to see real-time dashboard
        // console.log('\n=== Real-time Dashboard Example ===');
        // await realtimeDashboard();
    })().catch(console.error);
}