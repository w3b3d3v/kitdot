# Tech Stack

This is the DEFINITIVE technology selection for the entire kitdot project. Based on the tool orchestration architecture and existing implementation:

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| CLI Runtime | Node.js | >=18.0.0 | JavaScript runtime for CLI execution | Modern LTS with ESM support, matches existing codebase |
| CLI Language | TypeScript | ^5.6.2 | Type-safe CLI development | Existing choice, enables type safety across tool integrations |
| CLI Framework | Commander.js | ^12.1.0 | Command-line interface structure | Existing choice, mature and well-documented CLI framework |
| Template Engine | degit | ^2.8.4 | Git repository cloning without history | Existing choice, efficient for template fetching from GitHub |
| Process Management | execa | ^9.4.0 | Tool execution and process management | Existing choice, modern process execution with better error handling |
| User Interface | Inquirer.js | ^12.0.0 | Interactive CLI prompts and forms | Existing choice, rich interactive CLI components |
| Progress Feedback | ora | ^8.1.0 | Loading spinners and progress indication | Existing choice, enhances user experience during operations |
| File Operations | fs-extra | ^11.2.0 | Enhanced file system operations | Existing choice, extends Node.js fs with additional utilities |
| Terminal Styling | chalk | ^5.3.0 | Colored terminal output | Existing choice, improves CLI readability and UX |
| Package Distribution | npm | Latest | Global package distribution | Standard for Node.js CLI tools, existing distribution method |
| Embedded Tool: Contracts | Hardhat | Latest | Smart contract development and testing | Industry standard for Ethereum-compatible development |
| Embedded Tool: Frontend | Vite | Latest | Frontend build tool and dev server | Fast, modern build tool for React applications |
| Embedded Tool: Testing | Jest | ^29.7.0 | JavaScript testing framework | Existing choice, comprehensive testing capabilities |
| Embedded Tool: Linting | ESLint | ^9.14.0 | Code quality and style enforcement | Existing choice, maintains code standards |
| Embedded Tool: Docs | mdbook | Latest | Documentation generation | Rust-based documentation tool, integrates with Polkadot ecosystem |
| Template Source | GitHub API | v4 | Remote template repository access | Primary source for Parity and community templates |
| Template Validation | Custom System | 1.0 | Template integrity and compatibility checks | Existing implementation, ensures template quality |
| Build System | TypeScript Compiler | ^5.6.2 | CLI compilation and type checking | Existing choice, compiles TypeScript to JavaScript |
| Monorepo Tool | npm workspaces | Latest | Package management and organization | Simple, built-in solution for monorepo structure |
| CI/CD | GitHub Actions | Latest | Automated testing and publishing | Standard for open source projects |
