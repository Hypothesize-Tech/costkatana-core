import { AIProvider, OptimizationConfig, ProviderConfig, TrackerConfig } from '../types';
import { defaultConfig } from './default';

/**
 * Placeholder API key for the OpenAI-shaped provider slot when **no direct provider keys** are set.
 * Actual inference goes through the **Cost Katana gateway** (`costkatana-backend-nest`): the hosted
 * gateway resolves models (e.g. OpenAI-compatible routes, Anthropic via Bedrock, etc.) using your
 * `COST_KATANA_API_KEY` — you do not need `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` in the app.
 */
export const COST_KATANA_HOSTED_MODELS_PROXY_KEY = 'proxy' as const;

/** True when a Cost Katana dashboard API key is present (same sources as `AICostTracker.create`). */
export function hasCostKatanaApiKeyInEnv(): boolean {
  return !!(process.env.COST_KATANA_API_KEY || process.env.COSTKATANA_KEY);
}

/** True when at least one direct AI provider credential is present in the environment. */
export function hasDirectProviderApiKeysInEnv(): boolean {
  return !!(
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
  );
}

/**
 * Single OpenAI-compatible provider entry used for **Cost Katana hosted models** only.
 * Pair with `initializeGateway()` / `ai()` so traffic uses the gateway; the backend supplies upstream models.
 */
export function costKatanaHostedModelsProviderEntry(): ProviderConfig {
  return {
    provider: AIProvider.OpenAI,
    apiKey: COST_KATANA_HOSTED_MODELS_PROXY_KEY
  };
}

/**
 * Infer provider entries from the environment.
 *
 * - If any **direct** provider keys exist (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, or AWS Bedrock creds), those providers are registered.
 * - If **none** are set, returns {@link costKatanaHostedModelsProviderEntry} so the SDK uses **Cost Katana hosted models**
 *   through the gateway (`costkatana-backend-nest`) when you only have `COST_KATANA_API_KEY` (no provider keys in the app).
 */
export function detectProvidersFromEnv(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  if (process.env.OPENAI_API_KEY) {
    providers.push({ provider: AIProvider.OpenAI, apiKey: process.env.OPENAI_API_KEY });
  }
  if (process.env.ANTHROPIC_API_KEY) {
    providers.push({ provider: AIProvider.Anthropic, apiKey: process.env.ANTHROPIC_API_KEY });
  }
  if (process.env.GOOGLE_API_KEY) {
    providers.push({ provider: AIProvider.Google, apiKey: process.env.GOOGLE_API_KEY });
  }
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    providers.push({
      provider: AIProvider.AWSBedrock,
      region: process.env.AWS_REGION || 'us-east-1'
    });
  }

  if (providers.length === 0) {
    return [costKatanaHostedModelsProviderEntry()];
  }

  return providers;
}

function mergeOptimization(overrides?: Partial<OptimizationConfig>): OptimizationConfig {
  const base = defaultConfig.optimization as OptimizationConfig;
  return {
    ...base,
    ...overrides,
    thresholds: {
      ...base.thresholds,
      ...overrides?.thresholds
    }
  };
}

/**
 * Build a full {@link TrackerConfig} with package defaults and providers from the environment.
 * Pass partial overrides to replace or extend any field (e.g. custom `providers` or `optimization`).
 *
 * With only `COST_KATANA_API_KEY` and no direct provider keys, providers default to hosted gateway routing
 * (see {@link detectProvidersFromEnv}).
 */
export function createDefaultTrackerConfig(overrides: Partial<TrackerConfig> = {}): TrackerConfig {
  const providers =
    overrides.providers !== undefined ? overrides.providers : detectProvidersFromEnv();

  const optimization = mergeOptimization(overrides.optimization);

  const tracking = {
    retentionDays: 30,
    ...defaultConfig.tracking,
    ...overrides.tracking
  };

  const alerts = { ...defaultConfig.alerts, ...overrides.alerts };

  return {
    providers,
    optimization,
    tracking,
    alerts,
    logger: overrides.logger,
    apiUrl: overrides.apiUrl,
    projectId: overrides.projectId
  };
}
