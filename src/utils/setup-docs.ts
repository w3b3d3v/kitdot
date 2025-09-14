import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types.js';

export async function setupDocumentation(config: ProjectConfig): Promise<void> {
  const docsDir = path.join(config.directory, 'docs');
  
  await createMdBookConfig(docsDir, config);
  await createDocumentationStructure(docsDir, config);
  await createSummary(docsDir, config);
  await createDocumentationContent(docsDir, config);
}

async function createMdBookConfig(docsDir: string, config: ProjectConfig): Promise<void> {
  const bookToml = `[book]
title = "${config.name} Documentation"
description = "Documentation for ${config.name} - A Polkadot Dapp built with kit-dot"
authors = ["${config.name} Team"]
language = "en"
multilingual = false
src = "src"

[output.html]
default-theme = "navy"
preferred-dark-theme = "navy"
git-repository-url = "https://github.com/your-org/${config.name}"
edit-url-template = "https://github.com/your-org/${config.name}/edit/main/docs/{path}"

[output.html.playground]
copyable = true

[output.html.search]
enable = true
limit-results = 30
teaser-word-count = 30
use-boolean-and = true
boost-title = 2
boost-hierarchy = 1
boost-paragraph = 1
expand = true
heading-split-level = 3`;

  await fs.writeFile(path.join(docsDir, 'book.toml'), bookToml);
}

async function createDocumentationStructure(docsDir: string, config: ProjectConfig): Promise<void> {
  const srcDir = path.join(docsDir, 'src');
  await fs.ensureDir(srcDir);
  
  if (config.features.contracts) {
    await fs.ensureDir(path.join(srcDir, 'contracts'));
  }
  
  if (config.features.frontend) {
    await fs.ensureDir(path.join(srcDir, 'frontend'));
  }
  

  await fs.ensureDir(path.join(srcDir, 'deployment'));
  await fs.ensureDir(path.join(srcDir, 'guides'));
}

async function createSummary(docsDir: string, config: ProjectConfig): Promise<void> {
  let summary = `# Summary

[Introduction](./introduction.md)

# Getting Started

- [Quick Start](./getting-started/quick-start.md)
- [Project Structure](./getting-started/project-structure.md)
- [Development Setup](./getting-started/development-setup.md)

`;

  if (config.features.contracts) {
    summary += `# Smart Contracts

- [Overview](./contracts/overview.md)
- [Development with Foundry](./contracts/development.md)
- [Deployment with Hardhat](./contracts/deployment.md)
- [UUPS Upgrades](./contracts/upgrades.md)

`;
  }

  if (config.features.frontend) {
    summary += `# Frontend

- [Overview](./frontend/overview.md)
- [Getting Started](./frontend/getting-started.md)
- [Components](./frontend/components.md)
- [Polkadot Integration](./frontend/polkadot-integration.md)

`;
  }


  summary += `# Deployment

- [Overview](./deployment/overview.md)
- [Environment Setup](./deployment/environment-setup.md)
- [Production Deployment](./deployment/production.md)

# Guides

- [Contributing](./guides/contributing.md)
- [Troubleshooting](./guides/troubleshooting.md)
- [FAQ](./guides/faq.md)
`;

  await fs.writeFile(path.join(docsDir, 'src/SUMMARY.md'), summary);
}

async function createDocumentationContent(docsDir: string, config: ProjectConfig): Promise<void> {
  const srcDir = path.join(docsDir, 'src');

  const introduction = `# ${config.name}

Welcome to the documentation for **${config.name}**, a Polkadot Dapp built with [kit-dot](https://github.com/your-org/kit-dot).

## What is ${config.name}?

${config.name} is a decentralized application (Dapp) built for the Polkadot ecosystem. This project was scaffolded using kit-dot, a TypeScript SDK toolkit that provides everything you need to build modern, scalable Dapps on Polkadot Cloud.

## Features

${config.features.contracts ? '- **Smart Contracts**: Upgradeable smart contracts using UUPS pattern with Foundry and Hardhat' : ''}
${config.features.frontend ? '- **Frontend**: Modern React application with Polkadot integration' : ''}
- **Documentation**: Comprehensive documentation built with mdbook

## Architecture

This project follows a monorepo structure with clear separation of concerns:

${config.features.contracts ? `
### Smart Contracts
- \`contracts/develop/\` - Contract development with Foundry
- \`contracts/deploy/\` - Deployment scripts with Hardhat
` : ''}

${config.features.frontend ? `
### Frontend
- \`front/\` - React application with TypeScript and Tailwind CSS
` : ''}


## Getting Started

To get started with ${config.name}, follow the [Quick Start Guide](./getting-started/quick-start.md).

## Built with kit-dot

This project was created using kit-dot, which provides:

- 🚀 **Rapid scaffolding** of Polkadot Dapp projects
- 🔧 **Development tools** for smart contracts and frontend
- 📦 **Template management** with best practices
- 🌐 **Cloud integration** for scalable deployments
- 📚 **Documentation** generation and management

Learn more about kit-dot in the [official documentation](https://github.com/your-org/kit-dot).
`;

  await fs.writeFile(path.join(srcDir, 'introduction.md'), introduction);

  await fs.ensureDir(path.join(srcDir, 'getting-started'));
  
  const quickStart = `# Quick Start

This guide will help you get ${config.name} up and running in minutes.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
${config.features.contracts ? '- [Foundry](https://getfoundry.sh/) (for smart contract development)' : ''}

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-org/${config.name}.git
   cd ${config.name}
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm run install:all
   \`\`\`

## Development

${config.features.frontend ? `
### Frontend Development

1. Navigate to the frontend directory:
   \`\`\`bash
   cd front
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.
` : ''}

${config.features.contracts ? `
### Smart Contract Development

1. Navigate to the contracts development directory:
   \`\`\`bash
   cd contracts/develop
   \`\`\`

2. Build the contracts:
   \`\`\`bash
   forge build
   \`\`\`

3. Run tests:
   \`\`\`bash
   forge test
   \`\`\`
` : ''}


## Next Steps

- Read the [Project Structure](./project-structure.md) guide
- Follow the [Development Setup](./development-setup.md) instructions
${config.features.contracts ? '- Learn about [Smart Contract Development](../contracts/development.md)' : ''}
${config.features.frontend ? '- Explore [Frontend Development](../frontend/getting-started.md)' : ''}
`;

  await fs.writeFile(path.join(srcDir, 'getting-started/quick-start.md'), quickStart);

  if (config.features.contracts) {
    await createContractsDocs(srcDir);
  }

  if (config.features.frontend) {
    await createFrontendDocs(srcDir);
  }

}

async function createContractsDocs(srcDir: string): Promise<void> {
  const contractsOverview = `# Smart Contracts Overview

This project uses a dual-setup approach for smart contract development:

- **Foundry** for development, testing, and local deployment
- **Hardhat** for production deployment to Polkadot networks

## Architecture

### UUPS Upgradeable Contracts

All contracts in this project use the UUPS (Universal Upgradeable Proxy Standard) pattern, which provides:

- **Upgradeability**: Contracts can be upgraded while preserving state
- **Gas Efficiency**: Lower deployment costs compared to transparent proxies
- **Security**: Upgrade authorization is built into the implementation

### Development Workflow

1. **Develop** contracts in \`contracts/develop/\` using Foundry
2. **Test** thoroughly with Foundry's testing framework
3. **Deploy** to testnets using Hardhat scripts in \`contracts/deploy/\`
4. **Verify** contracts on block explorers
5. **Upgrade** when needed using the UUPS pattern

## Getting Started

See the [Development Guide](./development.md) to start building smart contracts.
`;

  await fs.writeFile(path.join(srcDir, 'contracts/overview.md'), contractsOverview);
}

async function createFrontendDocs(srcDir: string): Promise<void> {
  const frontendOverview = `# Frontend Overview

The frontend is a modern React application built with TypeScript and Tailwind CSS, designed for seamless integration with Polkadot networks.

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Wagmi** - React hooks for Ethereum (compatible with Polkadot Hub)
- **Viem** - TypeScript interface for Ethereum
- **Vite** - Fast development and build tool

## Key Features

- **Wallet Integration**: Connect to MetaMask and other wallets
- **Contract Interaction**: Read and write to smart contracts
- **Responsive Design**: Mobile-first responsive interface
- **Type Safety**: Full TypeScript coverage
- **Hot Reload**: Fast development with Vite

## Getting Started

See the [Getting Started Guide](./getting-started.md) to begin frontend development.
`;

  await fs.writeFile(path.join(srcDir, 'frontend/overview.md'), frontendOverview);
}

