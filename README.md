# Express Modular CLI

A powerful CLI tool for generating modular Express.js projects and components with TypeScript support.

## 📦 Installation

Install globally via npm to use the CLI from anywhere:

```bash
npm install -g express-modular-cli
```

## 🚀 Quick Start

### 1. Create a New Project

```bash
exm-cli new my-express-app
cd my-express-app
```

This command will:
- ✅ Create a complete Express.js project structure
- ✅ Install all required dependencies
- ✅ Initialize git repository with initial commit
- ✅ Set up TypeScript configuration with path aliases
- ✅ Configure development and production scripts

### 2. Generate Components

Once inside a project, generate individual components:

```bash
# Generate a complete user module
exm-cli g module user

# Or generate individual components
exm-cli g controller user
exm-cli g service user
exm-cli g route user
```

## 📚 Commands

### `new <project-name>`

Creates a new Express.js project with modern architecture.

```bash
exm-cli new my-api
```

**What it does:**
- Downloads the latest Express.js boilerplate
- Sets up modular project structure
- Installs dependencies automatically
- Configures TypeScript with path aliases
- Initializes git repository

### `generate <type> <name>` (alias: `g`)

Generates individual components within an existing project.

```bash
# Generate a controller
exm-cli generate controller product
exm-cli g controller product  # Short alias

# Generate a service
exm-cli g service product

# Generate a complete module (all files)
exm-cli g module product
```

## 🧩 Component Types

### `controller`
Generates Express.js route controllers with CRUD operations.

```bash
exm-cli g controller user
```

**Generated file:** `src/app/modules/user/user.controller.ts`

**Features:**
- ✅ Complete CRUD operations (create, read, update, delete)
- ✅ Proper error handling with catchAsync
- ✅ Response formatting with sendResponse
- ✅ TypeScript types and interfaces
- ✅ Path aliases for clean imports

### `service`
Creates business logic services with data access layer.

```bash
exm-cli g service user
```

**Generated file:** `src/app/modules/user/user.service.ts`

**Features:**
- ✅ Service layer pattern implementation
- ✅ Interface-based data operations
- ✅ Ready for database integration
- ✅ TypeScript support with proper typing

### `model`
Generates data models with schema definitions.

```bash
exm-cli g model user
```

**Generated file:** `src/app/modules/user/user.model.ts`

**Features:**
- ✅ Mongoose schema definition
- ✅ Model methods and statics
- ✅ TypeScript interface integration
- ✅ Validation rules and middleware

### `route`
Creates Express.js route definitions with middleware.

```bash
exm-cli g route user
```

**Generated file:** `src/app/modules/user/user.route.ts`

**Features:**
- ✅ RESTful route structure
- ✅ Controller method binding
- ✅ Middleware integration points
- ✅ Automatic route registration

### `validation`
Generates input validation schemas.

```bash
exm-cli g validation user
```

**Generated file:** `src/app/modules/user/user.validation.ts`

**Features:**
- ✅ Zod validation schemas
- ✅ Request body validation
- ✅ Parameter validation
- ✅ Type-safe validation rules

### `interface`
Creates TypeScript interfaces and types.

```bash
exm-cli g interface user
```

**Generated file:** `src/app/modules/user/user.interface.ts`

**Features:**
- ✅ TypeScript interface definitions
- ✅ Data transfer objects (DTOs)
- ✅ Type exports for reusability
- ✅ Model integration types

### `module`
Generates all component files for a complete module.

```bash
exm-cli g module user
```

**Generated files:**
- `user.controller.ts` - Route controllers
- `user.service.ts` - Business logic
- `user.model.ts` - Data models
- `user.route.ts` - Route definitions
- `user.validation.ts` - Input validation
- `user.interface.ts` - TypeScript types

**Additional features:**
- ✅ Automatic route registration in main router
- ✅ All files properly interconnected
- ✅ Ready-to-use module structure

## 🏗️ Project Structure

The CLI generates projects with a clean, modular architecture:

```
my-express-app/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   └── user/
│   │   │       ├── user.controller.ts
│   │   │       ├── user.service.ts
│   │   │       ├── user.model.ts
│   │   │       ├── user.route.ts
│   │   │       ├── user.validation.ts
│   │   │       └── user.interface.ts
│   │   ├── routes/
│   │   │   └── index.ts          # Route aggregation
│   │   ├── utils/
│   │   │   ├── catchAsync.ts     # Error handling
│   │   │   ├── sendResponse.ts   # Response formatting
│   │   │   └── ...               # Other utilities
│   │   └── app.ts                # Express app configuration
│   └── server.ts                 # Server startup
├── package.json
├── tsconfig.json                 # TypeScript config with path aliases
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Smart Features

### Context-Aware Generation
The CLI automatically detects your project environment:

**Inside Project:**
- Uses existing project utilities (`catchAsync`, `sendResponse`)
- Imports with path aliases (`@/app/utils/...`)
- Integrates with existing route structure

**Outside Project:**
- Includes inline utility functions
- Works as standalone files
- No external dependencies required

### Path Alias Support
Generated code uses modern TypeScript path aliases:

```typescript
// Clean imports with path aliases
import catchAsync from '@/app/utils/catchAsync';
import { sendResponse } from '@/app/utils/sendResponse';

// Module-level relative imports
import { UserService } from './user.service';
```

### Automatic Route Registration
When generating modules or routes, the CLI automatically updates the main router:

```typescript
// Automatically added to src/app/routes/index.ts
import { UserRoutes } from "../modules/user/user.route";

const moduleRoutes = [
  { path: "/user", route: UserRoutes },
  // Your new routes are automatically registered here
];
```

## 🛠️ Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Comes with Node.js
- **Git**: Required for project creation (downloads boilerplate)

## 🔍 Validation & Error Handling

The CLI includes robust validation:

### Project Structure Validation
```bash
❌ Error: Not in a valid Express project directory

Missing required structure:
  - src/app
  - src/app/modules
  - src/app/routes

Suggestions:
  • Create a new project first using: exm-cli new <project-name>
  • Or run this command from within an existing Express project directory
```

### Component Existence Check
```bash
❌ Error: controller user already exists
```

### Input Validation
- Project names must be valid npm package names
- Component names must be valid identifiers
- Component types must be supported

## 🚨 Troubleshooting

### Command Not Found
```bash
# Check if installed globally
npm list -g express-modular-cli

# If not found, reinstall
npm install -g express-modular-cli
```

### Permission Issues
```bash
# On macOS/Linux, you might need sudo
sudo npm install -g express-modular-cli

# Or configure npm to use a different directory
npm config set prefix ~/.local
```

### Git Issues
```bash
# Ensure git is installed and configured
git --version
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Network Issues
If project creation fails:
- Check internet connection
- Verify access to GitHub
- Try again (temporary network issues)

## 💡 Tips & Best Practices

### 1. Always Create Project First
```bash
# ✅ Correct workflow
exm-cli new my-api
cd my-api
exm-cli g controller user

# ❌ Wrong - will generate standalone files
exm-cli g controller user  # Outside project
```

### 2. Use Module Generation for Complete Features
```bash
# ✅ Generates all related files at once
exm-cli g module user

# ⚠️ Manual approach (more work)
exm-cli g controller user
exm-cli g service user
exm-cli g model user
exm-cli g route user
exm-cli g validation user
exm-cli g interface user
```

### 3. Follow RESTful Naming
```bash
# ✅ Good naming
exm-cli g module user
exm-cli g module product
exm-cli g module order

# ❌ Avoid plurals in component names
exm-cli g module users  # Will create usersController, etc.
```

## 📋 Examples

### Creating a Blog API
```bash
# 1. Create the project
exm-cli new blog-api
cd blog-api

# 2. Generate core modules
exm-cli g module user
exm-cli g module post
exm-cli g module comment

# 3. Generate additional components
exm-cli g controller auth
exm-cli g service email
```

### Creating an E-commerce API
```bash
# 1. Create the project
exm-cli new ecommerce-api
cd ecommerce-api

# 2. Generate main modules
exm-cli g module product
exm-cli g module category
exm-cli g module order
exm-cli g module user
exm-cli g module cart
```

## 📄 License

MIT License - see LICENSE file for details.

## 🐛 Issues & Support

Found a bug or need help? [Create an issue](https://github.com/abir-islam-z/express-cli/issues) on GitHub.

---

**Happy coding! 🚀** Build amazing Express.js APIs with the power of modular architecture.
