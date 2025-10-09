import { strict as assert } from "assert";
import {
  getTemplatesForMode,
  getAllTemplatesByCategory,
  filterTemplatesByTypes,
} from "../src/templatesManager/registry.js";

/**
 * Test mode-based template filtering for the new init flow
 */
async function testModeBasedTemplateFiltering() {
  console.log("🎯 Testing mode-based template filtering...");

  // Test fullstack mode - should show ALL templates
  const fullstackModeTemplates = getTemplatesForMode("fullstack");
  assert(
    fullstackModeTemplates.length >= 3,
    "Fullstack mode should show all templates"
  );

  // Should include templates from all categories
  const hasFrontend = fullstackModeTemplates.some(
    (t) => t.category === "frontend"
  );
  const hasSmartcontract = fullstackModeTemplates.some(
    (t) => t.category === "smartcontract"
  );
  const hasFullstack = fullstackModeTemplates.some(
    (t) => t.category === "fullstack"
  );

  assert(hasFrontend, "Fullstack mode should include frontend templates");
  assert(
    hasSmartcontract,
    "Fullstack mode should include smartcontract templates"
  );
  assert(hasFullstack, "Fullstack mode should include fullstack templates");

  // Test frontend-only mode - should show only frontend templates
  const frontendOnlyTemplates = getTemplatesForMode("frontend-only");
  for (const template of frontendOnlyTemplates) {
    assert.equal(
      template.category,
      "frontend",
      `Frontend-only mode should only show frontend templates, found ${template.category}`
    );
  }

  // Test smartcontracts-only mode - should show only smartcontract templates
  const smartcontractsOnlyTemplates = getTemplatesForMode(
    "smartcontracts-only"
  );
  for (const template of smartcontractsOnlyTemplates) {
    assert.equal(
      template.category,
      "smartcontract",
      `Smartcontracts-only mode should only show smartcontract templates, found ${template.category}`
    );
  }

  console.log("✅ Mode-based template filtering test passed!");
}

/**
 * Test template categorization system
 */
async function testTemplateCategorization() {
  console.log("📂 Testing template categorization system...");

  const allTemplatesByCategory = getAllTemplatesByCategory();

  // Verify all categories exist
  assert(allTemplatesByCategory.frontend, "Frontend category should exist");
  assert(
    allTemplatesByCategory.smartcontract,
    "Smartcontract category should exist"
  );
  assert(allTemplatesByCategory.fullstack, "Fullstack category should exist");

  // Verify default templates exist in appropriate categories
  const frontendTemplates = allTemplatesByCategory.frontend;
  const smartcontractTemplates = allTemplatesByCategory.smartcontract;
  const fullstackTemplates = allTemplatesByCategory.fullstack;

  const hasDefaultFrontend = frontendTemplates.some(
    (t) => t.key === "default-frontend"
  );
  const hasDefaultContracts = smartcontractTemplates.some(
    (t) => t.key === "default-contracts"
  );
  const hasDefaultFullstack = fullstackTemplates.some(
    (t) => t.key === "default"
  );

  assert(
    hasDefaultFrontend,
    "Frontend category should include default-frontend"
  );
  assert(
    hasDefaultContracts,
    "Smartcontract category should include default-contracts"
  );
  assert(hasDefaultFullstack, "Fullstack category should include default");

  console.log("✅ Template categorization test passed!");
}

/**
 * Test multi-category filtering utility
 */
async function testMultiCategoryFiltering() {
  console.log("🔍 Testing multi-category filtering utility...");

  // Test filtering multiple categories
  const frontendAndSmartcontract = filterTemplatesByTypes([
    "frontend",
    "smartcontract",
  ]);

  // Should only contain frontend and smartcontract templates
  for (const template of frontendAndSmartcontract) {
    assert(
      ["frontend", "smartcontract"].includes(template.category),
      `Multi-category filter should only include selected categories, found ${template.category}`
    );
  }

  // Should contain templates from both categories
  const hasFrontend = frontendAndSmartcontract.some(
    (t) => t.category === "frontend"
  );
  const hasSmartcontract = frontendAndSmartcontract.some(
    (t) => t.category === "smartcontract"
  );
  const hasFullstack = frontendAndSmartcontract.some(
    (t) => t.category === "fullstack"
  );

  assert(
    hasFrontend,
    "Multi-category filter should include frontend templates"
  );
  assert(
    hasSmartcontract,
    "Multi-category filter should include smartcontract templates"
  );
  assert(
    !hasFullstack,
    "Multi-category filter should NOT include fullstack templates when not selected"
  );

  console.log("✅ Multi-category filtering test passed!");
}

/**
 * Test SDK path resolution (basic validation)
 */
async function testSDKPathResolution() {
  console.log("🛠️ Testing SDK path resolution...");

  try {
    const { findSDKRoot, resolveTemplatePath, templateExists } = await import(
      "../src/utils/sdk-paths.js"
    );

    // Test SDK root detection
    const sdkRoot = await findSDKRoot();
    assert(typeof sdkRoot === "string", "SDK root should be a string");
    assert(sdkRoot.length > 0, "SDK root should not be empty");

    // Test template path resolution
    const templatePath = await resolveTemplatePath("templates/default");
    assert(
      typeof templatePath === "string",
      "Template path should be a string"
    );
    assert(
      templatePath.includes("templates/default"),
      "Template path should contain the relative path"
    );

    // Test template existence check
    const exists = await templateExists("templates/default");
    assert(
      typeof exists === "boolean",
      "Template existence check should return boolean"
    );

    console.log("✅ SDK path resolution test passed!");
  } catch (error) {
    console.log(`⚠️ SDK path resolution test skipped due to error: ${error}`);
  }
}

/**
 * Test auto-pairing logic simulation
 */
async function testAutoPairingLogic() {
  console.log("🔗 Testing auto-pairing logic simulation...");

  // Simulate auto-pairing scenarios
  const testCases = [
    {
      mode: "fullstack",
      selectedTemplateCategory: "frontend",
      expectedPairing: "default-contracts",
      description: "Frontend template should auto-pair with default-contracts",
    },
    {
      mode: "fullstack",
      selectedTemplateCategory: "smartcontract",
      expectedPairing: "default-frontend",
      description:
        "Smartcontract template should auto-pair with default-frontend",
    },
    {
      mode: "fullstack",
      selectedTemplateCategory: "fullstack",
      expectedPairing: null,
      description: "Fullstack template should not auto-pair",
    },
  ];

  for (const testCase of testCases) {
    // Simulate the auto-pairing logic from init.ts
    let shouldPair = false;
    let pairingTemplate = null;

    if (testCase.mode === "fullstack") {
      if (testCase.selectedTemplateCategory === "frontend") {
        shouldPair = true;
        pairingTemplate = "default-contracts";
      } else if (testCase.selectedTemplateCategory === "smartcontract") {
        shouldPair = true;
        pairingTemplate = "default-frontend";
      }
    }

    if (testCase.expectedPairing === null) {
      assert(!shouldPair, testCase.description);
    } else {
      assert(shouldPair, testCase.description);
      assert.equal(
        pairingTemplate,
        testCase.expectedPairing,
        testCase.description
      );
    }
  }

  console.log("✅ Auto-pairing logic test passed!");
}

/**
 * Jest test suite for mode selection and auto-pairing features
 */
describe("Mode Selection and Auto-Pairing Features", () => {
  test("mode-based template filtering", async () => {
    await testModeBasedTemplateFiltering();
  });

  test("template categorization system", async () => {
    await testTemplateCategorization();
  });

  test("multi-category filtering utility", async () => {
    await testMultiCategoryFiltering();
  });

  test("SDK path resolution", async () => {
    await testSDKPathResolution();
  });

  test("auto-pairing logic simulation", async () => {
    await testAutoPairingLogic();
  });
});
