import { BaseProvider } from './base';
import { ProviderConfig, AIProvider } from '../types';
import {
  ProviderRequest,
  ProviderResponse,
  AnthropicUsage,
  AnyUsage,
  Message
} from '../types/providers';

interface AnthropicErrorResponse {
  error?: {
    message?: string;
    type?: string;
  };
}

export class AnthropicProvider extends BaseProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(config: ProviderConfig) {
    super({ ...config, provider: AIProvider.Anthropic });

    if (!config.apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.apiKey = config.apiKey;
    this.apiUrl = config.endpoint || 'https://api.anthropic.com/v1';
  }

  async countTokens(text: string, _model: string): Promise<number> {
    // Anthropic does not have a public count tokens endpoint.
    // Approximating based on Claude's known tokenization behavior.
    return Promise.resolve(Math.ceil(text.length / 3.5));
  }

  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const url = `${this.apiUrl}/messages`;
    const body = this.formatRequestBody(request);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const error: unknown = await response.json();
          if (typeof error === 'object' && error !== null && 'error' in error) {
            const errObj = error as AnthropicErrorResponse;
            errorMsg = errObj.error?.message || errorMsg;
          }
        } catch (_err) {
          /* ignore */
        }
        throw new Error(`Anthropic API error: ${errorMsg}`);
      }

      const data = await response.json();
      return this.formatResponse(data, request);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to make Anthropic request');
    }
  }

  private formatRequestBody(request: ProviderRequest): any {
    const { model, messages, prompt, maxTokens, temperature, topP } = request;

    // Anthropic API requires messages format. Convert prompt to messages.
    const requestMessages = messages || [{ role: 'user', content: prompt || '' }];

    return {
      model,
      messages: this.filterSystemMessages(requestMessages),
      system: this.getSystemPrompt(requestMessages),
      max_tokens: maxTokens,
      temperature,
      top_p: topP
    };
  }

  private getSystemPrompt(messages: Message[]): string | undefined {
    return messages.find(m => m.role === 'system')?.content;
  }

  private filterSystemMessages(messages: Message[]): Message[] {
    return messages.filter(m => m.role !== 'system');
  }

  private formatResponse(response: any, request: ProviderRequest): ProviderResponse {
    const content = response.content?.[0]?.text || '';
    return {
      id: response.id,
      model: request.model,
      choices: [
        {
          message: {
            role: 'assistant',
            content
          },
          index: 0,
          finishReason: response.stop_reason
        }
      ],
      usage: {
        input_tokens: response.usage?.input_tokens || 0,
        output_tokens: response.usage?.output_tokens || 0
      }
    };
  }

  parseUsage(usage: any): AnthropicUsage {
    return {
      input_tokens: usage.input_tokens || 0,
      output_tokens: usage.output_tokens || 0
    };
  }

  protected getPromptTokens(usage: AnyUsage): number {
    return (usage as AnthropicUsage).input_tokens;
  }

  protected getCompletionTokens(usage: AnyUsage): number {
    return (usage as AnthropicUsage).output_tokens;
  }
}
