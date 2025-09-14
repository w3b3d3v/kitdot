import { execSync, spawn } from 'child_process';
import { PlatformDetector, SupportedPlatform } from './platform-detector.js';
import { ToolInstaller, ToolInstallationResult } from './manager.js';

export type RustInstallationResult = ToolInstallationResult;

export class RustInstaller implements ToolInstaller {
  private platformDetector: PlatformDetector;

  constructor() {
    this.platformDetector = PlatformDetector.getInstance();
  }

  /**
   * Checks if Rust is already installed
   * @returns boolean indicating if Rust is available
   */
  public async isToolInstalled(): Promise<boolean> {
    return this.isRustInstalled();
  }

  /**
   * Gets the currently installed Rust version
   * @returns string with version or null if not installed
   */
  public async getToolVersion(): Promise<string | null> {
    return this.getRustVersion();
  }

  /**
   * Installs Rust toolchain for the specified platform
   * @param platform The detected platform
   * @returns Promise<ToolInstallationResult>
   */
  public async installTool(platform: SupportedPlatform): Promise<ToolInstallationResult> {
    return this.installRust(platform);
  }

  /**
   * Checks if Rust is already installed (internal method)
   * @returns boolean indicating if Rust is available
   */
  private async isRustInstalled(): Promise<boolean> {
    try {
      execSync('rustc --version', { stdio: 'pipe', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the currently installed Rust version (internal method)
   * @returns string with version or null if not installed
   */
  private async getRustVersion(): Promise<string | null> {
    try {
      const version = execSync('rustc --version', { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 5000 
      }).trim();
      return version;
    } catch {
      return null;
    }
  }

  /**
   * Installs Rust toolchain with user consent
   * @param platform The detected platform
   * @returns Promise<RustInstallationResult>
   */
  public async installRust(platform: SupportedPlatform): Promise<RustInstallationResult> {
    // Check if already installed
    if (await this.isRustInstalled()) {
      const version = await this.getRustVersion();
      return {
        success: true,
        version: version || 'unknown',
        platform,
        skipped: true
      };
    }

    // Check if platform supports automatic installation
    if (!this.isPlatformSupportedForInstallation(platform)) {
      return {
        success: false,
        error: 'Automatic Rust installation not supported for this platform',
        platform
      };
    }

    try {
      await this.performRustInstallation(platform);
      const version = await this.getRustVersion();
      
      return {
        success: true,
        version: version || 'installed',
        platform
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown installation error',
        platform
      };
    }
  }

  /**
   * Performs the actual Rust installation
   * @param platform The detected platform
   */
  private async performRustInstallation(platform: SupportedPlatform): Promise<void> {
    switch (platform) {
      case 'linux':
      case 'macos':
      case 'wsl':
        await this.installRustUnix();
        break;
      default:
        throw new Error(`Unsupported platform for automatic installation: ${platform}`);
    }
  }

  /**
   * Installs Rust on Unix-like systems (Linux, macOS, WSL)
   */
  private async installRustUnix(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Download and run rustup installer
      const installCommand = 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y';
      
      const child = spawn('bash', ['-c', installCommand], {
        stdio: 'pipe',
        env: { ...process.env }
      });

      let stderr = '';

      child.stdout?.on('data', (_data) => {
        // Output is handled by the parent process
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          // Source the cargo environment
          try {
            execSync('source ~/.cargo/env', { shell: '/bin/bash' });
          } catch {
            // Ignore sourcing errors - environment will be available in new shells
          }
          resolve();
        } else {
          reject(new Error(`Rust installation failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start Rust installation: ${error.message}`));
      });

      // Set timeout for installation (15 minutes)
      setTimeout(() => {
        child.kill();
        reject(new Error('Rust installation timed out after 15 minutes'));
      }, 15 * 60 * 1000);
    });
  }

  /**
   * Checks if platform supports automatic Rust installation
   * @param platform The platform to check
   * @returns boolean indicating support
   */
  private isPlatformSupportedForInstallation(platform: SupportedPlatform): boolean {
    return ['linux', 'macos', 'wsl'].includes(platform);
  }

  /**
   * Gets installation time estimate for the platform
   * @param platform The detected platform
   * @returns string with time estimate
   */
  public getInstallationTimeEstimate(platform: SupportedPlatform): string {
    switch (platform) {
      case 'linux':
      case 'wsl':
        return '5-15 minutes (compilation time varies by system)';
      case 'macos':
        return '5-10 minutes (pre-compiled binaries available)';
      case 'windows':
        return 'Manual installation required - visit https://rustup.rs/';
      default:
        return 'Installation time varies by platform';
    }
  }

  /**
   * Gets troubleshooting guidance for installation failures
   * @param platform The detected platform
   * @param error The error that occurred
   * @returns string with troubleshooting steps
   */
  public getTroubleshootingGuidance(platform: SupportedPlatform, error?: string): string {
    const baseGuidance = `
Manual installation steps:
1. Visit https://rustup.rs/
2. Follow platform-specific instructions
3. Restart your terminal after installation
4. Verify installation with: rustc --version`;

    if (error?.includes('timeout')) {
      return `Installation timed out. This can happen on slower connections or systems.
${baseGuidance}`;
    }

    if (error?.includes('curl')) {
      return `Network connection issue detected.
- Check your internet connection
- Try running the installation manually:
  curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh
${baseGuidance}`;
    }

    return `Installation failed on ${platform}.
${baseGuidance}`;
  }
}