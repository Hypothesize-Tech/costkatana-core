/**
 * Standard Console Logger for Cost Katana SDK
 * Simple, colorized console logging for debugging
 */

import { LogLevel, ConsoleLoggerConfig } from '../types/logging';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

export class Logger {
  private config: Required<ConsoleLoggerConfig>;

  constructor(config: ConsoleLoggerConfig = {}) {
    this.config = {
      level: config.level || 'info',
      prefix: config.prefix || '[Cost Katana]',
      timestamps: config.timestamps ?? true,
      colors: config.colors ?? true,
    };
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any): void {
    this.log('error', message, error);
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Check if a level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = this.config.timestamps ? this.getTimestamp() : '';
    const levelStr = this.getLevelString(level);
    const color = this.config.colors ? this.getColor(level) : '';
    const reset = this.config.colors ? COLORS.reset : '';
    const prefix = this.config.prefix;

    const logMessage = `${color}${timestamp}${prefix} ${levelStr} ${message}${reset}`;

    // Output based on level
    switch (level) {
      case 'error':
        console.error(logMessage);
        if (data) {
          if (data instanceof Error) {
            console.error(`${color}${data.stack || data.message}${reset}`);
          } else {
            console.error(data);
          }
        }
        break;
      case 'warn':
        console.warn(logMessage);
        if (data) console.warn(data);
        break;
      case 'info':
        console.info(logMessage);
        if (data) console.info(data);
        break;
      case 'debug':
        console.debug(logMessage);
        if (data) console.debug(data);
        break;
    }
  }

  /**
   * Get formatted timestamp
   */
  private getTimestamp(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `[${hours}:${minutes}:${seconds}.${ms}] `;
  }

  /**
   * Get level string
   */
  private getLevelString(level: LogLevel): string {
    const levelMap: Record<LogLevel, string> = {
      debug: 'DEBUG',
      info: 'INFO ',
      warn: 'WARN ',
      error: 'ERROR',
    };
    return levelMap[level];
  }

  /**
   * Get color for level
   */
  private getColor(level: LogLevel): string {
    const colorMap: Record<LogLevel, string> = {
      debug: COLORS.cyan,
      info: COLORS.green,
      warn: COLORS.yellow,
      error: COLORS.red,
    };
    return colorMap[level];
  }

  /**
   * Create a timer for performance tracking
   */
  startTimer(label: string): () => number {
    const start = Date.now();
    this.debug(`Timer started: ${label}`);

    return () => {
      const duration = Date.now() - start;
      this.debug(`Timer ended: ${label} (${duration}ms)`);
      return duration;
    };
  }
}

// Export singleton instance
export const logger = new Logger();

