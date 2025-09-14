import { TemplateRegistry } from "../types.js";

/**
 * Template Registry - Defines available project templates
 *
 * Each template can be:
 * - Local: Bundled with CLI in /templates directory
 * - Remote: Fetched from GitHub repositories using degit
 */
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  // Official Parity template (updated to use remote source)
  "basic-polkadot-dapp": {
    name: "Basic Polkadot DApp",
    description:
      "Official React + Solidity + Hardhat template from Parity Technologies",
    framework: "React",
    category: "fullstack",
    source: {
      type: "remote",
      repository: "paritytech/create-polkadot-dapp",
      branch: "main",
      directory: "templates/react-solidity-hardhat",
    },
    features: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Solidity",
      "Hardhat",
    ],
    optionalSetup: {
      description: "Install dependencies and generate frontend components",
      commands: [
        {
          command: "npm install",
          workingDirectory: "frontend",
          description: "Install frontend dependencies",
          timeout: 180000, // 3 minutes timeout for npm install
        },
        {
          command: "npm run generate",
          workingDirectory: "frontend",
          description:
            "Generate frontend components and setup required dependencies",
          timeout: 120000, // 2 minutes timeout for generation
        },
      ],
    },
    nextSteps: {
      title: "Get Started with Your Polkadot DApp",
      instructions: [
        {
          title: "Install Dependencies",
          commands: [
            "cd contracts && npm install",
            "cd frontend && npm install",
          ],
          description:
            "Install all required packages for both contracts and frontend",
        },
        {
          title: "Start Development",
          commands: ["npm run dev"],
          description: "Start the development server to see your app in action",
          workingDirectory: "frontend",
        },
        {
          title: "Compile Contracts",
          commands: ["npm run compile"],
          description: "Compile your smart contracts for deployment",
          workingDirectory: "contracts",
        },
      ],
      documentationUrl: "https://docs.polkadot.cloud/tutorials/basic-dapp",
    },
  },

  "social-login-web3-react": {
    name: "React Web3Auth Social Login",
    description:
      "React dApp template with Web3Auth social login - users authenticate with Google/Twitter/Facebook while blockchain interactions are abstracted away for seamless UX",
    framework: "React",
    category: "frontend",
    source: {
      type: "remote",
      repository: "w3b3d3v/web3auth-examples",
      branch: "web3dev-version",
      directory: "quick-starts/react-quick-start",
    },
    features: [
      "React",
      "Web3Auth",
      "Social Login",
      "Google Auth",
      "Twitter Auth",
      "Facebook Auth",
      "TypeScript",
      "Seamless UX",
    ],
    documentationUrl:
      "https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/",
  },
};

/**
 * Get available templates by category
 */
export function getTemplatesByCategory(
  category: "frontend" | "fullstack" | "backend"
) {
  return Object.entries(TEMPLATE_REGISTRY)
    .filter(([, template]) => template.category === category)
    .map(([key, template]) => ({ key, ...template }));
}

/**
 * Get template definition by key
 */
export function getTemplate(key: string) {
  return TEMPLATE_REGISTRY[key];
}
