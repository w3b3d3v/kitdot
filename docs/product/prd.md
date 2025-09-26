# kitdot: Developer Toolbox for Polkadot

## Overview

kitdot is a comprehensive developer toolbox CLI that handles all the messy setup for Polkadot development. It provides seamless Web2-to-Web3 user experiences and embedded development tools, enabling developers to build applications where users don't know they're using blockchain technology.

## Project Goals

### Core Mission

Enable developers to build Polkadot applications with the same ease as traditional web development, while providing users with familiar Web2 experiences backed by Web3 infrastructure.

### Key Objectives

**Developer Experience**

- One-command project initialization with complete toolchain setup
- Platform recognition and automatic dependency installation (Rust, etc.)
- Embedded development tools (polkadot-hardhat, Pop-CLI, Chopsticks)
- Dynamic template ecosystem with community contributions via GitHub

**User Experience Innovation**

- Seamless Google/social login with PolkaVM compatibility
- Metamask Multi-Party Computation wallet creation behind the scenes
- Zero wallet extension requirements for end users
- Invisible blockchain interaction for mainstream adoption

**Template Ecosystem**

- Official Parity create-polkadot-dapp integration
- Web3Auth templates with seamless PolkaVM integration
- Thirdweb's 130+ audited smart contracts as pre-built options
- NFT marketplaces, staking portals, DAO frameworks
- Community-driven template marketplace

**Embedded Tools Strategy**

- polkadot-hardhat for deploying Solidity contracts to PolkaVM
- Pop-CLI for spinning up local test chains
- Chopsticks for forking and reproducing full mainnet states locally
- Unified CLI interface abstracting away tool complexity

**Polkadot Cloud Services**

- Web3 Storage via IPFS and Crust Network (decentralized file storage)
- Web3 Hosting for decentralized website and dApp deployment
- Cloud Functions for serverless automation using Acurast
- Simplified Apillon SDK integration with Web2-familiar APIs
- Free tier: 3GB storage, 60GB monthly bandwidth for rapid prototyping

**AI Integration & MCP Server**

- Model Context Protocol (MCP) server for AI agents and LLMs
- Enables code agents to use kitdot for automated application development
- Programmatic access to all kitdot features (init, templates, deploy)
- AI-assisted development workflows and intelligent project scaffolding
- Integration with Claude Code, Cursor, and other AI development tools

## Problem Statement

**Tool Fragmentation**: Developers must learn and manage 10+ different tools
**User Experience Barriers**: Complex wallet setup prevents mainstream adoption
**Setup Complexity**: Hours of configuration before first deployment
**Cloud Service Complexity**: Integrating Web3 storage, hosting, and functions requires deep blockchain knowledge
**AI Agent Limitations**: Current code agents lack access to comprehensive Web3 development tools
**Manual Development**: AI-assisted development still requires manual intervention for Web3 setup
**Awareness**: Developers working with Polkadot Cloud face fragmented tooling
**Acquisition**: Setting up new projects requires manual configuration of multiple tools
**Activation**: First API calls and contract deployments involve complex setup
**Retention**: Inconsistent patterns make long-term development difficult
**Product**: Missing standardized workflows for Polkadot Cloud development

## Solution Architecture

kitdot addresses these issues through a comprehensive developer toolbox that embeds essential tools, provides seamless user experiences, and abstracts Polkadot Cloud services through simplified APIs.

## Features

### Project Initialization

```bash
kitdot init my-project
```

- Generates standardized project structure for Polkadot development
- Platform recognition and automatic dependency installation
- Dynamic template loading from GitHub using degit
- TypeScript configuration for all components
- Supports both monorepo and single repo project structures

### Web3Auth Integration

- Seamless Google/social login with PolkaVM compatibility
- Metamask Multi-Party Computation wallet creation behind the scenes
- Zero wallet extension requirements for users
- Invisible blockchain interaction for improved UX
- Web2-to-Web3 user experience bridge

### Embedded Development Tools

- **polkadot-hardhat**: Deploy Solidity contracts to PolkaVM (abstracts network differences)
- **Pop-CLI**: Spin up local test chains and PolkaVM nodes
- **Chopsticks**: Fork and reproduce full mainnet states locally
- **Platform Detection**: Auto-install Rust and required dependencies
- **Unified Interface**: Single CLI abstracts away tool complexity

### Polkadot Cloud Services Integration

- **Web3 Storage**: IPFS-based decentralized file storage via Crust Network
- **Web3 Hosting**: Deploy websites and dApps to decentralized infrastructure
- **Cloud Functions**: Serverless automation and compute without centralized providers
- **Apillon SDK Abstraction**: Web2-familiar APIs for Web3 cloud services
- **Seamless Integration**: Storage, hosting, and functions work like traditional cloud

### Template Ecosystem

- **Official Parity Templates**: create-polkadot-dapp integration
- **Web3Auth Templates**: Social login + PolkaVM ready templates
- **Community Templates**: Dynamic GitHub loading with degit
- **Thirdweb Integration**: 130+ audited smart contracts as pre-built options
- **Specialized Templates**: NFT marketplaces, staking portals, DAO frameworks
- **Organic Growth**: Anyone can contribute templates via GitHub

### Model Context Protocol (MCP) Server

- **AI Agent Integration**: Enables other code agents and LLMs to use kitdot programmatically
- **Automated Development**: AI agents can initialize projects, select templates, and deploy applications
- **Intelligent Scaffolding**: AI-powered project setup based on requirements and context
- **Multi-Agent Workflows**: Support for complex development tasks across multiple AI agents
- **Tool Interoperability**: Seamless integration with Claude Code, Cursor, and AI development environments
- **Template Discovery**: AI-assisted template selection based on project requirements
- **Development Assistance**: Real-time guidance and recommendations during development

## Project Generated Structure

## Fullstack Project Structure

```
my-polkadot-dapp/
├── contracts/            # Smart contract development (flat structure)
│   ├── src/              # Solidity contracts
│   ├── test/             # Contract tests
│   ├── scripts/          # Deployment scripts
│   ├── hardhat.config.ts # Hardhat configuration
│   └── package.json      # Contract dependencies
├── front/                # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   └── generated.ts  # Contract types
│   ├── package.json      # Frontend dependencies
│   └── tsconfig.json     # TypeScript config
├── docs/                 # mdbook docs
│   ├── src/
│   └── book.toml
└── package.json          # Monorepo config
```

## Frontend-Only Project Structure

```
my-frontend-dapp/
├── src/                  # Frontend source code
│   ├── components/       # UI components
│   ├── App.tsx           # Main application
│   └── main.tsx          # Application entry
├── public/               # Static assets
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Build configuration
└── README.md             # Project documentation
```

## Project Templates

kitdot generates complete project structures with the following components:

### Smart Contracts

- Hardhat development environment with testing framework
- Official Parity templates integration (react-solidity-hardhat)
- PolkaVM deployment scripts and testing via polkadot-hardhat
- Local PolkaVM node integration via embedded Pop-CLI
- Chopsticks integration for mainnet state forking

### Frontend Applications

- React + TypeScript with Polkadot integration
- Official Parity template integration (paritytech/create-polkadot-dapp)
- Web3Auth social login templates with PolkaVM compatibility
- Templates loaded dynamically from GitHub using degit
- Single repo mode for frontend-only projects
- Tailwind CSS and Vite build system
- Enhanced terminal UX with ink.js components

### Documentation

- mdbook project documentation
- Auto-generated API references
- Developer guides and deployment instructions

## Target Use Cases

### Primary Target: Web2 Developers Entering Web3

- **Experience Level**: Traditional web developers new to blockchain
- **Pain Point**: Overwhelming complexity of Web3 development setup
- **Value Proposition**: Familiar Web2 patterns with invisible Web3 infrastructure
- **Success Metric**: Apps deployed where users don't know they're using blockchain

### AI Agents & Code Assistants

- **Use Case**: Automated application development and project scaffolding
- **Value Proposition**: Programmatic access to complete Polkadot development toolkit
- **Success Metric**: AI agents successfully deploy functional Polkadot applications
- **Integration**: Claude Code, Cursor, and other AI development environments

### Web3 Development Teams

- **Experience Level**: Traditional web developers new to blockchain
- **Pain Point**: Overwhelming complexity of Web3 development setup
- **Value Proposition**: Familiar Web2 patterns with invisible Web3 infrastructure
- **Success Metric**: Apps deployed where users don't know they're using blockchain

### Secondary Target: Ethereum Developers Transitioning to Polkadot

- **Experience Level**: Developers with existing Ethereum/Web3 experience
- **Pain Point**: Complex setup process for Polkadot development environment
- **Value Proposition**: Embedded tools eliminate need to learn 10+ separate tools
- **Success Metric**: Contracts deployed to PolkaVM within first project initialization

### Web3 Development Teams

- **Use Case**: Standardizing development workflows across team members
- **Value Proposition**: Consistent project structure and embedded tooling
- **Success Metric**: Reduced onboarding time for new team members

### Hackathon & Rapid Prototyping

- **Use Case**: Quick project setup for hackathons and proof-of-concepts
- **Value Proposition**: Zero-to-deployed in minutes with social login UX
- **Success Metric**: Live demos with working PolkaVM contracts and Web2 UX

### Educational & Portfolio Development

- **Use Case**: Learning Polkadot development, building portfolio projects
- **Value Proposition**: Official templates with modern UX patterns
- **Success Metric**: Portfolio projects demonstrating mainstream-ready Web3 apps

### Benefits

- Reduced setup time from hours to minutes
- Consistent project structure across teams
- Type-safe development with TypeScript
- Integrated testing and deployment workflows

## Technology Stack

### Blockchain

- **PolkaVM**: Primary deployment target with EVM compatibility
- **Polkadot Cloud**: Infrastructure layer
- **Passet Hub**: Testnet for development
- **EVM Compatibility**: Seamless Ethereum contract deployment

### Development

- **TypeScript**: Type safety across all components
- **polkadot-hardhat**: Smart contract development and PolkaVM deployment
- **Pop-CLI**: Local test chain management (embedded)
- **Chopsticks**: Mainnet state forking (embedded)
- **React**: Frontend user interfaces
- **Wagmi**: Blockchain interaction hooks
- **Vite**: Fast development server and builds

### Infrastructure

- **Polkadot Cloud**: Primary deployment target with Apillon SDK integration
- **Web3 Storage**: IPFS and Crust Network for decentralized file storage
- **Web3 Hosting**: Decentralized website deployment
- **Cloud Functions**: Serverless compute via Polkadot parachains
- **Web3Auth**: Social login integration
- **Metamask MPC**: Backend wallet creation
- **degit**: Dynamic template loading from GitHub
- **Official Templates**: Parity-maintained project templates
- **mdbook**: Documentation generation
- **TypeScript**: End-to-end type safety

### AI & Automation

- **Model Context Protocol (MCP)**: Server for AI agent integration
- **Agent Interoperability**: Support for Claude Code, Cursor, and other AI tools
- **Automated Workflows**: AI-driven project initialization and development
- **Intelligent Assistance**: Context-aware development recommendations

## Installation

```bash
npm install -g kitdot
```

## Quick Start

```bash
# Global installation
npx kitdot init my-dapp



# Choose from template ecosystem
# - Official Parity templates
# - Web3Auth social login templates
# - Community templates from GitHub
# - Thirdweb contract templates
```

## Available Commands

### Available Commands

```bash
kitdot init [name]     # Create new project with template selection
kitdot init [name] -i  # Create project with auto-dependency installation
kitdot templates       # Browse template library with community contributions
kitdot contracts       # Browse thirdweb contract library (130+ contracts)
kitdot deploy         # One-command deployment to PolkaVM networks
kitdot validate       # Validate project configuration and dependencies
kitdot mcp            # Start MCP server for AI agent integration
```

### Project Templates Available

- **basic-polkadot-dapp**: Official Parity React + Solidity + Hardhat template
- **social-login-web3-react**: React dApp with Web3Auth social login integration
- **thirdweb-contracts**: 130+ audited smart contracts as pre-built options
- **nft-marketplace**: NFT marketplace template with social login
- **staking-portal**: Staking interface with Web2 UX
- **dao-framework**: DAO governance with invisible blockchain interaction
- **Project Types**: Fullstack, frontend-only, contracts-only
- **Community Templates**: Dynamically loaded from GitHub

## Development Workflow

### 1. Project Initialization

```bash
kitdot init my-dapp -i       # Generate complete project structure with dependencies
```

### 2. Smart Contract Development

- Official Parity templates with polkadot-hardhat integration
- Embedded Pop-CLI for local PolkaVM test chains
- Chopsticks integration for mainnet state forking
- One-command deployment to PolkaVM networks

### 3. Frontend Development

- React + TypeScript templates with Web3Auth integration
- Social login templates (Google, GitHub, etc.)
- Invisible wallet creation via Metamask MPC
- Zero wallet extension requirements for users

### 4. User Experience

- Users login with familiar Web2 patterns
- Blockchain interactions happen transparently
- No technical Web3 knowledge required for end users
- Developers build with familiar patterns

### 5. Cloud Services Integration

- Storage: Upload files to IPFS through simple APIs (abstracted Apillon SDK)
- Hosting: Deploy websites to decentralized infrastructure like traditional hosting
- Functions: Serverless compute that runs on Polkadot parachains
- No vendor lock-in: Built on open Polkadot ecosystem
- Familiar developer experience: Web2 APIs backed by Web3 infrastructure

### 6. AI Agent Integration

- MCP Server: Enables AI agents to use kitdot programmatically
- Automated Project Setup: AI agents can initialize and configure projects
- Intelligent Template Selection: AI-powered recommendations based on requirements
- Multi-Agent Collaboration: Support for complex development workflows
- Context-Aware Assistance: Real-time guidance during development process

## Configuration

### Environment Variables

```bash
# .env (for future features)
POLKADOT_CLOUD_API_KEY=your_api_key
```

### Project Structure

Generated projects include pre-configured:

- Polkadot Cloud network connections
- Smart contract deployment scripts
- Frontend template integration
- TypeScript configuration

## Contributing

### Development Setup

```bash
git clone https://github.com/your-org/kitdot
cd kitdot
npm install
npm run build
npm link
```

### Testing

```bash
npm test                      # Run test suite
npm run lint                  # Check code style
npm run lint:fix              # Fix formatting
```

### Project Templates

kitdot provides several templates:

- `basic-polkadot-dapp/`: Official Parity React + Solidity + Hardhat template
- `social-login-web3-react/`: React with Web3Auth social login integration
- Additional templates for specific use cases

### Official Template Integration

- Uses official Parity create-polkadot-dapp templates
- React + Solidity + Hardhat development stack
- Templates loaded as-is without modifications
- Authentic Polkadot development patterns

## Requirements

- Node.js >= 18.0.0
- npm or yarn
- Git

## License

MIT License - see LICENSE file for details.

## Resources

- [Polkadot Cloud Documentation](https://docs.polkadot.cloud/)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

kitdot provides standardized tooling for Polkadot Cloud development. Get started with `kitdot init` and begin building on Polkadot infrastructure.
