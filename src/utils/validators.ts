import { AIProvider, TrackerConfig, ProviderConfig } from '../types';
import { getModelById } from '../types/models';

export function validateProvider(provider: string): AIProvider {
  const validProviders = Object.values(AIProvider);

  if (!validProviders.includes(provider as AIProvider)) {
    throw new Error(
      `Invalid provider: ${provider}. Valid providers are: ${validProviders.join(', ')}`
    );
  }

  return provider as AIProvider;
}

export function validateModel(modelId: string): void {
  const model = getModelById(modelId);

  if (!model) {
    throw new Error(`Unknown model: ${modelId}`);
  }
}

export function validateProviderConfig(config: ProviderConfig): void {
  // Validate provider
  validateProvider(config.provider);

  // Validate API key if required
  if (config.provider === AIProvider.OpenAI && !config.apiKey) {
    throw new Error('OpenAI provider requires an API key');
  }

  // Validate region for AWS Bedrock
  if (config.provider === AIProvider.AWSBedrock) {
    const validRegions = [
      'us-east-1',
      'us-west-2',
      'eu-west-1',
      'eu-central-1',
      'ap-northeast-1',
      'ap-southeast-1',
      'ap-southeast-2'
    ];

    if (config.region && !validRegions.includes(config.region)) {
      throw new Error(
        `Invalid AWS region: ${config.region}. Valid regions are: ${validRegions.join(', ')}`
      );
    }
  }

  // Validate custom pricing if provided
  if (config.customPricing) {
    Object.entries(config.customPricing).forEach(([modelId, pricing]) => {
      if (pricing.promptPrice < 0 || pricing.completionPrice < 0) {
        throw new Error(`Invalid pricing for model ${modelId}: prices must be non-negative`);
      }

      const validUnits = ['per-token', 'per-1k-tokens', 'per-1m-tokens'];
      if (!validUnits.includes(pricing.unit)) {
        throw new Error(
          `Invalid pricing unit for model ${modelId}: ${pricing.unit}. ` +
            `Valid units are: ${validUnits.join(', ')}`
        );
      }
    });
  }
}

export function validateTrackerConfig(config: TrackerConfig): void {
  // Validate providers
  if (!config.providers || config.providers.length === 0) {
    throw new Error('At least one provider configuration is required');
  }

  config.providers.forEach(validateProviderConfig);

  // Validate optimization config
  if (config.optimization) {
    if (config.optimization.bedrockConfig) {
      const { region, modelId } = config.optimization.bedrockConfig;

      if (!region) {
        throw new Error('Bedrock configuration requires a region');
      }

      if (!modelId) {
        throw new Error('Bedrock configuration requires a modelId');
      }

      // Validate that the model exists and is a Bedrock model
      const model = getModelById(modelId);
      if (!model) {
        throw new Error(`Unknown Bedrock model: ${modelId}`);
      }

      if (model.provider !== AIProvider.AWSBedrock) {
        throw new Error(`Model ${modelId} is not a Bedrock model`);
      }
    }
  }

  // Validate alert config
  if (config.alerts) {
    if (config.alerts.costThreshold && config.alerts.costThreshold < 0) {
      throw new Error('Cost threshold must be non-negative');
    }

    if (config.alerts.tokenThreshold && config.alerts.tokenThreshold < 0) {
      throw new Error('Token threshold must be non-negative');
    }

    if (config.alerts.webhookUrl) {
      try {
        new URL(config.alerts.webhookUrl);
      } catch {
        throw new Error('Invalid webhook URL');
      }
    }
  }
}

export function validatePrompt(prompt: string): void {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (prompt.length > 1000000) {
    throw new Error('Prompt exceeds maximum length of 1,000,000 characters');
  }
}

export function validateUserId(userId: string): void {
  if (!userId || typeof userId !== 'string') {
    throw new Error('User ID must be a non-empty string');
  }

  if (userId.length > 256) {
    throw new Error('User ID exceeds maximum length of 256 characters');
  }

  // Basic validation for common ID formats
  const validIdPattern = /^[a-zA-Z0-9_\-@.]+$/;
  if (!validIdPattern.test(userId)) {
    throw new Error(
      'User ID contains invalid characters. ' +
        'Only alphanumeric characters, underscore, hyphen, @ and dot are allowed'
    );
  }
}

export function validateDateRange(startDate?: Date, endDate?: Date): void {
  if (startDate && endDate && startDate > endDate) {
    throw new Error('Start date must be before or equal to end date');
  }

  if (startDate && startDate > new Date()) {
    throw new Error('Start date cannot be in the future');
  }
}

export function sanitizeInput(input: string): string {
  // Remove any potential script tags or malicious content
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}
