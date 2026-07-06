# GLIV v2

# 45_SYNC_ENGINE.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

The Sync Engine refreshes provider-backed data while preserving all personal information.

Synchronization enriches the library but never replaces user-owned data.

## Sync Scope

### Layer 1 — Personal Data

Never synchronized.

Includes:

- Progress
- Progress Override
- Notes
- Ratings
- Favorites
- Collections
- Original Order

### Layer 2 — Metadata

Refreshable.

Examples:

- Synopsis
- Genres
- Contributors
- Publication Information
- Connections

### Layer 3 — Live Information

Continuously refreshable.

Examples:

- Latest releases
- Hiatus status
- Announcements
- Airing information

## Sync Flow

```text
Provider
    ↓
Provider Manager
    ↓
Cache
    ↓
Sync Engine
    ↓
Database
```

## Sync Rules

- Layer 1 is never modified.
- Layer 2 refreshes only provider-managed fields.
- Layer 3 always reflects the newest provider information.
- Manual Titles are excluded from synchronization.
- Provider failures never affect personal data.

## Progress Override

Progress Override is personal data.

It is never overwritten by synchronization.

If provider data reaches or exceeds the overridden value, the Progress Override is automatically removed.

## External References

Only provider-backed Formats with valid External References participate in synchronization.

## Sync History

Every synchronization records:

- Provider
- Time
- Result
- Duration

## Principles

- Synchronization is deterministic.
- Personal data always wins.
- Manual Titles remain completely user-managed.
- Provider communication occurs only through the Provider Manager.