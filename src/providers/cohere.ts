import { BaseProvider } from './base';
import { ProviderConfig, AIProvider } from '../types';
import {
  ProviderRequest,
  ProviderResponse,
  CohereUsage,
  AnyUsage,
  Message
} from '../types/providers';

// Using gpt-3-encoder as a proxy, cohere has its own tokenizer
import { encode } from 'gpt-3-encoder';

interface CohereErrorResponse {
  message?: string;
}

interface CohereResponse {
  generation_id: string;
  text: string;
  finish_reason: string;
  meta?: {
    billed_units: {
      input_tokens: number;
      output_tokens: number;
    };
  };
}

interface CohereRequestBody {
  model: string;
  message: string;
  chat_history: Array<{ role: string; message: string }>;
  max_tokens?: number;
  temperature?: number;
  p?: number;
}

export class CohereProvider extends BaseProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(config: ProviderConfig) {
    super({ ...config, provider: AIProvider.Cohere });

    if (!config.apiKey) {
      throw new Error('Cohere API key is required');
    }

    this.apiKey = config.apiKey;
    this.apiUrl = config.endpoint || 'https://api.cohere.ai/v1';
  }

  async countTokens(text: string, _model: string): Promise<number> {
    // Cohere has a /tokenize endpoint, but for simplicity we'll approximate.
    // Using gpt-3-encoder as a rough proxy.
    try {
      const encoded = encode(text);
      return Promise.resolve(encoded.length);
    } catch (error) {
      console.warn('Token counting failed for Cohere model:', error);
      return Promise.resolve(Math.ceil(text.length / 4));
    }
  }

  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const url = `${this.apiUrl}/chat`;
    const body = this.formatRequestBody(request);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const error: unknown = await response.json();
          if (typeof error === 'object' && error !== null && 'message' in error) {
            const errObj = error as CohereErrorResponse;
            errorMsg = errObj.message || errorMsg;
          }
        } catch (_err) {
          /* ignore parsing error */
          console.debug('Error parsing response:', _err);
        }
        throw new Error(`Cohere API error: ${errorMsg}`);
      }

      const data = (await response.json()) as CohereResponse;
      return this.formatResponse(data, request);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to make Cohere request');
    }
  }

  private formatRequestBody(request: ProviderRequest): CohereRequestBody {
    const { model, messages, prompt, maxTokens, temperature, topP } = request;

    const lastMessage = messages ? messages[messages.length - 1] : { content: prompt || '' };
    const chatHistory = messages
      ? this.messagesToCohereHistory(messages.slice(0, messages.length - 1))
      : [];

    return {
      model,
      message: lastMessage.content,
      chat_history: chatHistory,
      max_tokens: maxTokens,
      temperature,
      p: topP
    };
  }

  private messagesToCohereHistory(messages: Message[]): Array<{ role: string; message: string }> {
    return messages.map(msg => ({
      role: msg.role === 'user' ? 'USER' : 'CHATBOT',
      message: msg.content
    }));
  }

  private formatResponse(response: CohereResponse, request: ProviderRequest): ProviderResponse {
    return {
      id: response.generation_id,
      model: request.model,
      choices: [
        {
          message: {
            role: 'assistant',
            content: response.text
          },
          index: 0,
          finishReason: response.finish_reason
        }
      ],
      usage: response.meta?.billed_units ?? { input_tokens: 0, output_tokens: 0 }
    };
  }

  parseUsage(usage: any): CohereUsage {
    return {
      tokens: {
        input_tokens: usage.input_tokens || 0,
        output_tokens: usage.output_tokens || 0
      },
      meta: {
        billed_units: {
          input_tokens: usage.input_tokens || 0,
          output_tokens: usage.output_tokens || 0
        }
      }
    };
  }

  protected getPromptTokens(usage: AnyUsage): number {
    return (usage as CohereUsage).meta?.billed_units.input_tokens || 0;
  }

  protected getCompletionTokens(usage: AnyUsage): number {
    return (usage as CohereUsage).meta?.billed_units.output_tokens || 0;
  }
}
