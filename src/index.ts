#!/usr/bin/env node

import { program } from 'commander';
import { initGenerateCommand, initNewCommand } from './commands/index.ts';

const [major = 0, minor = 0] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 18)) {
  console.error('express-modular-cli requires Node.js 22.18 or newer.');
  process.exit(1);
}

initNewCommand();
initGenerateCommand();

program.parse(process.argv);
