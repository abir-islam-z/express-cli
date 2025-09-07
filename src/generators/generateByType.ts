import chalk from 'chalk';
import ejs from 'ejs';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { APP_DIR, MODULE_DIR, SOURCE_DIR } from '../const';
import { schematics } from '../schematics';
import { logger } from '../utils/logger';

/**
 *
 * @param type - type of the file
 * @param name - name of the file
 */

export const generateByType = async (type: string, name: string) => {
  // file already exists
  const fileAlreadyExists = fs.existsSync(path.join(process.cwd(), SOURCE_DIR, APP_DIR, MODULE_DIR, name, `${name}.${type}.ts`));

  if (fileAlreadyExists) {
    logger.error(chalk.red(`❌ Error: ${type} ${name} already exists`));
    process.exit(1);
  }

  const spinner = ora(`Generating ${type} ${name}`).start();
  // ? check if schematic exists
  const isExistinSchematic = Object.prototype.hasOwnProperty.call(schematics, type);

  if (!isExistinSchematic) {
    spinner.fail();
    logger.error(chalk.red(`❌ Error: Schematic ${type} not found`));
    process.exit(1);
  }

  // Get template and generate content
  const templatePath = path.join(__dirname, '..', 'templates', `${type}.ejs`);
  const template = await fs.readFile(templatePath, 'utf8');
  const m_name = name.charAt(0).toUpperCase() + name.slice(1);
  const content = ejs.render(template, { name, m_name });

  // output path for the file
  //? src/app/modules/${name}/${name}.${type}.ts
  /**
   * todo: We will add checking for module directory
   * todo: We will add checking for project directory
   */

  const outputPath = path.join(process.cwd(), SOURCE_DIR, APP_DIR, MODULE_DIR, name, `${name}.${type}.ts`);

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, content);

  spinner.succeed(`${chalk.green('Created')} src/app/modules/${name}/${name}.${type}.ts`);
};
