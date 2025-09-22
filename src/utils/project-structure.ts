import fs from "fs-extra";
import path from "path";
import { ProjectConfig } from "../types.js";

export async function createProjectStructure(
  config: ProjectConfig
): Promise<void> {
  await fs.ensureDir(config.directory);

  // For frontend-only and backend-only projects, use single repo structure (no subdirectories)
  if (config.type === "frontend" || config.type === "backend") {
    // Single-purpose projects don't need subdirectories
    // Template will be loaded directly to project root
    return;
  }

  // For fullstack projects, create monorepo structure
  const folders = [];

  if (config.features.contracts) {
    folders.push("contracts");
  }

  if (config.features.frontend) {
    folders.push("frontend");
  }

  for (const folder of folders) {
    await fs.ensureDir(path.join(config.directory, folder));
  }

  // Templates provide their own package.json, .gitignore, and README
  // No need to create additional files
}