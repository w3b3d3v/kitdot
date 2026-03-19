# Data Models

Based on kitdot's role as a tool and template orchestrator, the core data models represent the entities that the CLI manages and manipulates during project generation and tool integration.

## Template

**Purpose:** Represents a project template that can be fetched, validated, and used for project generation

**Key Attributes:**
- `id`: string - Unique identifier for the template
- `name`: string - Human-readable template name
- `description`: string - Template description and use case
- `source`: TemplateSource - GitHub repo, npm package, or local path
- `version`: string - Template version or git reference
- `type`: ProjectType - fullstack, frontend-only, contracts-only
- `tags`: string[] - Searchable tags for template discovery
- `validatedAt`: Date - Last validation timestamp
- `isOfficial`: boolean - Whether template is Parity-maintained

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  source: TemplateSource;
  version: string;
  type: ProjectType;
  tags: string[];
  validatedAt: Date;
  isOfficial: boolean;
  requirements: ToolRequirement[];
  metadata: TemplateMetadata;
}
```

**Relationships:**
- Has many ToolRequirement entities
- Belongs to TemplateSource
- Can generate Project entities

## Tool

**Purpose:** Represents an embedded development tool that kitdot can execute and manage

**Key Attributes:**
- `id`: string - Unique tool identifier
- `name`: string - Tool display name
- `executable`: string - Command or binary name
- `version`: string - Required or installed version
- `isEmbedded`: boolean - Whether tool is bundled with kitdot
- `installCommand`: string - Command to install tool if not embedded
- `configFiles`: string[] - Configuration files the tool expects

```typescript
interface Tool {
  id: string;
  name: string;
  executable: string;
  version: string;
  isEmbedded: boolean;
  installCommand?: string;
  configFiles: string[];
  adapters: ToolAdapter[];
  dependencies: ToolDependency[];
}
```

**Relationships:**
- Has many ToolAdapter entities for different operations
- Required by Template entities through ToolRequirement
- Can have ToolDependency relationships with other tools

## Project

**Purpose:** Represents a generated project instance with its configuration and tool setup

**Key Attributes:**
- `name`: string - Project name
- `path`: string - Local file system path
- `templateUsed`: string - Template ID used for generation
- `toolsInstalled`: InstalledTool[] - Tools configured for this project
- `generatedAt`: Date - Project creation timestamp
- `lastModified`: Date - Last modification timestamp
- `config`: ProjectConfig - Project-specific configuration

```typescript
interface Project {
  name: string;
  path: string;
  templateUsed: string;
  toolsInstalled: InstalledTool[];
  generatedAt: Date;
  lastModified: Date;
  config: ProjectConfig;
  structure: ProjectStructure;
}
```

**Relationships:**
- Created from a Template
- Contains multiple InstalledTool entities
- Has one ProjectStructure representing file organization

## ToolAdapter

**Purpose:** Provides unified interface to specific tool operations, abstracting tool-specific command line interfaces

**Key Attributes:**
- `toolId`: string - Reference to parent Tool
- `operation`: string - Operation name (build, test, dev, deploy)
- `command`: string - Actual command to execute
- `args`: string[] - Default arguments for the command
- `workingDirectory`: string - Directory context for execution

```typescript
interface ToolAdapter {
  toolId: string;
  operation: string;
  command: string;
  args: string[];
  workingDirectory: string;
  envVars: Record<string, string>;
  successCriteria: string[];
}
```

**Relationships:**
- Belongs to a Tool entity
- Used by Project operations to execute tool commands
