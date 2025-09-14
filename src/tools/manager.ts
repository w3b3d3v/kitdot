import { SupportedPlatform } from './platform-detector.js';

export interface ToolInstallationResult {
  success: boolean;
  version?: string;
  error?: string;
  skipped?: boolean;
  platform: SupportedPlatform;
}

export interface ToolInstaller {
  /**
   * Checks if the tool is already installed
   */
  isToolInstalled(): Promise<boolean>;

  /**
   * Gets the version of the installed tool
   */
  getToolVersion(): Promise<string | null>;

  /**
   * Installs the tool for the specified platform
   */
  installTool(platform: SupportedPlatform): Promise<ToolInstallationResult>;

  /**
   * Gets installation time estimate for the platform
   */
  getInstallationTimeEstimate(platform: SupportedPlatform): string;

  /**
   * Gets troubleshooting guidance for installation failures
   */
  getTroubleshootingGuidance(platform: SupportedPlatform, error?: string): string;
}

export interface ConsentPromptResult {
  platformDetected?: string;
  toolInstalled?: boolean;
  toolInstallConsent?: boolean;
}

export class ToolInstallationManager {
  private static _instance: ToolInstallationManager;
  private _installedTools: Map<string, ToolInstallationResult> = new Map();

  private constructor() {}

  public static getInstance(): ToolInstallationManager {
    if (!ToolInstallationManager._instance) {
      ToolInstallationManager._instance = new ToolInstallationManager();
    }
    return ToolInstallationManager._instance;
  }

  /**
   * Registers a successful tool installation
   */
  public registerToolInstallation(toolName: string, result: ToolInstallationResult): void {
    this._installedTools.set(toolName, result);
  }

  /**
   * Checks if a tool has been installed during this session
   */
  public isToolInstalledInSession(toolName: string): boolean {
    const result = this._installedTools.get(toolName);
    return result?.success === true;
  }

  /**
   * Gets the installation result for a tool
   */
  public getToolInstallationResult(toolName: string): ToolInstallationResult | null {
    return this._installedTools.get(toolName) || null;
  }

  /**
   * Gets all installed tools in this session
   */
  public getInstalledTools(): Map<string, ToolInstallationResult> {
    return new Map(this._installedTools);
  }

  /**
   * Clears the installation history
   */
  public clearInstallationHistory(): void {
    this._installedTools.clear();
  }

  /**
   * Generic method to handle tool installation workflow
   * This can be extended by specific tool installers
   */
  public async handleToolInstallation<T extends ToolInstaller>(
    toolName: string,
    installer: T,
    platform: SupportedPlatform,
    userConsent: boolean
  ): Promise<ToolInstallationResult> {
    // Check if already installed
    if (await installer.isToolInstalled()) {
      const version = await installer.getToolVersion();
      const result: ToolInstallationResult = {
        success: true,
        version: version || 'unknown',
        platform,
        skipped: true
      };
      this.registerToolInstallation(toolName, result);
      return result;
    }

    // If no consent, skip installation
    if (!userConsent) {
      const result: ToolInstallationResult = {
        success: false,
        error: 'User declined installation',
        platform
      };
      this.registerToolInstallation(toolName, result);
      return result;
    }

    // Perform installation
    try {
      const result = await installer.installTool(platform);
      this.registerToolInstallation(toolName, result);
      return result;
    } catch (error) {
      const result: ToolInstallationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown installation error',
        platform
      };
      this.registerToolInstallation(toolName, result);
      return result;
    }
  }
}

/**
 * Configuration for tool installation consent prompts
 */
export interface ToolConsentConfig {
  toolName: string;
  promptMessage: string;
  timeWarningMessage?: string;
  skipMessage?: string;
  manualInstallUrl?: string;
}

/**
 * Helper function to create consistent consent configurations
 */
export function createToolConsentConfig(
  toolName: string,
  promptMessage: string,
  options?: {
    timeWarningMessage?: string;
    skipMessage?: string;
    manualInstallUrl?: string;
  }
): ToolConsentConfig {
  return {
    toolName,
    promptMessage,
    timeWarningMessage: options?.timeWarningMessage,
    skipMessage: options?.skipMessage || `Skipping ${toolName} installation.`,
    manualInstallUrl: options?.manualInstallUrl
  };
}