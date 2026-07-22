############################################################
## 16_IMPLEMENTATION_ROADMAP.md
############################################################

# GLIV v2

# 16_IMPLEMENTATION_ROADMAP.md

## Phase 1

-   Electron
-   React
-   TypeScript
-   SQLite
-   Theme
-   Navigation

## Phase 2

-   Database
-   Provider Manager
-   Importe Engine
-   Local Cache

## Phase 3

-   Library
-   Collections
-   Search
-   Series Page

## Phase 4

Phase 4

• Discover
• Updates
• Series Page Features
    • Availability
    • Connections

## Phase 5

-   Polish
-   Performance
-   Backups
-   Diagnostics
-   Packaging

## Definition of Done

GLIV replaces the original DOCX workflow while preserving original order
and providing reliable discovery, updates and library management.

############################################################
## 34_FOLDER_STRUCTURE.md
############################################################

# GLIV v2

# FOLDER_STRUCTURE.md

This document describes the internal structure of the **App/** directory only. The overall GLIV project (Obsidian vault) follows the repository structure defined in the Project Summary.

``` text
gliv/
├── docs/
├── electron/
├── src/
│   ├── components/
│   ├── pages/
│   ├── providers/
│   ├── database/
│   ├── services/
│   ├── hooks/
│   ├── state/
│   ├── models/
│   ├── assets/
│   └── utils/
├── tests/
└── scripts/
```

Business logic lives in services. UI components remain
presentation-focused.

############################################################
## 49_LOGGING_AND_DIAGNOSTICS.md
############################################################

# 49_LOGGING_AND_DIAGNOSTICS.md  
  
## Logging  
  
- Provider requests  
- Import Engine operations  
- Sync events  
- Errors  
  
## Diagnostics  
  
- Provider status  
- Cache usage  
- Database health  
- Backup status  
  
User-facing logs should remain concise and readable.

############################################################
## 55_STATE_MANAGEMENT.md
############################################################

# 55_STATE_MANAGEMENT.md  
  
Separate:  
- UI state  
- Library state  
- Provider state  
- Import Engine state  
- Sync state  
  
Avoid tightly coupled global state.

############################################################
## 56_TESTING_STRATEGY.md
############################################################

# 56_TESTING_STRATEGY.md  
  
Testing Layers  
  
- Unit  
- Integration  
- UI  
- Import Engine  
- Provider  
  
Critical workflows receive end-to-end tests.

############################################################
## 57_RELEASE_PROCESS.md
############################################################

# 57_RELEASE_PROCESS.md  
  
Stages  
  
- Development  
- Beta  
- Release Candidate  
- Stable  
  
Every release creates a backup before database migrations.

############################################################
## 58_CONFIGURATION.md
############################################################

# 58_CONFIGURATION.md  
  
Configurable  
  
- Theme  
- Provider preferences  
- Cache limits  
- Backup schedule  
- Update frequency  
  
Defaults should work without configuration.

############################################################
## 59_PACKAGING.md
############################################################

# 59_PACKAGING.md  
  
Platforms  
  
- Windows  
- macOS  
- Linux  
  
Deliverables  
  
- Installer  
- Portable build (future)  
  
Automatic update support planned.

