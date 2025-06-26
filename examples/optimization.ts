/// <reference types="node" />

import AICostTracker, {
    AIProvider,
    TrackerConfig,
} from '../src';

// Example 1: Prompt optimization
async function optimizePrompts() {
    const config: TrackerConfig = {
        providers: [
            {
                provider: AIProvider.OpenAI,
                apiKey: process.env.OPENAI_API_KEY!
            },
            {
                provider: AIProvider.AWSBedrock,
                region: 'us-east-1',
                optimization: {
                    enablePromptOptimization: true,
                    enableModelSuggestions: true,
                    enableCachingSuggestions: true,
                    bedrockConfig: {
                        region: 'us-east-1',
                        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0'
                    }
                }
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

    const tracker = await AICostTracker.create(config);

    // Example verbose prompt
    const verbosePrompt = `
      I would really appreciate it if you could basically help me understand 
      what machine learning is. I'm just a beginner and I'm pretty confused 
      about all the different concepts. Could you actually explain it in a way 
      that's very simple and easy to understand? I'd be quite grateful if you 
      could use some examples that are fairly relatable to everyday life.
    `;

    console.log('Original prompt:', verbosePrompt);
    console.log('Length:', verbosePrompt.length, 'characters\n');

    // Get optimization suggestions
    const suggestions = await tracker.optimizePrompt(
        verbosePrompt,
        'gpt-3.5-turbo',
        AIProvider.OpenAI
    );

    console.log('Optimization Suggestions:\n');
    suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.type.toUpperCase()} Optimization`);
        console.log(`   Confidence: ${(suggestion.confidence * 100).toFixed(0)}%`);
        console.log(`   Estimated Savings: ${suggestion.estimatedSavings.toFixed(1)}%`);
        console.log(`   Explanation: ${suggestion.explanation}`);

        if (suggestion.optimizedPrompt) {
            console.log(`   Optimized: "${suggestion.optimizedPrompt}"`);
        }

        console.log('');
    });
}

// Example 2: Get AI-powered optimization suggestions
async function getAIOptimizations() {
    const tracker = await AICostTracker.create({
        providers: [
            {
                provider: AIProvider.AWSBedrock,
                region: 'us-east-1',
                optimization: {
                    enablePromptOptimization: true,
                    enableModelSuggestions: true,
                    enableCachingSuggestions: true,
                    bedrockConfig: {
                        region: 'us-east-1',
                        modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                        // Add AWS credentials if not using default profile
                    }
                }
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
    });

    // Simulate some usage patterns
    const usagePatterns = [
        {
            prompt: "List the top 10 programming languages",
            model: "gpt-4",
            frequency: 50
        },
        {
            prompt: "What's the weather like today?",
            model: "gpt-4",
            frequency: 100
        },
        {
            prompt: "Translate this text to French: Hello, how are you?",
            model: "gpt-4",
            frequency: 30
        }
    ];

    // Track simulated usage
    for (const pattern of usagePatterns) {
        for (let i = 0; i < pattern.frequency; i++) {
            await tracker.trackUsage({
                provider: AIProvider.OpenAI,
                model: pattern.model,
                promptTokens: Math.floor(pattern.prompt.length / 4),
                completionTokens: 50,
                totalTokens: Math.floor(pattern.prompt.length / 4) + 50,
                estimatedCost: 0.003,
                prompt: pattern.prompt,
                responseTime: 1000 + Math.random() * 2000
            });
        }
    }

    // Get optimization suggestions based on usage patterns
    const suggestions = await tracker.getOptimizationSuggestions(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date()
    );

    console.log('\nAI-Powered Optimization Suggestions:\n');
    suggestions.slice(0, 5).forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.explanation}`);
        console.log(`   Type: ${suggestion.type}`);
        console.log(`   Potential Savings: ${suggestion.estimatedSavings.toFixed(1)}%`);
        console.log(`   Implementation: ${suggestion.implementation}`);
        console.log('');
    });
}

// Example 3: Generate optimization report
async function generateOptimizationReport() {
    const tracker = await AICostTracker.create({
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

    // Simulate diverse usage patterns
    const scenarios = [
        { model: 'gpt-4', cost: 0.05, tokens: 1000, prompt: 'Complex analysis task' },
        { model: 'gpt-3.5-turbo', cost: 0.002, tokens: 500, prompt: 'Simple question' },
        { model: 'anthropic.claude-3-5-sonnet-20240620-v1:0', cost: 0.015, tokens: 800, prompt: 'Code generation' }
    ];

    // Generate usage data
    for (let day = 0; day < 7; day++) {
        for (const scenario of scenarios) {
            const frequency = Math.floor(Math.random() * 20) + 1;
            for (let i = 0; i < frequency; i++) {
                await tracker.trackUsage({
                    provider: scenario.model.includes('claude') ? AIProvider.AWSBedrock : AIProvider.OpenAI,
                    model: scenario.model,
                    promptTokens: Math.floor(scenario.tokens * 0.3),
                    completionTokens: Math.floor(scenario.tokens * 0.7),
                    totalTokens: scenario.tokens,
                    estimatedCost: scenario.cost,
                    prompt: scenario.prompt,
                    responseTime: 2000
                });
            }
        }
    }

    // Generate comprehensive report
    const report = await tracker.generateReport(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        new Date()
    );

    console.log('\n=== OPTIMIZATION REPORT ===\n');
    console.log(report);
}

// Example 4: Batching optimization
async function batchingExample() {
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

    // Multiple related prompts that could be batched
    const prompts = [
        "What is the capital of France?",
        "What is the capital of Germany?",
        "What is the capital of Italy?",
        "What is the capital of Spain?",
        "What is the capital of Portugal?"
    ];

    console.log('Individual prompts:', prompts);

    // Estimate individual costs
    let totalIndividualCost = 0;
    for (const prompt of prompts) {
        const estimate = await tracker.estimateCost(
            prompt,
            'gpt-3.5-turbo',
            AIProvider.OpenAI,
            10
        );
        totalIndividualCost += estimate.totalCost;
    }

    // Estimate batched cost
    const batchedPrompt = prompts.map((p, i) => `${i + 1}. ${p}`).join('\n');
    const batchedEstimate = await tracker.estimateCost(
        batchedPrompt,
        'gpt-3.5-turbo',
        AIProvider.OpenAI,
        50
    );

    console.log('\nCost Analysis:');
    console.log(`Individual requests: $${totalIndividualCost.toFixed(4)}`);
    console.log(`Batched request: $${batchedEstimate.totalCost.toFixed(4)}`);
    console.log(`Savings: $${(totalIndividualCost - batchedEstimate.totalCost).toFixed(4)} (${((1 - batchedEstimate.totalCost / totalIndividualCost) * 100).toFixed(1)}%)`);
}

// Example 5: Model downgrade suggestions
async function modelDowngradeExample() {
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

    const tasks = [
        {
            prompt: "What is 2 + 2?",
            complexity: 'simple' as const,
            currentModel: 'gpt-4'
        },
        {
            prompt: "Write a haiku about spring",
            complexity: 'moderate' as const,
            currentModel: 'gpt-4'
        },
        {
            prompt: "Design a distributed system architecture for a global e-commerce platform",
            complexity: 'complex' as const,
            currentModel: 'gpt-4'
        }
    ];

    console.log('Model Optimization Analysis:\n');

    for (const task of tasks) {
        console.log(`Task: "${task.prompt.substring(0, 50)}..."`);
        console.log(`Complexity: ${task.complexity}`);
        console.log(`Current Model: ${task.currentModel}`);

        // Get current cost
        const currentCost = await tracker.estimateCost(
            task.prompt,
            task.currentModel,
            AIProvider.OpenAI,
            100
        );

        // Get suggested model cost
        const suggestedModel = task.complexity === 'simple' ? 'gpt-3.5-turbo' :
            task.complexity === 'moderate' ? 'gpt-3.5-turbo' : 'gpt-4';

        if (suggestedModel !== task.currentModel) {
            const optimizedCost = await tracker.estimateCost(
                task.prompt,
                suggestedModel,
                AIProvider.OpenAI,
                100
            );

            console.log(`Suggested Model: ${suggestedModel}`);
            console.log(`Current Cost: $${currentCost.totalCost.toFixed(4)}`);
            console.log(`Optimized Cost: $${optimizedCost.totalCost.toFixed(4)}`);
            console.log(`Savings: ${((1 - optimizedCost.totalCost / currentCost.totalCost) * 100).toFixed(1)}%`);
        } else {
            console.log('Recommendation: Keep current model for this complexity level');
        }
        console.log('');
    }
}

// Run examples
if (require.main === module) {
    (async () => {
        console.log('=== Prompt Optimization Example ===\n');
        await optimizePrompts();

        console.log('\n=== AI-Powered Optimizations ===\n');
        await getAIOptimizations();

        console.log('\n=== Batching Optimization ===\n');
        await batchingExample();

        console.log('\n=== Model Downgrade Analysis ===\n');
        await modelDowngradeExample();

        console.log('\n=== Generating Optimization Report ===\n');
        await generateOptimizationReport();
    })().catch(console.error);
}