#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_DIR = '/tmp/kit-dot-cli-tests';
const CLI_PATH = path.join(__dirname, 'dist/cli.js');

async function runCLITest(projectName, projectType) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Testing ${projectType} project creation: ${projectName}`);
    
    const child = spawn('node', [CLI_PATH, 'init', projectName], {
      cwd: TEST_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';
    
    let processExited = false;
    
    child.stdout.on('data', (data) => {
      output += data.toString();
      // Auto-respond to project type selection
      if (data.toString().includes('What type of project') && !processExited) {
        setTimeout(() => {
          if (child.stdin.writable && !processExited) {
            try {
              if (projectType === 'frontend') {
                child.stdin.write('\u001b[B\n'); // Down arrow to select frontend
              } else if (projectType === 'fullstack') {
                child.stdin.write('\n'); // Enter to select fullstack (default)
              } else if (projectType === 'backend') {
                child.stdin.write('\u001b[B\u001b[B\n'); // Down arrow twice to select backend
              }
            } catch (err) {
              console.warn('Failed to write to child stdin:', err.message);
            }
          }
        }, 100);
      }
      
      // Auto-respond to template selection if it appears
      if (data.toString().includes('Choose a frontend template') && !processExited) {
        setTimeout(() => {
          if (child.stdin.writable && !processExited) {
            try {
              child.stdin.write('\n'); // Select first template
            } catch (err) {
              console.warn('Failed to write to child stdin:', err.message);
            }
          }
        }, 100);
      }
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      processExited = true;
      if (code === 0) {
        resolve({ success: true, output, projectName, projectType });
      } else {
        reject({ success: false, error, output, projectName, projectType, code });
      }
    });
    
    child.on('error', (err) => {
      processExited = true;
      reject({ success: false, error: err.message, projectName, projectType });
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill();
      reject({ success: false, error: 'Timeout', projectName, projectType });
    }, 30000);
  });
}

async function validateProjectStructure(projectName, projectType) {
  const projectPath = path.join(TEST_DIR, projectName);
  const results = {
    projectExists: await fs.pathExists(projectPath),
    hasPackageJson: await fs.pathExists(path.join(projectPath, 'package.json')),
    hasDocs: await fs.pathExists(path.join(projectPath, 'docs')),
    hasContracts: await fs.pathExists(path.join(projectPath, 'contracts')),
    hasFront: await fs.pathExists(path.join(projectPath, 'front')),
    hasReadme: await fs.pathExists(path.join(projectPath, 'README.md'))
  };
  
  // Validate expected structure
  const expectations = {
    frontend: {
      projectExists: true,
      hasPackageJson: true,  // Should be template's package.json at root
      hasDocs: false,        // No docs for frontend-only
      hasContracts: false,   // No contracts for frontend-only
      hasFront: false,       // Frontend at root, not in /front
      hasReadme: true        // Should have template's README
    },
    fullstack: {
      projectExists: true,
      hasPackageJson: true,  // Monorepo package.json
      hasDocs: true,         // Docs for fullstack
      hasContracts: true,    // Contracts for fullstack
      hasFront: true,        // Frontend in /front directory
      hasReadme: true        // Root README
    },
    backend: {
      projectExists: true,
      hasPackageJson: true,  // Monorepo package.json
      hasDocs: true,         // Docs for backend
      hasContracts: true,    // Contracts for backend
      hasFront: false,       // No frontend for backend-only
      hasReadme: true        // Root README
    }
  };
  
  const expected = expectations[projectType];
  const isValid = Object.keys(expected).every(key => results[key] === expected[key]);
  
  return { isValid, results, expected };
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive CLI tests...');
  
  // Clean and create test directory
  await fs.remove(TEST_DIR);
  await fs.ensureDir(TEST_DIR);
  
  const testCases = [
    { name: 'test-frontend-1', type: 'frontend' },
    { name: 'test-frontend-2', type: 'frontend' },
    { name: 'my-frontend-app', type: 'frontend' },
    { name: 'frontend-with-dashes', type: 'frontend' },
    { name: 'frontend_with_underscores', type: 'frontend' }
  ];
  
  let passCount = 0;
  let failCount = 0;
  
  for (const testCase of testCases) {
    try {
      const result = await runCLITest(testCase.name, testCase.type);
      
      if (result.success) {
        console.log(`✅ ${testCase.name} (${testCase.type}): CLI execution successful`);
        
        // Validate structure
        const validation = await validateProjectStructure(testCase.name, testCase.type);
        if (validation.isValid) {
          console.log(`✅ ${testCase.name}: Project structure valid`);
          passCount++;
        } else {
          console.log(`❌ ${testCase.name}: Invalid project structure`);
          console.log(`   Expected:`, validation.expected);
          console.log(`   Actual:  `, validation.results);
          failCount++;
        }
      } else {
        console.log(`❌ ${testCase.name}: CLI execution failed`);
        failCount++;
      }
    } catch (err) {
      console.log(`❌ ${testCase.name}: Error - ${err.error || err.message}`);
      if (err.output) console.log(`   Output: ${err.output.slice(0, 200)}...`);
      failCount++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Test Results: ${passCount} passed, ${failCount} failed`);
  
  // Clean up
  await fs.remove(TEST_DIR);
  
  return { passCount, failCount };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
    .then(({ passCount, failCount }) => {
      process.exit(failCount > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error('Test runner failed:', err);
      process.exit(1);
    });
}

export { runAllTests, runCLITest, validateProjectStructure };
