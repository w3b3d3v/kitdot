/**
 * Template Validation Test Suite
 *
 * Tests all remote templates in the registry to ensure they are accessible
 * and can be downloaded successfully using degit.
 */

import degit from "degit";
import fs from "fs-extra";
import path from "path";

// Import template registry directly from source
import { TEMPLATE_REGISTRY } from "../src/templatesManager/registry.js";

const TEST_TEMP_DIR = "/tmp/kitdot-template-validation";

describe("Template Validation", () => {
  beforeEach(async () => {
    // Clean up temp directory before each test
    await fs.remove(TEST_TEMP_DIR);
    await fs.ensureDir(TEST_TEMP_DIR);
  });

  afterAll(async () => {
    // Clean up temp directory after all tests
    await fs.remove(TEST_TEMP_DIR);
  });

  // Get all remote templates from registry
  const remoteTemplates = Object.entries(TEMPLATE_REGISTRY)
    .filter(([_, template]) => template.source.type === "remote")
    .map(([key, template]) => ({ key, ...template }));

  if (remoteTemplates.length === 0) {
    test("should find remote templates in registry", () => {
      expect(remoteTemplates.length).toBeGreaterThan(0);
    });
  }

  // Create individual test for each remote template
  remoteTemplates.forEach((template) => {
    test(`should validate template: ${template.key}`, async () => {
      const { source } = template;

      // Build degit source string
      let degitSource = source.repository!;

      if (source.directory) {
        degitSource += `/${source.directory}`;
      }

      if (source.branch && source.branch !== "main") {
        degitSource += `#${source.branch}`;
      }

      const tempPath = path.join(TEST_TEMP_DIR, `template-${template.key}`);

      try {
        // Create degit emitter
        const emitter = degit(degitSource, {
          cache: false, // Don't use cache for tests to ensure fresh validation
          force: true,
          verbose: false,
        });

        // Attempt to clone the template
        await emitter.clone(tempPath);

        // Verify the template was downloaded
        expect(await fs.pathExists(tempPath)).toBe(true);

        // Verify it's not empty
        const files = await fs.readdir(tempPath);
        expect(files.length).toBeGreaterThan(0);

        // For templates with package.json, verify it's valid JSON
        const packageJsonPath = path.join(tempPath, "package.json");
        if (await fs.pathExists(packageJsonPath)) {
          const packageJson = await fs.readJson(packageJsonPath);
          expect(packageJson).toHaveProperty("name");
        }
      } catch (error) {
        // If clone fails, the test should fail with detailed error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to validate template '${template.key}' from ${degitSource}: ${errorMessage}`
        );
      }
    }, 30000); // 30 second timeout per template
  });

  test("should have valid registry structure", () => {
    // Validate the registry structure itself
    expect(typeof TEMPLATE_REGISTRY).toBe("object");
    expect(Object.keys(TEMPLATE_REGISTRY).length).toBeGreaterThan(0);

    // Validate each template has required fields
    Object.entries(TEMPLATE_REGISTRY).forEach(([key, template]) => {
      expect(template).toHaveProperty("name");
      expect(template).toHaveProperty("description");
      expect(template).toHaveProperty("framework");
      expect(template).toHaveProperty("category");
      expect(template).toHaveProperty("source");
      expect(template).toHaveProperty("features");

      // Validate source structure
      expect(template.source).toHaveProperty("type");

      if (template.source.type === "remote") {
        expect(template.source).toHaveProperty("repository");
        expect(template.source).toHaveProperty("branch");
        expect(typeof template.source.repository).toBe("string");
        expect(typeof template.source.branch).toBe("string");
      } else if (template.source.type === "local") {
        expect(template.source).toHaveProperty("localPath");
        expect(typeof template.source.localPath).toBe("string");
      }

      // Validate optional optionalSetup structure
      if (template.optionalSetup) {
        expect(template.optionalSetup).toHaveProperty("commands");
        expect(Array.isArray(template.optionalSetup.commands)).toBe(true);

        template.optionalSetup.commands.forEach((command, cmdIndex) => {
          expect(command).toHaveProperty("command");
          expect(typeof command.command).toBe("string");
          expect(command.command.trim().length).toBeGreaterThan(0);

          // Optional fields validation
          if (command.workingDirectory) {
            expect(typeof command.workingDirectory).toBe("string");
          }
          if (command.description) {
            expect(typeof command.description).toBe("string");
          }
          if (command.timeout) {
            expect(typeof command.timeout).toBe("number");
            expect(command.timeout).toBeGreaterThan(0);
          }
        });

        // Optional description validation
        if (template.optionalSetup.description) {
          expect(typeof template.optionalSetup.description).toBe("string");
        }
      }
    });
  });

  test("should not have templates with master branch", () => {
    // Ensure all templates use 'main' branch or specify a different valid branch
    const templatesWithMaster = Object.entries(TEMPLATE_REGISTRY).filter(
      ([_, template]) =>
        template.source.type === "remote" && template.source.branch === "master"
    );

    expect(templatesWithMaster).toHaveLength(0);

    if (templatesWithMaster.length > 0) {
      const templateNames = templatesWithMaster.map(([key]) => key).join(", ");
      throw new Error(
        `Templates using 'master' branch found: ${templateNames}. Update to 'main' or correct branch.`
      );
    }
  });

  test("should validate templates with optionalSetup instructions", () => {
    // Find templates with optionalSetup instructions
    const templatesWithOptionalSetup = Object.entries(TEMPLATE_REGISTRY)
      .filter(([_, template]) => template.optionalSetup)
      .map(([key, template]) => ({ key, ...template }));

    // Validate that optionalSetup templates have proper structure
    templatesWithOptionalSetup.forEach((template) => {
      expect(template.optionalSetup).toBeDefined();
      expect(template.optionalSetup!.commands).toBeDefined();
      expect(template.optionalSetup!.commands.length).toBeGreaterThan(0);

      // Validate each command
      template.optionalSetup!.commands.forEach((command) => {
        expect(command.command).toBeTruthy();
        expect(command.command.trim()).not.toBe("");

        // If timeout is specified, it should be reasonable (between 10s and 10 minutes)
        if (command.timeout) {
          expect(command.timeout).toBeGreaterThanOrEqual(10000); // At least 10 seconds
          expect(command.timeout).toBeLessThanOrEqual(600000); // At most 10 minutes
        }
      });
    });

    // Log templates with optionalSetup for verification
    if (templatesWithOptionalSetup.length > 0) {
      console.log(
        "Templates with optional setup instructions:",
        templatesWithOptionalSetup.map((t) => t.key).join(", ")
      );
    }
  });
});
