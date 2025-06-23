export { BaseProvider } from './base';
export { OpenAIProvider } from './openai';
export { BedrockProvider } from './bedrock';

import { AIProvider, ProviderConfig } from '../types';
import { BaseProvider } from './base';
import { OpenAIProvider } from './openai';
import { BedrockProvider } from './bedrock';

export function createProvider(config: ProviderConfig): BaseProvider {
  switch (config.provider) {
    case AIProvider.OpenAI:
      return new OpenAIProvider(config);
    case AIProvider.AWSBedrock:
      return new BedrockProvider(config);
    case AIProvider.Anthropic:
      // For now, route Anthropic through Bedrock
      // In a real implementation, you'd have a separate AnthropicProvider
      return new BedrockProvider({
        ...config,
        provider: AIProvider.AWSBedrock
      });
    case AIProvider.Google:
      // Placeholder - would need GoogleProvider implementation
      throw new Error('Google provider not yet implemented');
    case AIProvider.Cohere:
      // Placeholder - would need CohereProvider implementation
      throw new Error('Cohere provider not yet implemented');
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

export function isProviderSupported(provider: AIProvider): boolean {
  return [AIProvider.OpenAI, AIProvider.AWSBedrock, AIProvider.Anthropic].includes(provider);
}
