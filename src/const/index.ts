import path from 'path';

// Directories
export const SOURCE_DIR = 'src';
export const APP_DIR = 'app';
export const MODULE_DIR = 'modules';
export const ROUTE_DIR = 'routes';
export const TEMPLATE_DIR = 'templates';

// route file name
export const ROUTE_FILE_NAME = 'index.ts';

// File Paths
export const INDEX_ROUTE_PATH = path.join(__dirname, SOURCE_DIR, APP_DIR, ROUTE_DIR, ROUTE_FILE_NAME);

// app.ts path & server.ts path
export const APP_FILE_PATH = path.join(__dirname, SOURCE_DIR, 'app.ts');
export const SERVER_FILE_PATH = path.join(__dirname, SOURCE_DIR, 'server.ts');

// Dir Paths
export const SOURCE_DIR_PATH = path.join(__dirname, SOURCE_DIR);
export const TEMPLATE_DIR_PATH = path.join(__dirname, TEMPLATE_DIR);
export const MODULES_DIR_PATH = path.join(__dirname, 'src', MODULE_DIR);

// Error Logs Directory
export const ERROR_LOG_DIR = 'logs';
export const ERROR_LOG_FILE = 'error.log';
export const ERROR_LOG_PATH = path.join(__dirname, SOURCE_DIR, ERROR_LOG_DIR, ERROR_LOG_FILE);
