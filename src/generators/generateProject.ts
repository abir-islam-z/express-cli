import { execSync } from 'child_process';
import path from 'path';
import { TEMPLATE_REPO_URL } from '../const';
import { colors } from '../utils/console';
import * as fs from '../utils/fs';
import { simpleGit } from '../utils/git';
import { logger } from '../utils/logger';
import spinner from '../utils/spinner';

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

      const spinnerInstance = spinner(`Creating project "${this.projectName}"...`).start();

      // Create a temporary directory for cloning
      const tempDir = path.join(process.cwd(), `.temp-${this.projectName}-${Date.now()}`);

      try {
        // Clone the repository to temporary directory
        spinnerInstance.text = 'Downloading template...';
        const git = simpleGit();
        await git.clone(repoUrl, tempDir, ['--depth', '1']); // Shallow clone

        // Remove .git directory from template
        const gitDir = path.join(tempDir, '.git');
        if (await fs.pathExists(gitDir)) {
          await fs.remove(gitDir);
        }

        // Copy files to target directory
        spinnerInstance.text = 'Setting up project structure...';
        await fs.copy(tempDir, this.targetDir);

        // Clean up temporary directory
        await fs.remove(tempDir);

        // Update package.json with correct project name
        spinnerInstance.text = 'Configuring project...';
        await this.updatePackageJson();
        await this.updateTsConfig();

        // Initialize fresh git repository
        spinnerInstance.text = 'Initializing git repository...';
        const newGit = simpleGit(this.targetDir);
        await newGit.init();
        await newGit.add('.');
        await newGit.commit('Initial commit');

        spinnerInstance.succeed(`Created project "${this.projectName}"`);
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

  private async updateTsConfig(): Promise<void> {
    const tsConfigPath = path.join(this.targetDir, 'tsconfig.json');
    try {
      const tsConfig = await fs.readJson(tsConfigPath);
      if (!tsConfig) {
        // If no tsconfig exists, skip this step
        return;
      }

      // Remove path aliases to use relative imports
      if (tsConfig.compilerOptions) {
        delete tsConfig.compilerOptions.baseUrl;
        delete tsConfig.compilerOptions.paths;
      }

      await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
    } catch (error) {
      logger.error('❌ Error updating tsconfig.json:', error);
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

      const spinnerInstance = spinner('Installing dependencies...').start();
      execSync(`cd ${this.targetDir} && npm install`, { stdio: 'inherit' });
      spinnerInstance.succeed('Installed dependencies');
      console.log(colors.green('🚀 Project ready!'));
      console.log(colors.cyan(`cd ${this.projectName}`));
    } catch (error) {
      logger.error('❌ Error reading package.json:', error);
      process.exit(1);
    }
  }
}
