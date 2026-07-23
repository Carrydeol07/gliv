# GLIV v2

# 24_SEARCH_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component
> **Amendment (v2.1):** Universal Search ranking now prioritizes Provider Manager results over Personal Library matches. Discover exists to help the user find titles they don't yet have — surfacing already-owned titles first worked against that. Library matches are still returned and clearly marked, just ranked after provider results. This applies only to Universal Search (`scope: 'discover'`); Library's own in-app search (`26_LIBRARY_SPECIFICATION.md`) is local-only and unaffected.

---

# Purpose

Search is the primary entry point into GLIV.

Users should be able to:

- Find Titles already in their Library.
- Discover new Titles.
- Open existing Series.
- Add new Titles.
- Create Manual Titles when no suitable provider-backed Title exists.
- Explore Contributors and related Titles.

The Search System should answer most questions without requiring users to visit external websites.

---

# Design Principles

1. Fast enough to feel instant.
2. One search interface across every supported media type.
3. Provider results are prioritized in Discover; the Library tab is the path back to titles already tracked.
4. Rich results before navigation.
5. Provider routing remains invisible to the user.
6. Never hide useful information behind unnecessary clicks.

---

# Search Sources

Search order (Universal Search / Discover):
1. Provider Manager
2. Personal Library

Provider-backed results are prioritized because Discover exists to surface
titles the user doesn't yet have. Personal Library matches are still
returned, marked as already-owned, but ranked below provider results.

Provider Manager automatically routes requests to the appropriate provider based on media type.

---

# Search Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                                 │
├──────────────────────────────────────────────────────────────┤
│ Filters: All Anime Manga Manhwa Manhua Novel                 │
├──────────────────────────────────────────────────────────────┤
│ Poster │ Title                                               │
│        │ Formats                                              │
│        │ Contributor                                          │
│        │ Availability                                         │
│        │ Connections                                          │
│        │ Actions                                               │
├──────────────────────────────────────────────────────────────┤
│ ...                                                          │
└──────────────────────────────────────────────────────────────┘
```

---

# Search Result Contents

Each Search Result may display:

- Poster
- Primary Title
- Alternative Title Indicator
- Available Formats
- Publication Status
- Primary Contributor
- Availability Summary
- Latest Release Summary
- Connection Summary
- Library State
- Quick Actions

Search Results use the shared Search Result Card component.

---

# Quick Actions

Without opening the Series Page:

- View Series
- Add to Library
- Add to Collection

If the Title already exists:

- Open Series
- Update Progress

If no suitable provider-backed Title exists:

- Create Manual Title

---

# Search Ranking

Provider results are ordered by:
1. Exact Match
2. Alternative Titles
3. Native Titles
4. Contributor Match

Personal Library matches follow the same four-tier ordering internally,
but are appended after all provider results rather than appearing first.

---

# Search States

- Empty
- Searching
- Results
- No Results
- Offline
- Provider Unavailable

Offline mode continues to search the local Library.

If no suitable provider-backed Title exists, users may create a Manual Title.

---

# Provider Routing

The Search System communicates only with the Provider Manager.

The Provider Manager is responsible for:

- Provider selection
- Provider fallback
- Result aggregation
- Caching
- Duplicate resolution

The Search System never communicates directly with individual providers.

---

# Search Flow

```text
User Search
      │
      ▼
Local Library
      │
      ▼
Provider Manager
      │
      ▼
Merged Results
      │
      ▼
Search Result Cards
      │
      ▼
Series Page
      │
      └── No suitable provider-backed result
               │
               ▼
        Create Manual Title
```

---

# Performance

Goals:

- Local results <100 ms
- Cached provider results <300 ms
- Progressive provider loading
- Debounced typing
- Lazy image loading

---

# Edge Cases

- Duplicate Titles across providers
- Missing artwork
- Multiple Contributors
- Multiple Formats
- Different localized Titles
- Existing Library entries
- Provider unavailable

---

# Accessibility

The Search System is fully keyboard accessible.

Users can:

- Search
- Navigate Results
- Open Series
- Add Titles

without requiring a mouse.

---

# Principles

- Search never modifies personal data automatically.
- Provider routing remains transparent to the user.
- Provider results are prioritized in Discover; the Library tab is the path back to titles already tracked.
- Manual Titles are offered only when no suitable provider-backed Title exists.

---

# Acceptance Criteria

The component is complete when:

- Users can identify Titles quickly.
- Provider results rank above Library matches in Discover, while Library matches remain clearly flagged.
- Provider routing is invisible to the user.
- Manual Title creation integrates naturally into the search workflow.
- Search remains responsive across all supported media types.