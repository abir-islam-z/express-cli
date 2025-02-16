import { ProjectGenerator } from '@/generators';
import { program } from 'commander';

export const initNewCommand = () =>
  program
    .command('new <project-name>')
    .description('Create a new project')
    .action(async (projectName) => {
      const generator = new ProjectGenerator(projectName);
      await generator.generateProject();
    });
