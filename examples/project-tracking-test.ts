/// <reference types="node" />

import AICostTracker, {
    AIProvider,
    TrackerConfig
} from '../src';

// Test: ProjectId tracking validation
async function testProjectIdTracking() {
    console.log('=== Testing ProjectId Tracking ===\n');

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
            enableCachingSuggestions: true
        },
        tracking: {
            enableAutoTracking: true,
            storageType: 'memory'
        },
        // Dashboard integration using API key
        apiUrl: 'http://localhost:8000/api'
    };

    try {
        // Initialize the tracker
        const tracker = await AICostTracker.create(config);
        console.log('✅ Tracker initialized successfully');

        // Test projectId tracking
        const testProjectId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId

        console.log(`📊 Testing projectId tracking with projectId: ${testProjectId}`);

        // Test 1: Direct trackUsage with projectId
        await tracker.trackUsage({
            provider: AIProvider.OpenAI,
            model: 'gpt-3.5-turbo',
            promptTokens: 100,
            completionTokens: 150,
            totalTokens: 250,
            estimatedCost: 0.0005,
            prompt: "Test prompt for projectId validation",
            completion: "Test completion response",
            responseTime: 1200,
            projectId: testProjectId,  // This should be passed through
            tags: ['test', 'projectId-validation']
        });

        console.log('✅ Test 1: Direct trackUsage with projectId - SUCCESS');

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
        console.log('\nCheck your backend logs to verify that:');
        console.log('1. projectId is properly passed in the first two tests');
        console.log('2. projectId is undefined (not an error) in the third test');
        console.log('3. All usage records are saved correctly to the database');

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
        // Check if API_KEY is set for dashboard integration
        if (!process.env.API_KEY) {
            console.error('❌ API_KEY environment variable is required for this test');
            console.log('💡 Set your API_KEY from the AI Cost Optimizer dashboard');
            process.exit(1);
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY environment variable is required for this test');
            process.exit(1);
        }

        await testProjectIdTracking();
    })().catch(console.error);
} 