import { initCommand } from "./init.js";

export async function installCommand(projectName: string | undefined, options: {
  yes?: boolean;
  dir?: string;
}) {
  // Install command is simply a wrapper for init command
  // Delegate directly to init with the same arguments and options
  await initCommand(projectName, { dir: options.dir, yes: options.yes });
}