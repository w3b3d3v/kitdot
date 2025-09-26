import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types.js';
import { resolveTemplatePath } from './sdk-paths.js';

export async function setupContracts(config: ProjectConfig): Promise<void> {
  // Always use default contracts template (backend at root, fullstack in subdirectory)
  await setupDefaultContracts(config);
}

async function setupDefaultContracts(config: ProjectConfig): Promise<void> {
  const defaultContractsPath = await resolveTemplatePath('templates/default/contracts');

  // For backend-only projects, copy directly to root folder
  const targetDir = config.type === 'backend' ? config.directory : path.join(config.directory, 'contracts');

  // Copy the default contracts template
  await fs.copy(defaultContractsPath, targetDir, {
    filter: (src) => {
      const basename = path.basename(src);
      // Exclude node_modules and other build artifacts
      return !['node_modules', '.git', 'dist', 'build'].includes(basename);
    }
  });

  // Copy AGENTS.md to project root for backend-only projects
  if (config.type === 'backend') {
    await copyAgentsFile(config.directory);
  }

  // Personalize package.json with project name
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    // For backend-only, use project name directly; for fullstack, add -contracts suffix
    packageJson.name = config.type === 'backend' ? config.name : `${config.name}-contracts`;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

async function copyAgentsFile(projectRootPath: string): Promise<void> {
  try {
    const agentsSourcePath = await resolveTemplatePath('templates/llms/AGENTS.md');
    const agentsTargetPath = path.join(projectRootPath, 'AGENTS.md');

    // Check if source file exists
    if (await fs.pathExists(agentsSourcePath)) {
      await fs.copy(agentsSourcePath, agentsTargetPath);
    }
  } catch (error) {
    // Log warning but don't fail the whole process
    console.warn(`Warning: Could not copy AGENTS.md: ${error}`);
  }
}

