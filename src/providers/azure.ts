import { BaseProvider } from './base';
import { ProviderConfig, AIProvider } from '../types';
import { ProviderRequest, ProviderResponse, OpenAIUsage, AnyUsage } from '../types/providers';
import { encode } from 'gpt-3-encoder';

// Types for OpenAI API responses
interface OpenAIErrorResponse {
  error?: {
    message?: string;
  };
}

export class AzureProvider extends BaseProvider {
  private apiKey: string;
  private apiUrl: string;
  private apiVersion: string;

  constructor(config: ProviderConfig) {
    super({ ...config, provider: AIProvider.Azure });

    if (!config.apiKey || !config.resourceName || !config.deploymentId || !config.apiVersion) {
      throw new Error(
        'Azure provider requires apiKey, resourceName, deploymentId, and apiVersion in config'
      );
    }

    this.apiKey = config.apiKey;
    this.apiVersion = config.apiVersion;
    this.apiUrl = `https://${config.resourceName}.openai.azure.com/openai/deployments/${config.deploymentId}`;
  }

  async countTokens(text: string, _model: string): Promise<number> {
    try {
      const encoded = encode(text);
      return Promise.resolve(encoded.length);
    } catch (error) {
      return Promise.resolve(Math.ceil(text.length / 4));
    }
  }

  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const endpoint = request.messages ? '/chat/completions' : '/completions';
    const url = `${this.apiUrl}${endpoint}?api-version=${this.apiVersion}`;

    const body: Record<string, any> = {
      model: request.model, // Azure ignores this, but it's good practice
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
          'api-key': this.apiKey
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
        throw new Error(`Azure API error: ${errorMsg}`);
      }

      const data = await response.json();
      const apiData = data as any; // Cast to any to handle slightly different response shapes

      return {
        id: apiData.id,
        model: apiData.model,
        choices: Array.isArray(apiData.choices)
          ? apiData.choices.map((choice: any) => ({
              text: choice.text,
              message: choice.message,
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
      throw new Error('Failed to make Azure request');
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
}
