import { INDEX_ROUTE_PATH } from '../const';
import { colors } from './console';
import * as fs from './fs';
import { logger } from './logger';
import spinner from './spinner';

export const updateIndexRoute = async (name: string) => {
  const spinnerInstance = spinner('Updating index route file').start();
  try {
    const indexRouteContent = await fs.readFile(INDEX_ROUTE_PATH, 'utf8');
    const lines = indexRouteContent.split('\n');

    // Import module route file
    name = name.toLowerCase();
    const routeName = `${name.charAt(0).toUpperCase() + name.slice(1)}Routes`;
    const importLine = `import {${routeName}} from "../modules/${name}/${name}.route";`;
    if (!lines.includes(importLine)) {
      lines.splice(1, 0, importLine);
    }
    const updatedContent = lines.join('\n');

    // Extract moduleRoutes array content using string manipulation instead of AST
    // for better performance in this specific use case
    const moduleRoutesStartIndex = updatedContent.indexOf('const moduleRoutes = [');
    const moduleRoutesEndIndex = updatedContent.indexOf('];', moduleRoutesStartIndex);
    const moduleRoutesContent = updatedContent.substring(moduleRoutesStartIndex, moduleRoutesEndIndex + 2);

    // Parse and normalize the module routes array entries
    const moduleRoutes = moduleRoutesContent
      .replace('const moduleRoutes = [', '')
      .replace('];', '')
      .split('\n')
      .map((line: string) => line.trim())
      .filter(Boolean);

    // Construct route entry using normalized casing conventions
    const routePath = `"/${name}"`;

    // Prevent duplicate route entries
    if (!moduleRoutes.includes(`{ path: ${routePath}, route: ${routeName}},`)) {
      moduleRoutes.push(`{ path: ${routePath}, route: ${routeName}},`);
    }

    const updatedModuleRoutes = `const moduleRoutes = [\n${moduleRoutes.join('\n')}\n];`;

    // Replace the entire moduleRoutes block while preserving surrounding code
    const updatedIndexRouteContent = updatedContent.replace(moduleRoutesContent, updatedModuleRoutes);

    await fs.ensureDir('src/app/routes');
    await fs.writeFile('src/app/routes/index.ts', updatedIndexRouteContent);

    spinnerInstance.succeed(`${colors.green('Updated')} src/app/routes/index.ts`);
  } catch (error) {
    spinnerInstance.fail('Error updating index route file');
    logger.error('❌ Error: Could not update index route file', error);
    process.exit(1);
  }
};
