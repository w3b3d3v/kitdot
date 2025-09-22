export interface ProjectConfig {
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

export interface TemplateConfig {
  name: string;
  source: TemplateSource;
  path?: string; // For local templates or subfolder in remote repo
}

export type ProjectType = 'fullstack' | 'frontend' | 'backend';

export interface ProjectFeatures {
  contracts: boolean;
  frontend: boolean;
}

export interface TemplateOptions {
  projectName: string;
  projectType: ProjectType;
  targetDir: string;
}

export interface ContractConfig {
  foundryEnabled: boolean;
  hardhatEnabled: boolean;
  uupsEnabled: boolean;
}

export interface FrontendConfig {
  framework: 'react' | 'vue' | 'svelte';
  template: string;
}

export interface TemplateSource {
  type: 'local' | 'remote';
  repository?: string; // GitHub repo like 'user/repo' or full URL
  branch?: string; // Branch or tag, defaults to 'main'
  directory?: string; // Subdirectory within repo
  localPath?: string; // For local templates
}

export interface TemplateRegistry {
  [key: string]: TemplateDefinition;
}

export interface TemplateDefinition {
  name: string;
  description: string;
  framework: string;
  category: 'frontend' | 'fullstack' | 'backend';
  source: TemplateSource;
  features: string[];
  documentationUrl?: string; // Optional documentation URL
  optionalSetup?: OptionalSetupConfig; // Optional setup commands requiring user consent
  nextSteps?: NextStepsConfig; // Dynamic instructions for getting started
}

export interface OptionalSetupConfig {
  commands: TemplateCommand[];
  description?: string; // Description of what these commands do
}

export interface NextStepsConfig {
  title: string; // Title for the next steps section
  instructions: NextStepInstruction[]; // List of step-by-step instructions
  documentationUrl?: string; // Optional link to detailed documentation
}

export interface NextStepInstruction {
  title: string; // Step title (e.g., "Install Dependencies")
  commands: string[]; // Commands to run for this step
  description: string; // Description of what this step accomplishes
  workingDirectory?: string; // Optional directory to run commands in
}

export interface TemplateCommand {
  command: string; // The command to run (e.g., "npm run generate")
  workingDirectory?: string; // Optional subdirectory to run command in (relative to template root)
  description?: string; // Optional description of what this command does
  timeout?: number; // Optional timeout in milliseconds (default: 60000)
}

