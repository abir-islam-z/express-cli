import { program } from 'commander';
import { config } from 'dotenv';
import { initGenerateCommand, initNewCommand } from './commands';

config();

initNewCommand();
initGenerateCommand();

program.parse(process.argv);
