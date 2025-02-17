import fs from 'fs-extra';
import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

import { TransformableInfo as WinstonTransformableInfo } from 'logform';

// Error Logs Directory
export const ERROR_LOG_PATH = path.join(__dirname, '..', 'logs');

type TransformableInfo = {
  timestamp: string;
  level: string;
  message: string;
} & WinstonTransformableInfo;

// Ensure logs directory exists
try {
  if (!fs.existsSync(ERROR_LOG_PATH)) {
    fs.mkdirSync(ERROR_LOG_PATH, { recursive: true });
  }
} catch (error) {
  console.error(`Failed to create log directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  process.exit(1);
}

const stream = {
  write: (message: string): void => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

// Add this interface to handle the type mismatch

const logFormat = winston.format.printf((info: TransformableInfo) => {
  const message = typeof info.message === 'string' ? info.message : JSON.stringify(info.message);
  return `${info.timestamp} ${info.level}: ${message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${ERROR_LOG_PATH}/debug`, // log file /logs/debug/*.log in save
      filename: '%DATE%.log',
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${ERROR_LOG_PATH}/error`, // log file /logs/error/*.log in save
      filename: '%DATE%.log',
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      handleRejections: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), winston.format.colorize(), winston.format.simple()),
    })
  );
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export { logger, stream };
