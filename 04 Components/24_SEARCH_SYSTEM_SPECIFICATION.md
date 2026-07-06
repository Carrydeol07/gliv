# GLIV v2

# 24_SEARCH_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

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
3. Personal Library always takes priority.
4. Rich results before navigation.
5. Provider routing remains invisible to the user.
6. Never hide useful information behind unnecessary clicks.

---

# Search Sources

Search order:

1. Personal Library
2. Provider Manager

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

Results are ordered by:

1. Exact Library Match
2. Exact Provider Match
3. Alternative Titles
4. Native Titles
5. Contributor Match

Library results always appear before provider results.

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
- Personal Library always receives priority.
- Manual Titles are offered only when no suitable provider-backed Title exists.

---

# Acceptance Criteria

The component is complete when:

- Users can identify Titles quickly.
- Library results always appear first.
- Provider routing is invisible to the user.
- Manual Title creation integrates naturally into the search workflow.
- Search remains responsive across all supported media types.