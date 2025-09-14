import { describe, it, expect } from '@jest/globals';
import { PlatformDetector, SupportedPlatform } from '../src/tools/platform-detector.js';
import { RustInstaller } from '../src/tools/rust-installer.js';
import { ToolInstallationManager, ToolInstallationResult } from '../src/tools/manager.js';

describe('Platform Detection & Rust Installation', () => {
  describe('PlatformDetector', () => {
    it('should detect platform information', async () => {
      const detector = PlatformDetector.getInstance();
      const platformInfo = await detector.detectPlatform();
      
      expect(platformInfo).toBeDefined();
      expect(platformInfo.platform).toBeTruthy();
      expect(platformInfo.architecture).toBeTruthy();
      expect(typeof platformInfo.isSupported).toBe('boolean');
    });

    it('should return consistent results', async () => {
      const detector = PlatformDetector.getInstance();
      const info1 = await detector.detectPlatform();
      const info2 = await detector.detectPlatform();
      
      expect(info1.platform).toBe(info2.platform);
      expect(info1.architecture).toBe(info2.architecture);
    });

    it('should provide installation guidance', () => {
      const detector = PlatformDetector.getInstance();
      const guidance = detector.getInstallationGuidance('linux');
      
      expect(guidance).toBeTruthy();
      expect(typeof guidance).toBe('string');
    });

    it('should clear cache correctly', async () => {
      const detector = PlatformDetector.getInstance();
      await detector.detectPlatform();
      
      const cachedInfo = detector.getCachedPlatformInfo();
      expect(cachedInfo).toBeTruthy();
      
      detector.clearCache();
      const clearedInfo = detector.getCachedPlatformInfo();
      expect(clearedInfo).toBeNull();
    });
  });

  describe('RustInstaller', () => {
    it('should implement ToolInstaller interface', () => {
      const installer = new RustInstaller();
      
      expect(installer.isToolInstalled).toBeDefined();
      expect(installer.getToolVersion).toBeDefined();
      expect(installer.installTool).toBeDefined();
      expect(installer.getInstallationTimeEstimate).toBeDefined();
      expect(installer.getTroubleshootingGuidance).toBeDefined();
    });

    it('should check if Rust is installed', async () => {
      const installer = new RustInstaller();
      const isInstalled = await installer.isToolInstalled();
      
      expect(typeof isInstalled).toBe('boolean');
    });

    it('should provide time estimates for different platforms', () => {
      const installer = new RustInstaller();
      
      const linuxEstimate = installer.getInstallationTimeEstimate('linux');
      const macosEstimate = installer.getInstallationTimeEstimate('macos');
      const windowsEstimate = installer.getInstallationTimeEstimate('windows');
      
      expect(linuxEstimate).toBeTruthy();
      expect(macosEstimate).toBeTruthy();
      expect(windowsEstimate).toBeTruthy();
    });

    it('should provide troubleshooting guidance', () => {
      const installer = new RustInstaller();
      const guidance = installer.getTroubleshootingGuidance('linux', 'timeout');
      
      expect(guidance).toBeTruthy();
      expect(guidance).toContain('rustup.rs');
    });
  });

  describe('ToolInstallationManager', () => {
    it('should be a singleton', () => {
      const manager1 = ToolInstallationManager.getInstance();
      const manager2 = ToolInstallationManager.getInstance();
      
      expect(manager1).toBe(manager2);
    });

    it('should register and track tool installations', () => {
      const manager = ToolInstallationManager.getInstance();
      manager.clearInstallationHistory();
      
      const mockResult: ToolInstallationResult = {
        success: true,
        version: '1.0.0',
        platform: 'linux' as SupportedPlatform
      };
      
      manager.registerToolInstallation('test-tool', mockResult);
      
      expect(manager.isToolInstalledInSession('test-tool')).toBe(true);
      expect(manager.getToolInstallationResult('test-tool')).toEqual(mockResult);
    });

    it('should clear installation history', () => {
      const manager = ToolInstallationManager.getInstance();
      
      const mockResult: ToolInstallationResult = {
        success: true,
        version: '1.0.0',
        platform: 'linux' as SupportedPlatform
      };
      
      manager.registerToolInstallation('test-tool', mockResult);
      expect(manager.isToolInstalledInSession('test-tool')).toBe(true);
      
      manager.clearInstallationHistory();
      expect(manager.isToolInstalledInSession('test-tool')).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should detect platform and check Rust installation status', async () => {
      const detector = PlatformDetector.getInstance();
      const installer = new RustInstaller();
      
      const platformInfo = await detector.detectPlatform();
      const isRustInstalled = await installer.isToolInstalled();
      
      expect(platformInfo).toBeDefined();
      expect(typeof isRustInstalled).toBe('boolean');
      
      // If Rust is installed, we should be able to get version
      if (isRustInstalled) {
        const version = await installer.getToolVersion();
        expect(version).toBeTruthy();
      }
    });

    it('should provide consistent platform support information', async () => {
      const detector = PlatformDetector.getInstance();
      const installer = new RustInstaller();
      
      const platformInfo = await detector.detectPlatform();
      const timeEstimate = installer.getInstallationTimeEstimate(platformInfo.platform);
      
      expect(timeEstimate).toBeTruthy();
      
      if (platformInfo.isSupported) {
        expect(timeEstimate).not.toContain('Manual installation required');
      } else {
        expect(timeEstimate).toContain('Manual installation required');
      }
    });
  });
});