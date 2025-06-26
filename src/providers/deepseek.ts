import { OpenAIProvider } from './openai';
import { ProviderConfig, AIProvider } from '../types';

export class DeepSeekProvider extends OpenAIProvider {
  constructor(config: ProviderConfig) {
    const deepSeekConfig: ProviderConfig = {
      ...config,
      provider: AIProvider.DeepSeek,
      endpoint: 'https://api.deepseek.com/v1'
    };
    super(deepSeekConfig);
  }
}
