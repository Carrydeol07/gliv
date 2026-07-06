# GLIV v2

# 46_CACHE_SYSTEM.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

The Cache System reduces unnecessary provider requests, improves responsiveness, and enables graceful operation during temporary provider outages.

Cache is an optimization layer and never becomes the source of truth.

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

---

## Cache Invalidation

Cache entries may be refreshed when:

- Expiration time is reached.
- A manual refresh is requested.
- Provider data changes.
- Cache is cleared by the user.

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