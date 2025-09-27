// src/sdk-paths.ts
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve a template path relative to this package.
 */
export function resolveTemplatePath(templatePath: string): string {
  return path.join(__dirname, "..", "templates", templatePath);
}

/**
 * Get the templates directory inside this package.
 */
export function getTemplatesDirectory(): string {
  return path.join(__dirname, "..", "templates");
}

/**
 * Check if a template exists inside the package.
 */
export async function templateExists(templatePath: string): Promise<boolean> {
  const full = resolveTemplatePath(templatePath);
  try {
    await fs.access(full);
    return true;
  } catch {
    return false;
  }
}
