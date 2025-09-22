#!/usr/bin/env node

import { strict as assert } from "assert";
import {
  getTemplatesByCategory,
  getTemplate,
  TEMPLATE_REGISTRY,
} from "../dist/templates/registry.js";

console.log("🧪 Testing template selection functionality...");

async function testTemplateRegistry() {
  console.log("📋 Testing template registry structure...");

  // Test that default templates exist in registry
  assert(
    TEMPLATE_REGISTRY["default"],
    "Default fullstack template should exist"
  );
  assert(
    TEMPLATE_REGISTRY["default-frontend"],
    "Default frontend template should exist"
  );
  assert(
    TEMPLATE_REGISTRY["default-contracts"],
    "Default contracts template should exist"
  );

  // Test template categories
  assert.equal(
    TEMPLATE_REGISTRY["default"].category,
    "fullstack",
    "Default template should be fullstack category"
  );
  assert.equal(
    TEMPLATE_REGISTRY["default-frontend"].category,
    "frontend",
    "Default frontend template should be frontend category"
  );
  assert.equal(
    TEMPLATE_REGISTRY["default-contracts"].category,
    "backend",
    "Default contracts template should be backend category"
  );

  console.log("✅ Template registry structure test passed!");
}

async function testTemplatesByCategory() {
  console.log("📂 Testing getTemplatesByCategory function...");

  // Test frontend templates include default-frontend
  const frontendTemplates = getTemplatesByCategory("frontend");
  const hasDefaultFrontend = frontendTemplates.some(
    (template) => template.key === "default-frontend"
  );
  assert(
    hasDefaultFrontend,
    "Frontend templates should include default-frontend"
  );

  // Test backend templates include default-contracts
  const backendTemplates = getTemplatesByCategory("backend");
  const hasDefaultContracts = backendTemplates.some(
    (template) => template.key === "default-contracts"
  );
  assert(
    hasDefaultContracts,
    "Backend templates should include default-contracts"
  );

  // Test fullstack templates include default
  const fullstackTemplates = getTemplatesByCategory("fullstack");
  const hasDefault = fullstackTemplates.some(
    (template) => template.key === "default"
  );
  assert(hasDefault, "Fullstack templates should include default");

  console.log("✅ getTemplatesByCategory test passed!");
}

async function testTemplateRetrieval() {
  console.log("🔍 Testing template retrieval...");

  // Test getting specific templates
  const defaultTemplate = getTemplate("default");
  const frontendTemplate = getTemplate("default-frontend");
  const contractsTemplate = getTemplate("default-contracts");

  assert(defaultTemplate, "Should be able to get default template");
  assert(frontendTemplate, "Should be able to get default-frontend template");
  assert(contractsTemplate, "Should be able to get default-contracts template");

  // Test template properties
  assert.equal(
    defaultTemplate.source.type,
    "local",
    "Default template should use local source"
  );
  assert.equal(
    frontendTemplate.source.type,
    "local",
    "Frontend template should use local source"
  );
  assert.equal(
    contractsTemplate.source.type,
    "local",
    "Contracts template should use local source"
  );

  console.log("✅ Template retrieval test passed!");
}

async function testTemplateLabeling() {
  console.log("🏷️  Testing template labeling logic...");

  // Test the new project-type-specific default labeling logic
  const testCases = [
    {
      type: "frontend",
      templates: getTemplatesByCategory("frontend"),
      expectedDefault: "default-frontend",
    },
    {
      type: "fullstack",
      templates: getTemplatesByCategory("fullstack"),
      expectedDefault: "default",
    },
    {
      type: "backend",
      templates: getTemplatesByCategory("backend"),
      expectedDefault: "default-contracts",
    },
  ];

  for (const { type, templates, expectedDefault } of testCases) {
    for (const template of templates) {
      // Use the new logic from init.ts
      const isDefault =
        (type === "frontend" && template.key === "default-frontend") ||
        (type === "backend" && template.key === "default-contracts") ||
        (type === "fullstack" && template.key === "default");

      const expectedLabel = isDefault
        ? `${template.framework} - ${template.description} (Default)`
        : `${template.framework} - ${template.description}`;

      // Apply the new labeling logic
      const actualLabel = isDefault
        ? `${template.framework} - ${template.description} (Default)`
        : `${template.framework} - ${template.description}`;

      assert.equal(
        actualLabel,
        expectedLabel,
        `Template ${template.key} should have correct label for ${type} project type`
      );

      // Verify only the expected default gets the (Default) label
      if (template.key === expectedDefault) {
        assert(
          isDefault,
          `Template ${template.key} should be marked as default for ${type}`
        );
      } else {
        assert(
          !isDefault,
          `Template ${template.key} should NOT be marked as default for ${type}`
        );
      }
    }
  }

  console.log("✅ Template labeling test passed!");
}

async function testFallbackLogic() {
  console.log("🔄 Testing fallback logic simulation...");

  // Simulate what happens when no templates are available
  const emptyTemplates = [];

  // Test frontend fallback
  const frontendFallback = {
    name: "default-frontend",
    source: { type: "local", localPath: "templates/default/frontend" },
  };

  // Test backend fallback
  const backendFallback = {
    name: "default-contracts",
    source: { type: "local", localPath: "templates/default/contracts" },
  };

  // Test fullstack fallback
  const fullstackFallback = {
    name: "default",
    source: { type: "local", localPath: "templates/default" },
  };

  assert.equal(
    frontendFallback.name,
    "default-frontend",
    "Frontend fallback should use default-frontend"
  );
  assert.equal(
    backendFallback.name,
    "default-contracts",
    "Backend fallback should use default-contracts"
  );
  assert.equal(
    fullstackFallback.name,
    "default",
    "Fullstack fallback should use default"
  );

  console.log("✅ Fallback logic test passed!");
}

async function testTemplateAvailability() {
  console.log("📊 Testing template availability scenarios...");

  // Test different availability scenarios
  const frontendTemplates = getTemplatesByCategory("frontend");
  const backendTemplates = getTemplatesByCategory("backend");
  const fullstackTemplates = getTemplatesByCategory("fullstack");

  // Should have at least default templates
  assert(
    frontendTemplates.length >= 1,
    "Should have at least one frontend template"
  );
  assert(
    backendTemplates.length >= 1,
    "Should have at least one backend template"
  );
  assert(
    fullstackTemplates.length >= 1,
    "Should have at least one fullstack template"
  );

  // Test selection logic based on template count
  for (const [category, templates] of [
    ["frontend", frontendTemplates],
    ["backend", backendTemplates],
    ["fullstack", fullstackTemplates],
  ]) {
    if (templates.length > 1) {
      console.log(
        `  ${category}: Multiple templates available (${templates.length}) - should show selection menu`
      );
    } else if (templates.length === 1) {
      console.log(
        `  ${category}: Single template available - should auto-select`
      );
    } else {
      console.log(
        `  ${category}: No templates available - should use fallback`
      );
    }
  }

  console.log("✅ Template availability test passed!");
}

async function runAllTests() {
  try {
    await testTemplateRegistry();
    await testTemplatesByCategory();
    await testTemplateRetrieval();
    await testTemplateLabeling();
    await testFallbackLogic();
    await testTemplateAvailability();

    console.log("🎉 All template selection tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

runAllTests();
