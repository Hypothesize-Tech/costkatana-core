/**
 * Local Trace Service Implementation
 * Provides in-memory or file-based tracing for development and testing
 */

import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import {
  TraceService,
  StartSpanInput,
  EndSpanInput,
  RecordMessageInput,
  SessionGraph,
  SessionDetails,
  TraceNode,
  TraceEdge,
  Message
} from './types';

interface StoredTrace extends TraceNode {
  messages: Message[];
}

interface Session {
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
}

export interface LocalTraceServiceConfig {
  /**
   * Storage mode: 'memory' for in-memory storage, 'file' for file-based persistence
   */
  storageMode?: 'memory' | 'file';
  
  /**
   * Directory for file-based storage (only used when storageMode is 'file')
   */
  storageDir?: string;
  
  /**
   * Whether to auto-save traces to file periodically (only for memory mode)
   */
  autoSave?: boolean;
  
  /**
   * Auto-save interval in milliseconds (default: 60000 - 1 minute)
   */
  autoSaveInterval?: number;
  
  /**
   * Maximum number of sessions to keep in memory (older ones are evicted)
   */
  maxSessions?: number;
  
  /**
   * Sensitive keys to redact from messages
   */
  redactKeys?: string[];
}

/**
 * Local implementation of TraceService for development and testing
 * 
 * @example
 * ```typescript
 * const traceService = new LocalTraceService({
 *   storageMode: 'file',
 *   storageDir: './traces',
 *   autoSave: true
 * });
 * 
 * // Use with middleware
 * app.use(createTraceMiddleware({
 *   startSpan: traceService.startSpan.bind(traceService),
 *   endSpan: traceService.endSpan.bind(traceService)
 * }));
 * ```
 */
export class LocalTraceService implements TraceService {
  private traces: Map<string, StoredTrace> = new Map();
  private sessions: Map<string, Session> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private config: Required<LocalTraceServiceConfig>;
  private autoSaveTimer?: NodeJS.Timeout;
  
  constructor(config: LocalTraceServiceConfig = {}) {
    this.config = {
      storageMode: config.storageMode || 'memory',
      storageDir: config.storageDir || './traces',
      autoSave: config.autoSave ?? false,
      autoSaveInterval: config.autoSaveInterval || 60000,
      maxSessions: config.maxSessions || 1000,
      redactKeys: config.redactKeys || [
        'authorization',
        'x-api-key',
        'api-key',
        'apikey',
        'password',
        'secret',
        'token',
        'email',
        'phone',
        'ssn',
        'credit_card'
      ]
    };
    
    // Load existing traces if using file storage
    if (this.config.storageMode === 'file') {
      this.loadFromDisk();
    }
    
    // Set up auto-save if enabled
    if (this.config.autoSave && this.config.storageMode === 'memory') {
      this.autoSaveTimer = setInterval(() => {
        this.saveToDisk();
      }, this.config.autoSaveInterval);
    }
  }
  
  async startSpan(input: StartSpanInput): Promise<{ traceId: string; sessionId: string }> {
    const sessionId = input.sessionId || uuidv4();
    const traceId = uuidv4();
    
    // Get or create session
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userId: undefined,
        label: input.metadata?.label,
        status: 'active',
        totalSpans: 0,
        totalCostUSD: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        startedAt: new Date()
      };
      this.sessions.set(sessionId, session);
      
      // Evict old sessions if needed
      if (this.sessions.size > this.config.maxSessions) {
        const oldestSessionId = this.sessions.keys().next().value;
        if (oldestSessionId) {
          this.evictSession(oldestSessionId);
        }
      }
    }
    
    // Calculate depth based on parent
    let depth = 0;
    if (input.parentId) {
      const parent = this.traces.get(input.parentId);
      if (parent) {
        depth = parent.depth + 1;
      }
    }
    
    // Create trace
    const trace: StoredTrace = {
      id: traceId,
      parentId: input.parentId,
      sessionId,
      name: input.name,
      type: input.type,
      status: 'pending',
      metadata: input.metadata,
      startedAt: new Date(),
      depth,
      messages: []
    };
    
    this.traces.set(traceId, trace);
    session.totalSpans++;
    
    // Save if using file storage
    if (this.config.storageMode === 'file') {
      this.saveTrace(trace);
    }
    
    return { traceId, sessionId };
  }
  
  async endSpan(traceId: string, input: EndSpanInput): Promise<void> {
    const trace = this.traces.get(traceId);
    if (!trace) {
      throw new Error(`Trace ${traceId} not found`);
    }
    
    const endedAt = new Date();
    const duration = endedAt.getTime() - trace.startedAt.getTime();
    
    // Update trace
    trace.status = input.status;
    trace.error = input.error;
    trace.model = input.model;
    trace.tokens = input.tokens;
    trace.costUSD = input.costUSD;
    trace.tool = input.tool;
    trace.resourceIds = input.resourceIds;
    trace.metadata = { ...trace.metadata, ...input.metadata };
    trace.endedAt = endedAt;
    trace.duration = duration;
    
    // Update session metrics
    const session = this.sessions.get(trace.sessionId);
    if (session) {
      if (input.tokens) {
        session.totalInputTokens += input.tokens.input;
        session.totalOutputTokens += input.tokens.output;
      }
      if (input.costUSD) {
        session.totalCostUSD += input.costUSD;
      }
      if (input.status === 'error') {
        session.status = 'error';
      }
    }
    
    // Save if using file storage
    if (this.config.storageMode === 'file') {
      this.saveTrace(trace);
    }
  }
  
  async recordMessage(input: RecordMessageInput): Promise<void> {
    // Redact sensitive content
    const redactedContent = this.redactContent(input.content);
    
    const message: Message = {
      sessionId: input.sessionId,
      traceId: input.traceId,
      role: input.role,
      content: input.content,
      redactedContent: redactedContent !== input.content ? redactedContent : undefined,
      isRedacted: redactedContent !== input.content,
      metadata: input.metadata,
      createdAt: new Date()
    };
    
    // Store message with trace
    const trace = this.traces.get(input.traceId);
    if (trace) {
      trace.messages.push(message);
    }
    
    // Store message in session messages
    const sessionMessages = this.messages.get(input.sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(input.sessionId, sessionMessages);
    
    // Save if using file storage
    if (this.config.storageMode === 'file') {
      this.saveMessage(message);
    }
  }
  
  async getSessionGraph(sessionId: string): Promise<SessionGraph> {
    const sessionTraces = Array.from(this.traces.values())
      .filter(trace => trace.sessionId === sessionId);
    
    const nodes: TraceNode[] = sessionTraces.map(trace => ({
      id: trace.id,
      parentId: trace.parentId,
      sessionId: trace.sessionId,
      name: trace.name,
      type: trace.type,
      status: trace.status,
      error: trace.error,
      model: trace.model,
      tokens: trace.tokens,
      costUSD: trace.costUSD,
      tool: trace.tool,
      resourceIds: trace.resourceIds,
      metadata: trace.metadata,
      startedAt: trace.startedAt,
      endedAt: trace.endedAt,
      duration: trace.duration,
      depth: trace.depth
    }));
    
    const edges: TraceEdge[] = [];
    for (const node of nodes) {
      if (node.parentId) {
        edges.push({
          from: node.parentId,
          to: node.id
        });
      }
    }
    
    return { nodes, edges };
  }
  
  async getSessionDetails(sessionId: string): Promise<SessionDetails> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    const sessionMessages = this.messages.get(sessionId) || [];
    
    return {
      sessionId: session.sessionId,
      userId: session.userId,
      label: session.label,
      status: session.status,
      totalSpans: session.totalSpans,
      totalCostUSD: session.totalCostUSD,
      totalInputTokens: session.totalInputTokens,
      totalOutputTokens: session.totalOutputTokens,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      messages: sessionMessages
    };
  }
  
  /**
   * End a session and calculate final metrics
   */
  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    session.status = session.status === 'error' ? 'error' : 'completed';
    session.endedAt = new Date();
    
    // Save if using file storage
    if (this.config.storageMode === 'file') {
      this.saveSession(session);
    }
  }
  
  /**
   * List all sessions with optional filters
   */
  async listSessions(params?: {
    userId?: string;
    label?: string;
    from?: Date;
    to?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    sessions: SessionDetails[];
    total: number;
    page: number;
    pages: number;
  }> {
    let sessions = Array.from(this.sessions.values());
    
    // Apply filters
    if (params?.userId) {
      sessions = sessions.filter(s => s.userId === params.userId);
    }
    if (params?.label) {
      const labelFilter = params.label;
      sessions = sessions.filter(s => s.label && s.label.includes(labelFilter));
    }
    if (params?.from) {
      sessions = sessions.filter(s => s.startedAt >= params.from!);
    }
    if (params?.to) {
      sessions = sessions.filter(s => s.startedAt <= params.to!);
    }
    
    // Sort by start time (newest first)
    sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    
    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedSessions = sessions.slice(start, end);
    
    // Get details for each session
    const sessionDetails = await Promise.all(
      paginatedSessions.map(s => this.getSessionDetails(s.sessionId))
    );
    
    return {
      sessions: sessionDetails,
      total: sessions.length,
      page,
      pages: Math.ceil(sessions.length / limit)
    };
  }
  
  /**
   * Get summary statistics for sessions
   */
  async getSessionsSummary(params?: {
    from?: Date;
    to?: Date;
  }): Promise<{
    totalSessions: number;
    activeSessions: number;
    totalCost: number;
    avgDuration: number;
    errorRate: number;
  }> {
    let sessions = Array.from(this.sessions.values());
    
    // Apply date filters
    if (params?.from) {
      sessions = sessions.filter(s => s.startedAt >= params.from!);
    }
    if (params?.to) {
      sessions = sessions.filter(s => s.startedAt <= params.to!);
    }
    
    const totalSessions = sessions.length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const totalCost = sessions.reduce((sum, s) => sum + s.totalCostUSD, 0);
    const errorSessions = sessions.filter(s => s.status === 'error').length;
    const errorRate = totalSessions > 0 ? errorSessions / totalSessions : 0;
    
    // Calculate average duration
    const completedSessions = sessions.filter(s => s.endedAt);
    const avgDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => {
          const duration = s.endedAt!.getTime() - s.startedAt.getTime();
          return sum + duration;
        }, 0) / completedSessions.length
      : 0;
    
    return {
      totalSessions,
      activeSessions,
      totalCost,
      avgDuration,
      errorRate
    };
  }
  
  // Private helper methods
  
  private redactContent(content: string): string {
    let redacted = content;
    
    for (const key of this.config.redactKeys) {
      // Redact key-value pairs in JSON-like structures
      const jsonRegex = new RegExp(`"${key}"\\s*:\\s*"[^"]*"`, 'gi');
      redacted = redacted.replace(jsonRegex, `"${key}": "[REDACTED]"`);
      
      // Redact key=value pairs
      const kvRegex = new RegExp(`${key}\\s*=\\s*[^\\s,;]+`, 'gi');
      redacted = redacted.replace(kvRegex, `${key}=[REDACTED]`);
      
      // Redact email addresses
      if (key === 'email') {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        redacted = redacted.replace(emailRegex, '[EMAIL_REDACTED]');
      }
      
      // Redact phone numbers
      if (key === 'phone') {
        const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
        redacted = redacted.replace(phoneRegex, '[PHONE_REDACTED]');
      }
    }
    
    return redacted;
  }
  
  private evictSession(sessionId: string): void {
    this.sessions.delete(sessionId);
    
    // Remove associated traces
    for (const [traceId, trace] of this.traces) {
      if (trace.sessionId === sessionId) {
        this.traces.delete(traceId);
      }
    }
    
    // Remove associated messages
    this.messages.delete(sessionId);
  }
  
  // File storage methods
  
  private getStoragePath(type: 'sessions' | 'traces' | 'messages'): string {
    const dir = path.join(this.config.storageDir, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }
  
  private saveTrace(trace: StoredTrace): void {
    const dir = this.getStoragePath('traces');
    const file = path.join(dir, `${trace.id}.json`);
    fs.writeFileSync(file, JSON.stringify(trace, null, 2));
  }
  
  private saveSession(session: Session): void {
    const dir = this.getStoragePath('sessions');
    const file = path.join(dir, `${session.sessionId}.json`);
    fs.writeFileSync(file, JSON.stringify(session, null, 2));
  }
  
  private saveMessage(message: Message): void {
    const dir = this.getStoragePath('messages');
    const file = path.join(dir, `${message.sessionId}.json`);
    
    let messages: Message[] = [];
    if (fs.existsSync(file)) {
      messages = JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    messages.push(message);
    
    fs.writeFileSync(file, JSON.stringify(messages, null, 2));
  }
  
  private loadFromDisk(): void {
    // Load sessions
    const sessionsDir = this.getStoragePath('sessions');
    if (fs.existsSync(sessionsDir)) {
      const files = fs.readdirSync(sessionsDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = fs.readFileSync(path.join(sessionsDir, file), 'utf-8');
          const session = JSON.parse(data);
          session.startedAt = new Date(session.startedAt);
          if (session.endedAt) {
            session.endedAt = new Date(session.endedAt);
          }
          this.sessions.set(session.sessionId, session);
        }
      }
    }
    
    // Load traces
    const tracesDir = this.getStoragePath('traces');
    if (fs.existsSync(tracesDir)) {
      const files = fs.readdirSync(tracesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = fs.readFileSync(path.join(tracesDir, file), 'utf-8');
          const trace = JSON.parse(data);
          trace.startedAt = new Date(trace.startedAt);
          if (trace.endedAt) {
            trace.endedAt = new Date(trace.endedAt);
          }
          this.traces.set(trace.id, trace);
        }
      }
    }
    
    // Load messages
    const messagesDir = this.getStoragePath('messages');
    if (fs.existsSync(messagesDir)) {
      const files = fs.readdirSync(messagesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = fs.readFileSync(path.join(messagesDir, file), 'utf-8');
          const messages = JSON.parse(data).map((m: any) => ({
            ...m,
            createdAt: new Date(m.createdAt)
          }));
          const sessionId = file.replace('.json', '');
          this.messages.set(sessionId, messages);
        }
      }
    }
  }
  
  private saveToDisk(): void {
    // Save all sessions
    for (const session of this.sessions.values()) {
      this.saveSession(session);
    }
    
    // Save all traces
    for (const trace of this.traces.values()) {
      this.saveTrace(trace);
    }
    
    // Save all messages
    for (const [sessionId, messages] of this.messages) {
      const dir = this.getStoragePath('messages');
      const file = path.join(dir, `${sessionId}.json`);
      fs.writeFileSync(file, JSON.stringify(messages, null, 2));
    }
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    if (this.config.storageMode === 'file' || this.config.autoSave) {
      this.saveToDisk();
    }
  }
}
