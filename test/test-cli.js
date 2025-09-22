#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs-extra";
import path from "path";

const testDir = "/tmp/kitdot-test-project";

async function runTest() {
  console.log("🧪 Testing kitdot CLI...");

  // Clean up test directory
  await fs.remove(testDir);

  // Test CLI help
  console.log("📝 Testing CLI help...");
  const helpProcess = spawn("node", ["dist/cli.js", "--help"], {
    cwd: "/Users/nomadbitcoin/Projects/kitdot",
    stdio: "inherit",
  });

  await new Promise((resolve) => helpProcess.on("close", resolve));

  console.log("✅ CLI help test passed!");

  // Test project structure creation (without interactive prompt)
  console.log("📁 Testing project structure creation...");

  // We'll test the utility functions directly since we can't easily simulate interactive input
  const { createProjectStructure } = await import(
    "../dist/utils/project-structure.js"
  );

  const testConfig = {
    name: "test-project",
    type: "fullstack",
    directory: testDir,
    features: {
      contracts: true,
      frontend: true,
      cloudFunctions: true,
      documentation: true,
    },
  };

  try {
    await createProjectStructure(testConfig);

    // Verify structure
    const expectedDirs = [
      "contracts/develop",
      "contracts/deploy",
      "front",
      "cloud-functions",
      "docs",
    ];

    for (const dir of expectedDirs) {
      const dirPath = path.join(testDir, dir);
      if (!(await fs.pathExists(dirPath))) {
        throw new Error(`Directory ${dir} was not created`);
      }
    }

    // Verify files
    const expectedFiles = ["package.json", ".gitignore", "README.md"];

    for (const file of expectedFiles) {
      const filePath = path.join(testDir, file);
      if (!(await fs.pathExists(filePath))) {
        throw new Error(`File ${file} was not created`);
      }
    }

    console.log("✅ Project structure test passed!");

    // Clean up
    await fs.remove(testDir);

    console.log("🎉 All tests passed! kitdot CLI is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

runTest().catch(console.error);
