import { generateByType, generateModule } from '@/generators';
import { program } from 'commander';

export const initGenerateCommand = () => {
  const generateCommand = program.command('generate').alias('g');

  generateCommand.arguments('<type> <name>').action(async (type, name) => {
    /**
     *  ? check if src folder, app.ts, server.ts exists
     *  ! if not promt user to create a new project
     *  */
    /* const isSrcDirExists = fs.existsSync(SOURCE_DIR_PATH);
    const isAppFileExists = fs.existsSync(APP_FILE_PATH);
    const isServerFileExists = fs.existsSync(SERVER_FILE_PATH);

    if (!isSrcDirExists || !isAppFileExists || !isServerFileExists) {
      console.log(chalk.red('❌ Error: Project structure not found. Please create a new project using the "new" command'));
      return;
    } */
    if (type === 'module' || type === 'mo') {
      generateModule(name);
      return;
    }
    await generateByType(type, name);
  });
};
