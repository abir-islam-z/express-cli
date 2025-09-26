import path from 'path';
import { APP_DIR, MODULE_DIR, SOURCE_DIR } from '../const';
import { schematics } from '../schematics';
import { colors } from '../utils/console';
import * as fs from '../utils/fs';
import { logger } from '../utils/logger';
import { ensureProjectStructure } from '../utils/projectValidation';
import { generateFromTemplate } from '../utils/smartTemplates';
import spinner from '../utils/spinner';

/**
 *
 * @param type - type of the file
 * @param name - name of the file
 * @param skipValidation - skip project structure validation (used when called from generateModule)
 */

export const generateByType = async (type: string, name: string, skipValidation: boolean = false) => {
  // Ensure we're in a valid project structure before generating components
  if (!skipValidation) {
    await ensureProjectStructure();
  }

  // file already exists
  const fileAlreadyExists = fs.existsSync(path.join(process.cwd(), SOURCE_DIR, APP_DIR, MODULE_DIR, name, `${name}.${type}.ts`));

  if (fileAlreadyExists) {
    logger.error(colors.red(`❌ Error: ${type} ${name} already exists`));
    process.exit(1);
  }

  const spinnerInstance = spinner(`Generating ${type} ${name}`).start();
  // ? check if schematic exists
  const isExistinSchematic = Object.prototype.hasOwnProperty.call(schematics, type);

  if (!isExistinSchematic) {
    spinnerInstance.fail();
    logger.error(colors.red(`❌ Error: Schematic ${type} not found`));
    process.exit(1);
  }

  // Generate content using smart TypeScript template with context detection
  const m_name = name.charAt(0).toUpperCase() + name.slice(1);
  const content = await generateFromTemplate(type, { name, m_name });

  // output path for the file
  //? src/app/modules/${name}/${name}.${type}.ts
  /**
   * todo: We will add checking for module directory
   * todo: We will add checking for project directory
   */

  const outputPath = path.join(process.cwd(), SOURCE_DIR, APP_DIR, MODULE_DIR, name, `${name}.${type}.ts`);

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, content);

  spinnerInstance.succeed(`${colors.green('Created')} src/app/modules/${name}/${name}.${type}.ts`);
};
