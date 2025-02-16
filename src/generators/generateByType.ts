import chalk from 'chalk';
import ejs from 'ejs';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { schematics } from '../schematics';
import { createOutputPath } from '../utils/createOutputPath';
import { getTemplate } from '../utils/getTemplate';

/**
 *
 * @param type - type of the file
 * @param name - name of the file
 * @returns - void
 */

export const generateByType = async (type: string, name: string) => {
  const spinner = ora('Generating file').start();

  // ? check if schematic exists
  const isExistinSchematic = Object.hasOwn(schematics, type);

  if (!isExistinSchematic) {
    spinner.fail(chalk.red('Schematic not found'));
    return;
  }
  const templatePath = await getTemplate(type);

  const template = await fs.readFile(templatePath, 'utf8');
  const content = ejs.render(template, { name });
  const outputPath = createOutputPath(type, name);

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, content);

  spinner.succeed(`Created ${outputPath}`);
  spinner.stop();
};
