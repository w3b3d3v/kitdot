# Core Workflows

Based on the actual kitdot implementation, here are the key system workflows illustrated with sequence diagrams:

## Project Initialization Workflow

```mermaid
sequenceDiagram
    participant User
    participant CLI as CLI Core
    participant UI as Interactive UI
    participant PG as Project Generator
    participant TM as Template Manager
    participant PSG as Project Structure Generator
    participant GitHub
    participant FileSystem as File System

    User->>CLI: kitdot init [project-name]
    CLI->>UI: displayHomeScreen()
    CLI->>PG: initCommand(projectName, options)

    PG->>UI: gatherProjectInfo()
    UI->>User: Prompt for project name (if not provided)
    User->>UI: "my-polkadot-dapp"
    UI->>User: Select project type (fullstack/frontend/backend)
    User->>UI: "fullstack"

    PG->>TM: getTemplatesByCategory('frontend')
    TM->>PG: Available templates list
    UI->>User: Select template from list
    User->>UI: "basic-polkadot-dapp"

    PG->>PSG: createProjectStructure(config)
    PSG->>FileSystem: Create base directory structure

    alt Frontend Setup Required
        PG->>PSG: setupFrontend(config)
        PSG->>TM: getTemplate(templateName)
        TM->>GitHub: Clone template via degit
        GitHub->>TM: Template files
        TM->>FileSystem: Extract template to project directory
        PSG->>FileSystem: npm install (frontend dependencies)

        opt Optional Setup Commands
            PSG->>UI: Prompt for optional setup
            User->>UI: Confirm setup
            PSG->>FileSystem: npm run generate
        end
    end

    alt Contracts Setup Required
        PG->>PSG: setupContracts(config)
        PSG->>FileSystem: Create contracts directory
        PSG->>FileSystem: Setup Hardhat configuration
        PSG->>FileSystem: npm install (contract dependencies)
    end

    alt Documentation Setup Required
        PG->>PSG: setupDocumentation(config)
        PSG->>FileSystem: Setup mdbook structure
    end

    PG->>UI: Display project completion and next steps
    UI->>User: Project ready message with commands
```

## Tools Management Workflow

```mermaid
sequenceDiagram
    participant User
    participant CLI as CLI Core
    participant TM as Tools Manager
    participant PD as Platform Detector
    participant RI as Rust Installer
    participant UI as Interactive UI
    participant System as Operating System

    User->>CLI: kitdot tools install-rust
    CLI->>TM: toolsCommand('install-rust')

    TM->>RI: isToolInstalled()
    RI->>System: Check rust command availability
    System->>RI: Tool status

    alt Rust Already Installed
        RI->>System: getToolVersion()
        System->>RI: Version string
        RI->>UI: Display "already installed" message
        UI->>User: Success message with version
    else Rust Not Installed
        TM->>PD: detectPlatform()
        PD->>System: Get OS and architecture info
        System->>PD: Platform details
        PD->>TM: Platform information

        alt Platform Supported
            TM->>UI: Display platform info and installation prompt
            UI->>User: Consent for Rust installation
            User->>UI: Confirm installation

            TM->>RI: installRust(platform)
            RI->>System: Execute rustup installation
            System->>RI: Installation result

            alt Installation Successful
                RI->>UI: Success message
                UI->>User: Installation complete
            else Installation Failed
                RI->>UI: Error message with troubleshooting
                UI->>User: Error details and manual guidance
            end
        else Platform Not Supported
            TM->>UI: Display manual installation guidance
            UI->>User: Platform-specific instructions
        end
    end
```
