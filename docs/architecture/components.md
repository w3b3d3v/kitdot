# Components

Based on the actual kitdot implementation and tool orchestration architecture, here are the major logical components across the system:

## CLI Core

**Responsibility:** Main entry point and command orchestration for kitdot CLI operations

**Key Interfaces:**
- Commander.js command registration and parsing
- Error handling and user feedback coordination
- Version management and help system

**Dependencies:** Commander.js, chalk for styling

**Technology Stack:** TypeScript, Commander.js, Node.js runtime

## Project Generator

**Responsibility:** Orchestrates complete project creation workflow from template selection to dependency installation

**Key Interfaces:**
- `initCommand(projectName?, options?)` - Main project initialization entry point
- `gatherProjectInfo()` - Interactive project configuration collection
- `createProject(config)` - Project creation orchestration

**Dependencies:** Inquirer for user input, ora for progress feedback, Template Registry, Platform Detector

**Technology Stack:** TypeScript with inquirer.js, ora, fs-extra

## Template Manager

**Responsibility:** Template discovery, fetching, validation, and registry management

**Key Interfaces:**
- `getTemplatesByCategory(category)` - Filter templates by project type
- `getTemplate(key)` - Retrieve specific template definition
- Template registry with remote GitHub repository support

**Dependencies:** degit for GitHub repository cloning, fs-extra for file operations

**Technology Stack:** TypeScript, degit, GitHub API integration

## Tools Manager

**Responsibility:** Development tool installation, status checking, and cross-platform management

**Key Interfaces:**
- `toolsCommand(subcommand?)` - Main tools management entry point
- `installRustCommand()` - Rust toolchain installation
- `checkToolsCommand()` - Tool status verification

**Dependencies:** Platform Detector, individual tool installers (RustInstaller)

**Technology Stack:** TypeScript, platform-specific installation scripts, execa for process execution

## Platform Detector

**Responsibility:** Cross-platform environment detection and installation guidance

**Key Interfaces:**
- `detectPlatform()` - Identify OS, architecture, and capabilities
- `getInstallationGuidance(platform)` - Platform-specific setup instructions
- Singleton pattern for consistent platform information

**Dependencies:** Node.js built-in os module, process detection

**Technology Stack:** TypeScript, Node.js platform APIs

## Project Structure Generator

**Responsibility:** File system operations for project scaffolding and directory creation

**Key Interfaces:**
- `createProjectStructure(config)` - Create base project directories
- `setupContracts(config)` - Smart contract project setup
- `setupFrontend(config)` - Frontend application setup
- `setupDocumentation(config)` - Documentation generation

**Dependencies:** fs-extra, template fetching, dependency installation

**Technology Stack:** TypeScript, fs-extra, degit, npm/yarn process execution

## Rust Installer

**Responsibility:** Rust toolchain installation and management for blockchain development

**Key Interfaces:**
- `isToolInstalled()` - Check Rust installation status
- `getToolVersion()` - Retrieve installed Rust version
- `installRust(platform)` - Platform-specific Rust installation
- `getTroubleshootingGuidance()` - Error resolution guidance

**Dependencies:** Platform Detector, execa for rustup execution

**Technology Stack:** TypeScript, rustup.rs integration, cross-platform shell execution

## Interactive User Interface

**Responsibility:** User experience orchestration with prompts, progress feedback, and styled output

**Key Interfaces:**
- Template selection workflows
- Consent and configuration prompts
- Progress spinners and status updates
- Error reporting and troubleshooting guidance

**Dependencies:** inquirer, ora, chalk, homeScreen utility

**Technology Stack:** inquirer.js for prompts, ora for spinners, chalk for terminal styling
