/**
 * Provider Wrappers for Automatic LLM Call Tracing
 * Instruments AI provider clients to capture traces, tokens, and costs
 */

import { TraceContext } from './types';
import { OpenAIProvider } from '../providers/openai';
import { AnthropicProvider } from '../providers/anthropic';
import { ProviderRequest, ProviderResponse } from '../types/providers';
import { AIProvider } from '../types';
import { getModelPricing } from '../config/pricing-data';

interface TracedProviderOptions {
  /**
   * Trace context from the current request
   */
  traceContext?: TraceContext;

  /**
   * Function to start a span
   */
  startSpan: (input: {
    sessionId: string;
    parentId?: string;
    name: string;
    type: string;
    metadata?: Record<string, any>;
  }) => Promise<{ traceId: string }>;

  /**
   * Function to end a span
   */
  endSpan: (
    traceId: string,
    input: {
      status: 'ok' | 'error';
      error?: { message: string; stack?: string };
      model?: string;
      tokens?: { input: number; output: number };
      costUSD?: number;
      metadata?: Record<string, any>;
    }
  ) => Promise<void>;

  /**
   * Function to record messages (optional)
   */
  recordMessage?: (input: {
    sessionId: string;
    traceId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
  }) => Promise<void>;

  /**
   * Function to calculate cost (optional - will use default if not provided)
   */
  calculateCost?: (input: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    provider: string;
  }) => number;
}

/**
 * Wraps OpenAI provider for automatic tracing
 *
 * @example
 * ```typescript
 * import { TrackedOpenAI } from 'ai-cost-tracker/trace';
 *
 * const ai = new TrackedOpenAI({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   traceContext: req.traceContext,
 *   startSpan: traceService.startSpan,
 *   endSpan: traceService.endSpan
 * });
 *
 * const response = await ai.makeRequest({
 *   model: 'gpt-4',
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   maxTokens: 150
 * });
 * ```
 */
export class TrackedOpenAI {
  private provider: OpenAIProvider;
  private options: TracedProviderOptions;

  constructor(config: any & TracedProviderOptions) {
    const { traceContext, startSpan, endSpan, recordMessage, calculateCost, ...providerConfig } =
      config;

    this.options = { traceContext, startSpan, endSpan, recordMessage, calculateCost };

    // Create the underlying OpenAI provider
    this.provider = new OpenAIProvider({
      provider: AIProvider.OpenAI,
      apiKey: providerConfig.apiKey || process.env.OPENAI_API_KEY,
      endpoint: providerConfig.endpoint
    });
  }

  /**
   * Make a tracked request to OpenAI
   */
  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const startTime = Date.now();
    let traceId: string | undefined;

    try {
      // Start LLM span if we have context
      if (this.options.traceContext) {
        const span = await this.options.startSpan({
          sessionId: this.options.traceContext.sessionId,
          parentId: this.options.traceContext.traceId,
          name: `OpenAI ${request.model}`,
          type: 'llm',
          metadata: {
            model: request.model,
            temperature: request.temperature,
            maxTokens: request.maxTokens
          }
        });
        traceId = span.traceId;

        // Record user message
        if (this.options.recordMessage && request.messages?.length) {
          const lastMessage = request.messages[request.messages.length - 1];
          await this.options.recordMessage({
            sessionId: this.options.traceContext.sessionId,
            traceId,
            role: lastMessage.role as 'user' | 'assistant' | 'system',
            content: lastMessage.content
          });
        } else if (this.options.recordMessage && request.prompt) {
          await this.options.recordMessage({
            sessionId: this.options.traceContext.sessionId,
            traceId,
            role: 'user',
            content: request.prompt
          });
        }
      }

      // Make the actual API call using the provider
      const response = await this.provider.makeRequest(request);

      // End span with success
      if (traceId && this.options.traceContext) {
        const endTime = Date.now();
        const latency = endTime - startTime;

        // Calculate cost
        let costUSD = 0;
        if (response.usage) {
          const promptTokens = (response.usage as any).prompt_tokens || 0;
          const completionTokens = (response.usage as any).completion_tokens || 0;

          if (this.options.calculateCost) {
            costUSD = this.options.calculateCost({
              model: request.model,
              inputTokens: promptTokens,
              outputTokens: completionTokens,
              provider: 'openai'
            });
          } else {
            // Use default cost calculation
            try {
              const pricing = getModelPricing('OpenAI', request.model);
              if (pricing) {
                costUSD =
                  (promptTokens / 1_000_000) * pricing.inputPrice +
                  (completionTokens / 1_000_000) * pricing.outputPrice;
              }
            } catch (err) {
              // Fallback to basic estimation
              costUSD = promptTokens * 0.000001 + completionTokens * 0.000002;
            }
          }
        }

        await this.options.endSpan(traceId, {
          status: 'ok',
          model: request.model,
          tokens: response.usage
            ? {
                input: (response.usage as any).prompt_tokens || 0,
                output: (response.usage as any).completion_tokens || 0
              }
            : undefined,
          costUSD,
          metadata: {
            latency,
            finishReason: response.choices?.[0]?.finishReason
          }
        });

        // Record assistant message
        if (this.options.recordMessage && response.choices?.[0]) {
          const choice = response.choices[0];
          const content = choice.message?.content || choice.text || '';
          if (content) {
            await this.options.recordMessage({
              sessionId: this.options.traceContext.sessionId,
              traceId,
              role: 'assistant',
              content
            });
          }
        }
      }

      return response;
    } catch (error: any) {
      // End span with error
      if (traceId) {
        await this.options.endSpan(traceId, {
          status: 'error',
          error: {
            message: error.message,
            stack: error.stack
          }
        });
      }
      throw error;
    }
  }

  /**
   * Convenience method for chat completions
   */
  async chatCompletion(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
  }): Promise<ProviderResponse> {
    return this.makeRequest({
      model: params.model,
      messages: params.messages.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system' | 'function',
        content: m.content
      })),
      maxTokens: params.maxTokens,
      temperature: params.temperature,
      topP: params.topP
    });
  }

  /**
   * Get the underlying provider for direct access
   */
  getProvider(): OpenAIProvider {
    return this.provider;
  }
}

/**
 * Wraps Anthropic provider for automatic tracing
 *
 * @example
 * ```typescript
 * import { TrackedAnthropic } from 'ai-cost-tracker/trace';
 *
 * const ai = new TrackedAnthropic({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 *   traceContext: req.traceContext,
 *   startSpan: traceService.startSpan,
 *   endSpan: traceService.endSpan
 * });
 *
 * const response = await ai.makeRequest({
 *   model: 'claude-3-opus-20240229',
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   maxTokens: 150
 * });
 * ```
 */
export class TrackedAnthropic {
  private provider: AnthropicProvider;
  private options: TracedProviderOptions;

  constructor(config: any & TracedProviderOptions) {
    const { traceContext, startSpan, endSpan, recordMessage, calculateCost, ...providerConfig } =
      config;

    this.options = { traceContext, startSpan, endSpan, recordMessage, calculateCost };

    // Create the underlying Anthropic provider
    this.provider = new AnthropicProvider({
      provider: AIProvider.Anthropic,
      apiKey: providerConfig.apiKey || process.env.ANTHROPIC_API_KEY,
      endpoint: providerConfig.endpoint
    });
  }

  /**
   * Make a tracked request to Anthropic
   */
  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const startTime = Date.now();
    let traceId: string | undefined;

    try {
      // Start LLM span if we have context
      if (this.options.traceContext) {
        const span = await this.options.startSpan({
          sessionId: this.options.traceContext.sessionId,
          parentId: this.options.traceContext.traceId,
          name: `Claude ${request.model}`,
          type: 'llm',
          metadata: {
            model: request.model,
            maxTokens: request.maxTokens,
            temperature: request.temperature
          }
        });
        traceId = span.traceId;

        // Record user message
        if (this.options.recordMessage) {
          if (request.messages?.length) {
            const lastMessage = request.messages[request.messages.length - 1];
            await this.options.recordMessage({
              sessionId: this.options.traceContext.sessionId,
              traceId,
              role: lastMessage.role as 'user' | 'assistant' | 'system',
              content: lastMessage.content
            });
          } else if (request.prompt) {
            await this.options.recordMessage({
              sessionId: this.options.traceContext.sessionId,
              traceId,
              role: 'user',
              content: request.prompt
            });
          }
        }
      }

      // Make the actual API call using the provider
      const response = await this.provider.makeRequest(request);

      // End span with success
      if (traceId && this.options.traceContext) {
        const latency = Date.now() - startTime;

        // Calculate cost
        let costUSD = 0;
        if (response.usage) {
          const inputTokens = (response.usage as any).input_tokens || 0;
          const outputTokens = (response.usage as any).output_tokens || 0;

          if (this.options.calculateCost) {
            costUSD = this.options.calculateCost({
              model: request.model,
              inputTokens,
              outputTokens,
              provider: 'anthropic'
            });
          } else {
            // Use default cost calculation
            try {
              const pricing = getModelPricing('Anthropic', request.model);
              if (pricing) {
                costUSD =
                  (inputTokens / 1_000_000) * pricing.inputPrice +
                  (outputTokens / 1_000_000) * pricing.outputPrice;
              }
            } catch (err) {
              // Fallback to basic estimation
              costUSD = inputTokens * 0.000001 + outputTokens * 0.000002;
            }
          }
        }

        await this.options.endSpan(traceId, {
          status: 'ok',
          model: request.model,
          tokens: response.usage
            ? {
                input: (response.usage as any).input_tokens || 0,
                output: (response.usage as any).output_tokens || 0
              }
            : undefined,
          costUSD,
          metadata: {
            latency,
            finishReason: response.choices?.[0]?.finishReason
          }
        });

        // Record assistant message
        if (this.options.recordMessage && response.choices?.[0]) {
          const choice = response.choices[0];
          const content = choice.message?.content || choice.text || '';
          if (content) {
            await this.options.recordMessage({
              sessionId: this.options.traceContext.sessionId,
              traceId,
              role: 'assistant',
              content
            });
          }
        }
      }

      return response;
    } catch (error: any) {
      // End span with error
      if (traceId) {
        await this.options.endSpan(traceId, {
          status: 'error',
          error: {
            message: error.message,
            stack: error.stack
          }
        });
      }
      throw error;
    }
  }

  /**
   * Convenience method for messages API
   */
  async messages(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    system?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<ProviderResponse> {
    const formattedMessages = params.system
      ? [{ role: 'system', content: params.system }, ...params.messages].map(m => ({
          role: m.role as 'user' | 'assistant' | 'system' | 'function',
          content: m.content
        }))
      : params.messages.map(m => ({
          role: m.role as 'user' | 'assistant' | 'system' | 'function',
          content: m.content
        }));

    return this.makeRequest({
      model: params.model,
      messages: formattedMessages,
      maxTokens: params.maxTokens,
      temperature: params.temperature
    });
  }

  /**
   * Get the underlying provider for direct access
   */
  getProvider(): AnthropicProvider {
    return this.provider;
  }
}

/**
 * Generic wrapper for any provider
 *
 * @example
 * ```typescript
 * const trackedProvider = createTrackedProvider(
 *   originalProvider,
 *   'makeRequest',
 *   req.traceContext,
 *   traceService
 * );
 * ```
 */
export function createTrackedProvider<T extends object>(
  provider: T,
  methodName: keyof T,
  traceContext: TraceContext | undefined,
  traceService: {
    startSpan: TracedProviderOptions['startSpan'];
    endSpan: TracedProviderOptions['endSpan'];
    recordMessage?: TracedProviderOptions['recordMessage'];
  }
): T {
  const originalMethod = provider[methodName] as any;

  if (typeof originalMethod !== 'function') {
    throw new Error(`Method ${String(methodName)} is not a function`);
  }

  // Create a proxy that intercepts the method call
  return new Proxy(provider, {
    get(target, prop, receiver) {
      if (prop === methodName) {
        return async function (...args: any[]) {
          if (!traceContext) {
            // No trace context, call original method
            return originalMethod.apply(target, args);
          }

          const startTime = Date.now();
          const request = args[0];
          const modelName = request?.model || 'unknown';

          const { traceId } = await traceService.startSpan({
            sessionId: traceContext.sessionId,
            parentId: traceContext.traceId,
            name: `LLM ${modelName}`,
            type: 'llm',
            metadata: {
              method: String(methodName),
              model: modelName,
              temperature: request?.temperature,
              maxTokens: request?.maxTokens || request?.max_tokens
            }
          });

          try {
            const result = await originalMethod.apply(target, args);

            await traceService.endSpan(traceId, {
              status: 'ok',
              model: modelName,
              metadata: {
                latency: Date.now() - startTime,
                resultPreview: JSON.stringify(result).slice(0, 200)
              }
            });

            return result;
          } catch (error: any) {
            await traceService.endSpan(traceId, {
              status: 'error',
              error: {
                message: error.message,
                stack: error.stack
              }
            });
            throw error;
          }
        };
      }

      return Reflect.get(target, prop, receiver);
    }
  });
}
