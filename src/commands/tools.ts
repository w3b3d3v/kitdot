import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { PlatformDetector } from '../tools/platform-detector.js';
import { RustInstaller } from '../tools/rust-installer.js';

export async function toolsCommand(subcommand?: string) {
  if (!subcommand) {
    await displayToolsHelp();
    return;
  }

  switch (subcommand) {
    case 'install-rust':
      await installRustCommand();
      break;
    case 'check':
      await checkToolsCommand();
      break;
    default:
      console.log(chalk.red(`❌ Unknown tools subcommand: ${subcommand}`));
      await displayToolsHelp();
      break;
  }
}

async function displayToolsHelp() {
  console.log(chalk.blue('\n🔧 Kit-Dot Tools Management\n'));
  console.log('Available commands:');
  console.log(chalk.green('  kit-dot tools install-rust') + '  - Install Rust toolchain for blockchain development');
  console.log(chalk.green('  kit-dot tools check') + '        - Check status of development tools');
  console.log(chalk.green('  kit-dot tools') + '             - Show this help message');
  console.log('\nFor more information: https://kit-dot.dev/docs/tools\n');
}

async function installRustCommand() {
  const platformDetector = PlatformDetector.getInstance();
  const rustInstaller = new RustInstaller();

  // Check if Rust is already installed
  const isRustInstalled = await rustInstaller.isToolInstalled();
  
  if (isRustInstalled) {
    const version = await rustInstaller.getToolVersion();
    console.log(chalk.green(`✅ Rust toolchain already installed: ${version}`));
    return;
  }

  // Detect platform first
  const platformInfo = await platformDetector.detectPlatform();
  console.log(chalk.blue(`🖥️  Platform detected: ${platformInfo.platform} (${platformInfo.architecture})`));

  if (!platformInfo.isSupported) {
    console.log(chalk.yellow('⚠️  Automatic Rust installation not supported for your platform.'));
    console.log(chalk.blue(platformDetector.getInstallationGuidance(platformInfo.platform)));
    return;
  }

  // Single consent prompt with all necessary information
  const timeEstimate = rustInstaller.getInstallationTimeEstimate(platformInfo.platform);
  const rustConsentQuestion = {
    type: 'confirm' as const,
    name: 'installRust',
    message: `🦀 Install Rust toolchain for blockchain development? (Est. time: ${timeEstimate})`,
    default: true
  };

  const rustAnswer = await inquirer.prompt([rustConsentQuestion]);

  if (!rustAnswer.installRust) {
    console.log(chalk.yellow('⚠️  Rust installation cancelled.'));
    console.log(chalk.blue('💡 You can install Rust manually by visiting: https://rustup.rs/'));
    return;
  }

  // Proceed with installation
  const spinner = ora('Installing Rust toolchain for blockchain development...').start();
  
  try {
    const installResult = await rustInstaller.installRust(platformInfo.platform);
    
    if (installResult.success) {
      if (installResult.skipped) {
        spinner.succeed(`Rust toolchain ready: ${installResult.version}`);
      } else {
        spinner.succeed(`Rust toolchain installed successfully: ${installResult.version}`);
      }
    } else {
      spinner.fail('Rust installation failed');
      console.log(chalk.yellow('⚠️  ' + installResult.error));
      console.log(chalk.blue(rustInstaller.getTroubleshootingGuidance(installResult.platform, installResult.error)));
    }
  } catch (error) {
    spinner.fail('Rust installation failed');
    console.log(chalk.red('❌ Unexpected error during Rust installation:', error));
  }
}

async function checkToolsCommand() {
  console.log(chalk.blue('\n🔍 Checking development tools...\n'));
  
  const platformDetector = PlatformDetector.getInstance();
  const rustInstaller = new RustInstaller();

  // Platform detection
  const platformInfo = await platformDetector.detectPlatform();
  console.log(chalk.blue(`🖥️  Platform: ${platformInfo.platform} (${platformInfo.architecture})`));
  console.log(chalk.blue(`📦 Platform supported: ${platformInfo.isSupported ? 'Yes' : 'No'}`));
  
  // Rust status
  const isRustInstalled = await rustInstaller.isToolInstalled();
  if (isRustInstalled) {
    const version = await rustInstaller.getToolVersion();
    console.log(chalk.green(`🦀 Rust: Installed (${version})`));
  } else {
    console.log(chalk.yellow('🦀 Rust: Not installed'));
    console.log(chalk.gray('   Run: kit-dot tools install-rust'));
  }

  console.log();
}