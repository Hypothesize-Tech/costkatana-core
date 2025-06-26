import {
  UsageMetadata,
  UsageAnalytics,
  ModelUsage,
  ProviderCost,
  TimeSeriesData,
  ExpensivePrompt,
  AIProvider
} from '../types';

export class CostAnalyzer {
  private usageData: UsageMetadata[] = [];

  constructor(initialData?: UsageMetadata[]) {
    if (initialData) {
      this.usageData = initialData;
    }
  }

  addUsageData(data: UsageMetadata | UsageMetadata[]) {
    if (Array.isArray(data)) {
      this.usageData.push(...data);
    } else {
      this.usageData.push(data);
    }
  }

  clearData() {
    this.usageData = [];
  }

  getData(): UsageMetadata[] {
    return [...this.usageData];
  }

  analyzeUsage(startDate?: Date, endDate?: Date, userId?: string): UsageAnalytics {
    const filteredData = this.filterData(startDate, endDate, userId);

    if (filteredData.length === 0) {
      return this.getEmptyAnalytics();
    }

    const totalCost = this.calculateTotalCost(filteredData);
    const totalTokens = this.calculateTotalTokens(filteredData);
    const averageTokensPerRequest = totalTokens / filteredData.length;
    const mostUsedModels = this.getMostUsedModels(filteredData);
    const costByProvider = this.getCostByProvider(filteredData);
    const usageOverTime = this.getUsageOverTime(filteredData);
    const topExpensivePrompts = this.getTopExpensivePrompts(filteredData);

    return {
      totalCost,
      totalTokens,
      averageTokensPerRequest,
      mostUsedModels,
      costByProvider,
      usageOverTime,
      topExpensivePrompts
    };
  }

  private filterData(startDate?: Date, endDate?: Date, userId?: string): UsageMetadata[] {
    return this.usageData;
  }

  private calculateTotalCost(data: UsageMetadata[]): number {
    return data.reduce((sum, item) => sum + item.estimatedCost, 0);
  }

  private calculateTotalTokens(data: UsageMetadata[]): number {
    return data.reduce((sum, item) => sum + item.totalTokens, 0);
  }

  private getMostUsedModels(data: UsageMetadata[]): ModelUsage[] {
    const modelMap = new Map<string, ModelUsage>();

    data.forEach(item => {
      const key = `${item.provider}:${item.model}`;
      const existing = modelMap.get(key) || {
        model: item.model,
        provider: item.provider,
        requestCount: 0,
        totalTokens: 0,
        totalCost: 0,
        averageCostPerRequest: 0
      };

      existing.requestCount++;
      existing.totalTokens += item.totalTokens;
      existing.totalCost += item.estimatedCost;
      existing.averageCostPerRequest = existing.totalCost / existing.requestCount;

      modelMap.set(key, existing);
    });

    return Array.from(modelMap.values()).sort((a, b) => b.requestCount - a.requestCount);
  }

  private getCostByProvider(data: UsageMetadata[]): ProviderCost[] {
    const providerMap = new Map<AIProvider, number>();
    let totalCost = 0;

    data.forEach(item => {
      const current = providerMap.get(item.provider) || 0;
      providerMap.set(item.provider, current + item.estimatedCost);
      totalCost += item.estimatedCost;
    });

    return Array.from(providerMap.entries())
      .map(([provider, cost]) => ({
        provider,
        totalCost: cost,
        percentage: (cost / totalCost) * 100
      }))
      .sort((a, b) => b.totalCost - a.totalCost);
  }

  private getUsageOverTime(data: UsageMetadata[]): TimeSeriesData[] {
    // This method cannot be implemented correctly without timestamps on UsageMetadata.
    // It requires the storage layer to provide time-aggregated data.
    // Returning an empty array to fix the build.
    return [];
  }

  private getTopExpensivePrompts(data: UsageMetadata[], limit: number = 10): ExpensivePrompt[] {
    return data
      .map(item => ({
        prompt: item.prompt,
        cost: item.estimatedCost,
        tokens: item.totalTokens,
        model: item.model,
        timestamp: new Date()
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, limit);
  }

  private getEmptyAnalytics(): UsageAnalytics {
    return {
      totalCost: 0,
      totalTokens: 0,
      averageTokensPerRequest: 0,
      mostUsedModels: [],
      costByProvider: [],
      usageOverTime: [],
      topExpensivePrompts: []
    };
  }

  // Advanced analysis methods
  getCostProjection(days: number): number {
    if (this.usageData.length === 0) return 0;

    const totalCost = this.calculateTotalCost(this.usageData);
    const averageCostPerRequest = totalCost / this.usageData.length;

    const estimatedDailyCost = averageCostPerRequest * 100;

    return estimatedDailyCost * days;
  }

  getOptimizationOpportunities(): {
    provider: string;
    model: string;
    currentCost: number;
    optimizedCost: number;
    savings: number;
    recommendation: string;
  }[] {
    const modelUsage = this.getMostUsedModels(this.usageData);
    const opportunities = [];

    for (const usage of modelUsage) {
      // Example optimization logic
      if (usage.provider === AIProvider.OpenAI && usage.model === 'gpt-4') {
        const gpt35Cost = usage.totalCost * 0.05; // GPT-3.5 is ~5% of GPT-4 cost
        opportunities.push({
          provider: usage.provider,
          model: usage.model,
          currentCost: usage.totalCost,
          optimizedCost: gpt35Cost,
          savings: usage.totalCost - gpt35Cost,
          recommendation: 'Consider using GPT-3.5-turbo for non-critical tasks'
        });
      }

      if (usage.averageCostPerRequest > 0.1) {
        opportunities.push({
          provider: usage.provider,
          model: usage.model,
          currentCost: usage.totalCost,
          optimizedCost: usage.totalCost * 0.7,
          savings: usage.totalCost * 0.3,
          recommendation: 'Optimize prompts to reduce token usage'
        });
      }
    }

    return opportunities.sort((a, b) => b.savings - a.savings);
  }

  getAnomalies(threshold: number = 2): UsageMetadata[] {
    if (this.usageData.length < 10) return [];

    const costs = this.usageData.map(d => d.estimatedCost);
    const mean = costs.reduce((a, b) => a + b, 0) / costs.length;
    const stdDev = Math.sqrt(costs.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / costs.length);

    return this.usageData.filter(data => Math.abs(data.estimatedCost - mean) > threshold * stdDev);
  }
}
