# Testing Strategy

## Testing Pyramid

```
    E2E Tests (CLI Integration)
   /                           \
  Unit Tests (Components)    Integration Tests (Templates)
```

## Test Organization

```
test/
├── unit/                         # Component unit tests
│   ├── tools/
│   │   ├── platform-detector.test.ts
│   │   └── rust-installer.test.ts
│   └── utils/
│       └── project-structure.test.ts
├── integration/                  # Template integration tests
│   ├── template-validation.test.ts
│   └── project-generation.test.ts
└── e2e/                         # End-to-end CLI tests
    ├── init-command.test.ts
    └── tools-command.test.ts
```
