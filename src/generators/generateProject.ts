import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import simpleGit from "simple-git";

import ora from "ora";

export const generateProject = async (projectName: string) => {
  const repoUrl = process.env.TEMPLATE_REPO_URL || ""; // Repository URL

  if (!repoUrl) {
    console.error(chalk.red("❌ REPO_URL not found in .env"));
    return;
  }

  const targetDir = path.join(process.cwd(), projectName); // Destination

  try {
    if (fs.existsSync(targetDir)) {
      console.log(chalk.red(`❌ Project "${projectName}" already exists!`));
      return;
    }

    const spinner = ora(`Creating project "${projectName}"...`).start();
    // Clone the repository
    const git = simpleGit();
    spinner.text = "Initializing git...";
    await git.clone(repoUrl, targetDir);
    spinner.succeed();
    console.log(
      chalk.green(`✅ Project "${projectName}" created successfully!`)
    );

    // Install dependencies
    console.log(chalk.yellow(`📦 Installing dependencies...`));
    installDependencies(targetDir);
  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error}`));
  }
};

const installDependencies = (targetDir: string) => {
  const packageJsonPath = path.join(targetDir, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);
  if (!packageJson) {
    console.error(
      chalk.red(`❌ Error: package.json not found in "${targetDir}"`)
    );
    return;
  }

  const spinner = ora("Installing dependencies...").start();
  const execSync = require("child_process").execSync;
  execSync(`cd ${targetDir} && npm install`, { stdio: "inherit" });
  spinner.succeed();
  console.log(
    chalk.green(`🚀 Setup complete! Run "cd ${targetDir} && npm run dev"`)
  );
};
