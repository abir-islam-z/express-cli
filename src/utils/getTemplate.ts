import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { TEMPLATE_DIR_PATH } from "../const";

/**
 * Get the path of a template file
 * @param name - The name of the template
 * @returns The path of the template file
 */

export const getTemplate = async (name: string) => {
  const templatePath = path.join(TEMPLATE_DIR_PATH, `${name}.ejs`);

  if (!fs.existsSync(templatePath)) {
    console.log(chalk.red(`❌ No template found for "${name}"`));
    return;
  }

  return templatePath;
};
