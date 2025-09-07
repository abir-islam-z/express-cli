import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import simpleGit from 'simple-git';
import { TEMPLATE_REPO_URL } from '../const';
import { logger } from '../utils/logger';

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

      // Create a temporary directory for cloning
      const tempDir = path.join(process.cwd(), `.temp-${this.projectName}-${Date.now()}`);

      try {
        // Clone the repository to temporary directory
        spinner.text = 'Downloading template...';
        const git = simpleGit();
        await git.clone(repoUrl, tempDir, ['--depth', '1']); // Shallow clone

        // Remove .git directory from template
        const gitDir = path.join(tempDir, '.git');
        if (await fs.pathExists(gitDir)) {
          await fs.remove(gitDir);
        }

        // Copy files to target directory
        spinner.text = 'Setting up project structure...';
        await fs.copy(tempDir, this.targetDir);

        // Clean up temporary directory
        await fs.remove(tempDir);

        // Update package.json with correct project name
        spinner.text = 'Configuring project...';
        await this.updatePackageJson();

        // Initialize fresh git repository
        spinner.text = 'Initializing git repository...';
        const newGit = simpleGit(this.targetDir);
        await newGit.init();
        await newGit.add('.');
        await newGit.commit('Initial commit');

        spinner.succeed(`Created project "${this.projectName}"`);
        await this.installDependencies();
      } catch (error) {
        // Clean up temp directory if it exists
        if (await fs.pathExists(tempDir)) {
          await fs.remove(tempDir);
        }
        throw error;
      }
    } catch (error) {
      logger.error('Error generating project:', error);
      process.exit(1);
    }
  }

  private async updatePackageJson(): Promise<void> {
    const packageJsonPath = path.join(this.targetDir, 'package.json');
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      if (!packageJson) {
        logger.error('❌ Error: package.json not found or invalid');
        process.exit(1);
      }

      // Update package name to match project name
      packageJson.name = this.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      // Update description if it's generic
      if (packageJson.description && packageJson.description.includes('boilerplate')) {
        packageJson.description = `A modular Express.js project: ${this.projectName}`;
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    } catch (error) {
      logger.error('❌ Error updating package.json:', error);
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
