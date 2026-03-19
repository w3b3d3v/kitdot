# Database Schema

Based on kitdot's architecture as a CLI tool and template orchestrator, the current implementation does not use a traditional database. However, here's the data persistence and storage strategy:

## File System-Based Data Storage

kitdot uses the local file system for data persistence rather than a traditional database, which aligns with its CLI tool nature:

```plaintext
~/.kitdot/                          # User data directory
├── cache/                          # Template and tool caches
│   ├── templates/                  # Cached template repositories
│   │   ├── basic-polkadot-dapp/    # Cached template files
│   │   └── social-login-web3-react/
│   └── tools/                      # Tool installation artifacts
│       └── rust/                   # Rust installation metadata
├── config/                         # User configuration
│   ├── settings.json               # Global kitdot preferences
│   └── template-registry.json      # Local template registry cache
└── logs/                           # Operation logs
    ├── installations.log           # Tool installation history
    └── projects.log                # Project creation history
```

## Configuration File Schemas

**User Settings Schema (settings.json):**
```json
{
  "version": "0.1.0",
  "preferences": {
    "defaultProjectType": "fullstack",
    "autoInstallDependencies": false,
    "templateCacheEnabled": true,
    "rustToolchainPath": "/path/to/rust"
  },
  "platforms": {
    "detected": "darwin-arm64",
    "supported": true,
    "lastDetected": "2025-01-17T10:30:00Z"
  }
}
```

**Template Registry Cache Schema (template-registry.json):**
```json
{
  "lastUpdated": "2025-01-17T10:30:00Z",
  "templates": {
    "basic-polkadot-dapp": {
      "name": "Basic Polkadot DApp",
      "description": "Official React + Solidity + Hardhat template",
      "category": "fullstack",
      "lastFetched": "2025-01-17T10:25:00Z",
      "validation": {
        "status": "valid",
        "checkedAt": "2025-01-17T10:25:00Z",
        "errors": []
      },
      "source": {
        "type": "remote",
        "repository": "paritytech/create-polkadot-dapp",
        "branch": "main",
        "directory": "templates/react-solidity-hardhat"
      }
    }
  }
}
```
