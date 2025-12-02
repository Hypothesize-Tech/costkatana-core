/**
 * AI Logger for Cost Katana SDK
 * Non-blocking async logging with batching for AI operations
 */

import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AILogEntry, AILoggerConfig } from '../types/logging';
import { logger } from './logger';

export class AILogger {
  private config: Required<AILoggerConfig>;
  private apiClient?: AxiosInstance;
  private logBuffer: AILogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private isShuttingDown = false;
  private flushPromise?: Promise<void>;

  // Sensitive data patterns for redaction
  private readonly SENSITIVE_PATTERNS = [
    /api[_-]?key[_-]?:\s*['"]?([a-zA-Z0-9_-]+)['"]?/gi,
    /token[_-]?:\s*['"]?([a-zA-Z0-9_.-]+)['"]?/gi,
    /password[_-]?:\s*['"]?([^'"]+)['"]?/gi,
    /secret[_-]?:\s*['"]?([a-zA-Z0-9_-]+)['"]?/gi,
    /bearer\s+([a-zA-Z0-9_.-]+)/gi,
    /\b[A-Z0-9]{20,}\b/g // Long uppercase alphanumeric (likely keys)
  ];

  constructor(config: AILoggerConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.COST_KATANA_API_KEY || process.env.API_KEY || '',
      projectId: config.projectId || process.env.PROJECT_ID || '',
      baseUrl: config.baseUrl || 'https://api.costkatana.com',
      batchSize: config.batchSize ?? 50,
      flushInterval: config.flushInterval ?? 5000,
      enableLogging: config.enableLogging ?? true,
      maxPromptLength: config.maxPromptLength ?? 1000,
      maxResultLength: config.maxResultLength ?? 1000,
      redactSensitiveData: config.redactSensitiveData ?? true
    };

    if (this.config.enableLogging && this.config.apiKey) {
      this.initializeApiClient();
      this.startPeriodicFlush();
      this.setupShutdownHandlers();
    } else if (this.config.enableLogging) {
      logger.warn('AI logging enabled but no API key provided. Logs will not be sent to backend.');
    }
  }

  private initializeApiClient(): void {
    this.apiClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'x-project-id': this.config.projectId
      },
      timeout: 10000
    });
  }

  private startPeriodicFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushTimer = setInterval(() => {
      this.flush().catch(err => {
        logger.debug('Periodic flush failed', err);
      });
    }, this.config.flushInterval);
  }

  private setupShutdownHandlers(): void {
    const shutdown = async () => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;
      await this.flush();
      if (this.flushTimer) {
        clearInterval(this.flushTimer);
      }
    };

    process.on('beforeExit', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }

  /**
   * Log an AI operation (async, non-blocking)
   */
  public async logAICall(entry: AILogEntry): Promise<void> {
    if (!this.config.enableLogging) {
      return;
    }

    try {
      const enrichedEntry = this.enrichLogEntry(entry);
      this.logBuffer.push(enrichedEntry);

      logger.debug('AI call logged to buffer', {
        operation: entry.operation,
        model: entry.aiModel,
        bufferSize: this.logBuffer.length
      });

      // Flush if buffer is full
      if (this.logBuffer.length >= this.config.batchSize) {
        // Don't await - fire and forget for non-blocking behavior
        this.flush().catch(err => {
          logger.debug('Auto-flush failed', err);
        });
      }
    } catch (error) {
      // Never let logging errors crash the application
      logger.error(
        'Failed to log AI call',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Log template usage
   */
  public async logTemplateUsage(
    templateId: string,
    templateName: string,
    variables: Record<string, any>,
    additionalData: Partial<AILogEntry> = {}
  ): Promise<void> {
    return this.logAICall({
      service: 'template',
      operation: 'use_template',
      aiModel: additionalData.aiModel || 'template-engine',
      statusCode: 200,
      responseTime: 0,
      templateId,
      templateName,
      templateVariables: variables,
      ...additionalData
    });
  }

  /**
   * Enrich log entry with metadata and context
   */
  private enrichLogEntry(entry: AILogEntry): AILogEntry {
    const requestId = entry.requestId || uuidv4();

    // Redact sensitive data if enabled
    const sanitizedPrompt = entry.prompt
      ? this.redactSensitiveData(entry.prompt).substring(0, this.config.maxPromptLength)
      : undefined;

    const sanitizedResult = entry.result
      ? this.redactSensitiveData(entry.result).substring(0, this.config.maxResultLength)
      : undefined;

    // Calculate tokens if not provided
    const inputTokens =
      entry.inputTokens ?? (entry.prompt ? Math.ceil(entry.prompt.length / 4) : 0);
    const outputTokens =
      entry.outputTokens ?? (entry.result ? Math.ceil(entry.result.length / 4) : 0);
    const totalTokens = entry.totalTokens ?? inputTokens + outputTokens;

    // Determine success from status code if not provided
    const success = entry.success ?? entry.statusCode < 400;

    // Determine log level
    const logLevel = entry.logLevel || this.determineLogLevel(success, entry.statusCode);

    return {
      ...entry,
      userId: entry.userId || undefined,
      projectId: entry.projectId || this.config.projectId || undefined,
      requestId,
      prompt: sanitizedPrompt,
      result: sanitizedResult,
      inputTokens,
      outputTokens,
      totalTokens,
      success,
      logLevel,
      environment: entry.environment || (process.env.NODE_ENV as any) || 'development',
      logSource: entry.logSource || 'cost-katana-sdk'
    };
  }

  /**
   * Redact sensitive data from text
   */
  private redactSensitiveData(text: string): string {
    if (!this.config.redactSensitiveData) {
      return text;
    }

    let redacted = text;
    for (const pattern of this.SENSITIVE_PATTERNS) {
      redacted = redacted.replace(pattern, match => {
        return (
          match.substring(0, 3) +
          '*'.repeat(Math.max(0, match.length - 6)) +
          match.substring(match.length - 3)
        );
      });
    }
    return redacted;
  }

  /**
   * Determine log level based on success and status code
   */
  private determineLogLevel(success: boolean, statusCode: number): AILogEntry['logLevel'] {
    if (!success) {
      if (statusCode >= 500) return 'CRITICAL';
      if (statusCode >= 400) return 'ERROR';
      return 'WARN';
    }
    return 'INFO';
  }

  /**
   * Flush buffered logs to backend
   */
  public async flush(): Promise<void> {
    if (this.logBuffer.length === 0 || !this.apiClient || this.isShuttingDown) {
      return;
    }

    // Prevent concurrent flushes
    if (this.flushPromise) {
      return this.flushPromise;
    }

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    this.flushPromise = (async () => {
      try {
        await this.apiClient!.post('/api/ai-logs', { logs: logsToSend });
        logger.debug('AI logs flushed to backend', { count: logsToSend.length });
      } catch (error) {
        // Put logs back in buffer on failure
        this.logBuffer.unshift(...logsToSend);
        logger.debug('Failed to flush AI logs', error);
      } finally {
        this.flushPromise = undefined;
      }
    })();

    return this.flushPromise;
  }

  /**
   * Get buffer size (for testing/debugging)
   */
  public getBufferSize(): number {
    return this.logBuffer.length;
  }

  /**
   * Clear buffer (for testing)
   */
  public clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Shutdown the logger
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
  }
}

// Export singleton instance
export const aiLogger = new AILogger();
