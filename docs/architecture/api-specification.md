# API Specification

Based on the actual kitdot implementation, here's the accurate API specification for kitdot:

## CLI Command API (Actual Implementation)

```bash
# Core Commands (Actually Implemented)
kitdot init [project-name]           # Initialize new project with interactive prompts
kitdot init [project-name] -d <dir>  # Initialize with custom target directory
kitdot tools install-rust           # Install Rust toolchain for development
kitdot tools check                   # Check development tools status
kitdot tools                         # Show tools help menu
kitdot --version                     # Show version information
kitdot --help                        # Show general help
```

## Internal Module APIs (Based on Actual Types)

```typescript
// Project Configuration (from types.ts)
interface ProjectConfig {
  name: string;
  type: ProjectType;
  directory: string;
  features: ProjectFeatures;
  template?: TemplateConfig;
  platformDetected?: string;
  rustInstalled?: boolean;
  toolInstallConsent?: boolean;
  installRustTools?: boolean;
}

type ProjectType = 'fullstack' | 'frontend' | 'backend';

interface ProjectFeatures {
  contracts: boolean;
  frontend: boolean;
  documentation: boolean;
}

// Template System (from types.ts and registry.ts)
interface TemplateConfig {
  name: string;
  source: TemplateSource;
  path?: string;
}

interface TemplateDefinition {
  name: string;
  description: string;
  framework: string;
  category: 'frontend' | 'fullstack' | 'backend';
  source: TemplateSource;
  features: string[];
  documentationUrl?: string;
  optionalSetup?: OptionalSetupConfig;
  nextSteps?: NextStepsConfig;
}

interface TemplateSource {
  type: 'local' | 'remote';
  repository?: string;
  branch?: string;
  directory?: string;
  localPath?: string;
}

// Template Registry Functions (from registry.ts)
function getTemplatesByCategory(category: 'frontend' | 'fullstack' | 'backend');
function getTemplate(key: string): TemplateDefinition;
```

## Command Implementation APIs

```typescript
// Init Command API (from commands/init.ts)
export async function initCommand(projectName?: string, options?: { dir?: string }): Promise<void>;

// Tools Command API (from commands/tools.ts)
export async function toolsCommand(subcommand?: string): Promise<void>;
// Subcommands: 'install-rust' | 'check' | undefined
```

## Template Registry (Actual Templates)

Current implemented templates:

```typescript
const TEMPLATE_REGISTRY = {
  "basic-polkadot-dapp": {
    name: "Basic Polkadot DApp",
    description: "Official React + Solidity + Hardhat template from Parity Technologies",
    framework: "React",
    category: "fullstack",
    source: {
      type: "remote",
      repository: "paritytech/create-polkadot-dapp",
      branch: "main",
      directory: "templates/react-solidity-hardhat"
    },
    features: ["React", "TypeScript", "Vite", "Tailwind CSS", "Solidity", "Hardhat"]
  },

  "social-login-web3-react": {
    name: "React Web3Auth Social Login",
    description: "React dApp template with Web3Auth social login",
    framework: "React",
    category: "frontend",
    source: {
      type: "remote",
      repository: "w3b3d3v/web3auth-examples",
      branch: "web3dev-version",
      directory: "quick-starts/react-quick-start"
    },
    features: ["React", "Web3Auth", "Social Login", "TypeScript"]
  }
};
```
