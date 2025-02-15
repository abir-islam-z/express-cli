import { program } from 'commander';
import { config } from 'dotenv';
import { initNewCommand } from './commands';
import { initGenerateCommand } from './commands/generate';
import { logger } from './utils/logger';

config();

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(new Error(`Unhandled Rejection at: ${promise}, reason: ${reason}`));
});

initNewCommand();
initGenerateCommand();

program.parse(process.argv);
