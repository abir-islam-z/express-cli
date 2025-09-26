// Robust error handling utilities for CLI
// Provides comprehensive error handling and graceful failure recovery

export type ErrorContext = {
  operation: string;
  details?: Record<string, any>;
  suggestions?: string[];
};

export class CLIError extends Error {
  public readonly context: ErrorContext;
  public readonly exitCode: number;

  constructor(message: string, context: ErrorContext, exitCode: number = 1) {
    super(message);
    this.name = 'CLIError';
    this.context = context;
    this.exitCode = exitCode;
  }
}

export class ValidationError extends CLIError {
  constructor(message: string, context: ErrorContext) {
    super(message, context, 1);
    this.name = 'ValidationError';
  }
}

export class FileSystemError extends CLIError {
  constructor(message: string, context: ErrorContext) {
    super(message, context, 1);
    this.name = 'FileSystemError';
  }
}

export class GitError extends CLIError {
  constructor(message: string, context: ErrorContext) {
    super(message, context, 1);
    this.name = 'GitError';
  }
}

export class NetworkError extends CLIError {
  constructor(message: string, context: ErrorContext) {
    super(message, context, 1);
    this.name = 'NetworkError';
  }
}

// Input validation utilities
export class InputValidator {
  static validateProjectName(name: string): void {
    if (!name) {
      throw new ValidationError('Project name is required', {
        operation: 'project_name_validation',
        suggestions: ['Provide a valid project name'],
      });
    }

    if (name.length < 2) {
      throw new ValidationError('Project name must be at least 2 characters long', {
        operation: 'project_name_validation',
        details: { providedName: name },
        suggestions: ['Use a longer project name'],
      });
    }

    if (name.length > 100) {
      throw new ValidationError('Project name must be less than 100 characters', {
        operation: 'project_name_validation',
        details: { providedName: name },
        suggestions: ['Use a shorter project name'],
      });
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
      throw new ValidationError('Project name can only contain letters, numbers, hyphens, and underscores', {
        operation: 'project_name_validation',
        details: { providedName: name },
        suggestions: ['Use only alphanumeric characters, hyphens, and underscores'],
      });
    }

    if (name.startsWith('-') || name.endsWith('-')) {
      throw new ValidationError('Project name cannot start or end with hyphens', {
        operation: 'project_name_validation',
        details: { providedName: name },
        suggestions: ['Remove leading or trailing hyphens'],
      });
    }
  }

  static validateModuleName(name: string): void {
    if (!name) {
      throw new ValidationError('Module name is required', {
        operation: 'module_name_validation',
        suggestions: ['Provide a valid module name'],
      });
    }

    if (name.length < 2) {
      throw new ValidationError('Module name must be at least 2 characters long', {
        operation: 'module_name_validation',
        details: { providedName: name },
        suggestions: ['Use a longer module name'],
      });
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
      throw new ValidationError('Module name must start with a letter and contain only letters, numbers, and underscores', {
        operation: 'module_name_validation',
        details: { providedName: name },
        suggestions: ['Start with a letter and use only alphanumeric characters and underscores'],
      });
    }
  }

  static validateSchematicType(type: string): void {
    const validTypes = ['controller', 'service', 'model', 'route', 'validation', 'interface'];

    if (!validTypes.includes(type)) {
      throw new ValidationError(`Invalid schematic type: ${type}`, {
        operation: 'schematic_type_validation',
        details: { providedType: type, validTypes },
        suggestions: [`Use one of: ${validTypes.join(', ')}`],
      });
    }
  }

  static validateURL(url: string, context: string): void {
    try {
      new URL(url);
    } catch {
      throw new ValidationError(`Invalid URL: ${url}`, {
        operation: 'url_validation',
        details: { providedUrl: url, context },
        suggestions: ['Provide a valid HTTP or HTTPS URL'],
      });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new ValidationError(`URL must start with http:// or https://: ${url}`, {
        operation: 'url_validation',
        details: { providedUrl: url, context },
        suggestions: ['Ensure URL starts with http:// or https://'],
      });
    }
  }
}

// Error handler with graceful recovery
export class ErrorHandler {
  static handle(error: Error, exitOnError: boolean = true): void {
    if (error instanceof CLIError) {
      this.handleCLIError(error, exitOnError);
    } else {
      this.handleUnexpectedError(error, exitOnError);
    }
  }

  private static handleCLIError(error: CLIError, exitOnError: boolean): void {
    console.error(`❌ ${error.message}`);

    if (error.context.details) {
      console.error('Details:', error.context.details);
    }

    if (error.context.suggestions && error.context.suggestions.length > 0) {
      console.error('\nSuggestions:');
      error.context.suggestions.forEach((suggestion) => {
        console.error(`  • ${suggestion}`);
      });
    }

    if (exitOnError) {
      process.exit(error.exitCode);
    }
  }

  private static handleUnexpectedError(error: Error, exitOnError: boolean): void {
    console.error('❌ An unexpected error occurred:', error.message);

    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    console.error('\nIf this error persists, please report it as a bug.');

    if (exitOnError) {
      process.exit(1);
    }
  }

  static async withErrorHandling<T>(operation: () => Promise<T>, context: ErrorContext): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof CLIError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new CLIError(`Failed to ${context.operation}: ${error instanceof Error ? error.message : 'Unknown error'}`, context);
    }
  }

  static withSyncErrorHandling<T>(operation: () => T, context: ErrorContext): T {
    try {
      return operation();
    } catch (error) {
      if (error instanceof CLIError) {
        throw error;
      }

      // Wrap unexpected errors
      throw new CLIError(`Failed to ${context.operation}: ${error instanceof Error ? error.message : 'Unknown error'}`, context);
    }
  }
}

// Process signal handlers for graceful shutdown
export function setupGracefulShutdown(): void {
  const cleanup = (signal: string) => {
    console.log(`\n\nReceived ${signal}. Cleaning up...`);

    // Perform any necessary cleanup here
    // For example: close connections, save state, etc.

    console.log('Cleanup complete. Exiting...');
    process.exit(0);
  };

  // Handle various termination signals
  process.on('SIGINT', () => cleanup('SIGINT'));
  process.on('SIGTERM', () => cleanup('SIGTERM'));
  process.on('SIGHUP', () => cleanup('SIGHUP'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('The application will now exit.');
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('The application will now exit.');
    process.exit(1);
  });
}

export default {
  CLIError,
  ValidationError,
  FileSystemError,
  GitError,
  NetworkError,
  InputValidator,
  ErrorHandler,
  setupGracefulShutdown,
};
