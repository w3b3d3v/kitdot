# kitdot

A TypeScript SDK toolkit for building Dapps on Polkadot Cloud - inspired by Hardhat's developer experience.

## Features

🚀 **Quick Project Setup** - Initialize Polkadot Dapp projects in seconds
🎨 **Frontend Templates** - Official Parity and social login React templates
⚙️ **Smart Contracts** - Hardhat setup for Solidity development
📚 **Documentation** - Auto-generated docs with mdbook
🔧 **Developer Tools** - Rust toolchain management and status checking

## Installation

```bash
npm install -g kitdot
```

## Quick Start

Create a new Polkadot Dapp:

```bash
npx kitdot init my-polkadot-dapp
cd my-polkadot-dapp
```

The CLI will guide you through setting up:

- **Full-stack Dapp** - Frontend + Smart Contracts
- **Frontend only** - React app for Polkadot
- **Backend only** - Smart Contracts only

## Project Structure

```
my-polkadot-dapp/
├── contracts/            # Hardhat smart contracts
├── frontend/             # React frontend with Polkadot integration
├── docs/                 # mdbook documentation
└── package.json          # Monorepo configuration
```

## Commands

```bash
npx kitdot init [project-name]    # Initialize new project
npx kitdot tools install-rust     # Install Rust toolchain
npx kitdot tools check           # Check tool status
```

## Development Workflow

1. **Initialize**: `kitdot init my-dapp`
2. **Install Dependencies**: `cd contracts && npm install`
3. **Develop Contracts**: `cd contracts && npm run compile`
4. **Frontend Dev**: `cd frontend && npm run dev`
5. **Documentation**: `cd docs && mdbook serve`

## Technology Stack

### Smart Contracts

- **Hardhat** - Ethereum development environment for contracts and deployment
- **Solidity** - Smart contract programming language
- **OpenZeppelin** - Secure smart contract library

### Frontend

- **React** - Modern UI library with TypeScript
- **Polkadot Integration** - Web3 connectivity for Polkadot ecosystem
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Development Tools

- **Rust** - Required for Polkadot development
- **TypeScript** - Type-safe development
- **Jest** - Testing framework

### Documentation

- **mdbook** - Modern documentation tool
- **Markdown** - Simple, readable documentation format

## Templates

kitdot includes production-ready templates:

- **Basic Polkadot DApp** - Official Parity template with React + Solidity + Hardhat
- **Social Login Web3 React** - Web3Auth integration for seamless user experience
- **Comprehensive Documentation** - Guides and API references

## License

MIT License - see [LICENSE](LICENSE) for details.
