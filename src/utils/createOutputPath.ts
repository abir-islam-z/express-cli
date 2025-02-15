import path from 'path';
import { APP_DIR, MODULE_DIR, SOURCE_DIR } from '../const';

/**
 *
 * @param type - type of the file
 * @param name - name of the file
 * @returns - output path of the file
 */

export const createOutputPath = (type: string, name: string): string => {
  const outputPath = path.join(__dirname, SOURCE_DIR, APP_DIR, MODULE_DIR, name, `${name}.${type}.ts`);

  return outputPath;
};
