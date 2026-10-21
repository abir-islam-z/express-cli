import path from 'path';
import * as fs from './fs.ts';

const APP_ALIAS = '#app/*';
const APP_ALIAS_TARGET = './src/app/*.ts';

// Node resolves this imports map. tsconfig paths are ignored at runtime.
export async function ensureAppAlias(projectRoot: string = process.cwd()): Promise<void> {
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (!(await fs.pathExists(packageJsonPath))) return;

  const packageJson = await fs.readJson(packageJsonPath);
  if (!packageJson) return;

  const imports = packageJson.imports ?? {};
  if (imports[APP_ALIAS] === APP_ALIAS_TARGET) return;

  packageJson.imports = {
    ...imports,
    [APP_ALIAS]: APP_ALIAS_TARGET,
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}
