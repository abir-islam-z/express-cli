import { program } from 'commander';
import { ProjectGenerator } from '../generators';

export const initNewCommand = () =>
  program
    .command('new <project-name>')
    .description('Create a new project')
    .action(async (projectName) => {
      const generator = new ProjectGenerator(projectName);
      await generator.generateProject();
    });
