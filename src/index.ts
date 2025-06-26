// Main exports
export { AIProvider } from './types';
export type {
  UsageMetadata,
  CostEstimate,
  OptimizationSuggestion,
  UsageAnalytics,
  ModelUsage,
  ProviderCost,
  TimeSeriesData,
  ExpensivePrompt,
  TrackerConfig,
  ProviderConfig,
  OptimizationConfig,
  BedrockConfig,
  TrackingConfig,
  AlertConfig,
  CustomPricing,
  CustomStorage,
  AIResponse
} from './types';

// Provider types
export type {
  ProviderModel,
  ModelPricing,
  PricingUnit,
  ModelCapabilities,
  ProviderRequest,
  ProviderResponse,
  Message,
  Choice
} from './types/providers';

// Model registry
export { MODELS, getModelById, getModelsByProvider, getAllModels } from './types/models';

// Providers
export {
  BaseProvider,
  OpenAIProvider,
  BedrockProvider,
  createProvider,
  isProviderSupported
} from './providers';

// Analyzers
export { CostAnalyzer } from './analyzers/cost-analyzer';
export { TokenCounter } from './analyzers/token-counter';
export { UsageTracker } from './analyzers/usage-tracker';

// Optimizers
export { PromptOptimizer } from './optimizers/prompt-optimizer';
export { SuggestionEngine } from './optimizers/suggestion-engine';
export type { SuggestionEngineConfig } from './optimizers/suggestion-engine';

// Utilities
export {
  calculateCost,
  estimateMonthlyCost,
  compareCosts,
  calculateROI,
  formatCurrency,
  calculateBatchingEconomics
} from './utils/pricing';

export {
  validateProvider,
  validateModel,
  validateProviderConfig,
  validateTrackerConfig,
  validatePrompt,
  validateUserId,
  validateDateRange,
  sanitizeInput
} from './utils/validators';

export { Logger, LogLevel, logger } from './utils/logger';
export type { LoggerConfig } from './utils/logger';

// Configuration
export {
  defaultConfig,
  defaultBedrockRegion,
  defaultOptimizationModel,
  supportedProviders,
  providerEndpoints,
  optimizationThresholds,
  alertThresholds
} from './config/default';

export {
  PRICING_DATA,
  REGIONAL_PRICING_ADJUSTMENTS,
  VOLUME_DISCOUNTS,
  FREE_TIERS,
  RATE_LIMITS,
  getPricingForModel,
  getRegionalPricing,
  calculateVolumeDiscount
} from './config/pricing-data';

// High-level API class
import {
  TrackerConfig,
  AIProvider,
  UsageMetadata,
  CostEstimate,
  OptimizationSuggestion
} from './types';
import { createProvider, BaseProvider } from './providers';
import { CostAnalyzer } from './analyzers/cost-analyzer';
import { UsageTracker } from './analyzers/usage-tracker';
import { SuggestionEngine } from './optimizers/suggestion-engine';
import { validateTrackerConfig, validatePrompt, validateUserId } from './utils/validators';
import { logger } from './utils/logger';
import { optimizationThresholds } from './config/default';
import { getModelById } from './types/models';
import { ProviderRequest } from './types/providers';

export class AICostTracker {
  private config: TrackerConfig;
  private providers: Map<AIProvider, BaseProvider> = new Map();
  private costAnalyzer: CostAnalyzer;
  private usageTracker: UsageTracker;
  private suggestionEngine: SuggestionEngine;

  constructor(config: TrackerConfig) {
    validateTrackerConfig(config);
    this.config = config;

    // Initialize providers
    config.providers.forEach(providerConfig => {
      const provider = createProvider(providerConfig);
      this.providers.set(providerConfig.provider, provider);
    });

    // Initialize analyzers and optimizers
    this.costAnalyzer = new CostAnalyzer();
    this.usageTracker = new UsageTracker(config.tracking);
    this.suggestionEngine = new SuggestionEngine({
      bedrockConfig: config.optimization.bedrockConfig,
      thresholds: optimizationThresholds
    });

    logger.info('AICostTracker initialized', {
      providers: config.providers.map(p => p.provider)
    });
  }

  /**
   * Estimate the cost of a prompt before making the API call
   */
  async estimateCost(
    prompt: string,
    model: string,
    provider: AIProvider,
    expectedCompletionTokens?: number
  ): Promise<CostEstimate> {
    validatePrompt(prompt);

    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const timer = logger.startTimer('estimateCost');
    try {
      const estimate = await providerInstance.estimateCost(prompt, model, expectedCompletionTokens);

      timer();
      return estimate;
    } catch (error) {
      logger.error('Failed to estimate cost', error as Error, { provider, model });
      throw error;
    }
  }

  /**
   * Make an API request and automatically track usage
   */
  async makeRequest(request: ProviderRequest, userId: string): Promise<any> {
    validateUserId(userId);

    const provider = this.getProviderForModel(request.model);
    const providerInstance = this.providers.get(provider);

    if (!providerInstance) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const startTime = Date.now();
    const timer = logger.startTimer('makeRequest');

    try {
      // Make the actual API request
      const response = await providerInstance.makeRequest(request);

      // Track usage if enabled
      if (this.config.tracking.enableAutoTracking) {
        const usageMetadata = await providerInstance.trackUsage(
          request,
          response,
          userId,
          startTime
        );

        await this.usageTracker.track(usageMetadata);
        this.costAnalyzer.addUsageData(usageMetadata);

        // Check for alerts
        await this.checkAlerts(usageMetadata);

        logger.logRequest(
          provider,
          request.model,
          usageMetadata.totalTokens,
          usageMetadata.estimatedCost,
          Date.now() - startTime
        );
      }

      timer();
      return response;
    } catch (error) {
      logger.error('API request failed', error as Error, {
        provider,
        model: request.model,
        userId
      });
      throw error;
    }
  }

  /**
   * Track usage manually (for existing API integrations)
   */
  async trackUsage(metadata: UsageMetadata): Promise<void> {
    await this.usageTracker.track(metadata);
    this.costAnalyzer.addUsageData(metadata);
    await this.checkAlerts(metadata);
  }

  /**
   * Get usage analytics for a specific time period
   */
  async getAnalytics(startDate?: Date, endDate?: Date, userId?: string): Promise<any> {
    const usageData = await this.usageTracker.getUsageHistory(userId, startDate, endDate);

    this.costAnalyzer.clearData();
    this.costAnalyzer.addUsageData(usageData);

    return this.costAnalyzer.analyzeUsage(startDate, endDate, userId);
  }

  /**
   * Get optimization suggestions based on usage patterns
   */
  async getOptimizationSuggestions(
    startDate?: Date,
    endDate?: Date,
    userId?: string
  ): Promise<OptimizationSuggestion[]> {
    const usageData = await this.usageTracker.getUsageHistory(userId, startDate, endDate);

    return this.suggestionEngine.generateSuggestions(usageData);
  }

  /**
   * Optimize a prompt using AI
   */
  async optimizePrompt(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion[]> {
    validatePrompt(prompt);

    const optimizer = this.suggestionEngine['promptOptimizer'];
    return optimizer.optimizePrompt(prompt, targetModel, targetProvider);
  }

  /**
   * Generate a comprehensive optimization report
   */
  async generateReport(startDate?: Date, endDate?: Date, userId?: string): Promise<string> {
    const usageData = await this.usageTracker.getUsageHistory(userId, startDate, endDate);

    return this.suggestionEngine.generateReport(usageData);
  }

  /**
   * Export usage data in various formats
   */
  async exportData(
    format: 'json' | 'csv' = 'json',
    startDate?: Date,
    endDate?: Date,
    userId?: string
  ): Promise<string> {
    await this.usageTracker.getUsageHistory(userId, startDate, endDate);
    return this.usageTracker.exportData(format);
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<any> {
    validateUserId(userId);
    return this.usageTracker.getUserStats(userId);
  }

  /**
   * Get model statistics
   */
  async getModelStats(model: string): Promise<any> {
    return this.usageTracker.getModelStats(model);
  }

  /**
   * Clear all tracked data
   */
  clearData(): void {
    this.costAnalyzer.clearData();
    this.usageTracker.clearCache();
    logger.info('All tracked data cleared');
  }

  private getProviderForModel(model: string): AIProvider {
    const modelInfo = getModelById(model);
    if (!modelInfo) {
      throw new Error(`Unknown model: ${model}`);
    }
    return modelInfo.provider;
  }

  private async checkAlerts(metadata: UsageMetadata): Promise<void> {
    if (!this.config.alerts) return;

    const { costThreshold, tokenThreshold } = this.config.alerts;

    // Check daily thresholds
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsage = await this.usageTracker.getUsageHistory(metadata.userId, today);

    const dailyCost = todayUsage.reduce((sum, item) => sum + item.estimatedCost, 0);
    const dailyTokens = todayUsage.reduce((sum, item) => sum + item.totalTokens, 0);

    if (costThreshold && dailyCost > costThreshold) {
      logger.logCostAlert(metadata.userId, dailyCost, costThreshold, 'daily');
    }

    if (tokenThreshold && dailyTokens > tokenThreshold) {
      logger.warn(`Token threshold exceeded`, {
        userId: metadata.userId,
        dailyTokens,
        threshold: tokenThreshold
      });
    }
  }
}

// Export the main class as default
export default AICostTracker;
