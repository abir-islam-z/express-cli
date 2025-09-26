#!/usr/bin/env node

import { program } from 'commander';
import { initGenerateCommand, initNewCommand } from './commands';

initNewCommand();
initGenerateCommand();

program.parse(process.argv);
