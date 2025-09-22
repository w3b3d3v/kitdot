import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import {
  ProjectConfig,
  ProjectType,
  ProjectFeatures,
  TemplateConfig,
} from "../types.js";
import { createProjectStructure } from "../utils/project-structure.js";
import { setupContracts } from "../utils/setup-contracts.js";
import { setupFrontend } from "../utils/setup-frontend.js";
import { getTemplatesByCategory, getTemplate } from "../templates/registry.js";
import { displayHomeScreen } from "../utils/homeScreen.js";

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

  // If user wants non-default, proceed with existing flow
  const baseQuestions = [
    {
      type: "list" as const,
      name: "projectType",
      message: "What type of project do you want to create?",
      choices: [
        {
          name: "🌟 Full-stack Dapp (Frontend + Smart Contracts)",
          value: "fullstack",
        },
        {
          name: "🎨 Frontend only (React app for Polkadot)",
          value: "frontend",
        },
        {
          name: "⚙️  Backend only (Smart Contracts only)",
          value: "backend",
        },
      ],
    },
  ];

  const answers = await inquirer.prompt(baseQuestions);
  const type = (answers.projectType || "fullstack") as ProjectType;

  // Template selection for non-default flow
  let template: TemplateConfig | undefined;

  if (type === "frontend" || type === "fullstack" || type === "backend") {
    let availableTemplates;
    let messageText;

    if (type === "frontend") {
      // Frontend-only: Show all frontend templates including default
      availableTemplates = getTemplatesByCategory("frontend");
      messageText = "Choose a frontend template:";
    } else if (type === "backend") {
      // Backend-only: Show all backend templates including default contracts
      availableTemplates = getTemplatesByCategory("backend");
      messageText = "Choose a smart contracts template:";
    } else if (type === "fullstack") {
      // Full-stack: Show fullstack templates first, fallback to frontend if needed
      availableTemplates = getTemplatesByCategory("fullstack");
      messageText = "Choose a fullstack template:";
    } else {
      // Fallback to fullstack templates
      availableTemplates = getTemplatesByCategory("fullstack");
      messageText = "Choose a template:";
    }

    if (availableTemplates.length > 1) {
      const templateQuestion = {
        type: "list" as const,
        name: "selectedTemplate",
        message: messageText,
        choices: availableTemplates.map((template) => {
          // Determine if this is the default template for the current project type
          const isDefault =
            (type === "frontend" && template.key === "default-frontend") ||
            (type === "backend" && template.key === "default-contracts") ||
            (type === "fullstack" && template.key === "default");

          return {
            name: isDefault
              ? `${template.framework} - ${template.description} (Default)`
              : `${template.framework} - ${template.description}`,
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
  }

  // Determine features based on template category and user selection
  const selectedTemplate = template ? getTemplate(template.name) : null;
  const templateCategory = selectedTemplate?.category;

  const features: ProjectFeatures = {
    contracts: determineNeedsContracts(type, templateCategory),
    frontend: type === "fullstack" || type === "frontend",
  };

  return {
    name,
    type,
    directory,
    features,
    template,
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
