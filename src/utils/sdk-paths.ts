// src/sdk-paths.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of this source file
// In production: dist/utils/sdk-paths.js
// In development: src/utils/sdk-paths.ts
function getFileDir(): string {
  return path.dirname(fileURLToPath(import.meta.url));
}

// Find the SDK root by searching upward from this file's location
// This works whether the package is installed globally or run from source
function findSDKRootSync(): string {
  let dir = getFileDir();
  const maxUp = 10; // Search up to 10 levels

  for (let i = 0; i < maxUp; i++) {
    const packageJsonPath = path.join(dir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        // Check if this is the kitdot package
        if (pkg.name === 'kitdot') {
          return dir;
        }
      } catch (_e) {
        // Invalid package.json, continue searching
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break; // Reached root
    dir = parent;
  }

  // Fallback: search from cwd (useful for tests)
  dir = process.cwd();
  for (let i = 0; i < maxUp; i++) {
    const packageJsonPath = path.join(dir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (pkg.name === 'kitdot') {
          return dir;
        }
      } catch (_e) {
        // Invalid package.json, continue searching
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  throw new Error('Could not find kitdot package root');
}

// Cache the SDK root
let _sdkRoot: string | null = null;

function getSDKRoot(): string {
  if (!_sdkRoot) {
    _sdkRoot = findSDKRootSync();
  }
  return _sdkRoot;
}

export async function findSDKRoot(): Promise<string> {
  return getSDKRoot();
}

function findTemplatesDir(): string {
  const sdkRoot = getSDKRoot();
  const templatesPath = path.join(sdkRoot, "templates");

  if (fs.existsSync(templatesPath)) {
    return templatesPath;
  }

  throw new Error(`templates folder not found in SDK root: ${sdkRoot}`);
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
