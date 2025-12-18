# Cost Katana Distributed Tracing

Enterprise-grade distributed tracing for AI operations with automatic instrumentation, cost attribution, and performance monitoring.

## Features

- 🔍 **Automatic Instrumentation**: Zero-code tracing with middleware
- 🌳 **Hierarchical Traces**: Parent-child span relationships
- 💰 **Cost Attribution**: Per-span cost tracking with token counts
- ⚡ **Performance Metrics**: Latency, duration, and throughput analysis
- 🔒 **PII Redaction**: Automatic server-side data sanitization
- 📊 **Visual Timeline**: Interactive trace visualization in dashboard
- 🎯 **Error Tracking**: Trace errors through your entire AI pipeline

## Quick Start

### 1. Basic Setup

```typescript
import { LocalTraceService, createTraceMiddleware } from 'ai-cost-tracker/trace';
import express from 'express';

// Create a trace service
const traceService = new LocalTraceService({
  storageMode: 'file',
  storageDir: './traces'
});

// Add middleware to Express app
const app = express();
app.use(createTraceMiddleware({
  startSpan: traceService.startSpan.bind(traceService),
  endSpan: traceService.endSpan.bind(traceService)
}));
```

### 2. Trace LLM Calls

```typescript
import { TrackedOpenAI } from 'ai-cost-tracker/trace';

app.post('/chat', async (req, res) => {
  // Create a tracked AI client
  const ai = new TrackedOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    traceContext: req.traceContext, // Auto-attached by middleware
    startSpan: traceService.startSpan.bind(traceService),
    endSpan: traceService.endSpan.bind(traceService)
  });
  
  // All calls are automatically traced!
  const response = await ai.makeRequest({
    model: 'gpt-4',
    messages: [{ role: 'user', content: req.body.message }],
    maxTokens: 150
  });
  
  res.json(response);
});
```

### 3. View Traces

```typescript
// Get session graph
const graph = await traceService.getSessionGraph(sessionId);

// Get session details with messages
const details = await traceService.getSessionDetails(sessionId);

// List all sessions
const sessions = await traceService.listSessions({
  from: new Date('2024-01-01'),
  to: new Date(),
  page: 1,
  limit: 20
});
```

## Storage Options

### Local Storage (Development)

```typescript
const traceService = new LocalTraceService({
  storageMode: 'memory',  // In-memory storage
  maxSessions: 1000,      // Maximum sessions to keep
  autoSave: true,         // Auto-save to disk
  autoSaveInterval: 60000 // Save every minute
});
```

### File Storage (Testing)

```typescript
const traceService = new LocalTraceService({
  storageMode: 'file',    // Persist to disk
  storageDir: './traces', // Storage directory
  redactKeys: ['api-key', 'password'] // Custom PII keys
});
```

### Cloud Storage (Production)

```typescript
import { TraceClient } from 'ai-cost-tracker/trace';

const traceService = new TraceClient({
  apiKey: process.env.COST_KATANA_API_KEY,
  projectId: process.env.PROJECT_ID,
  apiUrl: 'https://api.costkatana.com'
});
```

## Custom Spans

Track any operation with custom spans:

```typescript
// Start a custom span
const span = await traceService.startSpan({
  sessionId: req.traceContext.sessionId,
  parentId: req.traceContext.traceId,
  name: 'database-query',
  type: 'tool',
  metadata: { query: 'SELECT * FROM users' }
});

// Your custom logic
const result = await db.query('...');

// End the span with metrics
await traceService.endSpan(span.traceId, {
  status: 'ok',
  metadata: { rowCount: result.rows.length }
});
```

## Supported Providers

### OpenAI

```typescript
import { TrackedOpenAI } from 'ai-cost-tracker/trace';

const ai = new TrackedOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  traceContext: req.traceContext,
  startSpan: traceService.startSpan.bind(traceService),
  endSpan: traceService.endSpan.bind(traceService)
});
```

### Anthropic

```typescript
import { TrackedAnthropic } from 'ai-cost-tracker/trace';

const ai = new TrackedAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  traceContext: req.traceContext,
  startSpan: traceService.startSpan.bind(traceService),
  endSpan: traceService.endSpan.bind(traceService)
});
```

### Generic Provider

```typescript
import { createTrackedProvider } from 'ai-cost-tracker/trace';

const trackedProvider = createTrackedProvider(
  originalProvider,
  'makeRequest',
  req.traceContext,
  traceService
);
```

## Data Model

### Session
- `sessionId`: Unique identifier for a conversation/workflow
- `userId`: Optional user identifier
- `label`: Optional label for filtering
- `status`: active | completed | error
- `totalSpans`: Number of spans in session
- `totalCostUSD`: Total cost across all spans
- `totalInputTokens`: Total input tokens
- `totalOutputTokens`: Total output tokens
- `startedAt`: Session start time
- `endedAt`: Session end time

### Trace (Span)
- `traceId`: Unique span identifier
- `sessionId`: Parent session ID
- `parentId`: Parent span ID (for hierarchy)
- `name`: Span name
- `type`: http | llm | tool | retrieval | custom
- `status`: pending | ok | error
- `error`: Error details if failed
- `model`: AI model used (for LLM spans)
- `tokens`: Input/output token counts
- `costUSD`: Cost for this span
- `startedAt`: Span start time
- `endedAt`: Span end time
- `duration`: Duration in milliseconds
- `depth`: Depth in trace tree

### Message
- `sessionId`: Parent session ID
- `traceId`: Parent trace ID
- `role`: user | assistant | system | tool
- `content`: Original message content
- `redactedContent`: PII-redacted content
- `isRedacted`: Whether content was redacted
- `createdAt`: Message timestamp

## PII Redaction

Sensitive data is automatically redacted server-side:

```typescript
const traceService = new LocalTraceService({
  redactKeys: [
    'authorization',
    'x-api-key',
    'password',
    'email',
    'phone',
    'ssn',
    'credit_card',
    // Add custom keys
    'my-secret-key'
  ]
});
```

## Best Practices

1. **Use Session IDs**: Pass `x-session-id` header to group related requests
2. **Add Metadata**: Include relevant metadata in spans for better debugging
3. **Handle Errors**: Always end spans even on error
4. **Clean Up**: Call `destroy()` on LocalTraceService when shutting down
5. **Monitor Performance**: Use trace data to identify bottlenecks
6. **Set Budgets**: Monitor `totalCostUSD` to stay within budget

## Examples

See [examples/tracing-example.ts](../../examples/tracing-example.ts) for a complete working example.

## API Reference

### LocalTraceService

```typescript
class LocalTraceService {
  constructor(config?: LocalTraceServiceConfig)
  startSpan(input: StartSpanInput): Promise<{ traceId: string; sessionId: string }>
  endSpan(traceId: string, input: EndSpanInput): Promise<void>
  recordMessage(input: RecordMessageInput): Promise<void>
  getSessionGraph(sessionId: string): Promise<SessionGraph>
  getSessionDetails(sessionId: string): Promise<SessionDetails>
  listSessions(params?: ListSessionsParams): Promise<SessionsList>
  getSessionsSummary(params?: DateRange): Promise<SessionsSummary>
  endSession(sessionId: string): Promise<void>
  destroy(): void
}
```

### TraceClient (Cloud)

```typescript
class TraceClient {
  constructor(config: TraceClientConfig)
  startSpan(input: StartSpanInput): Promise<{ traceId: string; sessionId: string }>
  endSpan(traceId: string, input: EndSpanInput): Promise<void>
  recordMessage(input: RecordMessageInput): Promise<void>
  getSessionGraph(sessionId: string): Promise<SessionGraph>
  getSessionDetails(sessionId: string): Promise<SessionDetails>
  listSessions(params?: ListSessionsParams): Promise<SessionsList>
  getSessionsSummary(params?: DateRange): Promise<SessionsSummary>
  ingestBatch(spans: SpanBatch[]): Promise<void>
}
```

## License

MIT
