import path from 'path';

// template repo url - now hardcoded since we removed dotenv
export const TEMPLATE_REPO_URL = 'https://github.com/abir-islam-z/nodejs-boilerplate.git';
// Directories
/*
  src
    - app
      - modules
        - module-name
          - controller
          - model
          - route
          - service
          - interface
          - validation
      - routes
        - index.ts
    - utils
    - app.ts
    - server.ts
*/

/***
 * Todo: In future, directories will be dynamic based on cli.json file.
 * Todo: Project structure will be more flexible. User can define their own structure.
 * Todo: We will provide a default structure for the user in the cli.json file.
 * Todo: Whole project will be generated based on the cli.json file. without any hard coded directories.
 * !For now, we are keeping it simple.
 */
export const SOURCE_DIR = 'src';
export const APP_DIR = 'app';
export const MODULE_DIR = 'modules';
export const ROUTE_DIR = 'routes';
export const TEMPLATE_DIR = 'templates';

// route file name
export const ROUTE_FILE_NAME = 'index.ts';

// File Paths
export const INDEX_ROUTE_PATH = path.join(process.cwd(), SOURCE_DIR, APP_DIR, ROUTE_DIR, ROUTE_FILE_NAME);

// app.ts path & server.ts path
export const APP_FILE_PATH = path.join(process.cwd(), SOURCE_DIR, 'app.ts');
export const SERVER_FILE_PATH = path.join(process.cwd(), SOURCE_DIR, 'server.ts');

// Dir Paths
export const SOURCE_DIR_PATH = path.join(process.cwd(), SOURCE_DIR);
export const MODULES_DIR_PATH = path.join(process.cwd(), 'src', MODULE_DIR);
