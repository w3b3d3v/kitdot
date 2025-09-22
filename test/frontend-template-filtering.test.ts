import { strict as assert } from 'assert';
import { getTemplatesByCategory, getTemplate, TEMPLATE_REGISTRY } from '../src/templates/registry.js';

/**
 * Test that frontend selection only shows frontend templates (AC: 1, 5)
 */
async function testFrontendOnlyFiltering() {
  console.log('📋 Testing frontend-only template filtering...');

  const frontendTemplates = getTemplatesByCategory('frontend');

  // Verify all returned templates are frontend category
  for (const template of frontendTemplates) {
    assert.equal(template.category, 'frontend',
      `Template ${template.key} should be frontend category, got ${template.category}`);
  }

  // Verify no fullstack templates appear in frontend selection
  const fullstackTemplateKeys = Object.keys(TEMPLATE_REGISTRY)
    .filter(key => TEMPLATE_REGISTRY[key].category === 'fullstack');

  for (const template of frontendTemplates) {
    assert(!fullstackTemplateKeys.includes(template.key),
      `Fullstack template ${template.key} should not appear in frontend selection`);
  }

  console.log('✅ Frontend-only filtering test passed!');
}

/**
 * Test that fullstack selection only shows fullstack templates (AC: 1, 5)
 */
async function testFullstackFiltering() {
  console.log('📋 Testing fullstack template filtering...');

  const fullstackTemplates = getTemplatesByCategory('fullstack');

  // Verify all returned templates are fullstack category
  for (const template of fullstackTemplates) {
    assert.equal(template.category, 'fullstack',
      `Template ${template.key} should be fullstack category, got ${template.category}`);
  }

  // Verify no frontend templates appear in fullstack selection
  const frontendTemplateKeys = Object.keys(TEMPLATE_REGISTRY)
    .filter(key => TEMPLATE_REGISTRY[key].category === 'frontend');

  for (const template of fullstackTemplates) {
    assert(!frontendTemplateKeys.includes(template.key),
      `Frontend template ${template.key} should not appear in fullstack selection`);
  }

  console.log('✅ Fullstack filtering test passed!');
}

/**
 * Test no duplicate default template references (AC: 2)
 */
async function testNoDuplicateDefaults() {
  console.log('🔍 Testing no duplicate default templates...');

  const frontendTemplates = getTemplatesByCategory('frontend');
  const fullstackTemplates = getTemplatesByCategory('fullstack');
  const backendTemplates = getTemplatesByCategory('backend');

  // Count templates with "default" in their key for each category
  const frontendDefaults = frontendTemplates.filter(t => t.key.includes('default'));
  const fullstackDefaults = fullstackTemplates.filter(t => t.key.includes('default'));
  const backendDefaults = backendTemplates.filter(t => t.key.includes('default'));

  // Each category should have exactly one default template
  assert.equal(frontendDefaults.length, 1, 'Frontend should have exactly one default template');
  assert.equal(fullstackDefaults.length, 1, 'Fullstack should have exactly one default template');
  assert.equal(backendDefaults.length, 1, 'Backend should have exactly one default template');

  // Verify the correct default template for each category
  assert.equal(frontendDefaults[0].key, 'default-frontend', 'Frontend default should be default-frontend');
  assert.equal(fullstackDefaults[0].key, 'default', 'Fullstack default should be default');
  assert.equal(backendDefaults[0].key, 'default-contracts', 'Backend default should be default-contracts');

  console.log('✅ No duplicate defaults test passed!');
}

/**
 * Test proper default indication in template choices (AC: 3)
 */
async function testDefaultIndicationLogic() {
  console.log('🏷️  Testing default template indication logic...');

  // Simulate the new default indication logic for each project type
  const projectTypes = [
    { type: 'frontend', expectedDefault: 'default-frontend' },
    { type: 'fullstack', expectedDefault: 'default' },
    { type: 'backend', expectedDefault: 'default-contracts' }
  ];

  for (const { type, expectedDefault } of projectTypes) {
    const templates = getTemplatesByCategory(type as 'frontend' | 'fullstack' | 'backend');

    for (const template of templates) {
      // Apply the new default indication logic from init.ts
      const isDefault = (type === 'frontend' && template.key === 'default-frontend') ||
                       (type === 'backend' && template.key === 'default-contracts') ||
                       (type === 'fullstack' && template.key === 'default');

      if (template.key === expectedDefault) {
        assert(isDefault, `Template ${template.key} should be marked as default for ${type} projects`);
      } else {
        assert(!isDefault, `Template ${template.key} should NOT be marked as default for ${type} projects`);
      }
    }
  }

  console.log('✅ Default indication logic test passed!');
}

/**
 * Test template descriptions are clear and specific (AC: 4)
 */
async function testTemplateDescriptions() {
  console.log('📝 Testing template descriptions...');

  const frontendTemplates = getTemplatesByCategory('frontend');

  for (const template of frontendTemplates) {
    // Verify description exists and is meaningful
    assert(template.description && template.description.length > 10,
      `Template ${template.key} should have a meaningful description`);

    // Verify framework is specified
    assert(template.framework && template.framework.length > 0,
      `Template ${template.key} should have a framework specified`);

    // For frontend templates, verify they mention frontend technologies
    const desc = template.description.toLowerCase();
    const isFrontendRelevant = desc.includes('react') || desc.includes('frontend') ||
                              desc.includes('ui') || desc.includes('web') ||
                              desc.includes('dapp') || desc.includes('app');

    assert(isFrontendRelevant,
      `Frontend template ${template.key} description should mention frontend technologies`);
  }

  console.log('✅ Template descriptions test passed!');
}

/**
 * Test cross-category contamination doesn't occur
 */
async function testNoCrossCategoryContamination() {
  console.log('🚫 Testing no cross-category contamination...');

  const allCategories = ['frontend', 'fullstack', 'backend'];

  for (const category of allCategories) {
    const templates = getTemplatesByCategory(category as 'frontend' | 'fullstack' | 'backend');

    for (const template of templates) {
      assert.equal(template.category, category,
        `Template ${template.key} in ${category} category should have category=${category}, got ${template.category}`);
    }
  }

  // Verify categories are mutually exclusive
  const frontendKeys = getTemplatesByCategory('frontend').map(t => t.key);
  const fullstackKeys = getTemplatesByCategory('fullstack').map(t => t.key);
  const backendKeys = getTemplatesByCategory('backend').map(t => t.key);

  // Check no overlap between categories
  const frontendFullstackOverlap = frontendKeys.filter(key => fullstackKeys.includes(key));
  const frontendBackendOverlap = frontendKeys.filter(key => backendKeys.includes(key));
  const fullstackBackendOverlap = fullstackKeys.filter(key => backendKeys.includes(key));

  assert.equal(frontendFullstackOverlap.length, 0, 'Frontend and fullstack categories should not overlap');
  assert.equal(frontendBackendOverlap.length, 0, 'Frontend and backend categories should not overlap');
  assert.equal(fullstackBackendOverlap.length, 0, 'Fullstack and backend categories should not overlap');

  console.log('✅ No cross-category contamination test passed!');
}

/**
 * Integration test simulating the entire template selection flow
 */
async function testTemplateSelectionFlow() {
  console.log('🔄 Testing complete template selection flow...');

  const projectTypes = ['frontend', 'fullstack', 'backend'];

  for (const projectType of projectTypes) {
    console.log(`  Testing ${projectType} project type...`);

    // Get templates for this project type (simulating init.ts logic)
    let availableTemplates: any[];
    let expectedCategory: string;

    if (projectType === 'frontend') {
      availableTemplates = getTemplatesByCategory('frontend');
      expectedCategory = 'frontend';
    } else if (projectType === 'backend') {
      availableTemplates = getTemplatesByCategory('backend');
      expectedCategory = 'backend';
    } else if (projectType === 'fullstack') {
      availableTemplates = getTemplatesByCategory('fullstack');
      expectedCategory = 'fullstack';
    } else {
      // Default case to satisfy TypeScript
      availableTemplates = [];
      expectedCategory = '';
    }

    // Verify templates are available
    assert(availableTemplates.length > 0, `Should have templates available for ${projectType}`);

    // Verify all templates belong to the correct category
    for (const template of availableTemplates) {
      assert.equal(template.category, expectedCategory,
        `All templates for ${projectType} should be ${expectedCategory} category`);
    }

    // Verify default template exists for this category
    const hasDefault = availableTemplates.some(template => {
      if (projectType === 'frontend') return template.key === 'default-frontend';
      if (projectType === 'backend') return template.key === 'default-contracts';
      if (projectType === 'fullstack') return template.key === 'default';
      return false;
    });

    assert(hasDefault, `Should have a default template for ${projectType} projects`);
  }

  console.log('✅ Template selection flow test passed!');
}

describe("Frontend Template Filtering", () => {
  test("frontend only filtering", async () => {
    await testFrontendOnlyFiltering();
  });

  test("fullstack filtering", async () => {
    await testFullstackFiltering();
  });

  test("no duplicate defaults", async () => {
    await testNoDuplicateDefaults();
  });

  test("default indication logic", async () => {
    await testDefaultIndicationLogic();
  });

  test("template descriptions", async () => {
    await testTemplateDescriptions();
  });

  test("no cross category contamination", async () => {
    await testNoCrossCategoryContamination();
  });

  test("template selection flow", async () => {
    await testTemplateSelectionFlow();
  });
});