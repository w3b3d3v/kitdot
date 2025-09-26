import path from "path";
import fs from "fs-extra";

/**
 * SDK Path Resolution Utilities
 *
 * Handles finding the correct SDK root directory for template loading
 * regardless of installation method or execution context.
 */

/**
 * Find the SDK root directory by looking for package.json with 'kitdot' name
 * Works for both development mode and installed packages
 */
export async function findSDKRoot(): Promise<string> {
  // Try current working directory first (development mode)
  const cwd = process.cwd();
  if (await isSDKRoot(cwd)) {
    return cwd;
  }

  // Try directory containing the current script
  let currentFile: string;
  let currentDir: string;

  try {
    // Try to get current file path using various methods
    const { fileURLToPath } = await import('url');
    // Use eval to avoid TypeScript compile-time checking of import.meta
    const metaUrl = eval('import.meta.url');
    if (metaUrl) {
      currentFile = fileURLToPath(metaUrl);
      currentDir = path.dirname(currentFile);
    } else {
      throw new Error('import.meta not available');
    }
  } catch {
    // Fallback for test environments or other contexts
    currentDir = (typeof __dirname !== 'undefined' ? __dirname : process.cwd());
  }

  // Walk up the directory tree looking for the SDK root
  while (currentDir !== path.dirname(currentDir)) {
    if (await isSDKRoot(currentDir)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  // Fallback: try node_modules/kitdot structure for global installs
  const nodeModulesPath = await findInNodeModules();
  if (nodeModulesPath) {
    return nodeModulesPath;
  }

  // Last resort: use current working directory and log warning
  console.warn("Warning: Could not detect SDK root directory. Using current working directory.");
  return cwd;
}

/**
 * Check if a directory is the SDK root by looking for package.json with 'kitdot' name
 */
async function isSDKRoot(dir: string): Promise<boolean> {
  try {
    const packageJsonPath = path.join(dir, "package.json");
    if (!(await fs.pathExists(packageJsonPath))) {
      return false;
    }

    const packageJson = await fs.readJson(packageJsonPath);
    return packageJson.name === "kitdot";
  } catch {
    return false;
  }
}

/**
 * Try to find kitdot in node_modules (for global installations)
 */
async function findInNodeModules(): Promise<string | null> {
  // Look for global node_modules/kitdot
  let currentDir: string;

  try {
    // Try to get current file path using various methods
    const { fileURLToPath } = await import('url');
    // Use eval to avoid TypeScript compile-time checking of import.meta
    const metaUrl = eval('import.meta.url');
    if (metaUrl) {
      const currentFile = fileURLToPath(metaUrl);
      currentDir = path.dirname(currentFile);
    } else {
      throw new Error('import.meta not available');
    }
  } catch {
    // Fallback for test environments or other contexts
    currentDir = (typeof __dirname !== 'undefined' ? __dirname : process.cwd());
  }

  while (currentDir !== path.dirname(currentDir)) {
    const nodeModulesKitdot = path.join(currentDir, "node_modules", "kitdot");
    if (await fs.pathExists(nodeModulesKitdot) && await isSDKRoot(nodeModulesKitdot)) {
      return nodeModulesKitdot;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Resolve a template path relative to the SDK root
 * @param templatePath - Path relative to SDK root (e.g., "templates/default")
 * @returns Absolute path to the template
 */
export async function resolveTemplatePath(templatePath: string): Promise<string> {
  const sdkRoot = await findSDKRoot();
  return path.join(sdkRoot, templatePath);
}

/**
 * Get the templates directory path
 */
export async function getTemplatesDirectory(): Promise<string> {
  return await resolveTemplatePath("templates");
}

/**
 * Check if a template exists at the given path
 * @param templatePath - Path relative to SDK root (e.g., "templates/default")
 */
export async function templateExists(templatePath: string): Promise<boolean> {
  const absolutePath = await resolveTemplatePath(templatePath);
  return await fs.pathExists(absolutePath);
}