import { BaseProvider } from './base';
import { ProviderConfig, AIProvider } from '../types';
import { ProviderRequest, ProviderResponse, OpenAIUsage, AnyUsage } from '../types/providers';
import { encode } from 'gpt-3-encoder';

// Types for OpenAI API responses
interface OpenAIChoice {
  text?: string;
  message?: any;
  index: number;
  finish_reason?: string;
}

interface OpenAIAPIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
  system_fingerprint?: string;
}

interface OpenAIErrorResponse {
  error?: {
    message?: string;
  };
}

interface OpenAIEmbeddingResponse {
  data: any;
}

export class OpenAIProvider extends BaseProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(config: ProviderConfig) {
    super({ ...config, provider: AIProvider.OpenAI });

    if (!config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.apiKey = config.apiKey;
    this.apiUrl = config.endpoint || 'https://api.openai.com/v1';
  }

  async countTokens(text: string, _model: string): Promise<number> {
    try {
      // Use gpt-3-encoder for token counting
      // Note: This is an approximation and may not be 100% accurate for newer models
      const encoded = encode(text);
      return Promise.resolve(encoded.length);
    } catch (error) {
      // Fallback to rough estimation
      return Promise.resolve(Math.ceil(text.length / 4));
    }
  }

  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const endpoint = request.messages ? '/chat/completions' : '/completions';
    const url = `${this.apiUrl}${endpoint}`;

    const body: Record<string, any> = {
      model: request.model,
      max_tokens: request.maxTokens,
      temperature: request.temperature,
      top_p: request.topP,
      stop: request.stopSequences,
      stream: false,
      user: request.userId
    };

    if (request.messages) {
      body.messages = request.messages;
    } else {
      body.prompt = request.prompt;
    }

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
          if (typeof error === 'object' && error !== null && 'error' in error) {
            const errObj = error as OpenAIErrorResponse;
            errorMsg = errObj.error?.message || errorMsg;
          }
        } catch (_err) {
          /* ignore */
        }
        throw new Error(`OpenAI API error: ${errorMsg}`);
      }

      const data: unknown = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from OpenAI API');
      }
      const apiData = data as OpenAIAPIResponse;

      return {
        id: apiData.id,
        model: apiData.model,
        choices: Array.isArray(apiData.choices)
          ? apiData.choices.map((choice: OpenAIChoice) => ({
              text: choice.text,
              message:
                typeof choice.message === 'object' &&
                choice.message !== null &&
                'role' in choice.message &&
                'content' in choice.message
                  ? (choice.message as import('../types/providers').Message)
                  : undefined,
              index: choice.index,
              finishReason: choice.finish_reason
            }))
          : [],
        usage: apiData.usage,
        created: apiData.created,
        metadata: {
          object: apiData.object,
          system_fingerprint: apiData.system_fingerprint
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to make OpenAI request');
    }
  }

  parseUsage(usage: unknown): OpenAIUsage {
    if (typeof usage === 'object' && usage !== null) {
      const u = usage as Partial<OpenAIUsage>;
      return {
        prompt_tokens: u.prompt_tokens ?? 0,
        completion_tokens: u.completion_tokens ?? 0,
        total_tokens: u.total_tokens ?? 0
      };
    }
    return { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  }

  protected getPromptTokens(usage: AnyUsage): number {
    return (usage as OpenAIUsage).prompt_tokens;
  }

  protected getCompletionTokens(usage: AnyUsage): number {
    return (usage as OpenAIUsage).completion_tokens;
  }

  // OpenAI specific methods
  async createEmbedding(input: string | string[], model: string = 'text-embedding-ada-002') {
    const url = `${this.apiUrl}/embeddings`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          input,
          model
        })
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const error: unknown = await response.json();
          if (typeof error === 'object' && error !== null && 'error' in error) {
            const errObj = error as OpenAIErrorResponse;
            errorMsg = errObj.error?.message || errorMsg;
          }
        } catch (_err) {
          /* ignore */
        }
        throw new Error(`OpenAI API error: ${errorMsg}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create embedding');
    }
  }

  async listModels() {
    const url = `${this.apiUrl}/models`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const error: unknown = await response.json();
          if (typeof error === 'object' && error !== null && 'error' in error) {
            const errObj = error as OpenAIErrorResponse;
            errorMsg = errObj.error?.message || errorMsg;
          }
        } catch (_err) {
          /* ignore */
        }
        throw new Error(`OpenAI API error: ${errorMsg}`);
      }

      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('data' in data)) {
        throw new Error('Invalid response from OpenAI API');
      }
      return (data as OpenAIEmbeddingResponse).data as unknown[];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to list models');
    }
  }
}
