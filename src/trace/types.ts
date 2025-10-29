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

/**
 * Session Replay Types
 * For recording and replaying in-app AI interactions
 */

export type AppFeature = 'chat' | 'experimentation' | 'workflow' | 'agent' | 'notebook';

export interface AIInteraction {
  timestamp: Date;
  model: string;
  prompt: string;
  response: string;
  tokens: {
    input: number;
    output: number;
  };
  cost: number;
  latency: number;
  provider: string;
  parameters?: Record<string, any>;
  requestMetadata?: Record<string, any>;
  responseMetadata?: Record<string, any>;
}

export interface UserAction {
  timestamp: Date;
  action: string;
  target?: string;
  metadata?: Record<string, any>;
}

export interface CodeContext {
  timestamp: Date;
  file?: string;
  language?: string;
  snippet?: string;
  cursorPosition?: {
    line: number;
    column: number;
  };
  metadata?: Record<string, any>;
}

export interface SystemMetrics {
  timestamp: Date;
  cpu?: number;
  memory?: number;
  activeRequests?: number;
  metadata?: Record<string, any>;
}

export interface StartRecordingInput {
  userId: string;
  feature: AppFeature;
  label: string;
  metadata?: Record<string, any>;
}

export interface RecordInteractionInput {
  sessionId: string;
  interaction: AIInteraction;
}

export interface RecordUserActionInput {
  sessionId: string;
  action: UserAction;
}

export interface RecordCodeContextInput {
  sessionId: string;
  context: CodeContext;
}

export interface SessionReplayData {
  aiInteractions: AIInteraction[];
  userActions: UserAction[];
  codeContext: CodeContext[];
  systemMetrics: SystemMetrics[];
  workspaceState?: Record<string, any>;
}

export interface SessionReplay {
  sessionId: string;
  userId: string;
  label: string;
  source: 'in-app' | 'integration';
  appFeature?: AppFeature;
  integrationName?: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  status: 'active' | 'completed' | 'error';
  hasErrors: boolean;
  errorCount: number;
  replayData: SessionReplayData;
  summary: {
    totalCost: number;
    totalTokens: {
      input: number;
      output: number;
    };
    totalSpans: number;
  };
  metadata?: Record<string, any>;
}

export interface SessionReplayService {
  startRecording(input: StartRecordingInput): Promise<{ sessionId: string }>;
  recordInteraction(input: RecordInteractionInput): Promise<void>;
  recordUserAction(input: RecordUserActionInput): Promise<void>;
  recordCodeContext(input: RecordCodeContextInput): Promise<void>;
  endRecording(sessionId: string): Promise<void>;
  getSessionReplay(sessionId: string): Promise<SessionReplay>;
  listSessionReplays(filters?: {
    userId?: string;
    feature?: AppFeature;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ replays: SessionReplay[]; total: number }>;
}
