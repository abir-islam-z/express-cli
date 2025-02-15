import fs from 'fs-extra';
import path from 'path';
import { TEMPLATE_DIR_PATH } from '../const';
import { logger } from './logger';

/**
 * Get the path of a template file
 * @param name - The name of the template
 * @returns The path of the template file
 * @throws Error if template name contains invalid characters
 */
export const getTemplate = async (name: string): Promise<string | undefined> => {
  try {
    // Validate template name - only allow alphanumeric chars, dash and underscore
    if (!/^[\w-]+$/.test(name)) {
      throw new Error('Invalid template name');
    }

    // Normalize and resolve the path for security
    const normalizedPath = path.normalize(`${name}.ejs`);
    const templatePath = path.resolve(TEMPLATE_DIR_PATH, normalizedPath);

    // Ensure the resolved path is within the templates directory
    if (!templatePath.startsWith(path.resolve(TEMPLATE_DIR_PATH))) {
      throw new Error('Invalid template path');
    }

    const exists = await fs.pathExists(templatePath);
    if (!exists) {
      logger.error(`No template found for "${name}"`);
      return;
    }

    return templatePath;
  } catch (error) {
    logger.error(`Error getting template: ${error}`);
    return;
  }
};
