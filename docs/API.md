# AI Cost Tracker API Reference

## Table of Contents

- [AICostTracker Class](#aicosttracker-class)
- [Types and Interfaces](#types-and-interfaces)
- [Providers](#providers)
- [Analyzers](#analyzers)
- [Optimizers](#optimizers)
- [Utilities](#utilities)

## AICostTracker Class

The main class for tracking and analyzing AI API costs.

### Constructor

```typescript
new AICostTracker(config: TrackerConfig)
```

#### Parameters

- `config`: Configuration object for the tracker

### Methods

#### estimateCost

```typescript
async estimateCost(
  prompt: string,
  model: string,
  provider: AIProvider,
  expectedCompletionTokens?: number
): Promise<CostEstimate>
```

Estimates the cost of a prompt before making the API call.

#### makeRequest

```typescript
async makeRequest(
  request: ProviderRequest,
  userId: string
): Promise<ProviderResponse>
```

Makes an API request and automatically tracks usage.

#### trackUsage

```typescript
async trackUsage(metadata: UsageMetadata): Promise<void>
```

Manually tracks usage for existing API integrations.

#### getAnalytics

```typescript
async getAnalytics(
  startDate?: Date,
  endDate?: Date,
  userId?: string
): Promise<UsageAnalytics>
```

Retrieves usage analytics for a specific time period.

#### getOptimizationSuggestions

```typescript
async getOptimizationSuggestions(
  startDate?: Date,
  endDate?: Date,
  userId?: string
): Promise<OptimizationSuggestion[]>
```

Gets AI-powered optimization suggestions based on usage patterns.

#### optimizePrompt

```typescript
async optimizePrompt(
  prompt: string,
  targetModel: string,
  targetProvider: AIProvider
): Promise<OptimizationSuggestion[]>
```

Optimizes a prompt using AI to reduce token usage.

#### generateReport

```typescript
async generateReport(
  startDate?: Date,
  endDate?: Date,
  userId?: string
): Promise<string>
```

Generates a comprehensive optimization report in Markdown format.

#### exportData

```typescript
async exportData(
  format: 'json' | 'csv' = 'json',
  startDate?: Date,
  endDate?: Date,
  userId?: string
): Promise<string>
```

Exports usage data in the specified format.

#### getUserStats

```typescript
async getUserStats(userId: string): Promise<UserStats>
```

Gets statistics for a specific user.

#### getModelStats

```typescript
async getModelStats(model: string): Promise<ModelStats>
```

Gets statistics for a specific model.

#### clearData

```typescript
async clearData(): Promise<void>
```

Clears all tracked data.

## Types and Interfaces

### TrackerConfig

```typescript
export interface TrackerConfig {
  providers: ProviderConfig[];
  optimization: OptimizationConfig;
  tracking: TrackingConfig;
  alerts?: AlertConfig;
}
```

### ProviderConfig

```typescript
interface ProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  region?: string;
  endpoint?: string;
  customPricing?: CustomPricing;
}
```

### UsageMetadata

```typescript
interface UsageMetadata {
  userId: string;
  timestamp: Date;
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  prompt: string;
  completion?: string;
  duration?: number;
  tags?: string[];
  sessionId?: string;
}
```

### CostEstimate

```typescript
interface CostEstimate {
  promptCost: number;
  completionCost: number;
  totalCost: number;
  currency: string;
  breakdown: {
    promptTokens: number;
    completionTokens: number;
    pricePerPromptToken: number;
    pricePerCompletionToken: number;
  };
}
```

### OptimizationSuggestion

```typescript
interface OptimizationSuggestion {
  id: string;
  type: 'prompt' | 'model' | 'batching' | 'caching';
  originalPrompt?: string;
  optimizedPrompt?: string;
  estimatedSavings: number;
  confidence: number;
  explanation: string;
  implementation?: string;
}
```

### UsageAnalytics

```typescript
interface UsageAnalytics {
  totalCost: number;
  totalTokens: number;
  averageTokensPerRequest: number;
  mostUsedModels: ModelUsage[];
  costByProvider: ProviderCost[];
  usageOverTime: TimeSeriesData[];
  topExpensivePrompts: ExpensivePrompt[];
}
```

### TrackingConfig

```typescript
export interface TrackingConfig {
  enableAutoTracking: boolean;
  retentionDays?: number;
}
```

### AlertConfig

```typescript
export interface AlertConfig {
  // ... existing code ...
}
```

## Providers

### BaseProvider

Abstract base class for all providers.

```typescript
abstract class BaseProvider {
  abstract countTokens(text: string, model: string): Promise<number>;
  abstract makeRequest(request: ProviderRequest): Promise<ProviderResponse>;
  abstract parseUsage(usage: any): AnyUsage;

  async estimateCost(
    prompt: string,
    model: string,
    expectedCompletion?: number
  ): Promise<CostEstimate>;

  async trackUsage(
    request: ProviderRequest,
    response: ProviderResponse,
    userId: string,
    startTime: number
  ): Promise<UsageMetadata>;
}
```

### OpenAIProvider

Provider implementation for OpenAI.

```typescript
class OpenAIProvider extends BaseProvider {
  constructor(config: ProviderConfig);
  async createEmbedding(input: string | string[], model?: string);
  async listModels();
}
```

### BedrockProvider

Provider implementation for AWS Bedrock.

```typescript
class BedrockProvider extends BaseProvider {
  constructor(config: ProviderConfig);
  async listFoundationModels();
  async invokeModelWithOptimization(request: ProviderRequest, optimizationModel?: string);
}
```

## Analyzers

### CostAnalyzer

Analyzes usage data to provide insights.

```typescript
class CostAnalyzer {
  constructor(initialData?: UsageMetadata[]);

  addUsageData(data: UsageMetadata | UsageMetadata[]): void;
  clearData(): void;
  getData(): UsageMetadata[];

  analyzeUsage(startDate?: Date, endDate?: Date, userId?: string): UsageAnalytics;

  getCostProjection(days: number): number;
  getOptimizationOpportunities(): OptimizationOpportunity[];
  getAnomalies(threshold?: number): UsageMetadata[];
}
```

### TokenCounter

Utilities for counting tokens across different providers.

```typescript
class TokenCounter {
  static async countTokens(text: string, provider: AIProvider, model: string): Promise<number>;

  static async countConversationTokens(
    messages: Message[],
    provider: AIProvider,
    model: string
  ): Promise<number>;

  static async splitTextByTokens(
    text: string,
    maxTokens: number,
    provider: AIProvider,
    model: string,
    overlap?: number
  ): Promise<string[]>;

  static async estimateOptimizationSavings(
    originalPrompt: string,
    optimizedPrompt: string,
    provider: AIProvider,
    model: string
  ): Promise<OptimizationStats>;
}
```

### UsageTracker

Tracks and stores usage data.

```typescript
class UsageTracker {
  constructor(config: TrackingConfig);

  async track(metadata: UsageMetadata): Promise<void>;

  async getUsageHistory(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    limit?: number
  ): Promise<UsageMetadata[]>;

  async getUserStats(userId: string): Promise<UserStats>;
  async getModelStats(model: string): Promise<ModelStats>;
  async exportData(format: 'json' | 'csv'): Promise<string>;
  async cleanOldData(retentionDays: number): Promise<void>;
  clearCache(): void;
}
```

## Optimizers

### PromptOptimizer

Optimizes prompts to reduce token usage.

```typescript
class PromptOptimizer {
  constructor(bedrockConfig?: BedrockConfig);

  async optimizePrompt(
    prompt: string,
    targetModel: string,
    targetProvider: AIProvider,
    context?: OptimizationContext
  ): Promise<OptimizationSuggestion[]>;

  async suggestBatching(
    prompts: string[],
    targetModel: string,
    targetProvider: AIProvider
  ): Promise<OptimizationSuggestion>;

  async suggestCaching(
    prompt: string,
    frequency: number,
    avgResponseTokens: number
  ): Promise<OptimizationSuggestion>;

  async suggestModelDowngrade(
    prompt: string,
    currentModel: string,
    taskComplexity: 'simple' | 'moderate' | 'complex'
  ): Promise<OptimizationSuggestion | null>;
}
```

### SuggestionEngine

Generates optimization suggestions based on usage patterns.

```typescript
class SuggestionEngine {
  constructor(config?: SuggestionEngineConfig);

  async generateSuggestions(usageData: UsageMetadata[]): Promise<OptimizationSuggestion[]>;

  async generateReport(usageData: UsageMetadata[]): Promise<string>;
}
```

## Utilities

### Pricing Utilities

```typescript
function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: ProviderModel,
  customPricing?: CustomPricing
): CostEstimate;

function estimateMonthlyCost(
  dailyRequests: number,
  avgPromptTokens: number,
  avgCompletionTokens: number,
  model: ProviderModel,
  customPricing?: CustomPricing
): MonthlyCostEstimate;

function compareCosts(
  promptTokens: number,
  completionTokens: number,
  models: ProviderModel[],
  customPricing?: CustomPricing
): CostComparison[];

function calculateROI(
  implementationCost: number,
  currentMonthlyCost: number,
  optimizedMonthlyCost: number,
  months?: number
): ROICalculation;
```

### Validation Utilities

```typescript
function validateProvider(provider: string): AIProvider;
function validateModel(modelId: string): void;
function validateProviderConfig(config: ProviderConfig): void;
function validateTrackerConfig(config: TrackerConfig): void;
function validatePrompt(prompt: string): void;
function validateUserId(userId: string): void;
function validateDateRange(startDate?: Date, endDate?: Date): void;
function sanitizeInput(input: string): string;
```

### Logger

```typescript
class Logger {
  constructor(config?: LoggerConfig);

  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: Error, ...args: any[]): void;

  startTimer(label: string): () => number;
  logStructured(level: LogLevel, event: string, data: any): void;
  logRequest(provider: string, model: string, tokens: number, cost: number, duration: number): void;
  logError(error: Error, context?: any): void;
  logCostAlert(userId: string, cost: number, threshold: number, period: string): void;
  logOptimization(type: string, originalCost: number, optimizedCost: number, savings: number): void;
}
```

## Constants and Configuration

### Model Registry

```typescript
const MODELS: Record<string, ProviderModel>;
function getModelById(modelId: string): ProviderModel | undefined;
function getModelsByProvider(provider: AIProvider): ProviderModel[];
function getAllModels(): ProviderModel[];
```

### Pricing Data

```typescript
const PRICING_DATA: Record<AIProvider, ModelPricing>;
const REGIONAL_PRICING_ADJUSTMENTS: Record<string, number>;
const VOLUME_DISCOUNTS: VolumeDiscountConfig;
const FREE_TIERS: Record<AIProvider, FreeTierLimits>;
const RATE_LIMITS: Record<AIProvider, RateLimits>;
```

### Default Configuration

```typescript
const defaultConfig: Partial<TrackerConfig>;
const defaultBedrockRegion: string;
const defaultOptimizationModel: string;
const supportedProviders: AIProvider[];
const optimizationThresholds: OptimizationThresholds;
const alertThresholds: AlertThresholds;
```
