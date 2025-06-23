export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamps?: boolean;
  colors?: boolean;
}

export class Logger {
  private config: LoggerConfig;
  private static instance: Logger;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      prefix: '[AI-Cost-Tracker]',
      timestamps: true,
      colors: true,
      ...config
    };
  }

  static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, error?: Error, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, error, ...args);
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (level < this.config.level) {
      return;
    }

    const timestamp = this.config.timestamps ? `[${new Date().toISOString()}] ` : '';

    const prefix = this.config.prefix ? `${this.config.prefix} ` : '';
    const levelStr = this.getLevelString(level);
    const color = this.config.colors ? this.getColor(level) : '';
    const reset = this.config.colors ? '\x1b[0m' : '';

    const formattedMessage = `${color}${timestamp}${prefix}${levelStr} ${message}${reset}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...args);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...args);
        break;
      case LogLevel.DEBUG:
        console.log(formattedMessage, ...args);
        break;
    }
  }

  private getLevelString(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '[DEBUG]';
      case LogLevel.INFO:
        return '[INFO]';
      case LogLevel.WARN:
        return '[WARN]';
      case LogLevel.ERROR:
        return '[ERROR]';
      default:
        return '';
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[36m'; // Cyan
      case LogLevel.INFO:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      default:
        return '';
    }
  }

  // Performance logging
  startTimer(label: string): () => void {
    const start = Date.now();
    this.debug(`Timer started: ${label}`);

    return () => {
      const duration = Date.now() - start;
      this.debug(`Timer ended: ${label} (${duration}ms)`);
      return duration;
    };
  }

  // Structured logging
  logStructured(level: LogLevel, event: string, data: Record<string, any>): void {
    if (level < this.config.level) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      event,
      ...data
    };

    this.log(level, JSON.stringify(logEntry));
  }

  // Request logging
  logRequest(
    provider: string,
    model: string,
    tokens: number,
    cost: number,
    duration: number
  ): void {
    this.logStructured(LogLevel.INFO, 'api_request', {
      provider,
      model,
      tokens,
      cost,
      duration
    });
  }

  // Error logging with context
  logError(error: Error, context: Record<string, any> = {}): void {
    this.logStructured(LogLevel.ERROR, 'error', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }

  // Cost tracking log
  logCostAlert(userId: string, cost: number, threshold: number, period: string): void {
    this.logStructured(LogLevel.WARN, 'cost_alert', {
      userId,
      cost,
      threshold,
      period,
      exceeded: cost > threshold
    });
  }

  // Optimization log
  logOptimization(
    type: string,
    originalCost: number,
    optimizedCost: number,
    savings: number
  ): void {
    this.logStructured(LogLevel.INFO, 'optimization', {
      type,
      originalCost,
      optimizedCost,
      savings,
      savingsPercentage: (savings / originalCost) * 100
    });
  }
}

// Export a default logger instance
export const logger = Logger.getInstance();
