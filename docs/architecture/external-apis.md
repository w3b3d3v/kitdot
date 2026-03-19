# External APIs

Based on the actual kitdot implementation, here are the external service integrations currently used:

## GitHub API

**Purpose:** Remote template repository access for project scaffolding
**Documentation:** https://docs.github.com/en/rest
**Base URL(s):** https://api.github.com, https://github.com (for repository cloning)
**Authentication:** Public repository access (no authentication required for current templates)
**Rate Limits:** 60 requests/hour for unauthenticated requests, 5000/hour for authenticated

**Key Endpoints Used:**
- Repository cloning via `degit` (uses git clone under the hood)
- Template validation through repository structure inspection

**Integration Notes:** kitdot uses `degit` library which handles GitHub repository cloning without git history. Current templates are from public repositories so no authentication is required. Rate limiting primarily affects template discovery operations.

## rustup.rs Installation API

**Purpose:** Cross-platform Rust toolchain installation for blockchain development
**Documentation:** https://rustup.rs/
**Base URL(s):** https://sh.rustup.rs (Unix), https://win.rustup.rs (Windows)
**Authentication:** None required
**Rate Limits:** No documented limits for installation scripts

**Key Endpoints Used:**
- `GET https://sh.rustup.rs` - Unix/Linux installation script
- `GET https://win.rustup.rs/x86_64` - Windows 64-bit installer

**Integration Notes:** kitdot executes platform-specific installation commands through the RustInstaller component. Installation is performed via direct shell execution of rustup scripts. Error handling includes platform-specific troubleshooting guidance.

## npm Registry

**Purpose:** Package dependency management for generated projects
**Documentation:** https://docs.npmjs.com/cli/
**Base URL(s):** https://registry.npmjs.org
**Authentication:** None required for public package installation
**Rate Limits:** No enforced limits for package installation

**Key Endpoints Used:**
- Package installation via `npm install` commands in generated projects
- Dependency resolution through npm CLI

**Integration Notes:** kitdot doesn't directly call npm registry APIs but orchestrates npm commands in generated projects. Template setup includes npm dependency installation for both frontend and contract projects.
