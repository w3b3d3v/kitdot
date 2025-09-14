import path from "path";
import { ProjectConfig } from "../types.js";
import { createTemplateLoader } from "./template-loader.js";
import { getTemplate } from "../templates/registry.js";

export async function setupFrontend(config: ProjectConfig): Promise<void> {
  // Ensure template is specified - no fallback
  if (!config.template) {
    throw new Error("Template must be specified for frontend setup");
  }

  const template = getTemplate(config.template.name);
  if (!template) {
    throw new Error(
      `Template '${config.template.name}' not found in registry`
    );
  }

  // Determine where to place the template based on template category and project type
  const frontendDir = determineFrontendDirectory(config, template);

  const templateLoader = createTemplateLoader();
  try {
    await templateLoader.loadTemplate(template, frontendDir, config);
  } finally {
    await templateLoader.cleanup();
  }
}

function determineFrontendDirectory(config: ProjectConfig, template: { category?: string }): string {
  // Frontend-only projects: always at project root
  if (config.type === 'frontend') {
    return config.directory;
  }
  
  // Fullstack projects:
  if (config.type === 'fullstack') {
    // If template category is 'fullstack', place at project root (template contains both frontend and contracts)
    if (template.category === 'fullstack') {
      return config.directory;
    }
    // If template category is 'frontend', place in 'front' subdirectory (we'll add contracts separately)
    if (template.category === 'frontend') {
      return path.join(config.directory, "front");
    }
  }
  
  // Fallback to project root
  return config.directory;
}
