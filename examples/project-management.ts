/**
 * Project Management Example
 * 
 * This example demonstrates how to use the AI Cost Optimizer with project-based
 * organization, budget tracking, and team collaboration features.
 */

import { AICostOptimizer } from '../src/index';

// Project configuration examples
const PROJECTS = {
    ECOMMERCE: {
        id: 'ecommerce-platform-2024',
        name: 'E-commerce AI Platform',
        description: 'AI-powered product recommendations and content generation',
        budget: {
            amount: 2000,
            currency: 'USD',
            period: 'monthly' as const
        },
        department: 'product',
        team: 'ai-ml'
    },
    CUSTOMER_SUPPORT: {
        id: 'customer-support-automation',
        name: 'Customer Support Automation',
        description: 'AI chatbot and automated response system',
        budget: {
            amount: 1500,
            currency: 'USD',
            period: 'monthly' as const
        },
        department: 'support',
        team: 'customer-success'
    },
    MARKETING: {
        id: 'marketing-content-gen',
        name: 'Marketing Content Generation',
        description: 'Automated blog posts, social media, and ad copy',
        budget: {
            amount: 800,
            currency: 'USD',
            period: 'monthly' as const
        },
        department: 'marketing',
        team: 'content'
    }
};

async function demonstrateProjectManagement() {
    console.log('🚀 AI Cost Optimizer - Project Management Demo\n');

    // Initialize optimizer with project configuration
    const optimizer = new AICostOptimizer({
        apiKey: process.env.OPENAI_API_KEY!,
        provider: 'openai',
        trackUsage: true,
        defaultProjectId: PROJECTS.ECOMMERCE.id,
        budgetAlerts: {
            thresholds: [50, 75, 90],
            webhookUrl: 'https://your-app.com/budget-alerts'
        }
    });

    // Example 1: E-commerce Product Descriptions
    console.log('📦 E-commerce: Generating product descriptions...');

    const productDescriptions = await Promise.all([
        optimizer.optimize({
            prompt: 'Generate SEO-optimized description for wireless noise-canceling headphones with 30-hour battery life',
            model: 'gpt-4',
            projectId: PROJECTS.ECOMMERCE.id,
            costAllocation: {
                department: PROJECTS.ECOMMERCE.department,
                team: PROJECTS.ECOMMERCE.team,
                purpose: 'product-descriptions',
                client: 'internal'
            },
            tags: ['seo', 'product-content', 'electronics']
        }),

        optimizer.optimize({
            prompt: 'Create compelling product title and bullet points for organic cotton t-shirt collection',
            model: 'gpt-3.5-turbo',
            projectId: PROJECTS.ECOMMERCE.id,
            costAllocation: {
                department: PROJECTS.ECOMMERCE.department,
                team: PROJECTS.ECOMMERCE.team,
                purpose: 'product-descriptions',
                client: 'internal'
            },
            tags: ['product-content', 'fashion', 'organic']
        })
    ]);

    console.log(`✅ Generated ${productDescriptions.length} product descriptions`);
    console.log(`💰 Total cost: $${productDescriptions.reduce((sum, result) => sum + result.cost, 0).toFixed(4)}\n`);

    // Example 2: Customer Support Automation
    console.log('🎧 Customer Support: Automated responses...');

    const supportResponses = await Promise.all([
        optimizer.optimize({
            prompt: 'Customer asks: "How do I return a defective product?" Provide helpful, empathetic response with clear steps.',
            model: 'gpt-3.5-turbo',
            projectId: PROJECTS.CUSTOMER_SUPPORT.id,
            costAllocation: {
                department: PROJECTS.CUSTOMER_SUPPORT.department,
                team: PROJECTS.CUSTOMER_SUPPORT.team,
                purpose: 'customer-support',
                client: 'end-customer'
            },
            tags: ['returns', 'customer-service', 'automated-response']
        }),

        optimizer.optimize({
            prompt: 'Customer complaint: "My order is late and I need it urgently." Generate professional, solution-focused response.',
            model: 'gpt-3.5-turbo',
            projectId: PROJECTS.CUSTOMER_SUPPORT.id,
            costAllocation: {
                department: PROJECTS.CUSTOMER_SUPPORT.department,
                team: PROJECTS.CUSTOMER_SUPPORT.team,
                purpose: 'customer-support',
                client: 'end-customer'
            },
            tags: ['shipping', 'complaints', 'automated-response']
        })
    ]);

    console.log(`✅ Generated ${supportResponses.length} support responses`);
    console.log(`💰 Total cost: $${supportResponses.reduce((sum, result) => sum + result.cost, 0).toFixed(4)}\n`);

    // Example 3: Marketing Content Generation
    console.log('📝 Marketing: Content generation...');

    const marketingContent = await Promise.all([
        optimizer.optimize({
            prompt: 'Write engaging blog post introduction about "The Future of AI in E-commerce" (300 words)',
            model: 'gpt-4',
            projectId: PROJECTS.MARKETING.id,
            costAllocation: {
                department: PROJECTS.MARKETING.department,
                team: PROJECTS.MARKETING.team,
                purpose: 'blog-content',
                client: 'internal'
            },
            tags: ['blog', 'ai', 'ecommerce', 'thought-leadership']
        }),

        optimizer.optimize({
            prompt: 'Create 5 social media posts promoting our new sustainable product line',
            model: 'gpt-3.5-turbo',
            projectId: PROJECTS.MARKETING.id,
            costAllocation: {
                department: PROJECTS.MARKETING.department,
                team: PROJECTS.MARKETING.team,
                purpose: 'social-media',
                client: 'internal'
            },
            tags: ['social-media', 'sustainability', 'product-promotion']
        })
    ]);

    console.log(`✅ Generated ${marketingContent.length} marketing pieces`);
    console.log(`💰 Total cost: $${marketingContent.reduce((sum, result) => sum + result.cost, 0).toFixed(4)}\n`);

    // Example 4: Project Analytics and Comparison
    console.log('📊 Analytics: Project performance comparison...');

    try {
        // Get individual project analytics
        const ecommerceAnalytics = await optimizer.getProjectAnalytics(PROJECTS.ECOMMERCE.id, {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
            endDate: new Date().toISOString(),
            groupBy: 'day'
        });

        console.log(`📦 E-commerce Project Analytics:`);
        console.log(`   - Total Cost: $${ecommerceAnalytics.summary.totalCost.toFixed(2)}`);
        console.log(`   - Total Tokens: ${ecommerceAnalytics.summary.totalTokens.toLocaleString()}`);
        console.log(`   - Total Requests: ${ecommerceAnalytics.summary.totalRequests}`);
        console.log(`   - Budget Utilization: ${ecommerceAnalytics.summary.budgetUtilization?.toFixed(1)}%`);

        // Compare all projects
        const projectComparison = await optimizer.compareProjects([
            PROJECTS.ECOMMERCE.id,
            PROJECTS.CUSTOMER_SUPPORT.id,
            PROJECTS.MARKETING.id
        ], {
            metric: 'cost',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
        });

        console.log(`\n🏆 Project Comparison (Last 30 Days):`);
        projectComparison.projects.forEach((project, index) => {
            console.log(`   ${index + 1}. ${project.projectName}`);
            console.log(`      - Cost: $${project.metrics.cost.toFixed(2)}`);
            console.log(`      - Requests: ${project.metrics.requests}`);
            console.log(`      - Avg Cost/Request: $${project.metrics.averageCostPerRequest.toFixed(4)}`);
            console.log(`      - Budget Usage: ${project.budgetUtilization.toFixed(1)}%`);
        });

        console.log(`\n📈 Overall Summary:`);
        console.log(`   - Total Projects: ${projectComparison.summary.totalProjects}`);
        console.log(`   - Combined Cost: $${projectComparison.summary.totalCost.toFixed(2)}`);
        console.log(`   - Combined Requests: ${projectComparison.summary.totalRequests}`);

    } catch (error) {
        console.log('⚠️  Analytics features require dashboard integration');
        console.log('   Configure dashboardConfig to enable project analytics');
    }

    // Example 5: Budget Monitoring
    console.log('\n💰 Budget Monitoring...');

    try {
        const budgetStatus = await optimizer.getBudgetStatus(PROJECTS.ECOMMERCE.id);

        console.log(`📦 E-commerce Budget Status:`);
        console.log(`   - Monthly Budget: $${budgetStatus.budget.amount}`);
        console.log(`   - Current Spending: $${budgetStatus.currentSpending.toFixed(2)}`);
        console.log(`   - Utilization: ${budgetStatus.utilizationPercentage.toFixed(1)}%`);
        console.log(`   - Remaining: $${budgetStatus.remainingBudget.toFixed(2)}`);

        if (budgetStatus.utilizationPercentage > 75) {
            console.log(`⚠️  Budget Alert: High utilization detected!`);
        }

    } catch (error) {
        console.log('⚠️  Budget monitoring requires dashboard integration');
        console.log('   Configure budgetAlerts to enable real-time monitoring');
    }

    // Example 6: Usage Tracking with Rich Metadata
    console.log('\n📋 Usage Tracking: Recording detailed usage data...');

    const usageEntries = await Promise.all([
        optimizer.trackUsage({
            prompt: 'Generate product recommendation algorithm explanation',
            completion: 'Our recommendation system uses collaborative filtering...',
            model: 'gpt-4',
            cost: 0.008,
            tokens: 450,
            responseTime: 1200,
            projectId: PROJECTS.ECOMMERCE.id,
            metadata: {
                endpoint: '/api/recommendations',
                temperature: 0.7,
                maxTokens: 500,
                promptTemplateId: 'product-rec-template-v2'
            },
            costAllocation: {
                department: 'product',
                team: 'ai-ml',
                purpose: 'algorithm-documentation',
                client: 'internal'
            },
            tags: ['documentation', 'algorithms', 'recommendations']
        }),

        optimizer.trackUsage({
            prompt: 'Analyze customer feedback sentiment',
            completion: 'The overall sentiment is positive with 85% satisfaction...',
            model: 'gpt-3.5-turbo',
            cost: 0.003,
            tokens: 280,
            responseTime: 800,
            projectId: PROJECTS.CUSTOMER_SUPPORT.id,
            metadata: {
                endpoint: '/api/sentiment-analysis',
                temperature: 0.3,
                maxTokens: 300
            },
            costAllocation: {
                department: 'support',
                team: 'analytics',
                purpose: 'sentiment-analysis',
                client: 'internal'
            },
            tags: ['sentiment', 'analytics', 'feedback']
        })
    ]);

    console.log(`✅ Tracked ${usageEntries.length} usage entries with detailed metadata\n`);

    // Example 7: Team Collaboration Features
    console.log('👥 Team Collaboration: Role-based access...');

    // Developer access - limited to specific projects
    const developerOptimizer = new AICostOptimizer({
        apiKey: process.env.OPENAI_API_KEY!,
        provider: 'openai',
        trackUsage: true,
        teamConfig: {
            userId: 'dev-001',
            teamId: 'engineering',
            role: 'developer',
            accessibleProjects: [PROJECTS.ECOMMERCE.id, PROJECTS.CUSTOMER_SUPPORT.id]
        }
    });

    // Admin access - full access to all projects
    const adminOptimizer = new AICostOptimizer({
        apiKey: process.env.OPENAI_API_KEY!,
        provider: 'openai',
        trackUsage: true,
        teamConfig: {
            userId: 'admin-001',
            teamId: 'leadership',
            role: 'admin',
            accessibleProjects: Object.values(PROJECTS).map(p => p.id)
        }
    });

    console.log('✅ Configured role-based access for team members');
    console.log('   - Developer: Limited project access');
    console.log('   - Admin: Full project access\n');

    console.log('🎉 Project Management Demo Complete!');
    console.log('\nKey Features Demonstrated:');
    console.log('✓ Project-based organization');
    console.log('✓ Budget tracking and alerts');
    console.log('✓ Cost allocation and metadata');
    console.log('✓ Project analytics and comparison');
    console.log('✓ Team collaboration and access control');
    console.log('✓ Detailed usage tracking');
}

// Run the demo
if (require.main === module) {
    demonstrateProjectManagement().catch(console.error);
}

export { demonstrateProjectManagement, PROJECTS }; 