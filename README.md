# kit-dot

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
npm install -g kit-dot
```

## Quick Start

Create a new Polkadot Dapp:

```bash
kit-dot init my-polkadot-dapp
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
kit-dot init [project-name]    # Initialize new project
kit-dot build                  # Build all components
kit-dot deploy                 # Deploy contracts/frontend
```

## Development Workflow

1. **Initialize**: `kit-dot init my-dapp`
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

kit-dot includes production-ready templates:

- **UUPS Upgradeable Contracts** - Secure upgrade patterns
- **React Polkadot Frontend** - Wallet integration and contract interaction
- **AWS Lambda Functions** - API endpoints and contract monitoring
- **Comprehensive Documentation** - Guides and API references

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Built by the Community

kit-dot is built for the Polkadot developer community. Join us in making Dapp development faster and more enjoyable!

- 📖 [Documentation](https://kit-dot.dev/docs)
- 💬 [Discord Community](https://discord.gg/polkadot)
- 🐛 [Report Issues](https://github.com/your-org/kit-dot/issues)
- 🚀 [Feature Requests](https://github.com/your-org/kit-dot/discussions)