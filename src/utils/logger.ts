// Simple logger replacement for CLI tool
class SimpleLogger {
  private formatMessage(level: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const messages = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    return `${timestamp} ${level.toUpperCase()}: ${messages}`;
  }

  info(...args: any[]): void {
    console.log(this.formatMessage('info', ...args));
  }

  error(...args: any[]): void {
    console.error(this.formatMessage('error', ...args));
  }

  warn(...args: any[]): void {
    console.warn(this.formatMessage('warn', ...args));
  }

  debug(...args: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', ...args));
    }
  }
}

const logger = new SimpleLogger();

// Simple stream for compatibility
const stream = {
  write: (message: string): void => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
