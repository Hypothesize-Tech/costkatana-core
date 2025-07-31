/**
 * High-Availability Gateway & Failover Types for @ai-cost-optimizer-core
 */

export interface FailoverTarget {
    /**
     * The base URL of the AI provider to try
     * @example "https://api.openai.com/v1"
     */
    'target-url': string;
    
    /**
     * Authentication headers needed for this specific provider
     * @example { "Authorization": "Bearer sk-...", "anthropic-version": "2023-06-01" }
     */
    headers: Record<string, string>;
    
    /**
     * HTTP status codes that will trigger a failover to the next provider
     * Can be single codes or ranges
     * @example [429, 500, 502, 503] or [{"from": 400, "to": 599}]
     */
    onCodes: (number | { from: number; to: number })[];
    
    /**
     * Optional object to modify keys in the request body to match the target provider's expected format
     * @example { "model": "model_name" } - changes "model" key to "model_name"
     */
    bodyKeyOverride?: Record<string, string>;
    
    /**
     * Optional timeout for this specific provider (in milliseconds)
     * @default 30000
     */
    timeout?: number;
}

export interface FailoverPolicy {
    /**
     * Array of providers in order of priority
     * The gateway will try them in sequence until one succeeds
     */
    targets: FailoverTarget[];
    
    /**
     * Global timeout for the entire failover sequence (in milliseconds)
     * @default 120000 (2 minutes)
     */
    globalTimeout?: number;
    
    /**
     * Whether to continue trying providers after a successful response
     * @default false
     */
    continueOnSuccess?: boolean;
}

export interface FailoverOptions {
    /**
     * Enable failover functionality
     * @default false
     */
    enabled?: boolean;
    
    /**
     * Failover policy defining providers and their configurations
     */
    policy?: FailoverPolicy;
    
    /**
     * Custom headers to include with failover requests
     */
    headers?: Record<string, string>;
}

export interface FailoverResponse {
    /**
     * Whether the request was successfully handled
     */
    success: boolean;
    
    /**
     * The index of the provider that successfully handled the request
     * -1 if all providers failed
     */
    successfulProviderIndex: number;
    
    /**
     * The response from the successful provider
     */
    response?: any;
    
    /**
     * Total time taken for the entire failover sequence
     */
    totalDuration: number;
    
    /**
     * Number of providers attempted
     */
    providersAttempted: number;
    
    /**
     * Final error if all providers failed
     */
    error?: string;
}