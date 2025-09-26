// Enhanced template system with context detection
// Determines if we're in a full project or standalone generation

import * as path from 'path';
import * as fs from './fs';

export interface TemplateContext {
  name: string;
  m_name: string; // Capitalized version of name
  isProjectContext?: boolean; // Whether we're in a full project setup
}

export interface ProjectContext {
  hasUtils: boolean;
  hasCatchAsync: boolean;
  hasSendResponse: boolean;
  hasModels: boolean;
  packageJsonExists: boolean;
}

// Detect project context
export async function detectProjectContext(basePath: string = process.cwd()): Promise<ProjectContext> {
  const context: ProjectContext = {
    hasUtils: false,
    hasCatchAsync: false,
    hasSendResponse: false,
    hasModels: false,
    packageJsonExists: false,
  };

  try {
    // Check for package.json
    context.packageJsonExists = await fs.pathExists(path.join(basePath, 'package.json'));

    // Check for utils directory
    const utilsPath = path.join(basePath, 'src', 'app', 'utils');
    context.hasUtils = await fs.pathExists(utilsPath);

    // Check for specific utility files
    if (context.hasUtils) {
      context.hasCatchAsync = await fs.pathExists(path.join(utilsPath, 'catchAsync.ts')) ||
        await fs.pathExists(path.join(utilsPath, 'catchAsync.js'));

      context.hasSendResponse = await fs.pathExists(path.join(utilsPath, 'sendResponse.ts')) ||
        await fs.pathExists(path.join(utilsPath, 'sendResponse.js'));
    }

    // Check for app structure
    const appPath = path.join(basePath, 'src', 'app');
    const hasAppStructure = await fs.pathExists(appPath);

    context.hasModels = hasAppStructure;

  } catch (error) {
    // If we can't detect context, assume standalone
    console.warn('Warning: Could not fully detect project context, using standalone templates');
  }

  return context;
}

export const templates = {
  controller: ({ name, m_name }: TemplateContext, projectContext: ProjectContext): string => {
    if (projectContext.hasCatchAsync && projectContext.hasSendResponse) {
      // Full project with utilities
      return `import catchAsync from '../../utils/catchAsync';
import { ${m_name}Service } from './${name}.service';
import { sendResponse } from '../../utils/sendResponse';

const create = catchAsync(async (req, res) => {
  const result = await ${m_name}Service.create(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: '${m_name} created successfully',
    data: result,
  });
});

const findAll = catchAsync(async (_req, res) => {
  const result = await ${m_name}Service.findAll();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${m_name} retrieved successfully',
    data: result,
  });
});

const findOne = catchAsync(async (req, res) => {
  const result = await ${m_name}Service.findOne(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${m_name} retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req, res) => {
  const result = await ${m_name}Service.update(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${m_name} updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req, res) => {
  await ${m_name}Service.remove(req.params.id);

  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: '${m_name} deleted successfully',
    data: {},
  });
});

export const ${m_name}Controller = {
    create,
    findAll,
    findOne,
    update,
    remove,
};
`;
    }

    // Standalone or basic project - self-contained controller
    return `import { Request, Response, NextFunction } from 'express';
// Note: Import ${m_name}Service when you create the service file
// import { ${m_name}Service } from './${name}.service';

// Simple response helper - replace with your preferred response utility
const sendResponse = (res: Response, options: {
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
}) => {
  res.status(options.statusCode).json({
    success: options.success,
    message: options.message,
    data: options.data,
  });
};

// Simple async wrapper - replace with your preferred error handling
const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const create = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement ${m_name}Service.create or add your logic here
  const result = { id: 1, message: '${m_name} created' }; // Replace with actual service call

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: '${m_name} created successfully',
    data: result,
  });
});

const findAll = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement ${m_name}Service.findAll or add your logic here
  const result = []; // Replace with actual service call

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${m_name} retrieved successfully',
    data: result,
  });
});

const findOne = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement ${m_name}Service.findOne or add your logic here
  const result = { id: req.params.id }; // Replace with actual service call

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${m_name} retrieved successfully',
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement ${m_name}Service.update or add your logic here
  const result = { id: req.params.id, ...req.body }; // Replace with actual service call

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: '${m_name} updated successfully',
    data: result,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  // TODO: Implement ${m_name}Service.remove or add your logic here
  // Replace with actual service call

  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: '${m_name} deleted successfully',
    data: {},
  });
});

export const ${m_name}Controller = {
    create,
    findAll,
    findOne,
    update,
    remove,
};
`;
  },

  service: ({ name, m_name }: TemplateContext, projectContext: ProjectContext): string => {
    if (projectContext.hasModels) {
      // Full project with models
      return `import { T${m_name} } from './${name}.interface';
// Note: Import ${m_name}Model when you create the model file
// import { ${m_name}Model } from './${name}.model';

const create = async (data: T${m_name}) => {
  // TODO: Replace with actual model call
  // return await ${m_name}Model.create(data);
  return { id: Date.now(), ...data };
};

const findAll = async () => {
  // TODO: Replace with actual model call
  // return await ${m_name}Model.find();
  return [];
};

const findOne = async (id: string) => {
  // TODO: Replace with actual model call
  // return await ${m_name}Model.findById(id);
  return { id };
};

const update = async (id: string, data: Partial<T${m_name}>) => {
  // TODO: Replace with actual model call
  // return await ${m_name}Model.findByIdAndUpdate(id, data, { new: true });
  return { id, ...data };
};

const remove = async (id: string) => {
  // TODO: Replace with actual model call
  // await ${m_name}Model.findByIdAndDelete(id);
  console.log(\`Deleting ${m_name} with id: \${id}\`);
};

export const ${m_name}Service = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
`;
    }

    // Basic service without models
    return `import { T${m_name} } from './${name}.interface';

// Simple in-memory storage for demonstration - replace with your database
let ${name}Storage: T${m_name}[] = [];
let nextId = 1;

const create = async (data: T${m_name}): Promise<T${m_name} & { id: number }> => {
  const new${m_name} = { id: nextId++, ...data };
  ${name}Storage.push(new${m_name});
  return new${m_name};
};

const findAll = async (): Promise<(T${m_name} & { id: number })[]> => {
  return ${name}Storage;
};

const findOne = async (id: string): Promise<(T${m_name} & { id: number }) | null> => {
  return ${name}Storage.find(item => item.id === parseInt(id)) || null;
};

const update = async (id: string, data: Partial<T${m_name}>): Promise<(T${m_name} & { id: number }) | null> => {
  const index = ${name}Storage.findIndex(item => item.id === parseInt(id));
  if (index === -1) return null;

  ${name}Storage[index] = { ...${name}Storage[index], ...data };
  return ${name}Storage[index];
};

const remove = async (id: string): Promise<boolean> => {
  const index = ${name}Storage.findIndex(item => item.id === parseInt(id));
  if (index === -1) return false;

  ${name}Storage.splice(index, 1);
  return true;
};

export const ${m_name}Service = {
  create,
  findAll,
  findOne,
  update,
  remove,
};
`;
  },

  model: ({ name, m_name }: TemplateContext): string => `import { model, Schema } from 'mongoose';
import { T${m_name} } from './${name}.interface';

const ${name}Schema = new Schema<T${m_name}>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  // Add more fields as needed
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

export const ${m_name}Model = model<T${m_name}>('${m_name}', ${name}Schema);
`,

  interface: ({ m_name }: TemplateContext): string => `export interface T${m_name} {
  name: string;
  // Add more properties as needed
}
`,

  route: ({ name, m_name }: TemplateContext): string => `import { Router } from 'express';
import { ${m_name}Controller } from './${name}.controller';

const router = Router();

router.post('/', ${m_name}Controller.create);
router.get('/', ${m_name}Controller.findAll);
router.get('/:id', ${m_name}Controller.findOne);
router.put('/:id', ${m_name}Controller.update);
router.delete('/:id', ${m_name}Controller.remove);

export const ${m_name}Routes = router;
`,

  validation: ({ m_name }: TemplateContext): string => `// Using Zod for validation - install with: npm install zod
// Alternative: Use Joi, express-validator, or your preferred validation library
import { z } from 'zod';

const create${m_name}ValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }).min(1, 'Name cannot be empty'),
  }),
});

const update${m_name}ValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

const get${m_name}ValidationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

export const ${m_name}Validation = {
  create${m_name}ValidationSchema,
  update${m_name}ValidationSchema,
  get${m_name}ValidationSchema,
};

// Validation middleware helper
export const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error instanceof z.ZodError ? error.errors : [error],
    });
  }
};
`,
};

// Get template function by type with context
export function getTemplate(type: string): ((context: TemplateContext, projectContext: ProjectContext) => string) | null {
  return templates[type as keyof typeof templates] || null;
}

// Generate content using template function with context detection
export async function generateFromTemplate(type: string, context: TemplateContext): Promise<string> {
  const projectContext = await detectProjectContext();
  const template = getTemplate(type);

  if (!template) {
    throw new Error(`Template not found for type: ${type}`);
  }

  return template(context, projectContext);
}

export default templates;