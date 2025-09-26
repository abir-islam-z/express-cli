// Native filesystem utilities to replace fs-extra dependency
// Provides essential file operations using Node.js built-in fs/promises module

import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

// Check if a path exists (async)
export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Check if a path exists (sync)
export function pathExistsSync(filePath: string): boolean {
  try {
    fsSync.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

// Recursively create directory structure (like mkdir -p)
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Recursively create directory structure (sync)
export function ensureDirSync(dirPath: string): void {
  try {
    fsSync.mkdirSync(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Remove file or directory recursively
export async function remove(targetPath: string): Promise<void> {
  try {
    const stats = await fs.stat(targetPath);
    if (stats.isDirectory()) {
      await fs.rm(targetPath, { recursive: true, force: true });
    } else {
      await fs.unlink(targetPath);
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

// Remove file or directory recursively (sync)
export function removeSync(targetPath: string): void {
  try {
    const stats = fsSync.statSync(targetPath);
    if (stats.isDirectory()) {
      fsSync.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fsSync.unlinkSync(targetPath);
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

// Copy file or directory recursively
export async function copy(src: string, dest: string): Promise<void> {
  const stats = await fs.stat(src);

  if (stats.isDirectory()) {
    await copyDir(src, dest);
  } else {
    await copyFile(src, dest);
  }
}

// Copy file
async function copyFile(src: string, dest: string): Promise<void> {
  // Ensure destination directory exists
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

// Copy directory recursively
async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

// Move file or directory
export async function move(src: string, dest: string): Promise<void> {
  try {
    await fs.rename(src, dest);
  } catch (error: any) {
    if (error.code === 'EXDEV') {
      // Cross-device move, fall back to copy + remove
      await copy(src, dest);
      await remove(src);
    } else {
      throw error;
    }
  }
}

// Read JSON file
export async function readJson(filePath: string): Promise<any> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`JSON file not found: ${filePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in file: ${filePath}`);
    }
    throw error;
  }
}

// Write JSON file
export async function writeJson(filePath: string, data: any, options?: { spaces?: number }): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const spaces = options?.spaces ?? 2;
  const content = JSON.stringify(data, null, spaces);
  await fs.writeFile(filePath, content, 'utf-8');
}

// Read JSON file (sync)
export function readJsonSync(filePath: string): any {
  try {
    const content = fsSync.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new Error(`JSON file not found: ${filePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in file: ${filePath}`);
    }
    throw error;
  }
}

// Write JSON file (sync)
export function writeJsonSync(filePath: string, data: any, options?: { spaces?: number }): void {
  ensureDirSync(path.dirname(filePath));
  const spaces = options?.spaces ?? 2;
  const content = JSON.stringify(data, null, spaces);
  fsSync.writeFileSync(filePath, content, 'utf-8');
}

// Export fs functions for compatibility
export { fs as promises, fsSync as sync };
export const existsSync = pathExistsSync;
export const readFile = fs.readFile;
export const writeFile = fs.writeFile;
export const mkdir = fs.mkdir;
export const stat = fs.stat;

// Default export with common fs-extra API compatibility
export default {
  pathExists,
  pathExistsSync,
  existsSync: pathExistsSync,
  ensureDir,
  ensureDirSync,
  remove,
  removeSync,
  copy,
  move,
  readJson,
  writeJson,
  readJsonSync,
  writeJsonSync,
  readFile: fs.readFile,
  writeFile: fs.writeFile,
  mkdir: fs.mkdir,
  stat: fs.stat,
  promises: fs,
  sync: fsSync,
};
