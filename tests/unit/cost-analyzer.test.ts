import { CostAnalyzer } from '../../src/analyzers/cost-analyzer';
import { UsageMetadata, AIProvider } from '../../src/types';

describe('CostAnalyzer', () => {
    let analyzer: CostAnalyzer;
    let sampleData: UsageMetadata[];

    beforeEach(() => {
        analyzer = new CostAnalyzer();

        sampleData = [
            {
                userId: 'user1',
                timestamp: new Date('2024-01-01'),
                provider: AIProvider.OpenAI,
                model: 'gpt-3.5-turbo',
                promptTokens: 100,
                completionTokens: 200,
                totalTokens: 300,
                estimatedCost: 0.0006,
                prompt: 'Test prompt 1',
                completion: 'Test completion 1',
                duration: 1000
            },
            {
                userId: 'user1',
                timestamp: new Date('2024-01-02'),
                provider: AIProvider.OpenAI,
                model: 'gpt-4',
                promptTokens: 150,
                completionTokens: 250,
                totalTokens: 400,
                estimatedCost: 0.0255,
                prompt: 'Test prompt 2',
                completion: 'Test completion 2',
                duration: 2000
            },
            {
                userId: 'user2',
                timestamp: new Date('2024-01-02'),
                provider: AIProvider.AWSBedrock,
                model: 'anthropic.claude-3-haiku-20240307-v1:0',
                promptTokens: 200,
                completionTokens: 300,
                totalTokens: 500,
                estimatedCost: 0.000625,
                prompt: 'Test prompt 3',
                completion: 'Test completion 3',
                duration: 1500
            }
        ];
    });

    describe('addUsageData', () => {
        it('should add single usage data', () => {
            analyzer.addUsageData(sampleData[0]);
            const data = analyzer.getData();
            expect(data).toHaveLength(1);
            expect(data[0]).toEqual(sampleData[0]);
        });

        it('should add multiple usage data', () => {
            analyzer.addUsageData(sampleData);
            const data = analyzer.getData();
            expect(data).toHaveLength(3);
            expect(data).toEqual(sampleData);
        });
    });

    describe('analyzeUsage', () => {
        beforeEach(() => {
            analyzer.addUsageData(sampleData);
        });

        it('should calculate total cost correctly', () => {
            const analytics = analyzer.analyzeUsage();
            const expectedTotalCost = 0.0006 + 0.0255 + 0.000625;
            expect(analytics.totalCost).toBeCloseTo(expectedTotalCost, 6);
        });

        it('should calculate total tokens correctly', () => {
            const analytics = analyzer.analyzeUsage();
            expect(analytics.totalTokens).toBe(1200);
        });

        it('should calculate average tokens per request', () => {
            const analytics = analyzer.analyzeUsage();
            expect(analytics.averageTokensPerRequest).toBe(400);
        });

        it('should filter by user ID', () => {
            const analytics = analyzer.analyzeUsage(undefined, undefined, 'user1');
            expect(analytics.totalCost).toBeCloseTo(0.0261, 6);
            expect(analytics.totalTokens).toBe(700);
        });

        it('should filter by date range', () => {
            const analytics = analyzer.analyzeUsage(
                new Date('2024-01-02'),
                new Date('2024-01-02')
            );
            expect(analytics.totalCost).toBeCloseTo(0.026125, 6);
            expect(analytics.totalTokens).toBe(900);
        });

        it('should return empty analytics for no data', () => {
            const emptyAnalyzer = new CostAnalyzer();
            const analytics = emptyAnalyzer.analyzeUsage();

            expect(analytics.totalCost).toBe(0);
            expect(analytics.totalTokens).toBe(0);
            expect(analytics.averageTokensPerRequest).toBe(0);
            expect(analytics.mostUsedModels).toHaveLength(0);
        });
    });

    describe('getMostUsedModels', () => {
        beforeEach(() => {
            analyzer.addUsageData(sampleData);
        });

        it('should identify most used models', () => {
            const analytics = analyzer.analyzeUsage();
            const mostUsed = analytics.mostUsedModels;

            expect(mostUsed).toHaveLength(3);
            expect(mostUsed[0].model).toBe('gpt-3.5-turbo');
            expect(mostUsed[0].requestCount).toBe(1);
        });

        it('should calculate model costs correctly', () => {
            const analytics = analyzer.analyzeUsage();
            const gpt4Model = analytics.mostUsedModels.find(m => m.model === 'gpt-4');

            expect(gpt4Model).toBeDefined();
            expect(gpt4Model?.totalCost).toBeCloseTo(0.0255, 6);
            expect(gpt4Model?.totalTokens).toBe(400);
        });
    });

    describe('getCostByProvider', () => {
        beforeEach(() => {
            analyzer.addUsageData(sampleData);
        });

        it('should calculate costs by provider', () => {
            const analytics = analyzer.analyzeUsage();
            const costByProvider = analytics.costByProvider;

            expect(costByProvider).toHaveLength(2);

            const openAICost = costByProvider.find(p => p.provider === AIProvider.OpenAI);
            expect(openAICost?.totalCost).toBeCloseTo(0.0261, 6);
            expect(openAICost?.percentage).toBeGreaterThan(97);

            const bedrockCost = costByProvider.find(p => p.provider === AIProvider.AWSBedrock);
            expect(bedrockCost?.totalCost).toBeCloseTo(0.000625, 6);
        });
    });

    describe('getUsageOverTime', () => {
        beforeEach(() => {
            analyzer.addUsageData(sampleData);
        });

        it('should aggregate usage by date', () => {
            const analytics = analyzer.analyzeUsage();
            const timeSeriesData = analytics.usageOverTime;

            expect(timeSeriesData).toHaveLength(2);

            const jan1Data = timeSeriesData.find(
                d => d.timestamp.toISOString().startsWith('2024-01-01')
            );
            expect(jan1Data?.cost).toBeCloseTo(0.0006, 6);
            expect(jan1Data?.tokens).toBe(300);
            expect(jan1Data?.requests).toBe(1);

            const jan2Data = timeSeriesData.find(
                d => d.timestamp.toISOString().startsWith('2024-01-02')
            );
            expect(jan2Data?.cost).toBeCloseTo(0.026125, 6);
            expect(jan2Data?.tokens).toBe(900);
            expect(jan2Data?.requests).toBe(2);
        });
    });

    describe('getTopExpensivePrompts', () => {
        beforeEach(() => {
            analyzer.addUsageData(sampleData);
        });

        it('should identify most expensive prompts', () => {
            const analytics = analyzer.analyzeUsage();
            const expensivePrompts = analytics.topExpensivePrompts;

            expect(expensivePrompts).toHaveLength(3);
            expect(expensivePrompts[0].cost).toBe(0.0255);
            expect(expensivePrompts[0].model).toBe('gpt-4');
            expect(expensivePrompts[0].prompt).toBe('Test prompt 2');
        });
    });

    describe('getCostProjection', () => {
        beforeEach(() => {
            const now = Date.now();
            const dataOverWeek = Array.from({ length: 7 }, (_, i) => ({
                userId: 'user1',
                timestamp: new Date(now - i * 24 * 60 * 60 * 1000),
                provider: AIProvider.OpenAI,
                model: 'gpt-3.5-turbo',
                promptTokens: 100,
                completionTokens: 200,
                totalTokens: 300,
                estimatedCost: 0.001,
                prompt: `Day ${i + 1} prompt`,
                duration: 1000
            }));

            analyzer.addUsageData(dataOverWeek);
        });

        it('should project future costs based on historical data', () => {
            const projection30Days = analyzer.getCostProjection(30);
            expect(projection30Days).toBeCloseTo(0.03, 2);

            const projection365Days = analyzer.getCostProjection(365);
            expect(projection365Days).toBeCloseTo(0.365, 2);
        });
    });

    describe('getOptimizationOpportunities', () => {
        beforeEach(() => {
            // Add data that would trigger optimization suggestions
            const highCostData = Array.from({ length: 10 }, (_, i) => ({
                userId: 'user1',
                timestamp: new Date(),
                provider: AIProvider.OpenAI,
                model: 'gpt-4',
                promptTokens: 500,
                completionTokens: 500,
                totalTokens: 1000,
                estimatedCost: 0.06,
                prompt: 'Complex task',
                duration: 3000
            }));

            analyzer.addUsageData(highCostData);
        });

        it('should identify optimization opportunities', () => {
            const opportunities = analyzer.getOptimizationOpportunities();

            expect(opportunities.length).toBeGreaterThan(0);
            expect(opportunities[0].provider).toBe(AIProvider.OpenAI);
            expect(opportunities[0].model).toBe('gpt-4');
            expect(opportunities[0].savings).toBeGreaterThan(0);
        });
    });

    describe('getAnomalies', () => {
        beforeEach(() => {
            // Add normal data
            const normalData = Array.from({ length: 20 }, () => ({
                userId: 'user1',
                timestamp: new Date(),
                provider: AIProvider.OpenAI,
                model: 'gpt-3.5-turbo',
                promptTokens: 100,
                completionTokens: 200,
                totalTokens: 300,
                estimatedCost: 0.001,
                prompt: 'Normal request',
                duration: 1000
            }));

            // Add anomaly
            const anomaly: UsageMetadata = {
                userId: 'user1',
                timestamp: new Date(),
                provider: AIProvider.OpenAI,
                model: 'gpt-4',
                promptTokens: 5000,
                completionTokens: 5000,
                totalTokens: 10000,
                estimatedCost: 0.6,
                prompt: 'Anomaly request',
                duration: 10000
            };

            analyzer.addUsageData([...normalData, anomaly]);
        });

        it('should detect cost anomalies', () => {
            const anomalies = analyzer.getAnomalies(2);

            expect(anomalies.length).toBeGreaterThan(0);
            expect(anomalies[0].estimatedCost).toBeGreaterThan(0.5);
        });
    });
});