/**
 * Express Middleware for Distributed Tracing
 * Automatically creates root spans for all HTTP requests
 */

import { v4 as uuidv4 } from 'uuid';
import { TraceContext } from './types';

// Define minimal Express-compatible interfaces to avoid dependency
export interface Request {
  headers: { [key: string]: string | string[] | undefined };
  method: string;
  path: string;
  query: any;
  ip?: string;
  traceContext?: TraceContext;
  get(name: string): string | undefined;
}

export interface Response {
  locals: {
    sessionId?: string;
    traceId?: string;
    traceContext?: TraceContext;
  };
  statusCode: number;
  send: Function;
  json: Function;
  end: Function;
  on(event: string, listener: Function): this;
  getHeaders(): { [key: string]: string | string[] | number | undefined };
}

export interface NextFunction {
  (err?: any): void;
}

interface TraceMiddlewareOptions {
  /**
   * Custom header name for session ID (default: x-session-id)
   */
  sessionHeader?: string;
  
  /**
   * Function to start a span - implement this with your trace service
   */
  startSpan: (input: {
    sessionId: string;
    name: string;
    type: string;
    metadata?: Record<string, any>;
  }) => Promise<{ traceId: string }>;
  
  /**
   * Function to end a span - implement this with your trace service
   */
  endSpan: (traceId: string, input: {
    status: 'ok' | 'error';
    error?: { message: string; stack?: string };
    metadata?: Record<string, any>;
  }) => Promise<void>;
  
  /**
   * Whether to include request/response details in metadata
   */
  includeDetails?: boolean;
}

/**
 * Creates Express middleware for automatic request tracing
 * 
 * @example
 * ```typescript
 * import { createTraceMiddleware } from 'ai-cost-tracker/trace';
 * import { traceService } from './services/trace';
 * 
 * app.use(createTraceMiddleware({
 *   startSpan: traceService.startSpan,
 *   endSpan: traceService.endSpan,
 *   includeDetails: true
 * }));
 * ```
 */
export function createTraceMiddleware(options: TraceMiddlewareOptions) {
  const {
    sessionHeader = 'x-session-id',
    startSpan,
    endSpan,
    includeDetails = false
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Get or generate session ID
    const sessionId = req.headers[sessionHeader] as string || uuidv4();
    
    // Start root span for the HTTP request
    const metadata: Record<string, any> = {
      method: req.method,
      path: req.path,
      query: req.query
    };
    
    if (includeDetails) {
      metadata.headers = req.headers;
      metadata.ip = req.ip;
      metadata.userAgent = req.get('user-agent');
    }
    
    try {
      const { traceId } = await startSpan({
        sessionId,
        name: `${req.method} ${req.path}`,
        type: 'http',
        metadata
      });
      
      // Attach context to request and response
      const traceContext: TraceContext = {
        sessionId,
        traceId,
        parentId: undefined
      };
      
      req.traceContext = traceContext;
      res.locals.sessionId = sessionId;
      res.locals.traceId = traceId;
      res.locals.traceContext = traceContext;
      
      // Capture response
      const originalSend = res.send;
      const originalJson = res.json;
      const originalEnd = res.end;
      
      const endTrace = async (error?: Error) => {
        try {
          await endSpan(traceId, {
            status: error || res.statusCode >= 400 ? 'error' : 'ok',
            error: error ? {
              message: error.message,
              stack: error.stack
            } : undefined,
            metadata: {
              statusCode: res.statusCode,
              ...(includeDetails ? {
                responseHeaders: res.getHeaders()
              } : {})
            }
          });
        } catch (err) {
          console.error('Failed to end trace span:', err);
        }
      };
      
      res.send = function(data: any) {
        endTrace();
        return originalSend.call(this, data);
      };
      
      res.json = function(data: any) {
        endTrace();
        return originalJson.call(this, data);
      };
      
      res.end = function(...args: any[]) {
        endTrace();
        return originalEnd.apply(this, args);
      };
      
      // Handle errors
      res.on('error', (error: any) => {
        endTrace(error);
      });
      
      next();
    } catch (error) {
      console.error('Failed to start trace span:', error);
      next();
    }
  };
}

/**
 * Helper to create child spans within a request handler
 * 
 * @example
 * ```typescript
 * app.get('/api/chat', async (req, res) => {
 *   const span = await createChildSpan(req, {
 *     name: 'database-query',
 *     type: 'tool'
 *   });
 *   
 *   try {
 *     const result = await db.query('...');
 *     await span.end({ status: 'ok' });
 *   } catch (error) {
 *     await span.end({ 
 *       status: 'error',
 *       error: { message: error.message }
 *     });
 *   }
 * });
 * ```
 */
export async function createChildSpan(
  req: Request,
  input: {
    name: string;
    type: string;
    metadata?: Record<string, any>;
  },
  startSpanFn: (input: any) => Promise<{ traceId: string }>
) {
  const parentContext = req.traceContext;
  if (!parentContext) {
    throw new Error('No trace context found on request');
  }
  
  const { traceId } = await startSpanFn({
    sessionId: parentContext.sessionId,
    parentId: parentContext.traceId,
    name: input.name,
    type: input.type,
    metadata: input.metadata
  });
  
  return {
    traceId,
    end: async (_endInput: {
      status: 'ok' | 'error';
      error?: { message: string; stack?: string };
      metadata?: Record<string, any>;
    }) => {
      // Implementation depends on your trace service
      // This is just the interface - actual implementation would call endSpan
    }
  };
}
