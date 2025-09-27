// src/sdk-paths.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findTemplatesDir(maxUp = 5): string {
  let dir = __dirname;
  for (let i = 0; i <= maxUp; i++) {
    const candidate = path.join(dir, "templates");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error("templates folder not found (checked up from __dirname)");
}

export function resolveTemplatePath(templatePath: string): string {
  const templatesDir = findTemplatesDir();
  const rel = templatePath.replace(/^templates[\\/]+/, "");
  return path.join(templatesDir, rel);
}

export function getTemplatesDirectory(): string {
  return findTemplatesDir();
}

export function templateExists(templatePath: string): boolean {
  return fs.existsSync(resolveTemplatePath(templatePath));
}
