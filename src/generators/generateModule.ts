import { logger } from '../utils/logger';
import { updateIndexRoute } from '../utils/updateIndexRoute';
import { generateByType } from './generateByType';

const filesToCreate = ['controller', 'model', 'route', 'service', 'interface', 'validation'];

export const generateModule = async (name: string) => {
  try {
    await Promise.all(filesToCreate.map((type) => generateByType(type, name)));
    await updateIndexRoute(name);
  } catch (error) {
    logger.error('❌ Error: Could not generate module', error);
    process.exit(1);
  }
};
