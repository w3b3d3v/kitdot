# kitdot

A TypeScript SDK toolkit for building Dapps on Polkadot Cloud - inspired by Hardhat's developer experience.

## Features

🚀 **Quick Project Setup** - Initialize Polkadot Dapp projects in seconds with `kitdot install`
🎨 **React + Solidity Templates** - Production-ready templates with Vite, Tailwind CSS, and wagmi
⚙️ **Smart Contracts** - Hardhat setup for Solidity development on Polkadot Asset Hub
📋 **AI Development Guide** - Integrated AGENTS.md for LLM-assisted development
🔧 **Developer Tools** - Rust toolchain management and status checking
🌐 **Polkadot Integration** - Pre-configured for Paseo testnet with proper network settings

## Installation

### Global Installation (Recommended)

```bash
npm install -g kitdot
```

After global installation, you can use `kitdot` directly without `npx`:

```bash
kitdot init my-polkadot-dapp    # No npx needed!
```

### Using npx (No Installation)

```bash
npx kitdot init my-polkadot-dapp
```

## Quick Start

# Quick start with default template

kitdot install -y my-app

```

The CLI will guide you through setting up:

- **Full-stack Dapp** - React frontend + Solidity contracts + Hardhat
- **Frontend only** - React app with wagmi for Polkadot interaction
- **Backend only** - Smart contracts with Hardhat development environment

## Project Structure

```

my-polkadot-dapp/
├── contracts/ # Hardhat smart contracts (Solidity)
│ ├── contracts/ # Smart contract source files
│ ├── ignition/ # Hardhat Ignition deployment modules
│ ├── test/ # Contract tests
│ └── hardhat.config.ts # Hardhat configuration for Polkadot
├── frontend/ # React frontend with Polkadot integration
│ ├── src/ # React TypeScript source
│ ├── src/generated.ts # Auto-generated contract types
│ └── wagmi.config.ts # wagmi configuration for Polkadot
├── AGENTS.md # AI development guide for LLMs
└── README.md # Project-specific documentation

````

## Commands

```bash
# Project Creation
kitdot install [project-name]     # Create new project (recommended)
kitdot init [project-name]        # Alternative to install command
kitdot install -y [project-name]  # Use default template without prompts

# Development Tools
kitdot tools install-rust         # Install Rust toolchain
kitdot tools check               # Check tool status

# Help
kitdot --help                    # Show all available commands
kitdot init --help               # Show specific command help
````

> **Note**: Replace `kitdot` with `npx kitdot` if you haven't installed globally.

## Development Workflow

### 1. Create Project

```bash
kitdot install my-dapp
cd my-dapp
```

### 2. Smart Contract Development

```bash
cd contracts
npm install
npx hardhat compile                    # Compile contracts
npx hardhat test                       # Run tests
npx hardhat ignition deploy ./ignition/modules/MyToken.ts --network passetHub
```

### 3. Frontend Development

```bash
cd frontend
npm install
npm run generate                       # Generate contract types from deployed contracts
npm run dev                           # Start development server
```

### 4. Environment Setup

```bash
# Set up private key for contract deployment
npx hardhat vars set PRIVATE_KEY       # In contracts directory

# Get testnet tokens
# Visit: https://faucet.polkadot.io/?parachain=1111
```

## Technology Stack

### Smart Contracts

- **Hardhat** - Development environment with Polkadot support via `@parity/hardhat-polkadot`
- **Solidity ^0.8.28** - Smart contract programming language (required version)
- **Hardhat Ignition** - Modern deployment system with dependency management
- **Polkadot Asset Hub** - Target network for smart contract deployment

### Frontend

- **React 18** - Modern UI library with TypeScript
- **wagmi** - React hooks for Ethereum/Polkadot contract interaction
- **Viem** - TypeScript interface for Ethereum-compatible chains
- **Tailwind CSS** - Utility-first CSS framework with Tailwind UI components
- **Vite** - Fast build tool and development server

## Templates

kitdot includes production-ready templates:

### Default Template

- **React + Solidity + Hardhat** - Full-stack template with:
  - React 18 frontend with TypeScript and Tailwind CSS
  - Solidity smart contracts with OpenZeppelin integration
  - Hardhat development environment configured for Polkadot
  - wagmi hooks for contract interaction
  - Pre-configured for Paseo testnet deployment
  - Example ERC-20 token contract (MyToken.sol)

### AI Development Support

- **AGENTS.md** - Comprehensive guide for LLM-assisted development
- **400+ line developer guide** with:
  - Network configurations and deployment instructions
  - Security patterns and best practices
  - Troubleshooting checklists and common solutions
  - Recommended development workflows

## License

MIT License - see [LICENSE](LICENSE) for details.
