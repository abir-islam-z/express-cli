#!/usr/bin/env node
import { SOURCE_DIR, TEMPLATE_DIR } from '@/const';
import { copy } from 'fs-extra';
import { join } from 'path';

(async () => {
  try {
    const srcDir = join(process.cwd(), SOURCE_DIR, TEMPLATE_DIR);
    const destDir = join(process.cwd(), 'dist', 'templates');
    await copy(srcDir, destDir);
  } catch (error) {
    console.error('Error copying templates:', error);
    process.exit(1);
  }
})();
