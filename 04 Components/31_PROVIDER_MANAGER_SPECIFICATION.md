# GLIV v2

# 31_PROVIDER_MANAGER_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Provider Manager is the single gateway between GLIV and every external metadata provider.

All provider communication passes through the Provider Manager.

No other component communicates directly with external providers.

---

# Responsibilities

The Provider Manager is responsible for:

- Search Routing
- Metadata Retrieval
- Publication Information
- Availability
- Connections
- Contributor Information
- Update Retrieval
- Provider Caching
- Rate Limiting
- Retry Logic
- Duplicate Resolution

---

# Provider Routing

Provider routing is capability-driven rather than provider-driven.

Current routing:

## Anime

Primary

- AniList

Secondary

- Jikan

---

## Manga / Manhwa / Manhua

Primary

- MangaUpdates

Secondary

- Comick

---

## Novels

Primary

- MangaUpdates

Secondary

- None

If no suitable provider-backed Title exists, the Provider Manager allows the workflow to continue through Manual Title creation.

---

# Search Flow

```text
Search Request
      │
      ▼
Provider Manager
      │
      ├──────────────► AniList
      │
      ├──────────────► MangaUpdates
      │
      ├──────────────► Comick
      │
      └──────────────► Jikan
               │
               ▼
      Aggregated Results
               │
               ▼
      Duplicate Resolution
               │
               ▼
      Search Results
```

---

# Caching

The Provider Manager maintains a local cache to improve responsiveness.

Cached information may include:

- Metadata
- Artwork
- Publication Information
- Availability
- Connections

Personal data is never cached by the Provider Manager.

---

# Failure Policy

Provider requests follow this order:

1. Primary Provider
2. Local Cache
3. Secondary Provider
4. Graceful Failure

Provider failures never block access to personal data.

---

# Duplicate Resolution

When multiple providers return equivalent Titles, the Provider Manager merges provider information into a single result before presenting it to the user.

Duplicate resolution never merges personal Library entries automatically.

---

# Manual Titles

If no supported provider can supply the requested Title:

- Search continues normally.
- Users may create a Manual Title.
- Manual Titles bypass Provider synchronization.

The Provider Manager never attempts to fabricate provider metadata.

---

# States

- Idle
- Searching
- Fetching Metadata
- Cached
- Provider Unavailable
- Offline

---

# Accessibility

Provider operations remain invisible to users.

The application should always remain responsive while provider requests execute in the background.

---

# Principles

- All provider communication flows through the Provider Manager.
- Provider routing remains transparent to the user.
- Personal data is never modified by provider operations.
- Capability determines provider selection.
- Manual Titles provide the fallback for unsupported content.

---

# Acceptance Criteria

The component is complete when:

- Every provider request uses the Provider Manager.
- Provider routing follows the capability matrix.
- Primary → Cache → Secondary → Graceful Failure is consistently applied.
- Duplicate provider results are merged before presentation.
- Manual Titles integrate seamlessly when no provider-backed Title exists.