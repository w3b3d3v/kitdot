#!/usr/bin/env node

/**
 * Test for template personalization functionality
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createTemplateLoader } from "../dist/utils/template-loader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPersonalization() {
  console.log("🧪 Testing template personalization...");

  const tempDir = path.join(__dirname, "test-output");
  const projectName = "my-awesome-dapp";

  try {
    // Clean up any existing test output
    await fs.rm(tempDir, { recursive: true, force: true });

    // Create test config
    const config = {
      name: projectName,
      type: "fullstack",
      directory: tempDir,
      features: {
        contracts: true,
        frontend: true,
        documentation: true,
      },
      template: {
        name: "default",
        source: {
          type: "local",
          localPath: "templates/default",
        },
      },
    };

    // Create template loader and load template
    const loader = createTemplateLoader();

    // Mock template definition
    const template = {
      name: "Default Polkadot DApp",
      description:
        "Local default template with React frontend and Hardhat contracts",
      framework: "React",
      category: "fullstack",
      source: {
        type: "local",
        localPath: "templates/default",
      },
      features: [
        "React",
        "TypeScript",
        "Vite",
        "Tailwind CSS",
        "Solidity",
        "Hardhat",
      ],
    };

    console.log("✅ Loading template with personalization...");
    await loader.loadTemplate(template, tempDir, config);

    console.log("✅ Template loaded, checking personalization...");

    // Check if personalization worked
    const frontendPackageJson = path.join(tempDir, "frontend", "package.json");
    const contractsPackageJson = path.join(
      tempDir,
      "contracts",
      "package.json"
    );

    const frontendExists = await fs
      .access(frontendPackageJson)
      .then(() => true)
      .catch(() => false);
    const contractsExists = await fs
      .access(contractsPackageJson)
      .then(() => true)
      .catch(() => false);

    if (!frontendExists) {
      throw new Error("Frontend package.json not found after template loading");
    }
    if (!contractsExists) {
      throw new Error(
        "Contracts package.json not found after template loading"
      );
    }

    const frontendPkg = JSON.parse(
      await fs.readFile(frontendPackageJson, "utf8")
    );
    const contractsPkg = JSON.parse(
      await fs.readFile(contractsPackageJson, "utf8")
    );

    console.log("✅ Package.json files found");
    console.log("   Frontend name:", frontendPkg.name);
    console.log("   Contracts name:", contractsPkg.name);

    // Verify personalization
    const expectedFrontendName = `${projectName}-frontend`;
    const expectedContractsName = `${projectName}-contracts`;

    if (frontendPkg.name !== expectedFrontendName) {
      throw new Error(
        `Frontend name not personalized. Expected: ${expectedFrontendName}, Got: ${frontendPkg.name}`
      );
    }

    if (contractsPkg.name !== expectedContractsName) {
      throw new Error(
        `Contracts name not personalized. Expected: ${expectedContractsName}, Got: ${contractsPkg.name}`
      );
    }

    console.log("✅ Package.json files correctly personalized!");

    // Clean up
    await loader.cleanup();
    await fs.rm(tempDir, { recursive: true, force: true });

    console.log("\n🎉 Template personalization test passed!");
  } catch (error) {
    console.error("❌ Personalization test failed:", error.message);

    // Clean up on error
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }

    process.exit(1);
  }
}

testPersonalization();
