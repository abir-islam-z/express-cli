import { TEMPLATE_REPO_URL } from '@/const';
import { logger } from '@/utils/logger';
import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import simpleGit from 'simple-git';

export class ProjectGenerator {
  private readonly projectName: string;
  private readonly targetDir: string;

  constructor(projectName: string) {
    this.projectName = projectName;
    this.targetDir = path.join(process.cwd(), projectName);
  }

  public async generateProject(): Promise<void> {
    const repoUrl = TEMPLATE_REPO_URL || '';

    if (!repoUrl) {
      logger.error('❌ Error: Template repository URL not found');
      process.exit(1);
    }

    try {
      const exists = await fs.pathExists(this.targetDir);
      if (exists) {
        logger.error(`❌ Error: Directory "${this.projectName}" already exists`);
        process.exit(1);
      }

      const spinner = ora(`Creating project "${this.projectName}"...`).start();
      const git = simpleGit();
      spinner.text = 'Initializing git...';
      await git.clone(repoUrl, this.targetDir);
      spinner.succeed(`Created project "${this.projectName}"`);
      await this.installDependencies();
    } catch (error) {
      logger.error('Error generating project:', error);
      process.exit(1);
    }
  }

  private async installDependencies(): Promise<void> {
    const packageJsonPath = path.join(this.targetDir, 'package.json');
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      if (!packageJson) {
        logger.error('❌ Error: package.json not found or invalid');
        process.exit(1);
      }

      const spinner = ora('Installing dependencies...').start();
      execSync(`cd ${this.targetDir} && npm install`, { stdio: 'inherit' });
      spinner.succeed('Installed dependencies');
      console.log(chalk.green('🚀 Project ready!'));
      console.log(chalk.cyan(`cd ${this.projectName}`));
    } catch (error) {
      logger.error('❌ Error reading package.json:', error);
      process.exit(1);
    }
  }
}
