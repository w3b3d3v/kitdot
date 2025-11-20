# kitdot

A TypeScript SDK toolkit for building Dapps on Polkadot Cloud - inspired by Hardhat's developer experience.

## Features

- 🚀 **Quick Project Setup** - Initialize Polkadot Dapp projects in seconds with `kitdot install`
- 🔐 **Web3Auth Social Logins** - Seamless user onboarding with Google, GitHub, Discord, Twitter, and more. [Try the live demo →](https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/)
- 🎨 **React Templates** - Production-ready templates with Vite, Tailwind CSS, and wagmi
- ⚙️ **Smart Contracts** - Hardhat setup for Solidity development on Polkadot Asset Hub
- 📋 **AI Development Guide** - Integrated AGENTS.md for LLM-assisted development
- 🔧 **Developer Tools** - Rust toolchain management and status checking
- 🌐 **Polkadot Integration** - Pre-configured for Paseo testnet with proper network settings

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

### Recommended: Use Web3Auth Default Templates for Best User Experience

```bash
kitdot install -y my-app
```

**✨ Live Demo:** [https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/](https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/)

**Why Web3Auth?** No seed phrases, no private key management - users log in with Google, GitHub, or other social accounts they already use.

The CLI will guide you through setting up:

- **Frontend only** - React app with Web3Auth social logins + wagmi for Polkadot interaction
- **Full-stack Dapp** - React frontend with Web3Auth + Solidity contracts + Hardhat
- **Backend only** - Smart contracts with Hardhat development environment

## Project Structure

```
my-polkadot-dapp/
├── contracts/              # Hardhat smart contracts (Solidity)
│   ├── contracts/          # Smart contract source files
│   ├── ignition/           # Hardhat Ignition deployment modules
│   ├── test/               # Contract tests
│   └── hardhat.config.ts   # Hardhat configuration for Polkadot
├── frontend/               # React frontend with Polkadot integration
│   ├── src/                # React TypeScript source
│   ├── src/generated.ts    # Auto-generated contract types
│   └── wagmi.config.ts     # wagmi configuration for Polkadot
├── AGENTS.md               # AI development guide for LLMs
└── README.md               # Project-specific documentation
```

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
```

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

## Templates

kitdot includes production-ready templates:

### ⭐ Recommended: React + Web3Auth (Frontend Only)

- **Social Login Integration** - [Live Demo](https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/)
  - **Web3Auth** for seamless social logins (Google, GitHub, Discord, Twitter, etc.)
  - No seed phrases or private key management for users
  - React 18 frontend with TypeScript and Tailwind CSS
  - wagmi hooks for Polkadot interaction
  - Pre-configured for Paseo testnet
  - Modern, production-ready UX with social authentication

### Full-stack Template

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