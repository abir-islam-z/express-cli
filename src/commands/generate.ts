import { APP_FILE_PATH, SERVER_FILE_PATH, SOURCE_DIR_PATH } from '@/const';
import { generateByType } from '@/generators/generateByType';
import { generateModule } from '@/generators/generateModule';
import {logger} from '@/utils/logger';
import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs';
import { exit } from 'process';

export const initGenerateCommand = () => {
  const generateCommand = program.command('generate').alias('g');

  generateCommand.arguments('<type> <name>').action(async (type, name) => {
    /**
     *  ? check if src folder, app.ts, server.ts exists
     *  ! if not promt user to create a new project
     *  */
    const isSrcDirExists = fs.existsSync(SOURCE_DIR_PATH);
    const isAppFileExists = fs.existsSync(APP_FILE_PATH);
    const isServerFileExists = fs.existsSync(SERVER_FILE_PATH);

    if (!isSrcDirExists || !isAppFileExists || !isServerFileExists) {
      logger.error(chalk.red('❌ Error: Project structure not found. Please create a new project using the "new" command'));
      exit(1);
    }
    if (type === 'module' || type === 'mo') {
      generateModule(name);
      return;
    }
    await generateByType(type, name);
  });
};
