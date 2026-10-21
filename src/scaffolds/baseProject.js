import { packageName } from './options.js';
import { authTemplateFiles } from './authProject.js';
import { sqlDependencies, sqlEnvLines, sqlFiles } from './sqlProject.js';
import { readTemplateDir } from '../utils/templateFiles.js';

const tsconfig = `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmit": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
`;

const gitignore = `node_modules
dist
*.tsbuildinfo
.env
.env.*
!.env.example
*.db
*.db-journal
`;

const eslintConfig = `import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.{js,ts}'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
    },
    ignores: ['node_modules', 'dist'],
  },
];
`;

function packageJson(options) {
  const dependencies = {
    'cookie-parser': '^1.4.7',
    cors: '^2.8.5',
    express: '^4.21.2',
    helmet: '^8.0.0',
    'http-status': '^2.0.0',
    zod: '^3.24.1',
  };
  const devDependencies = {
    '@types/cookie-parser': '^1.4.8',
    '@types/cors': '^2.8.17',
    '@types/express': '^5.0.0',
    '@types/node': '^24.10.0',
    '@typescript-eslint/eslint-plugin': '^8.19.0',
    '@typescript-eslint/parser': '^8.19.0',
    eslint: '^9.17.0',
    typescript: '^5.9.3',
  };

  if (options.mongo) dependencies.mongoose = '^8.9.3';
  if (options.auth) {
    dependencies.bcrypt = '^5.1.1';
    dependencies.jsonwebtoken = '^9.0.2';
    devDependencies['@types/bcrypt'] = '^5.0.2';
    devDependencies['@types/jsonwebtoken'] = '^9.0.7';
  }
  const sql = sqlDependencies(options);
  Object.assign(dependencies, sql.dependencies);
  Object.assign(devDependencies, sql.devDependencies);

  return `${JSON.stringify({
    name: packageName(options.name),
    version: '1.0.0',
    description: `A modular Express.js project: ${options.name}`,
    type: 'module',
    imports: { '#app/*': './src/app/*.ts' },
    engines: { node: '>=22.18.0' },
    scripts: {
      dev: 'node --watch src/server.ts',
      start: 'node src/server.ts',
      typecheck: 'tsc --noEmit',
      lint: 'eslint src',
      'lint:fix': 'eslint src --fix',
      ...sql.scripts,
    },
    dependencies,
    devDependencies,
  }, null, 2)}\n`;
}

function envExample(options) {
  const lines = [
    'NODE_ENV=development',
    `PORT=${options.port}`,
    'FRONTEND_URL=http://localhost:3000',
    '',
  ];
  if (options.mongo) {
    lines.push(`DB_URL=mongodb://localhost:27017/${packageName(options.name)}`, '');
  }
  if (options.database) lines.push(...sqlEnvLines(options));
  if (options.auth) {
    lines.push(
      'JWT_ACCESS_SECRET=replace-with-a-long-random-string',
      'JWT_ACCESS_EXPIRES_IN=1d',
      'JWT_REFRESH_SECRET=replace-with-another-long-random-string',
      'JWT_REFRESH_EXPIRES_IN=365d',
      'BCRYPT_SALT_ROUNDS=12',
      '',
    );
  }
  return lines.join('\n');
}

function readme(options) {
  const features = ['Express', 'TypeScript on Node.js'];
  if (options.orm === 'mongoose') features.push('Mongoose');
  if (options.orm === 'prisma') features.push('Prisma');
  if (options.orm === 'drizzle') features.push('Drizzle');
  if (options.database === 'postgres' && options.postgres === 'supabase') features.push('Supabase Postgres');
  else if (options.database) features.push(options.database);
  if (options.auth) features.push('JWT authentication');
  const databaseSteps = [];
  if (options.orm === 'prisma') databaseSteps.push('npx prisma migrate dev');
  if (options.orm === 'drizzle') databaseSteps.push('npm run db:push');
  const supabase = options.postgres === 'supabase'
    ? '\n\nSupabase: put the pooler URI in `DATABASE_URL` and the session URI in `DIRECT_URL` (from the Supabase dashboard).\n'
    : '';
  return `# ${options.name}

${features.join(', ')}.

\`\`\`bash
cp .env.example .env
npm install
${databaseSteps.join('\n')}
npm run dev
\`\`\`
${supabase}
The API listens on port ${options.port}. Health check: \`GET /health\`.
`;
}

function configSource(options) {
  const fields = [
    `  port: process.env.PORT || ${options.port},`,
    "  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',",
    '  NODE_ENV: process.env.NODE_ENV,',
  ];
  if (options.mongo) fields.push("  db_url: process.env.DB_URL || '',");
  if (options.database) fields.push("  database_url: process.env.DATABASE_URL || '',");
  if (options.auth) {
    fields.push(
      '  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,',
      '  jwt: {',
      '    access_secret: process.env.JWT_ACCESS_SECRET,',
      '    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,',
      '    refresh_secret: process.env.JWT_REFRESH_SECRET,',
      '    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,',
      '  },',
    );
  }
  return `import { existsSync } from 'node:fs';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const config = {
${fields.join('\n')}
};

export default config;
`;
}

function serverSource(options) {
  const mongoImport = options.mongo ? "import mongoose from 'mongoose';\n" : '';
  const connect = options.mongo
    ? `    await mongoose.connect(config.db_url as string);
    console.log('Database connected successfully');

`
    : '';
  return `import type { Server } from 'node:http';
${mongoImport}import app from './app.ts';
import config from '#app/config/index';

let server: Server;

async function main() {
  try {
${connect}    server = app.listen(config.port, () => {
      console.log(\`Server running on port \${config.port}\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Promise Rejection:', error);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

main();
`;
}

function routesSource(options) {
  if (!options.auth) {
    return `import { Router } from 'express';

const router = Router();

type ModuleRoute = {
  path: string;
  route: Router;
};

const moduleRoutes: ModuleRoute[] = [
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
`;
  }

  return `import { Router } from 'express';
import { AdminRoutes } from '#app/modules/admin/admin.route';
import { AuthRoutes } from '#app/modules/auth/auth.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
`;
}

function errorHandlerSource(options) {
  const imports = [
    "import type { ErrorRequestHandler } from 'express';",
    "import { ZodError } from 'zod';",
    "import config from '#app/config/index';",
    "import AppError from '#app/errors/AppError';",
    "import handleZodError from '#app/errors/handleZodError';",
  ];
  const branches = [
    `  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;`,
  ];
  if (options.mongo) {
    imports.push(
      "import handleCastError from '#app/errors/handleCastError';",
      "import handleDuplicateError from '#app/errors/handleDupliCateError';",
      "import handleValidationError from '#app/errors/handleValidationError';",
    );
    branches.push(`  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;`);
  }
  branches.push(`  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    error = [{ path: '', message: err.message }];`);
  if (options.auth) {
    imports.push(
      "import jwt from 'jsonwebtoken';",
      "import handleAuthenticationError from '#app/errors/handleAuthenticationError';",
    );
    branches.push(`  } else if (err instanceof jwt.JsonWebTokenError) {
    const simplifiedError = handleAuthenticationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;`);
  }
  branches.push(`  } else if (err instanceof Error) {
    message = err.message;
    error = [{ path: '', message: err.message }];
  }`);

  return `${imports.join('\n')}
import type { TErrorSources } from '#app/interface/error';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let error: TErrorSources = [{ path: '', message: 'Something went wrong' }];

${branches.join('\n')}

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
`;
}

const appSource = `import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import globalErrorHandler from '#app/middlewares/globalErrorHandler';
import notFound from '#app/middlewares/notFound';
import router from '#app/routes/index';

const app: Application = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
`;

const catchAsyncSource = `import type { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err));
  };
};

export default catchAsync;
`;

const sendResponseSource = `import type { Response } from 'express';

type ResponseBody<T> = {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
  };
};

export const sendResponse = <T>(res: Response, data: ResponseBody<T>) => {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    statusCode: data.statusCode,
    data: data.data,
    meta: data.meta,
  });
};
`;

const routeParamSource = `export const routeParam = (value: string | string[] | undefined): string => {
  const resolved = Array.isArray(value) ? value[0] : value;
  if (!resolved) {
    throw new Error('Missing route parameter');
  }
  return resolved;
};
`;

const notFoundSource = `import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendResponse } from '#app/utils/sendResponse';

const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  sendResponse(res, {
    success: false,
    message: 'Not Found',
    statusCode: httpStatus.NOT_FOUND,
    data: null,
  });
};

export default notFound;
`;

export async function buildProjectFiles(options) {
  const files = {
    'package.json': packageJson(options),
    'tsconfig.json': tsconfig,
    'eslint.config.mjs': eslintConfig,
    '.gitignore': gitignore,
    '.env.example': envExample(options),
    'README.md': readme(options),
    'src/server.ts': serverSource(options),
    'src/app.ts': appSource,
    'src/app/config/index.ts': configSource(options),
    'src/app/routes/index.ts': routesSource(options),
    'src/app/middlewares/globalErrorHandler.ts': errorHandlerSource(options),
    'src/app/middlewares/notFound.ts': notFoundSource,
    'src/app/utils/catchAsync.ts': catchAsyncSource,
    'src/app/utils/sendResponse.ts': sendResponseSource,
    'src/app/utils/routeParam.ts': routeParamSource,
  };

  Object.assign(files, sqlFiles(options));
  Object.assign(files, await readTemplateDir('core'));
  if (options.mongo) Object.assign(files, await readTemplateDir('mongo'));
  if (options.auth) Object.assign(files, await authTemplateFiles(options));
  return files;
}

export function starterModuleFiles(moduleName) {
  return ['controller', 'model', 'route', 'service', 'interface', 'validation']
    .map(type => `src/app/modules/${moduleName}/${moduleName}.${type}.ts`);
}
