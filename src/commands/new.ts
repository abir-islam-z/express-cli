import { program } from "commander";
import { generateProject } from "../generators/generateProject";

export const initNewCommand = () =>
  program
    .command("new <project-name>")
    .description("Create a new project")
    .action(async (projectName) => {
      generateProject(projectName);
    });
