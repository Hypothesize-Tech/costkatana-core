import { BaseProvider } from './base';
import { ProviderConfig, AIProvider } from '../types';
import { ProviderRequest, ProviderResponse, BedrockUsage, AnyUsage } from '../types/providers';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput
} from '@aws-sdk/client-bedrock-runtime';
import { fromIni, fromEnv } from '@aws-sdk/credential-providers';

export class BedrockProvider extends BaseProvider {
  private client: BedrockRuntimeClient;
  private region: string;

  constructor(config: ProviderConfig) {
    super({ ...config, provider: AIProvider.AWSBedrock });

    this.region = config.region || 'us-east-1';

    // Initialize AWS Bedrock client
    const credentials = this.getCredentials(config);
    this.client = new BedrockRuntimeClient({
      region: this.region,
      credentials
    });
  }

  private getCredentials(config: ProviderConfig) {
    const bedrockConfig = config.optimization?.bedrockConfig;

    if (bedrockConfig && bedrockConfig.credentials) {
      // Return static credentials object
      return {
        accessKeyId: bedrockConfig.credentials.accessKeyId,
        secretAccessKey: bedrockConfig.credentials.secretAccessKey,
        sessionToken: bedrockConfig.credentials.sessionToken
      };
    }

    // Use AWS SDK credential providers (do not invoke immediately)
    try {
      return fromEnv();
    } catch {
      return fromIni({ profile: 'default' });
    }
  }

  async countTokens(text: string, model: string): Promise<number> {
    // Bedrock doesn't provide a direct token counting API
    // Use approximation based on model type
    if (model.includes('claude')) {
      // Claude models: ~1 token per 3.5 characters
      return Promise.resolve(Math.ceil(text.length / 3.5));
    } else if (model.includes('titan')) {
      // Titan models: ~1 token per 4 characters
      return Promise.resolve(Math.ceil(text.length / 4));
    } else {
      // Default approximation
      return Promise.resolve(Math.ceil(text.length / 4));
    }
  }

  async makeRequest(request: ProviderRequest): Promise<ProviderResponse> {
    const body = this.formatRequestBody(request);

    const input: InvokeModelCommandInput = {
      modelId: request.model,
      contentType: 'application/json',
      accept: 'application/json',
      body: new TextEncoder().encode(JSON.stringify(body))
    };

    try {
      const command = new InvokeModelCommand(input);
      const response = await this.client.send(command);

      if (!response.body) {
        throw new Error('Empty response from Bedrock');
      }

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return this.formatResponse(responseBody, request);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Bedrock API error: ${error.message}`);
      }
      throw new Error('Failed to make Bedrock request');
    }
  }

  private formatRequestBody(request: ProviderRequest): any {
    const { model, prompt, messages, maxTokens, temperature, topP, stopSequences } = request;

    // Handle different model formats
    if (model.includes('claude')) {
      // Anthropic Claude format
      const formattedPrompt = messages
        ? this.formatClaudeMessages(messages)
        : `\n\nHuman: ${prompt}\n\nAssistant:`;

      return {
        prompt: formattedPrompt,
        max_tokens_to_sample: maxTokens || 1000,
        temperature: temperature || 0.7,
        top_p: topP || 1,
        stop_sequences: stopSequences || ['\n\nHuman:'],
        anthropic_version: 'bedrock-2023-05-31'
      };
    } else if (model.includes('titan')) {
      // Amazon Titan format
      return {
        inputText: prompt || this.messagesToPrompt(messages || []),
        textGenerationConfig: {
          maxTokenCount: maxTokens || 1000,
          temperature: temperature || 0.7,
          topP: topP || 1,
          stopSequences: stopSequences
        }
      };
    } else {
      // Default format
      return {
        prompt: prompt || this.messagesToPrompt(messages || []),
        max_tokens: maxTokens || 1000,
        temperature: temperature || 0.7,
        top_p: topP || 1,
        stop: stopSequences
      };
    }
  }

  private formatClaudeMessages(messages: Array<{ role: string; content: string }>): string {
    let prompt = '';
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `Human: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n\n`;
      }
    }
    prompt += 'Assistant:';
    return prompt;
  }

  private formatResponse(
    response: Record<string, unknown>,
    request: ProviderRequest
  ): ProviderResponse {
    const { model } = request;

    if (model.includes('claude')) {
      const claudeResponse = response as ClaudeResponse;
      return {
        id: claudeResponse.id ?? `bedrock-${Date.now()}`,
        model,
        choices: [
          {
            text: claudeResponse.completion ?? '',
            index: 0,
            finishReason: claudeResponse.stop_reason ?? 'stop'
          }
        ],
        usage: {
          inputTokens: claudeResponse.usage?.input_tokens ?? 0,
          outputTokens: claudeResponse.usage?.output_tokens ?? 0,
          totalTokens:
            (claudeResponse.usage?.input_tokens ?? 0) + (claudeResponse.usage?.output_tokens ?? 0)
        },
        metadata: claudeResponse.metrics
      };
    } else if (model.includes('titan')) {
      const result =
        Array.isArray(response.results) && response.results.length > 0
          ? (response.results[0] as TitanResult)
          : (response as TitanResult);
      return {
        id: `bedrock-${Date.now()}`,
        model,
        choices: [
          {
            text: result.outputText ?? result.text ?? '',
            index: 0,
            finishReason: result.completionReason ?? 'stop'
          }
        ],
        usage: {
          inputTokens: result.tokenCount ?? 0,
          outputTokens: result.tokenCount ?? 0,
          totalTokens: (result.tokenCount ?? 0) * 2
        }
      };
    } else {
      // Default response format
      const defaultResponse = response as DefaultResponse;
      return {
        id: defaultResponse.id ?? `bedrock-${Date.now()}`,
        model,
        choices: [
          {
            text:
              defaultResponse.text ?? defaultResponse.completion ?? defaultResponse.output ?? '',
            index: 0,
            finishReason: 'stop'
          }
        ],
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0
        }
      };
    }
  }

  parseUsage(usage: any): BedrockUsage {
    const usageAsAny = usage;
    return {
      inputTokens: usageAsAny.inputTokens ?? usageAsAny.input_tokens ?? 0,
      outputTokens: usageAsAny.outputTokens ?? usageAsAny.output_tokens ?? 0,
      totalTokens: usageAsAny.totalTokens ?? usageAsAny.total_tokens ?? 0,
      invocationLatency: usageAsAny.invocationLatency,
      firstByteLatency: usageAsAny.firstByteLatency
    };
  }

  protected getPromptTokens(usage: AnyUsage): number {
    return (usage as BedrockUsage).inputTokens;
  }

  protected getCompletionTokens(usage: AnyUsage): number {
    return (usage as BedrockUsage).outputTokens;
  }

  // Bedrock specific methods
  listFoundationModels(): Promise<string[]> {
    // This would require BedrockClient, not BedrockRuntimeClient
    // For now, return a static list
    return Promise.resolve([
      'anthropic.claude-sonnet-4-20250514-v1:0',
      'anthropic.claude-3-opus-20240229-v1:0',
      'anthropic.claude-3-haiku-20240307-v1:0',
      'amazon.titan-text-express-v1',
      'amazon.titan-text-lite-v1'
    ]);
  }

  async invokeModelWithOptimization(
    request: ProviderRequest,
    optimizationModel: string = 'anthropic.claude-sonnet-4-20250514-v1:0'
  ): Promise<{ response: ProviderResponse; optimization?: any }> {
    // First, get optimization suggestions
    const optimizationPrompt = `Analyze this prompt and suggest optimizations to reduce tokens while maintaining effectiveness:

Original prompt: "${request.prompt || this.messagesToPrompt(request.messages || [])}"

Provide:
1. Optimized version of the prompt
2. Estimated token reduction percentage
3. Key improvements made

Format as JSON.`;

    const optimizationRequest: ProviderRequest = {
      model: optimizationModel,
      prompt: optimizationPrompt,
      maxTokens: 500,
      temperature: 0.3
    };

    try {
      const optimizationResponse = await this.makeRequest(optimizationRequest);
      const optimizationText = optimizationResponse.choices[0]?.text || '';

      // Try to parse optimization suggestions
      let optimization: any;
      try {
        optimization = JSON.parse(optimizationText);
      } catch {
        optimization = { suggestions: optimizationText };
      }

      // Make the actual request
      const response = await this.makeRequest(request);

      return { response, optimization };
    } catch (error) {
      // If optimization fails, just make the regular request
      console.warn('Optimization failed, using regular request:', error);
      const response = await this.makeRequest(request);
      return { response };
    }
  }
}

interface ClaudeResponse {
  id?: string;
  completion?: string;
  stop_reason?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
  metrics?: any;
}

interface TitanResult {
  outputText?: string;
  text?: string;
  completionReason?: string;
  tokenCount?: number;
}

interface DefaultResponse {
  id?: string;
  text?: string;
  completion?: string;
  output?: string;
}
