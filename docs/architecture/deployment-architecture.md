# Deployment Architecture

## Deployment Strategy

**CLI Distribution:**
- **Platform:** npm registry for global installation
- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Distribution Method:** npm package publication

**Release Process:**
- **Platform:** GitHub Actions for automated releases
- **Build Command:** Automated on tag push
- **Deployment Method:** npm publish with CI/CD

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run build
```

## Environments

| Environment | CLI Install | Purpose |
|-------------|-------------|---------|
| Development | `npm link` (local) | Local development and testing |
| Staging | `npm install -g kitdot@beta` | Pre-release testing |
| Production | `npm install -g kitdot` | Global distribution |
