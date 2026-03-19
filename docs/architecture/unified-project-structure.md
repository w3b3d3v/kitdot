# Unified Project Structure

Based on kitdot's CLI-first architecture with npm workspaces:

```
kitdot/
├── .github/                       # CI/CD workflows
│   └── workflows/
│       ├── ci.yml                # Test and build pipeline
│       └── publish.yml           # npm publishing workflow
├── src/                          # CLI source code
│   ├── cli.ts                   # Main CLI entry point
│   ├── commands/                # Command implementations
│   ├── tools/                   # Tool management
│   ├── utils/                   # Utility functions
│   ├── templates/               # Template registry
│   └── types.ts                 # Type definitions
├── dist/                         # Compiled JavaScript output
├── test/                         # Test suites
│   ├── template-validation.test.ts
│   └── platform-detection.test.ts
├── templates/                    # Local template storage (if any)
├── docs/                         # Documentation
│   ├── architecture.md          # This document
│   ├── prd.md                   # Product requirements
│   └── ui-architecture.md       # Frontend guidance
├── .env.example                  # Environment template
├── package.json                  # Main package configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Testing configuration
├── .eslintrc.js                  # Code quality rules
└── README.md                     # Project documentation
```
