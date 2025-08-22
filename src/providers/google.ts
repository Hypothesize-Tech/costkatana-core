import { BaseProvider } from './base';
import { ProviderConfig, AIProvider } from '../types';
import {
  ProviderRequest,
  ProviderResponse,
  GoogleUsage,
  AnyUsage,
  Message
} from '../types/providers';

// Types for Google API responses
interface GoogleError {
  error?: {
    message?: string;
  };
}

interface GoogleResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
    finishReason: string;
    safetyRatings: any[];
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

interface GoogleRequestBody {
  contents: Array<{
    role: string;
    parts: Array<{ text: string | undefined }>;
  }>;
  generationConfig: {
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
  };
}

export class GoogleProvider extends BaseProvider {
  private apiKey: string;
  private apiUrl: string;

  constructor(config: ProviderConfig) {
    super({ ...config, provider: AIProvider.Google });

    if (!config.apiKey) {
      throw new Error('Google API key is required');
    }

    this.apiKey = config.apiKey;
    this.apiUrl = config.endpoint || 'https://generativelanguage.googleapis.com/v1beta';
  }

  async countTokens(text: string, model: string): Promise<number> {
    const url = `${this.apiUrl}/models/${model}:countTokens?key=${this.apiKey}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generateContentRequest: {
            contents: [{ parts: [{ text }] }]
          }
        })
      });

      if (!response.ok) {
        // Fallback to approximation
        return Math.ceil(text.length / 4);
      }

      const data: any = await response.json();
      return data.totalTokens || Math.ceil(text.length / 4);
    } catch (error) {
      // Fallback to approximation
      console.warn('Token counting failed for Google model:', error);
      return Math.ceil(text.length / 4);
    }
  }

  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const url = `${this.apiUrl}/models/${request.model}:generateContent?key=${this.apiKey}`;

    const body = this.formatRequestBody(request);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const error: unknown = await response.json();
          if (typeof error === 'object' && error !== null && 'error' in error) {
            const errObj = error as GoogleError;
            errorMsg = errObj.error?.message || errorMsg;
          }
        } catch (_err) {
          /* ignore parsing error */
          console.debug('Error parsing response:', _err);
        }
        throw new Error(`Google API error: ${errorMsg}`);
      }

      const data = (await response.json()) as GoogleResponse;
      return this.formatResponse(data, request);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to make Google request');
    }
  }

  private formatRequestBody(request: ProviderRequest): GoogleRequestBody {
    const { messages, prompt, maxTokens, temperature, topP } = request;

    const contents = messages
      ? this.messagesToGoogleContents(messages)
      : [{ role: 'user', parts: [{ text: prompt }] }];

    return {
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
        topP
      }
    };
  }

  private messagesToGoogleContents(
    messages: Message[]
  ): Array<{ role: string; parts: Array<{ text: string }> }> {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    messages.forEach(msg => {
      // Gemini uses 'user' and 'model' for roles.
      const role = msg.role === 'assistant' ? 'model' : 'user';
      // 'system' prompts can be handled differently if needed, here we just treat them as user prompts for simplicity.
      contents.push({
        role: role,
        parts: [{ text: msg.content }]
      });
    });
    return contents;
  }

  private formatResponse(response: GoogleResponse, request: ProviderRequest): ProviderResponse {
    const choice = response.candidates?.[0];
    const usage = response.usageMetadata ?? {} as GoogleUsage;

    return {
      id: `google-${Date.now()}`,
      model: request.model,
      choices: choice
        ? [
            {
              message: {
                role: 'assistant',
                content: choice.content?.parts?.[0]?.text || ''
              },
              index: 0,
              finishReason: choice.finishReason
            }
          ]
        : [],
      usage: {
        promptTokenCount: usage.promptTokenCount ?? 0,
        candidatesTokenCount: usage.candidatesTokenCount ?? 0,
        totalTokenCount: usage.totalTokenCount ?? 0
      },
      metadata: {
        safetyRatings: choice?.safetyRatings
      }
    };
  }

  parseUsage(usage: any): GoogleUsage {
    return {
      promptTokenCount: usage.promptTokenCount || 0,
      candidatesTokenCount: usage.candidatesTokenCount || 0,
      totalTokenCount: usage.totalTokenCount || 0
    };
  }

  protected getPromptTokens(usage: AnyUsage): number {
    return (usage as GoogleUsage).promptTokenCount;
  }

  protected getCompletionTokens(usage: AnyUsage): number {
    return (usage as GoogleUsage).candidatesTokenCount;
  }
}
