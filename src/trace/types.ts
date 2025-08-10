/**
 * Distributed Tracing Types for Cost Katana
 * Enterprise-grade tracing for AI operations
 */

export interface TraceContext {
  sessionId: string;
  traceId: string;
  parentId?: string;
}

export interface StartSpanInput {
  sessionId?: string;
  parentId?: string;
  name: string;
  type: 'http' | 'llm' | 'tool' | 'retrieval' | 'custom';
  metadata?: Record<string, any>;
}

export interface EndSpanInput {
  status: 'ok' | 'error';
  error?: {
    message: string;
    stack?: string;
  };
  model?: string;
  tokens?: {
    input: number;
    output: number;
  };
  costUSD?: number;
  tool?: string;
  resourceIds?: string[];
  metadata?: Record<string, any>;
}

export interface RecordMessageInput {
  sessionId: string;
  traceId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  metadata?: Record<string, any>;
}

export interface TraceNode {
  id: string;
  parentId?: string;
  sessionId: string;
  name: string;
  type: string;
  status: string;
  error?: {
    message: string;
    stack?: string;
  };
  model?: string;
  tokens?: {
    input: number;
    output: number;
  };
  costUSD?: number;
  tool?: string;
  resourceIds?: string[];
  metadata?: Record<string, any>;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  depth: number;
}

export interface TraceEdge {
  from: string;
  to: string;
}

export interface SessionGraph {
  nodes: TraceNode[];
  edges: TraceEdge[];
}

export interface Message {
  sessionId: string;
  traceId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  redactedContent?: string;
  isRedacted: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface SessionDetails {
  sessionId: string;
  userId?: string;
  label?: string;
  status: 'active' | 'completed' | 'error';
  totalSpans: number;
  totalCostUSD: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  startedAt: Date;
  endedAt?: Date;
  messages: Message[];
}

export interface TraceService {
  startSpan(input: StartSpanInput): Promise<{ traceId: string; sessionId: string }>;
  endSpan(traceId: string, input: EndSpanInput): Promise<void>;
  recordMessage(input: RecordMessageInput): Promise<void>;
  getSessionGraph(sessionId: string): Promise<SessionGraph>;
  getSessionDetails(sessionId: string): Promise<SessionDetails>;
}
