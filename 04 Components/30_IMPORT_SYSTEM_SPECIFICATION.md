# GLIV v2

# 30_IMPORT_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Import Engine brings external library data into GLIV while preserving personal information and preventing incorrect provider matches.

Every import follows the same validation and review pipeline regardless of its source.

---

# Supported Entry Points

Current:

- DOCX Import
- Backup Restore

Future:

- Search Import
- CSV Import
- TXT Import

All entry points use the same Import Engine after initial parsing.

---

# Import Pipeline

```text
Import Source
      │
      ▼
Parser
      │
      ▼
Normalizer
      │
      ▼
Provider Matching
      │
      ▼
Import Review
      │
      ▼
Database
```

---

# Parsing

The Import Engine recognizes:

- Original Order
- Progress
- Status
- Notes
- Collections
- Raw Source Text

Unknown data is preserved whenever possible.

---

# Provider Matching

Provider matching attempts to identify the imported Title using provider metadata.

Deterministic matches may proceed automatically.

All non-deterministic provider matches require Import Review.

The Import Engine never silently merges ambiguous Titles.

---

# Import Review

Import Review displays:

- Imported Title
- Suggested Provider Match
- Existing Library Match (if applicable)
- Match Confidence
- Suggested Action

Available actions:

- Merge with Existing Title
- Create New Title
- Create Manual Title
- Search Again
- Skip

---

# Manual Titles

If no suitable provider-backed match exists, users may create a Manual Title directly from Import Review.

Manual Titles preserve all imported personal information but do not receive provider synchronization.

---

# Conflict Resolution

When conflicts occur:

- Personal Progress always wins.
- Personal Status always wins.
- Personal Notes are preserved.
- Provider metadata may be refreshed later.

No personal information is discarded automatically.

---

# Import States

- Parsing
- Matching
- Import Review
- Importing
- Completed
- Cancelled
- Failed

---

# Accessibility

Import Review is fully keyboard accessible.

Users can:

- Review matches
- Search again
- Merge
- Create Manual Titles

without requiring a mouse.

---

# Principles

- The Import Engine never silently guesses.
- Personal information is always preserved.
- Provider matching never overwrites Layer 1 data.
- Ambiguous provider matches always require user confirmation.
- Every import remains reversible.

---

# Acceptance Criteria

The component is complete when:

- Multiple import sources use the same pipeline.
- Deterministic provider matches import correctly.
- Ambiguous matches always require Import Review.
- Manual Titles provide a valid fallback.
- Personal information is never lost.