import { TEMPLATE_DIR_PATH } from '@/const';
import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger';

/**
 * Get the path of a template file
 * @param name - The name of the template
 * @returns The path of the template file
 * @throws Error if template name contains invalid characters
 */
export const getTemplate = async (name: string): Promise<string | undefined> => {
  try {
    // Validate template name - only allow letters
    if (!/^[a-zA-Z]+$/.test(name)) {
      throw new Error('Invalid template name');
    }

    const templatePath = path.join(TEMPLATE_DIR_PATH, `${name}.ejs`);

    console.log(templatePath);
    const exists = await fs.pathExists(TEMPLATE_DIR_PATH);
    if (!exists) {
      throw new Error(`Template directory not found for: ${name}`);
    }

    return templatePath;
  } catch (error) {
    logger.error(`Error getting template: ${error}`);
    return;
  }
};
