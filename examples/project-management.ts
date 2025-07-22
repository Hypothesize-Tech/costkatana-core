/**
 * Project Management Example
 * 
 * This example demonstrates how to use the Cost Katana with project-based
 * organization, budget tracking, and team collaboration features integrated
 * with the Cost Katana dashboard at costkatana.com.
 * 
 * Prerequisites:
 * 1. Register at https://costkatana.com
 * 2. Create a project in your dashboard
 * 3. Set API_KEY and PROJECT_ID environment variables
 */

import AICostOptimizer, { AIProvider } from '../src/index';

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
    console.log('🚀 Cost Katana - Project Management Demo\n');

    // Initialize tracker with project configuration and Cost Katana integration
    const tracker = await AICostOptimizer.create({
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
        // Automatically syncs with costkatana.com using API_KEY and PROJECT_ID
    });

    // Example 1: E-commerce Product Descriptions
    console.log('📦 E-commerce: Generating product descriptions...');

    const productDescriptions = await Promise.all([
        tracker.makeRequest({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: 'Generate SEO-optimized description for wireless noise-canceling headphones with 30-hour battery life'
            }],
            maxTokens: 200,
            metadata: {
                projectId: PROJECTS.ECOMMERCE.id,
                costAllocation: {
                    department: PROJECTS.ECOMMERCE.department,
                    team: PROJECTS.ECOMMERCE.team,
                    purpose: 'product-descriptions',
                    client: 'internal'
                },
                tags: ['seo', 'product-content', 'electronics']
            }
        }),

        tracker.makeRequest({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: 'Create compelling product title and bullet points for organic cotton t-shirt collection'
            }],
            maxTokens: 150,
            metadata: {
                projectId: PROJECTS.ECOMMERCE.id,
                costAllocation: {
                    department: PROJECTS.ECOMMERCE.department,
                    team: PROJECTS.ECOMMERCE.team,
                    purpose: 'product-descriptions',
                    client: 'internal'
                },
                tags: ['product-content', 'fashion', 'organic']
            }
        })
    ]);

    console.log(`✅ Generated ${productDescriptions.length} product descriptions`);
    console.log(`📄 Responses received and tracked to Cost Katana dashboard\n`);

    // Example 2: Customer Support Automation
    console.log('🎧 Customer Support: Automated responses...');

    const supportResponses = await Promise.all([
        tracker.makeRequest({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: 'Customer asks: "How do I return a defective product?" Provide helpful, empathetic response with clear steps.'
            }],
            maxTokens: 200,
            metadata: {
                projectId: PROJECTS.CUSTOMER_SUPPORT.id,
                costAllocation: {
                    department: PROJECTS.CUSTOMER_SUPPORT.department,
                    team: PROJECTS.CUSTOMER_SUPPORT.team,
                    purpose: 'customer-support',
                    client: 'end-customer'
                },
                tags: ['returns', 'customer-service', 'automated-response']
            }
        }),

        tracker.makeRequest({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: 'Customer complaint: "My order is late and I need it urgently." Generate professional, solution-focused response.'
            }],
            maxTokens: 200,
            metadata: {
                projectId: PROJECTS.CUSTOMER_SUPPORT.id,
                costAllocation: {
                    department: PROJECTS.CUSTOMER_SUPPORT.department,
                    team: PROJECTS.CUSTOMER_SUPPORT.team,
                    purpose: 'customer-support',
                    client: 'end-customer'
                },
                tags: ['shipping', 'complaints', 'automated-response']
            }
        })
    ]);

    console.log(`✅ Generated ${supportResponses.length} support responses`);
    console.log(`📄 Responses received and tracked to Cost Katana dashboard\n`);

    // Example 3: Marketing Content Generation
    console.log('📝 Marketing: Content generation...');

    const marketingContent = await Promise.all([
        tracker.makeRequest({
            model: 'gpt-4',
            messages: [{
                role: 'user',
                content: 'Write engaging blog post introduction about "The Future of AI in E-commerce" (300 words)'
            }],
            maxTokens: 400,
            metadata: {
                projectId: PROJECTS.MARKETING.id,
                costAllocation: {
                    department: PROJECTS.MARKETING.department,
                    team: PROJECTS.MARKETING.team,
                    purpose: 'blog-content',
                    client: 'internal'
                },
                tags: ['blog', 'ai', 'ecommerce', 'thought-leadership']
            }
        }),

        tracker.makeRequest({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: 'Create 5 social media posts promoting our new sustainable product line'
            }],
            maxTokens: 300,
            metadata: {
                projectId: PROJECTS.MARKETING.id,
                costAllocation: {
                    department: PROJECTS.MARKETING.department,
                    team: PROJECTS.MARKETING.team,
                    purpose: 'social-media',
                    client: 'internal'
                },
                tags: ['social-media', 'sustainability', 'product-promotion']
            }
        })
    ]);

    console.log(`✅ Generated ${marketingContent.length} marketing pieces`);
    console.log(`📄 Responses received and tracked to Cost Katana dashboard\n`);

    // Example 4: Project Analytics and Comparison
    console.log('📊 Analytics: Available in Cost Katana Dashboard...');

    console.log('📈 All project analytics are available in your Cost Katana dashboard:');
    console.log('   - Visit https://costkatana.com to view detailed analytics');
    console.log('   - Project-specific cost breakdowns and comparisons');
    console.log('   - Real-time budget monitoring and alerts');
    console.log('   - Usage trends and optimization recommendations');
    console.log('   - Team collaboration and access controls\n');

    // Example 5: Budget Monitoring
    console.log('\n💰 Budget Monitoring: Available in Cost Katana Dashboard...');

    console.log('💰 Budget monitoring features available at https://costkatana.com:');
    console.log('   - Set monthly/yearly budgets per project');
    console.log('   - Real-time budget utilization tracking');
    console.log('   - Automated alerts at custom thresholds');
    console.log('   - Budget forecasting and recommendations');
    console.log('   - Cost allocation across teams and departments\n');

    // Example 6: Usage Tracking with Rich Metadata
    console.log('\n📋 Usage Tracking: Recording detailed usage data...');

    const usageEntries = await Promise.all([
        tracker.trackUsage({
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

        tracker.trackUsage({
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
    console.log('👥 Team Collaboration: Available in Cost Katana Dashboard...');

    console.log('👥 Team collaboration features available at https://costkatana.com:');
    console.log('   - Role-based access controls (Admin, Developer, Viewer)');
    console.log('   - Project-specific permissions and access limits');
    console.log('   - Team member invitation and management');
    console.log('   - Usage tracking by individual team members');
    console.log('   - Shared projects and cost allocation');
    console.log('   - Audit logs and activity tracking\n');

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