#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { installCommand } from "./commands/install.js";

const program = new Command();

program
  .name("kitdot")
  .description("A TypeScript SDK toolkit for building Dapps on Polkadot Cloud")
  .version("0.2.4")
  .addHelpText(
    "after",
    "\nQuick Start:\n  kitdot install             Create new project (alias for init)\n  kitdot -y                  Create project with default template\n  kitdot init                Interactive project creation\n\nDevelopment Tools:\n  kitdot tools install-rust  Install Rust toolchain\n  kitdot tools check         Check tool status\n\n" +
      chalk.blue("📋 Get Started Fast") +
      "\n" +
      chalk.gray("Follow these steps to create a full-stack Polkadot Dapp:\n") +
      "\n1. " +
      chalk.blue("Create new project") +
      "\n   " +
      chalk.gray("Create a project with React frontend and smart contracts") +
      "\n   " +
      chalk.yellow("kitdot install") +
      " or " +
      chalk.yellow("kitdot -y") +
      "\n\n2. " +
      chalk.blue("Navigate to project") +
      "\n   " +
      chalk.gray("Enter your project directory") +
      "\n   " +
      chalk.yellow("cd your-project-name") +
      "\n\n3. " +
      chalk.blue("Start frontend development") +
      "\n   " +
      chalk.gray("Install dependencies and start the frontend") +
      "\n   " +
      chalk.yellow("cd frontend && npm install && npm run dev") +
      "\n\n4. " +
      chalk.blue("Start contracts development") +
      "\n   " +
      chalk.gray("Install dependencies and compile contracts") +
      "\n   " +
      chalk.yellow("cd contracts && npm install && npx hardhat compile") +
      "\n"
  );

program
  .command("init")
  .description("Initialize a new Polkadot Dapp project")
  .argument("[project-name]", "Name of the project")
  .option("-d, --dir <directory>", "Target directory for the project")
  .option("-y, --yes", "Use default template without prompts")
  .action(initCommand);

program
  .command("install")
  .description("Initialize a new Polkadot Dapp project (same as init)")
  .argument("[project-name]", "Name of the project")
  .option("-d, --dir <directory>", "Target directory for the project")
  .option("-y, --yes", "Use default template without prompts")
  .addHelpText(
    "after",
    "\nThe install command is an alias for init:\n  kitdot install          Interactive project creation\n  kitdot install -y       Create project with default template\n  kitdot install my-app   Create project named 'my-app'\n"
  )
  .action(installCommand);

// Tools command with subcommands
const toolsProgram = program
  .command("tools")
  .description("Manage development tools (Rust, Pop-CLI, etc.)")
  .addHelpText(
    "after",
    "\nAvailable tools commands:\n  kitdot tools install-rust  Install Rust toolchain\n  kitdot tools check         Check tool status\n"
  );

toolsProgram
  .command("install-rust")
  .description("Install Rust toolchain for blockchain development")
  .addHelpText(
    "after",
    "\nInstalls the Rust toolchain required for Polkadot smart contract development.\nThis includes rustc, cargo, and wasm32 target for WebAssembly compilation.\n"
  )
  .action(async () => {
    const { toolsCommand } = await import("./commands/tools.js");
    await toolsCommand("install-rust");
  });

toolsProgram
  .command("check")
  .description("Check status of development tools")
  .addHelpText(
    "after",
    "\nChecks if required development tools are installed and properly configured.\nShows platform information and tool versions.\n"
  )
  .action(async () => {
    const { toolsCommand } = await import("./commands/tools.js");
    await toolsCommand("check");
  });

// Fallback for 'tools' without subcommand
toolsProgram.action(async () => {
  const { toolsCommand } = await import("./commands/tools.js");
  await toolsCommand();
});

// Handle -y flag at top level before commander parsing
const args = process.argv.slice(2);
if (args.includes("-y") && !args.includes("init")) {
  // Convert "kitdot -y" to "kitdot init -y"
  const yIndex = args.indexOf("-y");
  args.splice(yIndex, 1); // Remove -y
  args.unshift("init", "-y"); // Add init -y at the beginning
  // Update process.argv for commander to parse
  process.argv = [process.argv[0], process.argv[1], ...args];
}

// Handle unknown commands with helpful error
program.on("command:*", (operands) => {
  console.error(chalk.red(`❌ Unknown command: ${operands[0]}`));
  console.log(chalk.yellow("\nDid you mean one of these?"));
  console.log(
    chalk.cyan(
      "  kitdot install             Create new project (alias for init)"
    )
  );
  console.log(
    chalk.cyan("  kitdot init                Initialize a new project")
  );
  console.log(
    chalk.cyan("  kitdot tools               Manage development tools")
  );
  console.log(
    chalk.cyan("  kitdot -y                  Quick start with default template")
  );
  console.log(chalk.gray('\nRun "kitdot --help" for all available commands.'));
  process.exit(1);
});

program.parse();
