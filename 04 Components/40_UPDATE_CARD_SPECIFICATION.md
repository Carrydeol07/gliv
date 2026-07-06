# GLIV v2

# 40_UPDATE_CARD_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Update Card represents a single update for a Title already in the user's Library.

It provides a concise summary of what changed and allows users to quickly open the affected Series.

---

# Supported Update Types

Anime

- Episode Release
- New Season
- Trailer

Manga / Manhwa / Manhua

- Chapter Release
- Official Release
- Hiatus
- Hiatus Ended

Novel

- Chapter Release
- Volume Release
- Adaptation Announcement

---

# Displays

Each Update Card displays:

- Poster
- Title
- Update Type
- Update Summary
- Timestamp

---

# Actions

Available actions:

- Open Series
- Mark as Read

When appropriate:

- Update Progress

---

# Grouping

Update Cards are:

- Grouped by Date
- Sorted Newest First

Examples:

- Today
- Yesterday
- This Week
- Earlier

---

# States

- Unread
- Read
- Hover
- Focused
- Loading

---

# Accessibility

The entire card is keyboard accessible.

Users can:

- Open the Series
- Mark the update as Read
- Update Progress (when available)

without requiring a mouse.

---

# Principles

- Only display updates for Titles already in the user's Library.
- Updates should be easy to scan.
- Multiple updates for the same Title remain separate events.
- Reading an update never modifies personal progress automatically.

---

# Acceptance Criteria

The component is complete when:

- Updates are immediately understandable.
- Users can reach the affected Series in one interaction.
- Read and unread states are clearly distinguishable.
- The component behaves consistently throughout the Updates view.