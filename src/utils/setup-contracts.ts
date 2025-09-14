import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types.js';

export async function setupContracts(config: ProjectConfig): Promise<void> {
  await setupHardhatProject(config);
}


async function setupHardhatProject(config: ProjectConfig): Promise<void> {
  const contractsDir = path.join(config.directory, 'contracts');
  
  const packageJson = {
    name: `${config.name}-contracts`,
    version: '0.1.0',
    description: 'Smart contract development and deployment',
    type: 'module',
    scripts: {
      compile: 'hardhat compile',
      test: 'hardhat test',
      deploy: 'hardhat run scripts/deploy.ts',
      'deploy:testnet': 'hardhat run scripts/deploy.ts --network polkadotHubTestnet'
    },
    dependencies: {
      '@nomicfoundation/hardhat-toolbox': '^5.0.0',
      '@parity/hardhat-polkadot': '^0.1.0',
      'hardhat': '^2.22.0'
    },
    devDependencies: {
      '@types/node': '^22.16.2',
      'typescript': '^5.6.2'
    }
  };

  await fs.writeJson(
    path.join(contractsDir, 'package.json'), 
    packageJson, 
    { spaces: 2 }
  );

  const hardhatConfigPath = path.join(process.cwd(), 'hardhat-template.ts');
  const hardhatConfigContent = await fs.readFile(hardhatConfigPath, 'utf-8');
  
  await fs.writeFile(
    path.join(contractsDir, 'hardhat.config.ts'), 
    hardhatConfigContent
  );

  await fs.ensureDir(path.join(contractsDir, 'scripts'));
  await fs.ensureDir(path.join(contractsDir, 'test'));

  const deployScript = `import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Polkadot Hub...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy your contracts here
  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });`;

  await fs.writeFile(
    path.join(contractsDir, 'scripts/deploy.ts'), 
    deployScript
  );

  const envExample = `# Hardhat configuration
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000`;

  await fs.writeFile(path.join(contractsDir, '.env.example'), envExample);
}