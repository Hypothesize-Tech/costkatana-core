export { BaseProvider } from './base';
export { OpenAIProvider } from './openai';
export { BedrockProvider } from './bedrock';
export { GoogleProvider } from './google';
export { CohereProvider } from './cohere';
export { AnthropicProvider } from './anthropic';
export { AzureProvider } from './azure';
export { DeepSeekProvider } from './deepseek';

import { AIProvider, ProviderConfig } from '../types';
import { BaseProvider } from './base';
import { OpenAIProvider } from './openai';
import { BedrockProvider } from './bedrock';
import { GoogleProvider } from './google';
import { CohereProvider } from './cohere';
import { AnthropicProvider } from './anthropic';
import { AzureProvider } from './azure';
import { DeepSeekProvider } from './deepseek';

export function createProvider(config: ProviderConfig): BaseProvider {
  switch (config.provider) {
    case AIProvider.OpenAI:
      return new OpenAIProvider(config);
    case AIProvider.AWSBedrock:
      return new BedrockProvider(config);
    case AIProvider.Anthropic:
      return new AnthropicProvider(config);
    case AIProvider.Google:
      return new GoogleProvider(config);
    case AIProvider.Cohere:
      return new CohereProvider(config);
    case AIProvider.Azure:
      return new AzureProvider(config);
    case AIProvider.DeepSeek:
      return new DeepSeekProvider(config);
    default:
      throw new Error(`Unknown or unsupported provider: ${config.provider}`);
  }
}

export function isProviderSupported(provider: AIProvider): boolean {
  return [
    AIProvider.OpenAI,
    AIProvider.AWSBedrock,
    AIProvider.Anthropic,
    AIProvider.Google,
    AIProvider.Cohere,
    AIProvider.Azure,
    AIProvider.DeepSeek
  ].includes(provider);
}
