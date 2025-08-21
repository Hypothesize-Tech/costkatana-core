/**
 * Cost Katana Distributed Tracing Module
 *
 * Provides enterprise-grade tracing for AI operations with:
 * - Automatic HTTP request tracing
 * - LLM call instrumentation
 * - Hierarchical span relationships
 * - Cost and token tracking
 * - PII redaction
 *
 * @example
 * ```typescript
 * // 1. Create a local trace service
 * import { LocalTraceService, createTraceMiddleware } from 'ai-cost-tracker/trace';
 * const traceService = new LocalTraceService({
 *   storageMode: 'file',
 *   storageDir: './traces'
 * });
 *
 * // 2. Add middleware to Express app
 * app.use(createTraceMiddleware({
 *   startSpan: traceService.startSpan.bind(traceService),
 *   endSpan: traceService.endSpan.bind(traceService)
 * }));
 *
 * // 3. Use tracked providers
 * import { TrackedOpenAI } from 'ai-cost-tracker/trace';
 * const ai = new TrackedOpenAI({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   traceContext: req.traceContext,
 *   startSpan: traceService.startSpan.bind(traceService),
 *   endSpan: traceService.endSpan.bind(traceService)
 * });
 *
 * // 4. All calls are automatically traced!
 * const response = await ai.makeRequest({
 *   model: 'gpt-4',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */

// Export types
export * from './types';

// Export middleware
export {
  createTraceMiddleware,
  createChildSpan,
  type Request,
  type Response,
  type NextFunction
} from './middleware';

// Export provider wrappers
export { TrackedOpenAI, TrackedAnthropic, createTrackedProvider } from './providers';

// Export services
export { LocalTraceService, type LocalTraceServiceConfig } from './service';
export { TraceClient, type TraceClientConfig } from './client';

// Re-export commonly used types for convenience
export type {
  TraceContext,
  StartSpanInput,
  EndSpanInput,
  RecordMessageInput,
  TraceNode,
  SessionGraph,
  SessionDetails,
  TraceService
} from './types';
