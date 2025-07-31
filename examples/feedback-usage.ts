/**
 * CostKATANA User Feedback & Value Tracking Example
 * 
 * This example demonstrates how to use the feedback functionality to measure
 * Return on AI Spend by correlating costs with user satisfaction.
 */

import AICostTracker, { FeedbackOptions, ImplicitSignals } from '../src/index';

async function main() {
    // Initialize the tracker with your API key
    const tracker = new AICostTracker({
        apiKey: 'your-costkatana-api-key',
        providers: {
            openai: { apiKey: 'your-openai-key' }
        },
        tracking: {
            enableAutoTracking: true
        }
    });

    // Initialize gateway for request tracking
    tracker.initializeGateway({
        baseURL: 'https://cost-katana-backend.store/api/gateway',
        defaultHeaders: {
            'CostKatana-Auth': 'Bearer your-costkatana-api-key'
        }
    });

    console.log('🚀 CostKATANA User Feedback & Value Tracking Demo');

    // ====================================================================
    // STEP 1: Make AI requests and capture request IDs
    // ====================================================================

    console.log('\n📝 Step 1: Making AI requests with request ID tracking...');

    // Generate unique request IDs
    const supportBotRequestId = `support-${Date.now()}-1`;
    const codeAssistRequestId = `code-${Date.now()}-2`;

    // Make a support bot request
    const supportResponse = await tracker.gatewayOpenAI({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: 'You are a helpful customer support assistant.' },
            { role: 'user', content: 'How do I return a damaged product?' }
        ],
        max_tokens: 150
    }, {
        requestId: supportBotRequestId,
        properties: {
            feature: 'support-bot',
            department: 'customer-service'
        }
    });

    console.log(`✅ Support bot response received (Request ID: ${supportBotRequestId})`);

    // Make a code assistant request
    const codeResponse = await tracker.gatewayOpenAI({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'user', content: 'Write a Python function to calculate fibonacci numbers' }
        ],
        max_tokens: 200
    }, {
        requestId: codeAssistRequestId,
        properties: {
            feature: 'code-assistant',
            department: 'engineering'
        }
    });

    console.log(`✅ Code assistant response received (Request ID: ${codeAssistRequestId})`);

    // ====================================================================
    // STEP 2: Simulate user feedback collection
    // ====================================================================

    console.log('\n👍 Step 2: Collecting user feedback...');

    // Positive feedback for support bot (user found it helpful)
    const supportFeedback: FeedbackOptions = {
        rating: true, // Positive feedback
        comment: "Perfect! The bot gave me exactly the steps I needed for returning my item.",
        implicitSignals: {
            copied: true,              // User copied the response
            conversationContinued: false, // User didn't ask follow-up questions
            immediateRephrase: false,  // User didn't rephrase the question
            sessionDuration: 45000,    // User spent 45 seconds reading
            codeAccepted: null         // Not applicable for support
        }
    };

    await tracker.submitFeedback(supportBotRequestId, supportFeedback);
    console.log('✅ Positive feedback submitted for support bot');

    // Negative feedback for code assistant (user wasn't satisfied)
    const codeFeedback: FeedbackOptions = {
        rating: false, // Negative feedback
        comment: "The code was incomplete and had syntax errors. Not helpful.",
        implicitSignals: {
            copied: false,             // User didn't copy the code
            conversationContinued: true, // User asked follow-up questions
            immediateRephrase: true,   // User rephrased for better results
            sessionDuration: 120000,   // User spent 2 minutes trying to fix
            codeAccepted: false        // User rejected the code
        }
    };

    await tracker.submitFeedback(codeAssistRequestId, codeFeedback);
    console.log('✅ Negative feedback submitted for code assistant');

    // ====================================================================
    // STEP 3: Update implicit signals (behavioral tracking)
    // ====================================================================

    console.log('\n📊 Step 3: Updating implicit behavioral signals...');

    // Later, update implicit signals based on user behavior
    const updatedSignals: ImplicitSignals = {
        copied: true,
        conversationContinued: false,
        sessionDuration: 60000, // User came back and spent more time
        codeAccepted: false
    };

    await tracker.updateImplicitSignals(codeAssistRequestId, updatedSignals);
    console.log('✅ Implicit signals updated for code assistant');

    // ====================================================================
    // STEP 4: Analyze Return on AI Spend
    // ====================================================================

    console.log('\n💰 Step 4: Analyzing Return on AI Spend...');

    // Get basic feedback analytics
    const basicAnalytics = await tracker.getFeedbackAnalytics();
    console.log('\n📈 Basic Feedback Analytics:');
    console.log(`Total Requests: ${basicAnalytics.totalRequests}`);
    console.log(`Positive Ratings: ${basicAnalytics.positiveRatings} (${(basicAnalytics.averageRating * 100).toFixed(1)}%)`);
    console.log(`Negative Ratings: ${basicAnalytics.negativeRatings}`);
    console.log(`Total Cost: $${basicAnalytics.totalCost.toFixed(4)}`);
    console.log(`Cost on Positive Responses: $${basicAnalytics.positiveCost.toFixed(4)}`);
    console.log(`Cost on Negative Responses: $${basicAnalytics.negativeCost.toFixed(4)}`);

    // Get enhanced analytics with insights and recommendations
    const enhancedAnalytics = await tracker.getEnhancedFeedbackAnalytics();
    console.log('\n🎯 Enhanced Analytics with Business Insights:');
    
    if (enhancedAnalytics.insights) {
        console.log(`Wasted Spend: ${enhancedAnalytics.insights.wastedSpendPercentage.toFixed(1)}% of budget`);
        console.log(`Return on AI Spend: ${(enhancedAnalytics.insights.returnOnAISpend * 100).toFixed(1)}%`);
        console.log(`Cost Efficiency Score: ${enhancedAnalytics.insights.costEfficiencyScore.toFixed(1)}%`);
        
        console.log('\n💡 Recommendations:');
        enhancedAnalytics.insights.recommendations.forEach((rec, index) => {
            console.log(`${index + 1}. ${rec}`);
        });
    }

    // ====================================================================
    // STEP 5: Feature-specific ROI analysis
    // ====================================================================

    console.log('\n🔍 Step 5: Feature-specific ROI Analysis...');

    console.log('\n📊 Ratings by Feature:');
    Object.entries(basicAnalytics.ratingsByFeature).forEach(([feature, stats]) => {
        const total = stats.positive + stats.negative;
        const satisfaction = total > 0 ? (stats.positive / total * 100) : 0;
        const avgCost = total > 0 ? (stats.cost / total) : 0;
        
        console.log(`${feature}:`);
        console.log(`  - Satisfaction: ${satisfaction.toFixed(1)}% (${stats.positive}/${total})`);
        console.log(`  - Average Cost: $${avgCost.toFixed(4)}`);
        console.log(`  - Total Spend: $${stats.cost.toFixed(4)}`);
    });

    console.log('\n📊 Ratings by Model:');
    Object.entries(basicAnalytics.ratingsByModel).forEach(([model, stats]) => {
        const total = stats.positive + stats.negative;
        const satisfaction = total > 0 ? (stats.positive / total * 100) : 0;
        
        console.log(`${model}: ${satisfaction.toFixed(1)}% satisfaction, $${stats.cost.toFixed(4)} spent`);
    });

    // ====================================================================
    // STEP 6: Implicit signals analysis
    // ====================================================================

    console.log('\n🎭 Step 6: Implicit Behavioral Analysis...');

    const signals = basicAnalytics.implicitSignalsAnalysis;
    console.log(`Copy Rate: ${(signals.copyRate * 100).toFixed(1)}% (high value indicator)`);
    console.log(`Continuation Rate: ${(signals.continuationRate * 100).toFixed(1)}% (engagement indicator)`);
    console.log(`Rephrase Rate: ${(signals.rephraseRate * 100).toFixed(1)}% (confusion indicator)`);
    console.log(`Code Acceptance Rate: ${(signals.codeAcceptanceRate * 100).toFixed(1)}%`);
    console.log(`Average Session Duration: ${(signals.averageSessionDuration / 1000).toFixed(1)} seconds`);

    // ====================================================================
    // BUSINESS INSIGHTS SUMMARY
    // ====================================================================

    console.log('\n💼 Business Insights Summary:');
    console.log('=====================================');
    
    const wastedPercentage = basicAnalytics.totalCost > 0 ? 
        (basicAnalytics.negativeCost / basicAnalytics.totalCost * 100) : 0;
    
    console.log(`💸 Wasted Spend: ${wastedPercentage.toFixed(1)}% ($${basicAnalytics.negativeCost.toFixed(4)})`);
    console.log(`✅ Effective Spend: ${(100 - wastedPercentage).toFixed(1)}% ($${basicAnalytics.positiveCost.toFixed(4)})`);
    console.log(`📈 ROI Score: ${(basicAnalytics.averageRating * 100).toFixed(1)}%`);
    
    if (wastedPercentage > 20) {
        console.log('⚠️  HIGH WASTE ALERT: Consider optimizing prompts or switching models');
    } else if (wastedPercentage < 10) {
        console.log('🎉 EXCELLENT: Your AI spending is highly efficient!');
    }

    console.log('\n🔚 Demo completed! You now have visibility into your Return on AI Spend.');
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

export default main;