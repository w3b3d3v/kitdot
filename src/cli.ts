#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { initCommand } from "./commands/init.js";
import { toolsCommand } from "./commands/tools.js";

const program = new Command();

program
  .name("kitdot")
  .description("A TypeScript SDK toolkit for building Dapps on Polkadot Cloud")
  .version("0.1.0")
  .addHelpText(
    "after",
    "\nDevelopment Tools:\n  kitdot tools install-rust  Install Rust toolchain\n  kitdot tools check         Check tool status\n"
  );

program
  .command("init")
  .description("Initialize a new Polkadot Dapp project")
  .argument("[project-name]", "Name of the project")
  .option("-d, --dir <directory>", "Target directory for the project")
  .action(initCommand);

program
  .command("tools")
  .description("Manage development tools (Rust, Pop-CLI, etc.)")
  .argument("[subcommand]", "Tools subcommand: install-rust, check")
  .action(toolsCommand);

program
  .command("build")
  .description("Build the project")
  .action(() => {
    console.log(chalk.yellow("Build command coming soon!"));
  });

program
  .command("deploy")
  .description("Deploy contracts or frontend")
  .action(() => {
    console.log(chalk.yellow("Deploy command coming soon!"));
  });

program.parse();
