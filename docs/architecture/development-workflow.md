# Development Workflow

## Local Development Setup

```bash
# Prerequisites
node --version    # >= 18.0.0
npm --version     # Latest
git --version     # Latest
```

```bash
# Initial Setup
git clone https://github.com/your-org/kitdot
cd kitdot
npm install
npm run build
npm link         # Install globally for testing
```

```bash
# Development Commands
npm run dev      # Start development with tsx
npm run build    # Compile TypeScript to JavaScript
npm run test     # Run all tests
npm run lint     # Check code quality
npm run lint:fix # Fix linting issues
```

## Environment Configuration

```bash
# Development (.env)
NODE_ENV=development
LOG_LEVEL=debug

# Production (.env)
NODE_ENV=production
LOG_LEVEL=info
```
