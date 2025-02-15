import chalk from "chalk";
import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import simpleGit from "simple-git";

export class NewProject {
  private projectName: string;
  private repoUrl: string;
  private targetDir: string;

  constructor(projectName: string, repoUrl: string) {
    this.projectName = projectName;
    this.repoUrl = repoUrl;
    this.targetDir = path.join(process.cwd(), projectName); // Destination
  }

  async create() {
    try {
      if (fs.existsSync(this.targetDir)) {
        console.log(
          chalk.red(`❌ Project "${this.projectName}" already exists!`)
        );
        return;
      }

      // Clone the repository
      const git = simpleGit();
      await git.clone(this.repoUrl, this.targetDir);
      console.log(
        chalk.green(`✅ Project "${this.projectName}" created successfully!`)
      );

      // Install dependencies
      console.log(chalk.yellow(`📦 Installing dependencies...`));
      this.installDependencies();
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error}`));
    }
  }

  private installDependencies() {
    const execSync = require("child_process").execSync;
    execSync(`cd ${this.targetDir} && npm install`, { stdio: "inherit" });
    console.log(
      chalk.green(
        `🚀 Setup complete! Run "cd ${this.projectName} && npm run dev"`
      )
    );
  }
}

export const generateNewProject = () =>
  program
    .command("new <project-name> <repo-url>")
    .description("Create a new project")
    .action(async (projectName, repoUrl) => {
      const newProject = new NewProject(projectName, repoUrl);
      await newProject.create();
    });