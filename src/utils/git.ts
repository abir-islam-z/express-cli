// Native git utilities to replace simple-git dependency
// Uses child_process to execute git commands directly

import { execSync, spawn } from 'child_process';

export type GitOptions = {
  cwd?: string;
  stdio?: 'inherit' | 'pipe' | 'ignore';
};

export class SimpleGit {
  private cwd: string;

  constructor(workingDirectory?: string) {
    this.cwd = workingDirectory || process.cwd();
  }

  // Clone repository
  async clone(repoUrl: string, directory: string, options: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const args = ['clone', ...options, repoUrl, directory];
      const child = spawn('git', args, {
        stdio: 'pipe',
        cwd: this.cwd,
      });

      let stderr = '';

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Git clone failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start git clone: ${error.message}`));
      });
    });
  }

  // Initialize repository
  async init(): Promise<void> {
    return this.execAsync(['init']);
  }

  // Add files to staging
  async add(files: string | string[]): Promise<void> {
    const fileArgs = Array.isArray(files) ? files : [files];
    return this.execAsync(['add', ...fileArgs]);
  }

  // Commit changes
  async commit(message: string, files?: string[]): Promise<void> {
    const args = ['commit', '-m', message];
    if (files && files.length > 0) {
      args.push(...files);
    }
    return this.execAsync(args);
  }

  // Push changes
  async push(remote?: string, branch?: string): Promise<void> {
    const args = ['push'];
    if (remote) args.push(remote);
    if (branch) args.push(branch);
    return this.execAsync(args);
  }

  // Pull changes
  async pull(remote?: string, branch?: string): Promise<void> {
    const args = ['pull'];
    if (remote) args.push(remote);
    if (branch) args.push(branch);
    return this.execAsync(args);
  }

  // Check status
  async status(): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('git', ['status', '--porcelain'], {
        stdio: 'pipe',
        cwd: this.cwd,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Git status failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to run git status: ${error.message}`));
      });
    });
  }

  // Execute git command asynchronously
  private async execAsync(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('git', args, {
        stdio: 'pipe',
        cwd: this.cwd,
      });

      let stderr = '';

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Git command failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to execute git command: ${error.message}`));
      });
    });
  }

  // Execute git command synchronously
  private execSync(args: string[], options: GitOptions = {}): string {
    const opts = {
      cwd: options.cwd || this.cwd,
      stdio: options.stdio || 'pipe',
      encoding: 'utf-8' as const,
    };

    try {
      return execSync(`git ${args.join(' ')}`, opts)
        .toString()
        .trim();
    } catch (error: any) {
      throw new Error(`Git command failed: ${error.message}`);
    }
  }
}

// Factory functions for compatibility with simple-git API
export function simpleGit(workingDirectory?: string): SimpleGit {
  return new SimpleGit(workingDirectory);
}

export default simpleGit;
