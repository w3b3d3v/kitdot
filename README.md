# kitdot

A TypeScript SDK toolkit for building Dapps on Polkadot Cloud - inspired by Hardhat's developer experience.

## Features

🚀 **Quick Project Setup** - Initialize full-stack Polkadot Dapps in seconds  
⚙️ **Smart Contracts** - Foundry + Hardhat setup with UUPS upgradeable patterns  
🎨 **Frontend** - Modern React apps with Polkadot integration  
☁️ **Cloud Functions** - Serverless backend with AWS Lambda  
📚 **Documentation** - Auto-generated docs with mdbook  
🔧 **Developer Tools** - Build, test, and deploy commands

## Installation

```bash
npm install -g kitdot
```

## Quick Start

Create a new Polkadot Dapp:

```bash
kitdot init my-polkadot-dapp
cd my-polkadot-dapp
```

The CLI will guide you through setting up:

- **Full-stack Dapp** - Frontend + Smart Contracts + Cloud Functions
- **Frontend only** - React app for Polkadot
- **Backend only** - Smart Contracts + Cloud Functions

## Project Structure

```
my-polkadot-dapp/
├── contracts/
│   ├── develop/          # Foundry project with UUPS examples
│   └── deploy/           # Hardhat deployment scripts
├── front/                # React frontend with Polkadot integration
├── cloud-functions/      # AWS Lambda functions
├── docs/                 # mdbook documentation
└── package.json          # Monorepo configuration
```

## Commands

```bash
kitdot init [project-name]    # Initialize new project
kitdot build                  # Build all components
kitdot deploy                 # Deploy contracts/frontend
```

## Development Workflow

1. **Initialize**: `kitdot init my-dapp`
2. **Develop Contracts**: `cd contracts/develop && forge build`
3. **Frontend Dev**: `cd front && npm run dev`
4. **Cloud Functions**: `cd cloud-functions && npm run dev`
5. **Documentation**: `cd docs && mdbook serve`

## Technology Stack

### Smart Contracts

- **Foundry** - Fast, portable and modular toolkit for Ethereum development
- **Hardhat** - Ethereum development environment for deployment
- **OpenZeppelin** - Secure smart contract library with UUPS support

### Frontend

- **React** - Modern UI library with TypeScript
- **Wagmi** - React hooks for Ethereum/Polkadot
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Cloud Functions

- **AWS Lambda** - Serverless compute platform
- **TypeScript** - Type-safe backend development
- **Serverless Framework** - Infrastructure as code

### Documentation

- **mdbook** - Modern documentation tool
- **Markdown** - Simple, readable documentation format

## Templates

kitdot includes production-ready templates:

- **UUPS Upgradeable Contracts** - Secure upgrade patterns
- **React Polkadot Frontend** - Wallet integration and contract interaction
- **AWS Lambda Functions** - API endpoints and contract monitoring
- **Comprehensive Documentation** - Guides and API references

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Built by the Community

kitdot is built for the Polkadot developer community. Join us in making Dapp development faster and more enjoyable!

- 📖 [Documentation](https://kitdot.dev/docs)
- 💬 [Discord Community](https://discord.gg/polkadot)
- 🐛 [Report Issues](https://github.com/your-org/kitdot/issues)
- 🚀 [Feature Requests](https://github.com/your-org/kitdot/discussions)
