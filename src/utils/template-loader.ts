import fs from "fs-extra";
import path from "path";
import degit from "degit";
import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";
import { spawn } from "child_process";
import {
  TemplateDefinition,
  TemplateSource,
  ProjectConfig,
  TemplateCommand,
  NextStepInstruction,
} from "../types.js";

/**
 * Template Loader - Handles loading templates from local and remote sources
 */
export class TemplateLoader {
  private tempDir: string;

  constructor() {
    // Create temporary directory for remote template downloads
    this.tempDir = path.join(process.cwd(), ".kitdot-cache");
  }

  /**
   * Load a template to the target directory
   */
  async loadTemplate(
    template: TemplateDefinition,
    targetDir: string,
    config: ProjectConfig
  ): Promise<void> {
    const spinner = ora(`Loading ${template.name} template...`).start();

    try {
      let templatePath: string;

      if (template.source.type === "local") {
        templatePath = await this.loadLocalTemplate(template.source);
      } else {
        templatePath = await this.loadRemoteTemplate(template.source, spinner);
      }

      // Copy template to target directory as-is
      await this.copyTemplate(templatePath, targetDir, config);

      spinner.succeed(`${template.name} template loaded successfully`);

      // Prompt user for optional setup commands if specified
      if (
        template.optionalSetup &&
        template.optionalSetup.commands.length > 0
      ) {
        const shouldRunOptionalSetup = await this.promptUserForOptionalSetup(
          template
        );
        if (shouldRunOptionalSetup) {
          await this.executeOptionalSetupWithProgress(template, targetDir);
        }
      }

      // Display next steps guidance
      if (template.nextSteps) {
        this.displayNextSteps(template, targetDir);
      }
    } catch (error) {
      spinner.fail(`Failed to load ${template.name} template`);
      throw error;
    }
  }

  /**
   * Load local template
   */
  private async loadLocalTemplate(source: TemplateSource): Promise<string> {
    const templatePath = path.join(process.cwd(), source.localPath!);

    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Local template not found at ${templatePath}`);
    }

    return templatePath;
  }

  /**
   * Load remote template using degit
   */
  private async loadRemoteTemplate(
    source: TemplateSource,
    spinner: Ora
  ): Promise<string> {
    // Ensure temp directory exists
    await fs.ensureDir(this.tempDir);

    // Build degit source string
    let degitSource = source.repository!;

    if (source.directory) {
      degitSource += `/${source.directory}`;
    }

    if (source.branch && source.branch !== "main") {
      degitSource += `#${source.branch}`;
    }

    spinner.text = `Downloading template from ${source.repository}...`;

    // Create temporary directory for this template
    const tempTemplatePath = path.join(this.tempDir, `template-${Date.now()}`);

    try {
      const emitter = degit(degitSource, {
        cache: false,
        force: true,
        verbose: false,
      });

      await emitter.clone(tempTemplatePath);

      return tempTemplatePath;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // If commit hash resolution fails, try fetching latest commit hash manually
      if (errorMessage.includes("could not find commit hash")) {
        spinner.text = `Resolving latest commit for ${source.branch}...`;
        try {
          const latestCommit = await this.getLatestCommitHash(
            source.repository!,
            source.branch || "main"
          );
          const commitSource = source.directory
            ? `${source.repository}/${source.directory}#${latestCommit}`
            : `${source.repository}#${latestCommit}`;

          const retryEmitter = degit(commitSource, {
            cache: false,
            force: true,
            verbose: false,
          });

          await retryEmitter.clone(tempTemplatePath);
          return tempTemplatePath;
        } catch (retryError) {
          throw new Error(
            `Failed to download template from ${source.repository} after commit hash retry: ${retryError}`
          );
        }
      }

      throw new Error(
        `Failed to download template from ${source.repository}: ${errorMessage}`
      );
    }
  }

  /**
   * Get the latest commit hash for a specific branch from GitHub API
   */
  private async getLatestCommitHash(
    repository: string,
    branch: string
  ): Promise<string> {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/branches/${branch}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch branch info for ${repository}#${branch}: ${response.statusText}`
      );
    }

    const branchData = await response.json();
    return branchData.commit.sha;
  }

  /**
   * Copy template files to target directory
   */
  private async copyTemplate(
    sourcePath: string,
    targetPath: string,
    _config: ProjectConfig
  ): Promise<void> {
    await fs.copy(sourcePath, targetPath, {
      filter: (src) => {
        const basename = path.basename(src);
        // Exclude common directories/files that shouldn't be copied
        return ![
          "node_modules",
          ".git",
          "dist",
          ".DS_Store",
          "tsconfig.tsbuildinfo",
          "package-lock.json",
          ".next",
          ".nuxt",
          ".svelte-kit",
          "build",
        ].includes(basename);
      },
    });
  }

  /**
   * Prompt user for consent to run optional setup commands
   */
  private async promptUserForOptionalSetup(
    template: TemplateDefinition
  ): Promise<boolean> {
    const { optionalSetup } = template;
    if (!optionalSetup) return false;

    console.log(chalk.blue("\n🔧 Optional Setup Available"));
    console.log(
      chalk.gray(
        optionalSetup.description ||
          "Additional setup commands are available for this template."
      )
    );

    console.log("\nCommands that will be executed:");
    optionalSetup.commands.forEach(
      (command: TemplateCommand, index: number) => {
        const workingDir = command.workingDirectory
          ? ` (in ${command.workingDirectory})`
          : "";
        console.log(
          chalk.yellow(`  ${index + 1}. ${command.command}${workingDir}`)
        );
        if (command.description) {
          console.log(chalk.gray(`     ${command.description}`));
        }
      }
    );

    const answer = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "Would you like to run these optional setup commands now?",
        default: true,
      },
    ]);

    return answer.proceed;
  }

  /**
   * Execute optional setup commands with real-time progress streaming
   */
  private async executeOptionalSetupWithProgress(
    template: TemplateDefinition,
    targetDir: string
  ): Promise<void> {
    const { optionalSetup } = template;
    if (!optionalSetup) return;

    console.log(
      chalk.blue(`\n🚀 Running optional setup for ${template.name}...`)
    );

    for (const [index, command] of optionalSetup.commands.entries()) {
      try {
        console.log(
          chalk.blue(
            `\n[${index + 1}/${optionalSetup.commands.length}] ${
              command.description || command.command
            }`
          )
        );
        console.log(chalk.gray(`Command: ${command.command}`));

        const workingDir = command.workingDirectory
          ? path.join(targetDir, command.workingDirectory)
          : targetDir;

        console.log(chalk.gray(`Working directory: ${workingDir}`));
        console.log(chalk.gray("Output:"));

        await this.executeCommandWithStreaming(command, targetDir);
        console.log(chalk.green(`✅ Command completed successfully\n`));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.log(chalk.red(`❌ Command failed: ${errorMessage}\n`));
        throw new Error(
          `Optional setup command failed: ${command.command} - ${errorMessage}`
        );
      }
    }

    console.log(
      chalk.green(`🎉 Optional setup completed for ${template.name}!`)
    );
  }

  /**
   * Display next steps guidance from template configuration
   */
  private displayNextSteps(
    template: TemplateDefinition,
    _targetDir: string
  ): void {
    const { nextSteps } = template;
    if (!nextSteps) return;

    console.log(chalk.blue(`\n📋 ${nextSteps.title}`));
    console.log(chalk.gray("Follow these steps to get started:\n"));

    nextSteps.instructions.forEach(
      (instruction: NextStepInstruction, index: number) => {
        console.log(chalk.blue(`${index + 1}. ${instruction.title}`));
        console.log(chalk.gray(`   ${instruction.description}`));

        instruction.commands.forEach((cmd: string) => {
          const workingDir = instruction.workingDirectory
            ? ` (run in ${instruction.workingDirectory})`
            : "";
          console.log(chalk.yellow(`   ${cmd}${workingDir}`));
        });
        console.log(""); // Empty line between steps
      }
    );

    if (nextSteps.documentationUrl) {
      console.log(
        chalk.cyan(`📚 Documentation: ${nextSteps.documentationUrl}`)
      );
    }
  }

  /**
   * Execute a single template command with real-time output streaming
   */
  private async executeCommandWithStreaming(
    command: TemplateCommand,
    templateDir: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const workingDir = command.workingDirectory
        ? path.join(templateDir, command.workingDirectory)
        : templateDir;

      // Check if working directory exists
      if (!fs.existsSync(workingDir)) {
        reject(new Error(`Working directory not found: ${workingDir}`));
        return;
      }

      // Parse command and arguments
      const [cmd, ...args] = command.command.split(" ");

      const child = spawn(cmd, args, {
        cwd: workingDir,
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
      });

      let hasOutput = false;
      let loadingAnimation: NodeJS.Timeout | null = null;

      // Start cool loading animation
      loadingAnimation = this.startLoadingAnimation(command.command);

      child.stdout?.on("data", (data) => {
        // Stop loading animation when output starts
        if (loadingAnimation) {
          clearInterval(loadingAnimation);
          loadingAnimation = null;
          process.stdout.write("\r\x1b[K"); // Clear current line
        }
        hasOutput = true;

        // Stream output directly to console with indentation
        const output = data.toString();
        output.split("\n").forEach((line: string) => {
          if (line.trim()) {
            console.log(`   ${line}`);
          }
        });
      });

      child.stderr?.on("data", (data) => {
        // Stop loading animation when output starts
        if (loadingAnimation) {
          clearInterval(loadingAnimation);
          loadingAnimation = null;
          process.stdout.write("\r\x1b[K"); // Clear current line
        }
        hasOutput = true;

        // Stream error output directly to console with indentation and color
        const output = data.toString();
        output.split("\n").forEach((line: string) => {
          if (line.trim()) {
            console.log(chalk.yellow(`   ${line}`));
          }
        });
      });

      child.on("close", (code) => {
        // Stop loading animation if still running
        if (loadingAnimation) {
          clearInterval(loadingAnimation);
          loadingAnimation = null;
          process.stdout.write("\r\x1b[K"); // Clear current line
        }

        if (!hasOutput) {
          console.log(chalk.gray("   (no output)"));
        }

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command exited with code ${code}`));
        }
      });

      child.on("error", (error) => {
        // Stop loading animation on error
        if (loadingAnimation) {
          clearInterval(loadingAnimation);
          loadingAnimation = null;
          process.stdout.write("\r\x1b[K"); // Clear current line
        }
        reject(new Error(`Failed to execute command: ${error.message}`));
      });

      // Set timeout (default 60 seconds)
      const timeout = command.timeout || 60000;
      setTimeout(() => {
        child.kill();
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Execute a single template command (legacy method - kept for compatibility)
   */
  private async executeCommand(
    command: TemplateCommand,
    templateDir: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const workingDir = command.workingDirectory
        ? path.join(templateDir, command.workingDirectory)
        : templateDir;

      // Check if working directory exists
      if (!fs.existsSync(workingDir)) {
        reject(new Error(`Working directory not found: ${workingDir}`));
        return;
      }

      // Parse command and arguments
      const [cmd, ...args] = command.command.split(" ");

      const child = spawn(cmd, args, {
        cwd: workingDir,
        stdio: ["pipe", "pipe", "pipe"],
        shell: true,
      });

      let output = "";
      let errorOutput = "";

      child.stdout?.on("data", (data) => {
        output += data.toString();
      });

      child.stderr?.on("data", (data) => {
        errorOutput += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `Command exited with code ${code}. Error: ${
                errorOutput || output
              }`
            )
          );
        }
      });

      child.on("error", (error) => {
        reject(new Error(`Failed to execute command: ${error.message}`));
      });

      // Set timeout (default 60 seconds)
      const timeout = command.timeout || 60000;
      setTimeout(() => {
        child.kill();
        reject(new Error(`Command timed out after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    try {
      await fs.remove(this.tempDir);
    } catch (_error) {
      // Ignore cleanup errors
      console.warn(chalk.yellow("Warning: Could not clean up temporary files"));
    }
  }

  /**
   * Start cool loading animation while waiting for command output
   */
  private startLoadingAnimation(command: string): NodeJS.Timeout {
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    const colors = [chalk.cyan, chalk.blue, chalk.magenta, chalk.green];
    let frameIndex = 0;
    let colorIndex = 0;

    const loadingInterval = setInterval(() => {
      const frame = frames[frameIndex];
      const color = colors[colorIndex];
      const message = command.includes("install")
        ? "📦 Installing dependencies..."
        : "⚡ Running command...";

      process.stdout.write(`\r   ${color(frame)} ${message}`);

      frameIndex = (frameIndex + 1) % frames.length;
      if (frameIndex === 0) {
        colorIndex = (colorIndex + 1) % colors.length;
      }
    }, 80);

    return loadingInterval;
  }
}

/**
 * Create a template loader instance
 */
export function createTemplateLoader(): TemplateLoader {
  return new TemplateLoader();
}
