import { createImportLine } from '@/utils/createImportLine';
import { logger } from '@/utils/logger';
import fs from 'fs-extra';
import ora from 'ora';
import { exit } from 'process';
import { INDEX_ROUTE_PATH } from '../const';
import { generateByType } from './generateByType';

const filesToCreate = ['controller', 'model', 'route', 'service', 'interface', 'validation'];

const updateIndexRouteFile = async (name: string) => {
  const spinner = ora('Updating index route file').start();

  // ? Read the content of the index route file as string and split it into lines
  const indexRouteContent = await fs.readFile(INDEX_ROUTE_PATH, 'utf8');
  const lines = indexRouteContent.split('\n');

  // ? Create the import line for the new route file and add it to the top of the file
  const importLine = await createImportLine('route', name);
  if (!lines.includes(importLine)) {
    lines.splice(1, 0, importLine);
  }
  const updatedContent = lines.join('\n');

  //? Find the start and end indices of the moduleRoutes array and extract the content
  const moduleRoutesStartIndex = updatedContent.indexOf('const moduleRoutes = [');
  const moduleRoutesEndIndex = updatedContent.indexOf('];', moduleRoutesStartIndex);

  const moduleRoutesContent = updatedContent.substring(moduleRoutesStartIndex, moduleRoutesEndIndex + 2);

  // Process the moduleRoutes array content
  const moduleRoutes = moduleRoutesContent
    .replace('const moduleRoutes = [', '')
    .replace('];', '')
    .split('\n')
    .map((line: string) => line.trim())
    .filter(Boolean); // Remove empty lines

  // Create the new route path and name
  const routePath = `"/${name.toLowerCase()}"`;
  const routeName = `${name.charAt(0).toUpperCase() + name.slice(1)}Routes`;

  // Add the new route to the moduleRoutes array if it doesn't already exist
  if (!moduleRoutes.includes(`{ path: ${routePath}, route: ${routeName}, }`)) {
    moduleRoutes.push(`{ path: ${routePath}, route: ${routeName}, }`);
  }

  // Create the updated moduleRoutes array content
  const updatedModuleRoutes = `const moduleRoutes = [\n${moduleRoutes.join(',\n')}\n];`;

  // Replace the old moduleRoutes array content with the updated content
  const updatedIndexRouteContent = updatedContent.replace(moduleRoutesContent, updatedModuleRoutes);

  // Write the updated index route content back to the file
  await fs.writeFile(INDEX_ROUTE_PATH, updatedIndexRouteContent);

  spinner.succeed(`Updated${INDEX_ROUTE_PATH}`);
};

export const generateModule = async (name: string) => {
  // ? Check if the module already exists

  const isModuleExists = await fs.pathExists(`src/app/modules/${name}`);

  if (isModuleExists) {
    logger.error(`❌ Error: Module "${name}" already exists`);

    exit(1);
  }

  filesToCreate.forEach(async (type) => {
    await generateByType(type, name);
  });

  await updateIndexRouteFile(name);
};
