import { logger } from '../utils/logger.ts';
import { ensureProjectStructure } from '../utils/projectValidation.ts';
import { updateIndexRoute } from '../utils/updateIndexRoute.ts';
import { generateByType } from './generateByType.ts';

const filesToCreate = ['controller', 'model', 'route', 'service', 'interface', 'validation'];

export const generateModule = async (name: string) => {
  try {
    // Ensure we're in a valid project structure before generating module
    await ensureProjectStructure();

    // Generate all module files (skip individual validation since we already checked)
    await Promise.all(filesToCreate.map((type) => generateByType(type, name, true)));
    await updateIndexRoute(name);
  } catch (error) {
    logger.error('❌ Error: Could not generate module', error);
    process.exit(1);
  }
};
