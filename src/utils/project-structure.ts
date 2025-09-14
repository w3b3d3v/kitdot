import fs from "fs-extra";
import path from "path";
import { ProjectConfig } from "../types.js";

export async function createProjectStructure(
  config: ProjectConfig
): Promise<void> {
  await fs.ensureDir(config.directory);

  // For frontend-only projects, use single repo structure (no subdirectories)
  if (config.type === "frontend") {
    // Frontend-only projects don't need subdirectories
    // Template will be loaded directly to project root
    return;
  }

  // For fullstack and backend projects, create monorepo structure
  const folders = [];

  if (config.features.contracts) {
    folders.push("contracts");
  }

  if (config.features.frontend) {
    folders.push("front");
  }

  if (config.features.documentation) {
    folders.push("docs");
  }

  for (const folder of folders) {
    await fs.ensureDir(path.join(config.directory, folder));
  }

  await createRootPackageJson(config);
  await createGitignore(config);
  await createReadme(config);
}

async function createRootPackageJson(config: ProjectConfig): Promise<void> {
  // Frontend-only projects don't need root package.json - template provides it
  if (config.type === "frontend") {
    return;
  }

  const packageJson = {
    name: config.name,
    version: "0.1.0",
    description: "A Polkadot Dapp built with kitdot",
    private: true,
    type: "module",
    workspaces: getWorkspaces(config),
    scripts: {
      "install:all": "npm install",
      "build:all": "npm run build --workspaces",
      "lint:all": "npm run lint --workspaces",
      "test:all": "npm run test --workspaces",
    },
    devDependencies: {
      "@types/node": "^22.16.2",
      typescript: "^5.6.2",
    },
    engines: {
      node: ">=18.0.0",
      npm: ">=8.0.0",
    },
  };

  await fs.writeJson(path.join(config.directory, "package.json"), packageJson, {
    spaces: 2,
  });
}

function getWorkspaces(config: ProjectConfig): string[] {
  const workspaces = [];

  if (config.features.contracts) {
    workspaces.push("contracts");
  }

  if (config.features.frontend) {
    workspaces.push("front");
  }

  return workspaces;
}

async function createGitignore(config: ProjectConfig): Promise<void> {
  // Frontend-only projects should use template's gitignore
  if (config.type === "frontend") {
    return;
  }

  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Cache
.cache/
.parcel-cache/

# Contracts
contracts/out/
contracts/cache/
contracts/artifacts/
contracts/typechain-types/

# Documentation
docs/book/`;

  await fs.writeFile(
    path.join(config.directory, ".gitignore"),
    gitignoreContent
  );
}

async function createReadme(config: ProjectConfig): Promise<void> {
  // Frontend-only projects should use template's README
  if (config.type === "frontend") {
    return;
  }

  const readmeContent = `# ${config.name}

A Polkadot Dapp built with [kitdot](https://github.com/your-org/kitdot).

## Project Structure

${
  config.features.contracts
    ? `
### 📄 Smart Contracts
- \`contracts/\` - Smart contract development and deployment
`
    : ""
}

${
  config.features.frontend
    ? `
### 🎨 Frontend
- \`front/\` - React frontend application with Polkadot integration
`
    : ""
}

${
  config.features.documentation
    ? `
### 📚 Documentation
- \`docs/\` - Project documentation built with mdbook
`
    : ""
}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm run install:all
   \`\`\`

${
  config.features.frontend
    ? `
2. Start the frontend development server:
   \`\`\`bash
   cd front
   npm run dev
   \`\`\`
`
    : ""
}

${
  config.features.contracts
    ? `
3. Build smart contracts:
   \`\`\`bash
   cd contracts
   forge build
   \`\`\`
`
    : ""
}

${
  config.features.documentation
    ? `
4. View documentation:
   \`\`\`bash
   cd docs
   mdbook serve
   \`\`\`
`
    : ""
}

## Commands

- \`npm run build:all\` - Build all packages
- \`npm run lint:all\` - Lint all packages  
- \`npm run test:all\` - Test all packages

## Built with kitdot

This project was created using [kitdot](https://github.com/your-org/kitdot), a toolkit for building Dapps on Polkadot Cloud.
`;

  await fs.writeFile(path.join(config.directory, "README.md"), readmeContent);
}
