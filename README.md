# Express Modular CLI

A command-line interface tool for generating and managing modular Express.js applications with TypeScript support.

## Features

✨ Modular project structure
🚀 Quick scaffolding of components
📝 TypeScript support out of the box
🔄 Automatic route registration
🎨 Template-based code generation
📝 Built-in logging system
🛡️ ESLint configuration included
🔧 Configurable templates

## Installation

```bash
npm install -g express-modular-cli
```

## Commands

### Create New Project

Create a new Express.js project with a modular structure:

```bash
exm-cli new <project-name>
```

This command:
- Creates project structure
- Sets up TypeScript configuration
- Installs dependencies
- Initializes Git repository

### Generate Components

Generate new components using:

```bash
exm-cli generate <type> <name>
# or using the shorthand
exm-cli g <type> <name>
```

### Available Component Types

| Type       | Shorthand | Description               |
|------------|-----------|---------------------------|
| module     | mo        | Complete module with components |
| controller | c         | Controller file           |
| service    | s         | Service file             |
| model      | m         | Mongoose model           |
| interface  | i         | TypeScript interface     |
| validation | v         | Validation schema        |
| route      | r         | Route definitions        |

### Module Generation

When generating a complete module, it creates all necessary components:

```bash
exm-cli g module user
```

This creates:
- user.controller.ts
- user.service.ts
- user.model.ts
- user.interface.ts
- user.validation.ts
- user.route.ts

## Project Structure

```
src/
  ├── app/
  │   ├── modules/
  │   │   └── [module-name]/
  │   │       ├── [name].controller.ts
  │   │       ├── [name].service.ts
  │   │       ├── [name].model.ts
  │   │       ├── [name].interface.ts
  │   │       ├── [name].validation.ts
  │   │       └── [name].route.ts
  │   └── routes/
  │       └── index.ts
  ├── utils/
  ├── app.ts
  └── server.ts
```

## Contributing

Contributions are welcome! Please follow our contribution guidelines.
