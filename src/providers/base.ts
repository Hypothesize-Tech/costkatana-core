import { AIProvider, ProviderConfig, UsageMetadata, CostEstimate } from '../types';
import {
  ProviderRequest,
  ProviderResponse,
  ProviderModel,
  AnyUsage,
  Message
} from '../types/providers';
import { getModelById, MODELS } from '../types/models';
import { calculateCost } from '../utils/pricing';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseProvider {
  protected config: ProviderConfig;
  protected provider: AIProvider;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.provider = config.provider;
  }

  abstract countTokens(text: string, model: string): Promise<number>;
  abstract makeRequest(request: ProviderRequest): Promise<ProviderResponse>;
  abstract parseUsage(usage: any): AnyUsage;

  async estimateCost(
    prompt: string,
    model: string,
    expectedCompletion?: number
  ): Promise<CostEstimate> {
    const modelInfo = getModelById(model);
    if (!modelInfo) {
      throw new Error(`Unknown model: ${model}`);
    }

    const promptTokens = await this.countTokens(prompt, model);
    const completionTokens = expectedCompletion || Math.floor(promptTokens * 0.5);

    return calculateCost(promptTokens, completionTokens, modelInfo, this.config.customPricing);
  }

  trackUsage(
    request: ProviderRequest,
    response: ProviderResponse,
    startTime: number
  ): UsageMetadata {
    const endTime = Date.now();
    const usage = this.parseUsage(response.usage);
    const model = getModelById(request.model);

    if (!model) {
      throw new Error(`Unknown model: ${request.model}`);
    }

    const promptTokens = this.getPromptTokens(usage);
    const completionTokens = this.getCompletionTokens(usage);
    const totalTokens = promptTokens + completionTokens;

    const cost = calculateCost(promptTokens, completionTokens, model, this.config.customPricing);

    const prompt =
      request.prompt || (request.messages ? this.messagesToPrompt(request.messages) : '');

    const completion = response.choices[0]?.text || response.choices[0]?.message?.content || '';

    return {
      provider: this.provider,
      model: request.model,
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCost: cost.totalCost,
      prompt,
      completion,
      responseTime: endTime - startTime,
      tags: request.metadata?.tags,
      sessionId: request.metadata?.sessionId || uuidv4()
    };
  }

  protected abstract getPromptTokens(usage: AnyUsage): number;
  protected abstract getCompletionTokens(usage: AnyUsage): number;

  protected messagesToPrompt(messages: Message[]): string {
    return messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  getConfig(): ProviderConfig {
    return this.config;
  }

  validateModel(modelId: string): boolean {
    const model = getModelById(modelId);
    return model !== undefined && model.provider === this.provider;
  }

  getSupportedModels(): ProviderModel[] {
    return Object.values(MODELS).filter(model => model && model.provider === this.provider);
  }
}
