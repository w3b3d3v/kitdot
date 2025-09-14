import { platform, arch, release } from 'os';
import { execSync } from 'child_process';

export type SupportedPlatform = 'linux' | 'macos' | 'windows' | 'wsl' | 'unknown';

export interface PlatformInfo {
  platform: SupportedPlatform;
  architecture: string;
  osVersion: string;
  isWsl: boolean;
  isSupported: boolean;
}

export class PlatformDetector {
  private static _instance: PlatformDetector;
  private _detectionResult: PlatformInfo | null = null;

  private constructor() {}

  public static getInstance(): PlatformDetector {
    if (!PlatformDetector._instance) {
      PlatformDetector._instance = new PlatformDetector();
    }
    return PlatformDetector._instance;
  }

  /**
   * Detects the current platform only when explicitly requested
   * @returns PlatformInfo with platform details
   */
  public async detectPlatform(): Promise<PlatformInfo> {
    if (this._detectionResult) {
      return this._detectionResult;
    }

    const nodePlatform = platform();
    const nodeArch = arch();
    const osVersion = release();

    let detectedPlatform: SupportedPlatform;
    let isWsl = false;

    try {
      // Check for WSL first (Windows Subsystem for Linux)
      if (nodePlatform === 'linux') {
        isWsl = this.detectWSL();
        detectedPlatform = isWsl ? 'wsl' : 'linux';
      } else {
        switch (nodePlatform) {
          case 'darwin':
            detectedPlatform = 'macos';
            break;
          case 'win32':
            detectedPlatform = 'windows';
            break;
          default:
            detectedPlatform = 'unknown';
        }
      }
    } catch (_error) {
      detectedPlatform = 'unknown';
    }

    this._detectionResult = {
      platform: detectedPlatform,
      architecture: nodeArch,
      osVersion,
      isWsl,
      isSupported: this.isPlatformSupported(detectedPlatform)
    };

    return this._detectionResult;
  }

  /**
   * Detects if running in Windows Subsystem for Linux (WSL)
   * @returns boolean indicating if running in WSL
   */
  private detectWSL(): boolean {
    try {
      // Check for WSL environment variables
      if (process.env.WSL_DISTRO_NAME || process.env.WSLENV) {
        return true;
      }

      // Check /proc/version for Microsoft or WSL signature
      const procVersion = execSync('cat /proc/version 2>/dev/null || echo ""', { 
        encoding: 'utf8',
        timeout: 1000 
      });
      
      return /microsoft|wsl/i.test(procVersion);
    } catch {
      return false;
    }
  }

  /**
   * Checks if the platform is supported for Rust installation
   * @param platform The detected platform
   * @returns boolean indicating if platform is supported
   */
  private isPlatformSupported(platform: SupportedPlatform): boolean {
    return ['linux', 'macos', 'wsl'].includes(platform);
  }

  /**
   * Gets platform-specific installation guidance
   * @param platform The detected platform
   * @returns string with platform-specific guidance
   */
  public getInstallationGuidance(platform: SupportedPlatform): string {
    switch (platform) {
      case 'linux':
      case 'macos':
      case 'wsl':
        return 'Automatic Rust installation is supported for your platform.';
      case 'windows':
        return `Windows users should manually install Rust from https://rustup.rs/
Download and run rustup-init.exe, then restart your terminal.`;
      case 'unknown':
      default:
        return `Your platform is not automatically supported. 
Please visit https://rustup.rs/ for manual installation instructions.`;
    }
  }

  /**
   * Clears the cached detection result for fresh detection
   */
  public clearCache(): void {
    this._detectionResult = null;
  }

  /**
   * Gets the cached platform info without re-detection
   * @returns PlatformInfo or null if not detected yet
   */
  public getCachedPlatformInfo(): PlatformInfo | null {
    return this._detectionResult;
  }
}