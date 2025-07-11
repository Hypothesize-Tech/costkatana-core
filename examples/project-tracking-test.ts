/// <reference types="node" />

import AICostTracker, {
    AIProvider,
    TrackerConfig
} from '../src';

// Test: ProjectId tracking validation with Cost Katana
async function testProjectIdTracking() {
    console.log('=== Testing ProjectId Tracking with Cost Katana ===\n');
    console.log('📊 This test validates automatic syncing with costkatana.com\n');

    // Configure the tracker with Cost Katana dashboard integration
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
        // Automatically connects to costkatana.com using environment variables
    };

    try {
        // Initialize the tracker - connects to costkatana.com automatically
        const tracker = await AICostTracker.create(config);
        console.log('✅ Tracker initialized and connected to Cost Katana dashboard');
        console.log('🔑 Using credentials from environment variables\n');

        // Test projectId tracking
        const testProjectId = process.env.PROJECT_ID; // Use actual project ID from environment

        console.log(`📊 Testing projectId tracking with projectId: ${testProjectId}`);
        console.log('📈 All data will be synced to your costkatana.com dashboard\n');

        // Test 1: Direct trackUsage with projectId
        await tracker.trackUsage({
            provider: AIProvider.OpenAI,
            model: 'gpt-3.5-turbo',
            promptTokens: 100,
            completionTokens: 150,
            totalTokens: 250,
            estimatedCost: 0.0005,
            prompt: "Test prompt for projectId validation with Cost Katana",
            completion: "Test completion response synced to costkatana.com",
            responseTime: 1200,
            projectId: testProjectId,  // This should be passed through to costkatana.com
            tags: ['test', 'projectId-validation', 'costkatana']
        });

        console.log('✅ Test 1: Direct trackUsage with projectId - SUCCESS (synced to costkatana.com)');

        // Test 2: Make tracked request with projectId in metadata
        const response = await tracker.makeRequest({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a test assistant.' },
                { role: 'user', content: 'Say hello for projectId test' }
            ],
            maxTokens: 50,
            temperature: 0.7,
            metadata: {
                projectId: testProjectId  // This should also be tracked
            }
        });

        console.log('✅ Test 2: Tracked request with projectId in metadata - SUCCESS');
        console.log('Response:', response.choices[0].message.content);

        // Test 3: Verify projectId is properly handled when missing
        await tracker.trackUsage({
            provider: AIProvider.OpenAI,
            model: 'gpt-3.5-turbo',
            promptTokens: 50,
            completionTokens: 75,
            totalTokens: 125,
            estimatedCost: 0.00025,
            prompt: "Test prompt without projectId",
            completion: "Test completion without projectId",
            responseTime: 800,
            // No projectId provided - should handle gracefully
            tags: ['test', 'no-projectId']
        });

        console.log('✅ Test 3: trackUsage without projectId - SUCCESS (handled gracefully)');

        console.log('\n🎉 All projectId tracking tests completed successfully!');
        console.log('\n📊 Check your Cost Katana dashboard at https://costkatana.com to verify:');
        console.log('1. All test usage data appears in your project dashboard');
        console.log('2. ProjectId is properly associated with tracked requests');
        console.log('3. Cost and token metrics are accurately recorded');
        console.log('4. Tags and metadata are preserved in the dashboard analytics');

    } catch (error) {
        console.error('❌ ProjectId tracking test failed:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
        }
    }
}

// Run the test
if (require.main === module) {
    (async () => {
        // Check if required environment variables are set for Cost Katana integration
        if (!process.env.API_KEY) {
            console.error('❌ API_KEY environment variable is required for this test');
            console.log('💡 Get your API_KEY from your Cost Katana dashboard at https://costkatana.com');
            console.log('📋 Steps: 1) Register at costkatana.com 2) Create a project 3) Copy API_KEY from settings');
            process.exit(1);
        }

        if (!process.env.PROJECT_ID) {
            console.error('❌ PROJECT_ID environment variable is required for this test');
            console.log('💡 Get your PROJECT_ID from your Cost Katana dashboard at https://costkatana.com');
            console.log('📋 Steps: 1) Go to your project 2) Copy PROJECT_ID from project settings');
            process.exit(1);
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY environment variable is required for this test');
            console.log('💡 Get your OpenAI API key from https://platform.openai.com/api-keys');
            process.exit(1);
        }

        await testProjectIdTracking();
    })().catch(console.error);
} 