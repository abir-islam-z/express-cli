import chalk from "chalk";
import ejs from "ejs";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { APP_FILE_PATH, SERVER_FILE_PATH, SOURCE_DIR_PATH } from "../const";
import { schematics } from "../schematics";
import { createOutputPath } from "../utils/createOutputPath";
import { getTemplate } from "../utils/getTemplate";

/**
 *
 * @param type - type of the file
 * @param name - name of the file
 * @returns - void
 */

export const generateFile = async (type: string, name: string) => {
  // ? check if schematic exists
  const isExistinSchematic = schematics[type];

  if (!isExistinSchematic) {
    console.log(chalk.red(`Schematic ${type} not found`));
    return;
  }

  /**
   *  ? check if src folder, app.ts, server.ts exists
   *  ! if not promt user to create a new project
   *  */
  const isSrcDirExists = fs.existsSync(SOURCE_DIR_PATH);
  const isAppFileExists = fs.existsSync(APP_FILE_PATH);
  const isServerFileExists = fs.existsSync(SERVER_FILE_PATH);

  if (!isSrcDirExists || !isAppFileExists || !isServerFileExists) {
    console.log(chalk.red("❌ Please create a new project first"));
    return;
  }

  const spinner = ora("Generating file").start();

  const templatePath = getTemplate(type);

  const template = await fs.readFile(templatePath!, "utf8");
  const content = ejs.render(template, { name });
  const outputPath = createOutputPath(type, name);

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeFile(outputPath, content);

  spinner.succeed(chalk.green(`✅ ${type} "${name}" generated successfully!`));
};
