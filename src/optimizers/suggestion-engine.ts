import { OptimizationSuggestion, UsageMetadata, AIProvider, BedrockConfig } from '../types';
import { PromptOptimizer } from './prompt-optimizer';
import { CostAnalyzer } from '../analyzers/cost-analyzer';
import { v4 as uuidv4 } from 'uuid';

export interface SuggestionEngineConfig {
  bedrockConfig?: BedrockConfig;
  thresholds?: {
    highCostPerRequest?: number;
    highTokenUsage?: number;
    frequencyThreshold?: number;
  };
}

export class SuggestionEngine {
  private promptOptimizer: PromptOptimizer;
  private costAnalyzer: CostAnalyzer;
  private config: SuggestionEngineConfig;

  constructor(config: SuggestionEngineConfig = {}) {
    this.config = {
      thresholds: {
        highCostPerRequest: 0.1,
        highTokenUsage: 2000,
        frequencyThreshold: 5,
        ...config.thresholds
      },
      ...config
    };

    this.promptOptimizer = new PromptOptimizer(config.bedrockConfig);
    this.costAnalyzer = new CostAnalyzer();
  }

  async generateSuggestions(usageData: UsageMetadata[]): Promise<OptimizationSuggestion[]> {
    this.costAnalyzer.clearData();
    this.costAnalyzer.addUsageData(usageData);

    const suggestions: OptimizationSuggestion[] = [];

    // 1. Analyze high-cost requests
    suggestions.push(...(await this.analyzeHighCostRequests(usageData)));

    // 2. Analyze repeated patterns
    suggestions.push(...(await this.analyzeRepeatedPatterns(usageData)));

    // 3. Analyze model usage patterns
    suggestions.push(...this.analyzeModelUsage(usageData));

    // 4. Analyze token usage efficiency
    suggestions.push(...this.analyzeTokenEfficiency(usageData));

    // 5. Get optimization opportunities from cost analyzer
    suggestions.push(...this.getOptimizationOpportunities());

    // Remove duplicates and sort by estimated savings
    const uniqueSuggestions = this.deduplicateSuggestions(suggestions);
    return uniqueSuggestions.sort((a, b) => b.estimatedSavings - a.estimatedSavings);
  }

  private async analyzeHighCostRequests(
    usageData: UsageMetadata[]
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    const threshold = this.config.thresholds?.highCostPerRequest || 0.1;

    const highCostRequests = usageData.filter(item => item.estimatedCost > threshold);

    for (const request of highCostRequests.slice(0, 5)) {
      // Optimize the prompt
      const promptSuggestions = await this.promptOptimizer.optimizePrompt(
        request.prompt,
        request.model,
        request.provider
      );

      suggestions.push(...promptSuggestions);

      // Suggest model downgrade if applicable
      const modelSuggestion = await this.promptOptimizer.suggestModelDowngrade(
        request.model,
        this.classifyTaskComplexity(request.prompt)
      );

      if (modelSuggestion) {
        suggestions.push(modelSuggestion);
      }
    }

    return suggestions;
  }

  private async analyzeRepeatedPatterns(
    usageData: UsageMetadata[]
  ): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    const promptFrequency = new Map<string, number>();

    // Count prompt frequency
    usageData.forEach(item => {
      const normalizedPrompt = this.normalizePrompt(item.prompt);
      const count = promptFrequency.get(normalizedPrompt) || 0;
      promptFrequency.set(normalizedPrompt, count + 1);
    });

    // Find frequently repeated prompts
    const threshold = this.config.thresholds?.frequencyThreshold || 5;
    for (const [prompt, frequency] of promptFrequency.entries()) {
      if (frequency >= threshold) {
        const avgTokens =
          usageData
            .filter(item => this.normalizePrompt(item.prompt) === prompt)
            .reduce((sum, item) => sum + item.completionTokens, 0) / frequency;

        const cachingSuggestion = await this.promptOptimizer.suggestCaching(frequency, avgTokens);

        suggestions.push(cachingSuggestion);
      }
    }

    // Check for batching opportunities
    const userPromptGroups = this.groupPromptsByUser(usageData);
    for (const [, prompts] of userPromptGroups.entries()) {
      if (prompts.length >= 3) {
        const recentPrompts = this.getRecentPrompts(prompts, 5);
        if (recentPrompts.length >= 2) {
          const batchingSuggestion = await this.promptOptimizer.suggestBatching(
            recentPrompts.map(p => p.prompt),
            recentPrompts[0].model,
            recentPrompts[0].provider
          );

          if (batchingSuggestion.estimatedSavings > 10) {
            suggestions.push(batchingSuggestion);
          }
        }
      }
    }

    return suggestions;
  }

  private analyzeModelUsage(_usageData: UsageMetadata[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const analytics = this.costAnalyzer.analyzeUsage();

    analytics.mostUsedModels.forEach(modelUsage => {
      // Suggest cheaper alternatives for high-volume models
      if (modelUsage.requestCount > 100) {
        const costPerToken = modelUsage.totalCost / modelUsage.totalTokens;

        if (costPerToken > 0.00001) {
          suggestions.push({
            id: uuidv4(),
            type: 'model',
            estimatedSavings: 30,
            confidence: 0.7,
            explanation: `Model ${modelUsage.model} is used frequently (${modelUsage.requestCount} times). Consider using a more cost-effective model for routine tasks.`,
            implementation: this.getModelAlternatives(modelUsage.model, modelUsage.provider)
          });
        }
      }
    });

    return suggestions;
  }

  private analyzeTokenEfficiency(_usageData: UsageMetadata[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const threshold = this.config.thresholds?.highTokenUsage || 2000;

    // Find requests with high token usage
    const highTokenRequests = _usageData.filter(item => item.totalTokens > threshold);

    if (highTokenRequests.length > 0) {
      const avgTokens =
        highTokenRequests.reduce((sum, item) => sum + item.totalTokens, 0) /
        highTokenRequests.length;

      suggestions.push({
        id: uuidv4(),
        type: 'prompt',
        estimatedSavings: 25,
        confidence: 0.8,
        explanation: `${highTokenRequests.length} requests exceed ${threshold} tokens (avg: ${Math.round(avgTokens)}). Consider breaking down complex prompts or using more concise language.`,
        implementation:
          'Use structured prompts with clear sections:\n1. Context (brief)\n2. Task (specific)\n3. Output format (examples)'
      });
    }

    // Analyze prompt-to-completion ratio
    const ratios = _usageData.map(item => ({
      ratio: item.completionTokens / item.promptTokens,
      cost: item.estimatedCost
    }));

    const highRatioRequests = ratios.filter(r => r.ratio > 3);
    if (highRatioRequests.length > _usageData.length * 0.1) {
      suggestions.push({
        id: uuidv4(),
        type: 'prompt',
        estimatedSavings: 20,
        confidence: 0.7,
        explanation:
          'Many requests generate long responses relative to prompts. Consider adding length constraints or requesting more concise outputs.',
        implementation:
          'Add to prompts: "Please provide a concise response" or "Limit response to X words/sentences"'
      });
    }

    return suggestions;
  }

  private getOptimizationOpportunities(): OptimizationSuggestion[] {
    const opportunities = this.costAnalyzer.getOptimizationOpportunities();

    return opportunities.map(opp => ({
      id: uuidv4(),
      type: 'model' as const,
      estimatedSavings: (opp.savings / opp.currentCost) * 100,
      confidence: 0.8,
      explanation: opp.recommendation,
      implementation: `Switch from ${opp.model} to a more cost-effective alternative`
    }));
  }

  private normalizePrompt(prompt: string): string {
    return prompt.toLowerCase().replace(/\s+/g, ' ').trim().substring(0, 100);
  }

  private groupPromptsByUser(_usageData: UsageMetadata[]): Map<string, UsageMetadata[]> {
    const groups = new Map<string, UsageMetadata[]>();

    _usageData.forEach(item => {
      const userPrompts = groups.get(item.userId) || [];
      userPrompts.push(item);
      groups.set(item.userId, userPrompts);
    });

    return groups;
  }

  private getRecentPrompts(prompts: UsageMetadata[], minutes: number): UsageMetadata[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return prompts
      .filter(p => p.timestamp > cutoff)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private classifyTaskComplexity(prompt: string): 'simple' | 'moderate' | 'complex' {
    const complexityIndicators = {
      simple: ['list', 'define', 'what is', 'translate', 'summarize briefly'],
      complex: ['analyze', 'create', 'design', 'implement', 'solve', 'optimize']
    };

    const lowerPrompt = prompt.toLowerCase();

    if (complexityIndicators.simple.some(indicator => lowerPrompt.includes(indicator))) {
      return 'simple';
    }

    if (complexityIndicators.complex.some(indicator => lowerPrompt.includes(indicator))) {
      return 'complex';
    }

    return 'moderate';
  }

  private getModelAlternatives(model: string, _provider: AIProvider): string {
    const alternatives: Record<string, string> = {
      'gpt-4':
        'Consider gpt-3.5-turbo for simpler tasks, or gpt-4-turbo for better cost/performance',
      'gpt-4-turbo-preview': 'Use gpt-3.5-turbo for routine tasks',
      'claude-3-opus': 'Try claude-3-sonnet for most tasks, or claude-3-haiku for simple queries',
      'claude-3-sonnet': 'Use claude-3-haiku for straightforward tasks'
    };

    return alternatives[model] || 'Research model-specific alternatives for your use case';
  }

  private deduplicateSuggestions(suggestions: OptimizationSuggestion[]): OptimizationSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter(suggestion => {
      const key = `${suggestion.type}-${suggestion.explanation}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async generateReport(usageData: UsageMetadata[]): Promise<string> {
    const suggestions = await this.generateSuggestions(usageData);
    const analytics = this.costAnalyzer.analyzeUsage();

    const report = `# AI Cost Optimization Report
  
  ## Summary
  - Total Cost: $${analytics.totalCost.toFixed(2)}
  - Total Requests: ${usageData.length}
  - Average Cost per Request: $${(analytics.totalCost / usageData.length).toFixed(3)}
  - Total Tokens Used: ${analytics.totalTokens.toLocaleString()}
  
  ## Top Optimization Opportunities
  
  ${suggestions
    .slice(0, 5)
    .map(
      (s, i) => `
  ### ${i + 1}. ${s.type.charAt(0).toUpperCase() + s.type.slice(1)} Optimization
  - **Potential Savings**: ${s.estimatedSavings.toFixed(1)}%
  - **Confidence**: ${(s.confidence * 100).toFixed(0)}%
  - **Recommendation**: ${s.explanation}
  - **How to Implement**: ${s.implementation}
  `
    )
    .join('\n')}
  
  ## Model Usage Breakdown
  ${analytics.mostUsedModels
    .slice(0, 5)
    .map(m => `- **${m.model}**: ${m.requestCount} requests, $${m.totalCost.toFixed(2)} total cost`)
    .join('\n')}
  
  ## Cost by Provider
  ${analytics.costByProvider
    .map(p => `- **${p.provider}**: $${p.totalCost.toFixed(2)} (${p.percentage.toFixed(1)}%)`)
    .join('\n')}
  
  ## Next Steps
  1. Implement high-confidence optimizations first
  2. Monitor usage patterns for the next week
  3. Re-evaluate model choices based on actual task complexity
  4. Consider implementing caching for frequently repeated queries
  5. Set up alerts for unusually high-cost requests
  
  Generated on: ${new Date().toISOString()}`;

    return report;
  }
}
