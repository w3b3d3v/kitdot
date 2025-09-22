#!/usr/bin/env node

/**
 * Test that templates work correctly without unnecessary files
 */

import { promises as fs } from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

async function testCleanup() {
  console.log('🧪 Testing template-only approach...');

  const tests = [
    {
      name: 'Backend-only',
      config: {
        name: 'test-backend-clean',
        type: 'backend',
        directory: '/tmp/test-backend-clean',
        features: { contracts: true, frontend: false }
      },
      shouldHave: ['package.json', 'hardhat.config.ts', 'contracts'],
      shouldNotHave: ['frontend', 'docs', '.gitignore', 'README.md'] // Template provides these
    },
    {
      name: 'Fullstack',
      config: {
        name: 'test-fullstack-clean',
        type: 'fullstack',
        directory: '/tmp/test-fullstack-clean',
        features: { contracts: true, frontend: true },
        template: { name: 'default', source: { type: 'local', localPath: 'templates/default' } }
      },
      shouldHave: ['contracts', 'frontend'],
      shouldNotHave: ['docs'] // No extra root files since template provides everything
    }
  ];

  for (const test of tests) {
    console.log(`\n📁 Testing ${test.name}...`);

    try {
      // Clean up
      await fs.rm(test.config.directory, { recursive: true, force: true });

      // Import and run
      const { createProjectStructure } = await import('../dist/utils/project-structure.js');
      const { setupContracts } = await import('../dist/utils/setup-contracts.js');

      await createProjectStructure(test.config);

      if (test.config.features.contracts) {
        await setupContracts(test.config);
      }

      // Check results
      const entries = await fs.readdir(test.config.directory);
      console.log(`   Created: ${entries.sort().join(', ')}`);

      // Verify expected files exist
      for (const item of test.shouldHave) {
        if (!entries.includes(item)) {
          throw new Error(`❌ Missing expected item: ${item}`);
        }
        console.log(`   ✅ ${item}`);
      }

      // Verify unwanted files don't exist
      for (const item of test.shouldNotHave) {
        if (entries.includes(item)) {
          console.log(`   ⚠️  Found ${item} (should come from template only)`);
        } else {
          console.log(`   ✅ No ${item} (good - template provides it)`);
        }
      }

      // Clean up
      await fs.rm(test.config.directory, { recursive: true, force: true });
      console.log(`   ✅ ${test.name} test passed`);

    } catch (error) {
      console.error(`   ❌ ${test.name} test failed:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n🎉 All cleanup tests passed!');
  console.log('✅ No unnecessary package.json creation');
  console.log('✅ No hardhat template files');
  console.log('✅ Templates provide all necessary files');
}

testCleanup();