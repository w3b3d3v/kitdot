# Error Handling Strategy

## Error Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Component
    participant ErrorHandler

    Component->>Component: Operation fails
    Component->>ErrorHandler: Throw/return error
    ErrorHandler->>ErrorHandler: Categorize error type
    ErrorHandler->>CLI: Format user-friendly message
    CLI->>User: Display error + guidance
    CLI->>User: Suggest manual alternatives
```

## Error Response Format

```typescript
interface CLIError {
  code: string;
  message: string;
  userGuidance: string;
  troubleshootingUrl?: string;
  platform?: string;
}
```
