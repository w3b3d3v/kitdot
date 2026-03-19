# Coding Standards

## Critical CLI Rules

- **Error Handling:** All external operations must include comprehensive error handling with user guidance
- **User Consent:** Tool installations and optional operations require explicit user consent
- **Cross-Platform:** All file system operations must work on Windows, macOS, and Linux
- **Input Validation:** Validate all user inputs against injection and path traversal attacks
- **Progress Feedback:** Long-running operations must provide progress feedback to users
- **Graceful Degradation:** Provide manual alternatives when automated operations fail

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Commands | kebab-case | `init`, `tools` |
| Files | kebab-case | `platform-detector.ts` |
| Classes | PascalCase | `RustInstaller` |
| Functions | camelCase | `createProject` |
| Constants | UPPER_SNAKE_CASE | `TEMPLATE_REGISTRY` |
