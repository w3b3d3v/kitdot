/**
 * AGENTS.md Template Integration Test Suite
 *
 * Tests the automatic copying of AGENTS.md file during template initialization
 * across different project types and configurations.
 */

import fs from "fs-extra";
import path from "path";
import { TemplateLoader } from "../src/utils/template-loader.js";
import { setupContracts } from "../src/utils/setup-contracts.js";
import { ProjectConfig } from "../src/types.js";

const TEST_TEMP_DIR = "/tmp/kitdot-agents-test";
const AGENTS_SOURCE_PATH = path.join(process.cwd(), "templates/llms/AGENTS.md");

describe("AGENTS.md Template Integration", () => {
  let originalCwd: string;

  beforeAll(async () => {
    originalCwd = process.cwd();
    // Ensure AGENTS.md source file exists for testing
    await fs.ensureDir(path.dirname(AGENTS_SOURCE_PATH));
    if (!(await fs.pathExists(AGENTS_SOURCE_PATH))) {
      await fs.writeFile(AGENTS_SOURCE_PATH, "# Test AGENTS.md Content");
    }
  });

  beforeEach(async () => {
    // Clean up temp directory before each test
    await fs.remove(TEST_TEMP_DIR);
    await fs.ensureDir(TEST_TEMP_DIR);
  });

  afterAll(async () => {
    // Clean up temp directory after all tests
    await fs.remove(TEST_TEMP_DIR);
  });

  describe("TemplateLoader AGENTS.md Copy", () => {
    test("should copy AGENTS.md for frontend project", async () => {
      const config: ProjectConfig = {
        name: "test-frontend",
        type: "frontend",
        directory: path.join(TEST_TEMP_DIR, "test-frontend"),
        features: { contracts: false, frontend: true },
        template: {
          name: "test-template",
          source: { type: "local", localPath: "templates/default/frontend" },
        },
        installRustTools: false,
      };

      await fs.ensureDir(config.directory);
      await fs.ensureDir(path.join(process.cwd(), "templates/default/frontend"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/frontend/package.json"),
        JSON.stringify({ name: "test-frontend" })
      );

      const templateLoader = new TemplateLoader();
      const templateDefinition = {
        name: "test-template",
        description: "Test frontend template",
        framework: "React",
        category: "frontend" as const,
        features: ["react", "typescript"],
        source: { type: "local" as const, localPath: "templates/default/frontend" },
      };

      await templateLoader.loadTemplate(templateDefinition, config.directory, config);

      // Verify AGENTS.md was copied to project root
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(true);
    });

    test("should copy AGENTS.md for fullstack project with template at root", async () => {
      const config: ProjectConfig = {
        name: "test-fullstack",
        type: "fullstack",
        directory: path.join(TEST_TEMP_DIR, "test-fullstack"),
        features: { contracts: true, frontend: true },
        template: {
          name: "test-fullstack-template",
          source: { type: "local", localPath: "templates/default" },
        },
        installRustTools: false,
      };

      await fs.ensureDir(config.directory);
      await fs.ensureDir(path.join(process.cwd(), "templates/default"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/package.json"),
        JSON.stringify({ name: "test-fullstack" })
      );

      const templateLoader = new TemplateLoader();
      const templateDefinition = {
        name: "test-fullstack-template",
        description: "Test fullstack template",
        framework: "React + Hardhat",
        category: "fullstack" as const,
        features: ["react", "hardhat", "typescript"],
        source: { type: "local" as const, localPath: "templates/default" },
      };

      await templateLoader.loadTemplate(templateDefinition, config.directory, config);

      // Verify AGENTS.md was copied to project root
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(true);
    });

    test("should copy AGENTS.md to project root when template placed in frontend subdirectory", async () => {
      const config: ProjectConfig = {
        name: "test-fullstack-frontend",
        type: "fullstack",
        directory: path.join(TEST_TEMP_DIR, "test-fullstack-frontend"),
        features: { contracts: true, frontend: true },
        template: {
          name: "test-frontend-template",
          source: { type: "local", localPath: "templates/default/frontend" },
        },
        installRustTools: false,
      };

      const frontendDir = path.join(config.directory, "frontend");
      await fs.ensureDir(frontendDir);
      await fs.ensureDir(path.join(process.cwd(), "templates/default/frontend"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/frontend/package.json"),
        JSON.stringify({ name: "test-frontend" })
      );

      const templateLoader = new TemplateLoader();
      const templateDefinition = {
        name: "test-frontend-template",
        description: "Test frontend template for fullstack",
        framework: "React",
        category: "frontend" as const,
        features: ["react", "typescript"],
        source: { type: "local" as const, localPath: "templates/default/frontend" },
      };

      await templateLoader.loadTemplate(templateDefinition, frontendDir, config);

      // Verify AGENTS.md was copied to project root (not frontend subdirectory)
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(true);

      // Verify AGENTS.md was NOT copied to frontend subdirectory
      const agentsSubdirPath = path.join(frontendDir, "AGENTS.md");
      expect(await fs.pathExists(agentsSubdirPath)).toBe(false);
    });

    test("should handle gracefully when AGENTS.md source doesn't exist", async () => {
      // Temporarily remove AGENTS.md source
      const backupPath = AGENTS_SOURCE_PATH + ".backup";
      if (await fs.pathExists(AGENTS_SOURCE_PATH)) {
        await fs.move(AGENTS_SOURCE_PATH, backupPath);
      }

      const config: ProjectConfig = {
        name: "test-no-agents",
        type: "frontend",
        directory: path.join(TEST_TEMP_DIR, "test-no-agents"),
        features: { contracts: false, frontend: true },
        template: {
          name: "test-template",
          source: { type: "local", localPath: "templates/default/frontend" },
        },
        installRustTools: false,
      };

      await fs.ensureDir(config.directory);
      await fs.ensureDir(path.join(process.cwd(), "templates/default/frontend"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/frontend/package.json"),
        JSON.stringify({ name: "test-frontend" })
      );

      const templateLoader = new TemplateLoader();
      const templateDefinition = {
        name: "test-template",
        description: "Test frontend template",
        framework: "React",
        category: "frontend" as const,
        features: ["react", "typescript"],
        source: { type: "local" as const, localPath: "templates/default/frontend" },
      };

      // Should not throw error even when AGENTS.md doesn't exist
      await expect(
        templateLoader.loadTemplate(templateDefinition, config.directory, config)
      ).resolves.not.toThrow();

      // Verify AGENTS.md was not copied (since source doesn't exist)
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(false);

      // Restore AGENTS.md source
      if (await fs.pathExists(backupPath)) {
        await fs.move(backupPath, AGENTS_SOURCE_PATH);
      }
    });
  });

  describe("Backend Contracts Setup AGENTS.md Copy", () => {
    test("should copy AGENTS.md for backend-only project", async () => {
      const config: ProjectConfig = {
        name: "test-backend",
        type: "backend",
        directory: path.join(TEST_TEMP_DIR, "test-backend"),
        features: { contracts: true, frontend: false },
        installRustTools: false,
      };

      await fs.ensureDir(config.directory);
      await fs.ensureDir(path.join(process.cwd(), "templates/default/contracts"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/contracts/package.json"),
        JSON.stringify({ name: "test-contracts" })
      );

      await setupContracts(config);

      // Verify AGENTS.md was copied to project root
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(true);
    });

    test("should NOT copy AGENTS.md for fullstack project (to avoid duplication)", async () => {
      const config: ProjectConfig = {
        name: "test-fullstack-contracts",
        type: "fullstack",
        directory: path.join(TEST_TEMP_DIR, "test-fullstack-contracts"),
        features: { contracts: true, frontend: true },
        installRustTools: false,
      };

      const contractsDir = path.join(config.directory, "contracts");
      await fs.ensureDir(contractsDir);
      await fs.ensureDir(path.join(process.cwd(), "templates/default/contracts"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/contracts/package.json"),
        JSON.stringify({ name: "test-contracts" })
      );

      await setupContracts(config);

      // Verify AGENTS.md was NOT copied (should be handled by template loader)
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(false);
    });

    test("should handle gracefully when AGENTS.md source doesn't exist in backend setup", async () => {
      // Temporarily remove AGENTS.md source
      const backupPath = AGENTS_SOURCE_PATH + ".backup";
      if (await fs.pathExists(AGENTS_SOURCE_PATH)) {
        await fs.move(AGENTS_SOURCE_PATH, backupPath);
      }

      const config: ProjectConfig = {
        name: "test-backend-no-agents",
        type: "backend",
        directory: path.join(TEST_TEMP_DIR, "test-backend-no-agents"),
        features: { contracts: true, frontend: false },
        installRustTools: false,
      };

      await fs.ensureDir(config.directory);
      await fs.ensureDir(path.join(process.cwd(), "templates/default/contracts"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/contracts/package.json"),
        JSON.stringify({ name: "test-contracts" })
      );

      // Should not throw error even when AGENTS.md doesn't exist
      await expect(setupContracts(config)).resolves.not.toThrow();

      // Verify AGENTS.md was not copied (since source doesn't exist)
      const agentsPath = path.join(config.directory, "AGENTS.md");
      expect(await fs.pathExists(agentsPath)).toBe(false);

      // Restore AGENTS.md source
      if (await fs.pathExists(backupPath)) {
        await fs.move(backupPath, AGENTS_SOURCE_PATH);
      }
    });
  });

  describe("Cross-platform Path Handling", () => {
    test("should handle Windows-style paths correctly", () => {
      const targetPath = "C:\\Users\\test\\project\\frontend";
      const expectedRoot = "C:\\Users\\test\\project";

      // Mock path operations for Windows-style paths
      const windowsPath = targetPath.replace(/\//g, "\\");
      const isSubdirectory = windowsPath.endsWith("\\frontend") || windowsPath.endsWith("\\contracts");

      expect(isSubdirectory).toBe(true);

      if (isSubdirectory) {
        const root = path.dirname(windowsPath);
        expect(root.replace(/\//g, "\\")).toBe(expectedRoot);
      }
    });

    test("should handle Unix-style paths correctly", () => {
      const targetPath = "/home/user/project/frontend";
      const expectedRoot = "/home/user/project";

      const isSubdirectory = targetPath.endsWith("/frontend") || targetPath.endsWith("/contracts");

      expect(isSubdirectory).toBe(true);

      if (isSubdirectory) {
        const root = path.dirname(targetPath);
        expect(root).toBe(expectedRoot);
      }
    });
  });

  describe("Error Handling", () => {
    test("should continue processing even when AGENTS.md copy fails", async () => {
      const config: ProjectConfig = {
        name: "test-error-handling",
        type: "frontend",
        directory: path.join(TEST_TEMP_DIR, "test-error-handling"),
        features: { contracts: false, frontend: true },
        template: {
          name: "test-template",
          source: { type: "local", localPath: "templates/default/frontend" },
        },
        installRustTools: false,
      };

      // Create read-only directory to cause permission error
      await fs.ensureDir(config.directory);
      await fs.chmod(config.directory, 0o444); // Read-only

      await fs.ensureDir(path.join(process.cwd(), "templates/default/frontend"));
      await fs.writeFile(
        path.join(process.cwd(), "templates/default/frontend/package.json"),
        JSON.stringify({ name: "test-frontend" })
      );

      const templateLoader = new TemplateLoader();
      const templateDefinition = {
        name: "test-template",
        description: "Test frontend template",
        framework: "React",
        category: "frontend" as const,
        features: ["react", "typescript"],
        source: { type: "local" as const, localPath: "templates/default/frontend" },
      };

      // Should not throw error even when file copy fails
      await expect(
        templateLoader.loadTemplate(templateDefinition, config.directory, config)
      ).resolves.not.toThrow();

      // Restore permissions for cleanup
      await fs.chmod(config.directory, 0o755);
    });
  });
});