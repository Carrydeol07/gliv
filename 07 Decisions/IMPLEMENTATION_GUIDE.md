# GLIV v2

# IMPLEMENTATION_GUIDE.md

> Version: 1.0
> Status: Locked
> Purpose: Defines the implementation workflow for GLIV v2.

---

# Purpose

This document defines the implementation process for GLIV v2.

The documentation has already been stabilized.

Implementation is expected to follow the documentation exactly.

The goal is to minimize architectural drift, reduce AI hallucination, and ensure every implementation decision is traceable back to the documentation.

---

# Source of Truth

The documentation hierarchy is authoritative.

When documents disagree, higher levels always override lower levels.

Priority:

1. ADRs
2. Business Rules
3. Architecture
4. Foundation
5. Components
6. Design
7. Engineering

Implementation must never contradict a higher-level document.

---

# General Principles

Implementation is not design.

Do not redesign the architecture.

Do not simplify documented behavior.

Do not invent undocumented features.

If documentation is internally consistent:

Implement it exactly.

If documentation contains a contradiction:

Stop implementation.

Report the inconsistency.

Do not guess.

---

# Architectural Principles

The following decisions are locked.

## Offline First

The application must function without internet access.

Provider data enriches the Library.

Provider data never owns personal data.

---

## Three Data Layers

Layer 1

Personal Data

Examples:

- Progress
- Status
- Rating
- Favorite
- Notes
- Collections
- Progress Override

Layer 1 always wins.

---

Layer 2

Metadata

Examples:

- Titles
- Formats
- Contributors
- Genres
- Connections

Refreshable.

---

Layer 3

Publication Data

Examples:

- Latest Official Release
- Latest Scanlation Release
- Availability
- Updates

Refreshable.

---

## Provider Manager

No component communicates directly with providers.

Every provider interaction passes through the Provider Manager.

---

## Import Engine

Every import source uses the same Import Engine.

Examples:

- DOCX
- Search
- Backup Restore
- Add Another Format

---

## Title Model

One Title represents one work.

A Title may contain:

- Anime
- Manga
- Manhwa
- Manhua
- Novel

Each media type may appear at most once.

Each Format owns:

- Provider Relationships
- Publication Data
- Progress
- Contributors

independently.

---

## Contributor Model

One Contributor entity.

Supported roles:

- Author
- Artist

The UI may expose Author Pages and Artist Pages.

Internally they are the same entity.

---

## Manual Formats

Manual Formats are provider-independent.

They support Layer 1 personal data.

They do not support provider functionality.

---

## Progress Override

Progress Override belongs to Layer 1.

Provider synchronization never edits it.

Provider synchronization may remove it after catching up.

---

## Effective Latest

Calculated.

Never provider-owned.

Never manually edited.

---

# Module Workflow

Every module follows the same lifecycle.

```
Documentation
        │
        ▼
Implementation Planning
        │
        ▼
Implementation
        │
        ▼
Architecture Review
        │
        ▼
Fixes
        │
        ▼
Final Review
        │
        ▼
Merge
```

Modules are implemented independently.

---

# Planning Phase

Before writing code:

1.

Read every relevant document.

2.

Identify:

- Foundation

- Architecture

- Business Rules

- Design

- Components

- Engineering

3.

Summarize understanding.

4.

Identify dependencies.

5.

Produce implementation order.

Only then begin implementation.

---

# Coding Rules

Code must be:

- Production Ready
- Modular
- Strongly Typed
- Documented
- Testable
- Maintainable

Avoid:

- Temporary implementations
- Placeholder architecture
- Hidden assumptions
- TODO-driven design

---

# Documentation Compliance

Every implementation should be traceable to documentation.

If code introduces behavior that is not documented:

It is considered incomplete.

---

# AI Workflow

The recommended AI workflow is:

ChatGPT/Claude

↓

Implementation Planning

↓

Implementation Brief

↓

Implementation Agent

↓

Architecture Review

↓

Implementation Fixes

↓

Final Review

↓

Git Commit

The planning AI and implementation AI should have distinct responsibilities.

---

# One Module At A Time

Never implement multiple modules simultaneously.

Complete:

Plan

↓

Implement

↓

Review

↓

Merge

↓

Next Module

---

# AI Responsibilities

## Planning AI

Responsible for:

- Understanding documentation
- Identifying dependencies
- Producing implementation plans

Not responsible for:

- Architectural redesign

---

## Implementation AI

Responsible for:

- Writing production code
- Following documentation exactly

Must not:

- Invent features
- Modify architecture
- Ignore Business Rules

---

## Review AI

Responsible for:

- Architecture compliance
- Documentation compliance
- Code quality
- Layer separation
- Dependency direction

Review findings should be classified as:

- Bug
- Documentation Inconsistency
- Improvement
- Future Enhancement

---

# Git Workflow

Each module should use its own branch.

Example:

main

↓

module-01

↓

module-02

↓

module-03

Only reviewed modules are merged.

---

# Commit Philosophy

Commits should remain focused.

Good:

- Module 1 complete
- Provider Manager implemented
- Progress Widget completed

Avoid:

- Misc fixes
- Final cleanup
- Random changes

---

# Testing

Every module should include:

- Unit Tests

When appropriate:

- Widget Tests

Critical workflows should also include:

- Integration Tests

Testing is part of implementation, not a later phase.

---

# Documentation Updates

Implementation should not modify architecture.

If implementation reveals a genuine documentation inconsistency:

Stop.

Document the issue.

Resolve the documentation first.

Only then continue implementation.

---

# Definition of Done

A module is complete only when:

- Documentation is fully implemented.
- Tests pass.
- No architecture violations exist.
- Code review is complete.
- Documentation review is complete.
- The module is committed.

Only then may work begin on the next module.