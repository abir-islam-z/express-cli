import { program } from "commander";
import { generateProject } from "../generators/generateProject";

export const initNewCommand = () =>
  program
    .command("new <project-name> <repo-url>")
    .description("Create a new project")
    .action(async (projectName, repoUrl) => {
      generateProject(projectName, repoUrl);
    });
