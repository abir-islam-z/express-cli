import { logger } from '@/utils/logger';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { exit } from 'process';
import simpleGit from 'simple-git';

export const generateProject = async (projectName: string) => {
  const repoUrl = process.env.TEMPLATE_REPO_URL || '';

  if (!repoUrl) {
    logger.error('❌ Error: Template repository URL not found');
    exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);

  try {
    // Replace existsSync with pathExists for async operation
    const exists = await fs.pathExists(targetDir);
    if (exists) {
      logger.error(`❌ Error: Directory "${projectName}" already exists`);
      exit(1);
    }

    const spinner = ora(`Creating project "${projectName}"...`).start();
    const git = simpleGit();
    spinner.text = 'Initializing git...';
    await git.clone(repoUrl, targetDir);
    spinner.succeed(`Created project "${projectName}"`);
    await installDependencies(targetDir);
  } catch (error) {
    logger.error('Error generating project:', error);
    exit(1);
  }
};

// Make installDependencies async
const installDependencies = async (targetDir: string) => {
  const packageJsonPath = path.join(targetDir, 'package.json');
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    if (!packageJson) {
      logger.error('❌ Error: package.json not found or invalid');
      exit(1);
    }

    const spinner = ora('Installing dependencies...').start();
    execSync(`cd ${targetDir} && npm install`, { stdio: 'inherit' });
    spinner.succeed('Installed dependencies');
    console.log(chalk.green('🚀 Project ready!'));
    // show message to cd into the project
    console.log(chalk.cyan(`cd ${targetDir}`));
  } catch (error) {
    logger.error('❌ Error reading package.json:', error);
    exit(1);
  }
};
