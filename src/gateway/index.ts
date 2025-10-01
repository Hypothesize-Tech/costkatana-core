/**
 * CostKATANA AI Gateway - Main exports
 */

export { GatewayClient } from './client';
export * from '../types/gateway';

// Re-export for convenience
import { GatewayClient } from './client';
import { GatewayConfig } from '../types/gateway';

/**
 * Create a new gateway client instance
 */
export function createGatewayClient(config: GatewayConfig): GatewayClient {
  return new GatewayClient(config);
}

/**
 * Create a gateway client with environment variables
 */
export function createGatewayClientFromEnv(overrides: Partial<GatewayConfig> = {}): GatewayClient {
  const apiKey = process.env.API_KEY || process.env.API_KEY;
  const baseUrl =
    process.env.COSTKATANA_GATEWAY_URL || 'https://cost-katana-backend.store/api/gateway';

  if (!apiKey) {
    throw new Error(
      'API_KEY or API_KEY environment variable not set. Please get your API key from the Cost Katana dashboard.'
    );
  }

  const config: GatewayConfig = {
    baseUrl,
    apiKey,
    authMethod: 'gateway',
    enableCache: true,
    enableRetries: true,
    retryConfig: {
      count: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000
    },
    cacheConfig: {
      ttl: 604800 // 7 days
    },
    ...overrides
  };

  return new GatewayClient(config);
}

/**
 * Create a gateway client with standard Authorization header (for direct API calls)
 */
export function createStandardGatewayClient(
  config: Omit<GatewayConfig, 'authMethod'>
): GatewayClient {
  return createGatewayClient({
    ...config,
    authMethod: 'standard'
  });
}

/**
 * Create a gateway client with CostKatana-Auth header (for gateway requests)
 */
export function createCostKatanaGatewayClient(
  config: Omit<GatewayConfig, 'authMethod'>
): GatewayClient {
  return createGatewayClient({
    ...config,
    authMethod: 'gateway'
  });
}
