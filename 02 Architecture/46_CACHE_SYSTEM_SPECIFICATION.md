# GLIV v2

# 46_CACHE_SYSTEM.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

The Cache System reduces unnecessary provider requests, improves responsiveness, and enables graceful operation during temporary provider outages.

Cache is an optimization layer and never becomes the source of truth.

---

## Cache Tiers (ADR-016)

The Cache System operates in two tiers.

### Library Tier (Persistent)

Applies to provider-backed Formats belonging to a Title currently in the user's Library — that is, Formats with an `external_reference` per BR-002.

Stored in the `cache_entries` table (see 32_DATABASE_SPECIFICATION.md). Survives application restarts.

### Discover Tier (In-Memory)

Applies to search/browse results not yet added to the Library.

Never persisted to disk. Fully cleared when the application closes.

### Scope Selection

The Provider Manager determines which tier applies to each request and passes it explicitly (`scope: 'library' | 'discover'`). The Cache System never infers the tier through a database lookup.

---

## Cached Information

Examples include:

- Search results
- Metadata
- Posters
- Availability
- Publication information
- Live updates

Personal data is never cached as provider data.

---

## Cache Flow

```text
Provider
    ↓
Provider Manager
    ↓
Cache
    ↓
Application
```

---

## Cache Rules

- Provider data is cached after successful retrieval.
- Cached data may be used when a provider is temporarily unavailable.
- Expired cache entries are refreshed automatically.
- Cache never overwrites personal data.
- Manual Titles do not participate in provider caching.
- Discover-tier entries are never persisted and do not participate in orphan retention.

---

## Cache Invalidation

Cache entries may be refreshed when:

- Expiration time is reached.
- A manual refresh is requested.
- Provider data changes.
- Cache is cleared by the user.

---

## Orphaned Entries (ADR-016)

When a Format is removed from the Library, its Library-tier cache entries are not deleted immediately.

Entries are marked orphaned and retained for 7 days, allowing the same Format to reuse its cached data if it is added back to the Library within that window.

After 7 days, orphaned entries are permanently deleted by a startup cleanup routine.

Orphan status never overrides normal expiration. An entry past its `expires_at` is still treated as a miss, even while it is within its 7-day orphan window.

---

## Failure Handling

If a provider is unavailable:

1. Use cached data when available.
2. Attempt the configured secondary provider (if one exists).
3. Gracefully continue with the latest available information.

If no provider data exists, the application continues normally without interrupting the user.

---

## Principles

- Cache improves performance.
- Cache never owns data.
- Personal information always remains authoritative.
- Provider communication always occurs through the Provider Manager.