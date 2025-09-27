#!/usr/bin/env node

/**
 * Integration test for default template functionality
 */

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDefaultTemplateIntegration() {
  console.log("🧪 Testing default template integration...");

  try {
    // Test 1: Check if default template exists in registry
    const { TEMPLATE_REGISTRY } = await import(
      "../dist/templatesManager/registry.js"
    );

    console.log("✅ Template registry loaded");

    if (!TEMPLATE_REGISTRY.default) {
      throw new Error("Default template not found in registry");
    }

    console.log("✅ Default template found in registry");
    console.log("   Name:", TEMPLATE_REGISTRY.default.name);
    console.log("   Category:", TEMPLATE_REGISTRY.default.category);
    console.log("   Source type:", TEMPLATE_REGISTRY.default.source.type);
    console.log("   Local path:", TEMPLATE_REGISTRY.default.source.localPath);

    // Test 2: Check if local template directory exists
    const templatePath = path.join(
      __dirname,
      TEMPLATE_REGISTRY.default.source.localPath
    );

    const templateExists = await fs
      .access(templatePath)
      .then(() => true)
      .catch(() => false);
    if (!templateExists) {
      throw new Error(`Template directory not found: ${templatePath}`);
    }

    console.log("✅ Template directory exists:", templatePath);

    // Test 3: Check if required package.json files exist
    const frontendPackageJson = path.join(
      templatePath,
      "frontend",
      "package.json"
    );
    const contractsPackageJson = path.join(
      templatePath,
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
      throw new Error(
        `Frontend package.json not found: ${frontendPackageJson}`
      );
    }
    if (!contractsExists) {
      throw new Error(
        `Contracts package.json not found: ${contractsPackageJson}`
      );
    }

    console.log("✅ Required package.json files exist");

    // Test 4: Check package.json content for personalization targets
    const frontendPkg = JSON.parse(
      await fs.readFile(frontendPackageJson, "utf8")
    );
    const contractsPkg = JSON.parse(
      await fs.readFile(contractsPackageJson, "utf8")
    );

    console.log("✅ Package.json files readable");
    console.log("   Frontend name:", frontendPkg.name);
    console.log("   Contracts name:", contractsPkg.name);

    if (!frontendPkg.name || !contractsPkg.name) {
      throw new Error("Package.json files missing name field");
    }

    // Test 5: Verify TemplateLoader can handle local templates
    const { createTemplateLoader } = await import(
      "../dist/utils/template-loader.js"
    );
    const loader = createTemplateLoader();
    console.log("✅ TemplateLoader created successfully");

    console.log("\n🎉 All default template integration tests passed!");
    console.log("\nNext steps to test manually:");
    console.log("1. Run: npm run dev init my-test-app");
    console.log("2. Select Y for default template");
    console.log(
      '3. Check that package.json files are personalized with "my-test-app"'
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testDefaultTemplateIntegration();
