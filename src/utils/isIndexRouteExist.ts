import fs from 'fs-extra';
import path from 'path';
import { INDEX_ROUTE_PATH } from '../const';
import { logger } from './logger';

/**
 * Check if the index route file exists
 * @returns A promise that resolves to a boolean
 */
export const isIndexRouteFileExists = async (): Promise<boolean> => {
  try {
    // Normalize and resolve the path for security
    const normalizedPath = path.normalize(INDEX_ROUTE_PATH);
    const absolutePath = path.resolve(normalizedPath);

    // Use async pathExists instead of sync version
    return await fs.pathExists(absolutePath);
  } catch (error) {
    logger.error('Error checking index route file:', error);
    return false;
  }
};
