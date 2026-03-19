# Backend Architecture

kitdot's backend is the CLI tool itself, designed as a Node.js application with modular service architecture:

## Service Architecture

**CLI Application Pattern** - Single-threaded Node.js application with command-based architecture:

```
src/
├── cli.ts                         # Main CLI entry point
├── commands/                      # Command handlers
│   ├── init.ts                   # Project initialization
│   └── tools.ts                  # Tools management
├── tools/                        # Tool management services
│   ├── platform-detector.ts     # OS/architecture detection
│   └── rust-installer.ts        # Rust toolchain management
├── utils/                        # Utility services
│   ├── project-structure.ts     # File system operations
│   ├── setup-contracts.ts       # Contract scaffolding
│   ├── setup-frontend.ts        # Frontend scaffolding
│   └── setup-docs.ts            # Documentation setup
├── templates/                    # Template management
│   └── registry.ts              # Template registry and fetching
└── types.ts                     # Shared type definitions
```
