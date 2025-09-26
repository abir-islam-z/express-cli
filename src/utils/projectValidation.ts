// Project structure detection and validation
// Ensures components are only generated within valid Express projects

import * as path from 'path';
import { colors } from './console';
import * as fs from './fs';
import { logger } from './logger';

export interface ProjectValidation {
  isValidProject: boolean;
  missingStructure: string[];
  suggestions: string[];
}

export async function validateProjectStructure(basePath: string = process.cwd()): Promise<ProjectValidation> {
  const validation: ProjectValidation = {
    isValidProject: true,
    missingStructure: [],
    suggestions: [],
  };

  const requiredStructure = [
    'src',
    'src/app',
    'src/app/modules',
    'src/app/routes',
    'src/app/routes/index.ts',
  ];

  const optionalButImportant = [
    'package.json',
    'src/app.ts',
    'src/server.ts',
  ];

  // Check required structure
  for (const item of requiredStructure) {
    const itemPath = path.join(basePath, item);
    const exists = await fs.pathExists(itemPath);

    if (!exists) {
      validation.isValidProject = false;
      validation.missingStructure.push(item);
    }
  }

  // Add suggestions based on missing structure
  if (validation.missingStructure.length > 0) {
    validation.suggestions = [
      'Create a new project first using: exm-cli new <project-name>',
      'Or run this command from within an existing Express project directory',
    ];

    // If we're missing basic structure, suggest creating new project
    if (validation.missingStructure.includes('src') ||
      validation.missingStructure.includes('src/app')) {
      validation.suggestions.unshift(
        'This directory does not contain an Express project structure'
      );
    }

    // If we're missing just routes, offer to create minimal structure
    if (validation.missingStructure.length === 1 &&
      validation.missingStructure.includes('src/app/routes/index.ts')) {
      validation.suggestions.push(
        'Or create the missing route file structure manually'
      );
    }
  }

  return validation;
}

export async function ensureProjectStructure(): Promise<void> {
  const validation = await validateProjectStructure();

  if (!validation.isValidProject) {
    logger.error(colors.red('❌ Error: Not in a valid Express project directory'));

    if (validation.missingStructure.length > 0) {
      logger.error(colors.yellow('\nMissing required structure:'));
      validation.missingStructure.forEach(item => {
        logger.error(colors.red(`  - ${item}`));
      });
    }

    if (validation.suggestions.length > 0) {
      logger.error(colors.cyan('\nSuggestions:'));
      validation.suggestions.forEach(suggestion => {
        logger.error(colors.cyan(`  • ${suggestion}`));
      });
    }

    logger.error(colors.yellow('\nTo create a new project:'));
    logger.error(colors.green('  exm-cli new <project-name>'));
    logger.error(colors.yellow('\nThen navigate to the project directory:'));
    logger.error(colors.green('  cd <project-name>'));
    logger.error(colors.yellow('\nThen generate components:'));
    logger.error(colors.green('  exm-cli g controller user'));

    process.exit(1);
  }
}

export async function isInProjectRoot(): Promise<boolean> {
  const validation = await validateProjectStructure();
  return validation.isValidProject;
}

export default {
  validateProjectStructure,
  ensureProjectStructure,
  isInProjectRoot,
};