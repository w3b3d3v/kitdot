import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import {
  ProjectConfig,
  ProjectType,
  ProjectFeatures,
  TemplateConfig,
  InitMode,
} from "../types.js";
import { createProjectStructure } from "../utils/project-structure.js";
import { setupContracts } from "../utils/setup-contracts.js";
import { setupFrontend } from "../utils/setup-frontend.js";
import { getTemplate, getTemplatesForMode } from "../templates/registry.js";
import { displayHomeScreen } from "../utils/homeScreen.js";
import { createTemplateLoader } from "../utils/template-loader.js";

export async function initCommand(
  projectName?: string,
  options?: { dir?: string; yes?: boolean }
) {
  // Display the new styled home screen
  displayHomeScreen();

  try {
    const config = await gatherProjectInfo(
      projectName,
      options?.dir,
      options?.yes
    );
    await createProject(config);
    // Template displays its own next steps - no additional CLI messages needed
  } catch (error) {
    console.error(chalk.red("❌ Error creating project:"), error);
    process.exit(1);
  }
}

async function gatherProjectInfo(
  projectName?: string,
  targetDir?: string,
  useYes?: boolean
): Promise<ProjectConfig> {
  // If -y flag is used, skip template question and use default
  let defaultAnswer;
  if (useYes) {
    defaultAnswer = { useDefault: true };
  } else {
    // First, ask about using default template
    const defaultTemplateQuestion = {
      type: "confirm" as const,
      name: "useDefault",
      message: "Install default template [Y/n]?",
      default: true,
    };

    defaultAnswer = await inquirer.prompt([defaultTemplateQuestion]);
  }

  // Get project name if not provided
  let name: string;
  if (!projectName) {
    const nameQuestion = {
      type: "input" as const,
      name: "projectName",
      message: "What is your project name?",
      default: "my-polkadot-dapp",
      validate: (input: string) => {
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return "Project name can only contain letters, numbers, hyphens, and underscores";
        }
        return true;
      },
    };

    const nameAnswer = await inquirer.prompt([nameQuestion]);
    name = nameAnswer.projectName;
  } else {
    name = projectName;
  }

  const directory = targetDir || path.join(process.cwd(), name);

  // If user wants default template, use local templates/default
  if (defaultAnswer.useDefault) {
    const template: TemplateConfig = {
      name: "default",
      source: {
        type: "local",
        localPath: "templates/default",
      },
    };

    const features: ProjectFeatures = {
      contracts: true,
      frontend: true,
    };

    return {
      name,
      type: "fullstack",
      directory,
      features,
      template,
      installRustTools: false,
    };
  }

  // Step 1: Mode Selection
  const modeQuestion = {
    type: "list" as const,
    name: "initMode",
    message: "What type of project would you like to create?",
    choices: [
      {
        name: "🌟 Full Stack (Frontend + Smart Contracts)",
        value: "fullstack" as InitMode,
      },
      {
        name: "🎨 Frontend Only",
        value: "frontend-only" as InitMode,
      },
      {
        name: "⚙️  Smart Contracts Only",
        value: "smartcontracts-only" as InitMode,
      },
    ],
  };

  const modeAnswer = await inquirer.prompt([modeQuestion]);
  const selectedMode = modeAnswer.initMode as InitMode;

  // Convert mode to project type for internal processing
  let type: ProjectType;
  switch (selectedMode) {
    case "fullstack":
      type = "fullstack";
      break;
    case "frontend-only":
      type = "frontend";
      break;
    case "smartcontracts-only":
      type = "backend";
      break;
    default:
      type = "fullstack";
  }

  // Template selection based on selected mode
  let template: TemplateConfig | undefined;
  const availableTemplates = getTemplatesForMode(selectedMode);

  let messageText: string;
  switch (selectedMode) {
    case "fullstack":
      messageText = "Select a template:";
      break;
    case "frontend-only":
      messageText = "Choose a frontend template:";
      break;
    case "smartcontracts-only":
      messageText = "Choose a smart contracts template:";
      break;
    default:
      messageText = "Choose a template:";
  }

  if (availableTemplates.length > 1) {
    const templateQuestion = {
      type: "list" as const,
      name: "selectedTemplate",
      message: messageText,
      choices: availableTemplates.map((template) => {
        // Create display name with type indicator for fullstack mode
        let displayName: string;

        if (selectedMode === "fullstack") {
          // Show type indicator for fullstack mode
          const typeIndicator = template.category === "frontend" ? " (Frontend Only)" :
                               template.category === "smartcontract" ? " (Smart Contracts Only)" :
                               template.category === "fullstack" ? " (Full Stack)" : "";
          displayName = `${template.framework} - ${template.description}${typeIndicator}`;
        } else {
          // For mode-specific selections, don't show type indicator since it's redundant
          displayName = `${template.framework} - ${template.description}`;
        }

        // Determine if this is the default template for the current project type
        const isDefault =
          (type === "frontend" && template.key === "default-frontend") ||
          (type === "backend" && template.key === "default-contracts") ||
          (type === "fullstack" && template.key === "default");

        return {
          name: isDefault ? `${displayName} (Default)` : displayName,
          value: template.key,
        };
      }),
    };

    const templateAnswer = await inquirer.prompt([templateQuestion]);

    template = {
      name: templateAnswer.selectedTemplate,
      source: availableTemplates.find(
        (t) => t.key === templateAnswer.selectedTemplate
      )!.source,
    };
  } else if (availableTemplates.length === 1) {
    // Use the only available template
    template = {
      name: availableTemplates[0].key,
      source: availableTemplates[0].source,
    };
  } else {
    // No templates available - auto-select appropriate default
    if (type === "frontend") {
      template = {
        name: "default-frontend",
        source: { type: "local", localPath: "templates/default/frontend" },
      };
    } else if (type === "backend") {
      template = {
        name: "default-contracts",
        source: { type: "local", localPath: "templates/default/contracts" },
      };
    } else {
      template = {
        name: "default",
        source: { type: "local", localPath: "templates/default" },
      };
    }
  }

  // Determine features and handle auto-pairing for fullstack mode
  const selectedTemplate = template ? getTemplate(template.name) : null;
  const templateCategory = selectedTemplate?.category;

  // Auto-pairing logic for fullstack mode
  let additionalTemplate: TemplateConfig | undefined;
  let features: ProjectFeatures;

  if (selectedMode === "fullstack" && templateCategory) {
    if (templateCategory === "frontend") {
      // Frontend template selected → pair with default-smartcontracts
      additionalTemplate = {
        name: "default-contracts",
        source: { type: "local", localPath: "templates/default/contracts" },
      };
      features = { contracts: true, frontend: true };
      console.log(chalk.blue("🔗 Auto-pairing with default smart contracts for full-stack setup"));
    } else if (templateCategory === "smartcontract") {
      // Smartcontract template selected → pair with default-frontend
      additionalTemplate = {
        name: "default-frontend",
        source: { type: "local", localPath: "templates/default/frontend" },
      };
      features = { contracts: true, frontend: true };
      console.log(chalk.blue("🔗 Auto-pairing with default frontend for full-stack setup"));
    } else {
      // Fullstack template selected → no pairing needed
      features = { contracts: true, frontend: true };
    }
  } else {
    // Non-fullstack modes or no template
    features = {
      contracts: determineNeedsContracts(type, templateCategory),
      frontend: type === "fullstack" || type === "frontend",
    };
  }

  return {
    name,
    type,
    directory,
    features,
    template,
    additionalTemplate, // New field for auto-paired template
    installRustTools: false,
  };
}

function determineNeedsContracts(
  projectType: ProjectType,
  templateCategory?: string
): boolean {
  // Backend projects always need contracts
  if (projectType === "backend") return true;

  // Frontend projects never need separate contracts
  if (projectType === "frontend") return false;

  // Fullstack projects:
  // - If template is 'fullstack', it already contains contracts - don't create separate
  // - If template is 'frontend', we need to add contracts separately
  if (projectType === "fullstack") {
    return templateCategory !== "fullstack";
  }

  return false;
}

async function createProject(config: ProjectConfig) {
  const spinner = ora("Creating project structure...").start();

  try {
    await createProjectStructure(config);
    spinner.succeed("Project structure created");

    if (config.features.contracts) {
      spinner.start("Setting up smart contracts...");
      await setupContracts(config);
      spinner.succeed("Smart contracts setup complete");
    }

    if (config.features.frontend) {
      // Don't use spinner for frontend setup - it has interactive prompts
      console.log(chalk.blue("🎨 Setting up frontend..."));
      await setupFrontend(config);
      console.log(chalk.green("✅ Frontend setup complete"));
    }

    // Handle additional template for auto-pairing in fullstack mode
    if (config.additionalTemplate) {
      const additionalTemplate = getTemplate(config.additionalTemplate.name);
      if (additionalTemplate) {
        if (additionalTemplate.category === "smartcontract") {
          spinner.start("Setting up additional smart contracts...");
          await setupAdditionalContracts(config);
          spinner.succeed("Additional smart contracts setup complete");
        } else if (additionalTemplate.category === "frontend") {
          console.log(chalk.blue("🎨 Setting up additional frontend..."));
          await setupAdditionalFrontend(config);
          console.log(chalk.green("✅ Additional frontend setup complete"));
        }
      }
    }

    // Project creation completed - display contextual next steps
    displayNextSteps(config);
  } catch (error) {
    spinner.fail("Failed to create project");
    throw error;
  }

  // Ensure clean exit
  process.nextTick(() => {
    // Allow any pending operations to complete before exit
  });
}

function displayNextSteps(config: ProjectConfig): void {
  console.log(chalk.blue("\n📋 Next Steps"));
  console.log(
    chalk.gray("Follow these steps to start developing your Polkadot Dapp:\n")
  );

  let stepNumber = 1;

  // Step 1: Navigate to project
  console.log(chalk.blue(`${stepNumber}. Navigate to project`));
  console.log(chalk.gray("   Enter your project directory"));
  console.log(chalk.yellow(`   cd ${config.name}`));
  console.log("");
  stepNumber++;

  // Step 2: Frontend development (if frontend is included)
  if (config.features.frontend) {
    console.log(chalk.blue(`${stepNumber}. Start frontend development`));
    console.log(chalk.gray("   Install dependencies and start the frontend"));
    console.log(chalk.yellow("   cd frontend && npm install && npm run dev"));
    console.log("");
    stepNumber++;
  }

  // Step 3: Contracts development (if contracts are included)
  if (config.features.contracts) {
    console.log(chalk.blue(`${stepNumber}. Start contracts development`));
    console.log(chalk.gray("   Install dependencies and compile contracts"));
    console.log(
      chalk.yellow("   cd contracts && npm install && npx hardhat compile")
    );
    console.log("");
    stepNumber++;
  }

  // AGENTS.md tip
  console.log(
    chalk.cyan(
      "🤖 Tip: Check out AGENTS.md in your project root for comprehensive AI agent instructions"
    )
  );

  console.log(chalk.cyan("📚 For more help: kitdot --help"));
  console.log("");
}

/**
 * Setup additional contracts template for auto-pairing in fullstack mode
 */
async function setupAdditionalContracts(config: ProjectConfig): Promise<void> {
  if (!config.additionalTemplate) return;

  const template = getTemplate(config.additionalTemplate.name);
  if (!template || template.category !== "smartcontract") return;

  // For auto-paired contracts, always place in 'contracts' subdirectory
  const contractsDir = path.join(config.directory, "contracts");

  const templateLoader = createTemplateLoader();
  try {
    await templateLoader.loadTemplate(template, contractsDir, config);
  } finally {
    await templateLoader.cleanup();
  }
}

/**
 * Setup additional frontend template for auto-pairing in fullstack mode
 */
async function setupAdditionalFrontend(config: ProjectConfig): Promise<void> {
  if (!config.additionalTemplate) return;

  const template = getTemplate(config.additionalTemplate.name);
  if (!template || template.category !== "frontend") return;

  // For auto-paired frontend, always place in 'frontend' subdirectory
  const frontendDir = path.join(config.directory, "frontend");

  const templateLoader = createTemplateLoader();
  try {
    await templateLoader.loadTemplate(template, frontendDir, config);
  } finally {
    await templateLoader.cleanup();
  }
}
