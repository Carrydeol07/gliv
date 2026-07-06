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
