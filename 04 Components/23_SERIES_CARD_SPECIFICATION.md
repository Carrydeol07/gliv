# GLIV v2

# 23_SERIES_CARD_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Series Card is the single most frequently used component in GLIV.

It appears in:

- Library
- Collections
- Discover
- Search Results
- Related Connections
- Contributor pages

Because of this, the Series Card defines much of GLIV's visual identity.

---

# Design Goals

The card should answer, at a glance:

1. What is this Title?
2. Which Formats do I have?
3. Where am I in each Format?
4. Has anything changed recently?
5. Can I act on it immediately?

The card should never feel crowded.

---

# Anatomy

```text
┌──────────────────────────────┐
│          Poster              │
├──────────────────────────────┤
│ Title                        │
│ Author                       │
│                              │
│ Anime  ✓ 12/12               │
│ Manga  ✓ 205                 │
│ Novel  ⏸ 516                 │
│                              │
│ ★ Favorite   ★ Rating  ● Update │
└──────────────────────────────┘
```

---

# Regions

1. Poster
2. Title
3. Contributor
4. Format Summary
5. Status Indicators
6. Update Indicator
7. Favorite Indicator
8. Rating Indicator

---

# Poster

Uses provider artwork.

Priority:

1. User override (future)
2. MangaUpdates
3. AniList
4. Comick
5. Placeholder

Poster ratio: **2:3**

Never crop faces where avoidable.

---

# Title Rules

- Prefer English title when available.
- Fall back to Romaji.
- Native title is shown on the Series Page only.
- Maximum two lines.
- Overflow uses ellipsis.

---

# Contributor

Displays the primary contributor.

The UI presents contributor roles such as:

- Author
- Artist

Each displayed contributor is clickable and opens the appropriate Contributor page.

Only the primary contributor is shown on the Series Card to preserve readability.

---

# Format Summary

Each owned Format receives a compact row.

Examples:

```text
Anime   Watching   8 / 12

Manga   Reading    214

Novel   Paused     516
```

Formats not owned are hidden.

---

# Indicators

Favorite

- Filled star
- Always visible

Rating

- Personal rating
- Displayed when available

Updates

- Blue dot = new content
- Yellow dot = announcement
- Red badge = manual attention (Import Review)

---

# Hover

On hover:

Reveal quick actions.

```text
Continue

Edit

Collections

More…
```

Hover animation:

- 180 ms
- Subtle elevation
- Slight poster brighten

---

# Context Menu

Right click:

- Open
- Edit Progress
- Edit Notes
- Edit Rating
- Toggle Favorite
- Add to Collection
- Remove from Collection
- Copy Title
- Open External Sources

---

# Keyboard

Enter → Open

Space → Quick Preview

Ctrl + E → Edit Progress

Delete → Confirm Removal

---

# States

- Normal
- Hover
- Focused
- Loading
- Offline
- Missing Poster
- Provider Syncing
- Import Review

---

# Empty Metadata

If provider data cannot be found:

- Preserve the personal record.
- Show placeholder artwork.
- Offer "Search Again."

Never hide the Title.

---

# Accessibility

The entire card is keyboard accessible.

Interactive elements remain reachable without a mouse.

Visual focus indicators are always visible.

---

# Performance

Library should comfortably display thousands of cards.

Requirements:

- Lazy image loading
- Virtualized scrolling
- Cached posters
- No provider requests during scrolling

---

# Future Extensions

Potential additions:

- Reading time estimate
- Personal bookmarks
- Inline notes preview
- Smart collection badges

These are optional and must not complicate the default card.

---

# Acceptance Criteria

The component is complete when:

- Every common action is available within two interactions.
- Cards remain readable with missing metadata.
- Performance remains smooth with large libraries.
- The same component works consistently across Library, Collections, Discover, and Search.

---

# Design Rationale

The Series Card intentionally prioritizes the user's personal library information over external metadata.

Artwork attracts attention, but the card's primary purpose is to answer:

> **"What is my relationship with this Title?"**

Everything else is secondary.