# GLIV v2

# 29_UPDATES_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Updates view presents meaningful changes for Titles already in the user's Library.

It helps users stay informed about new content without overwhelming them with unrelated information.

---

# Feed Types

## Anime

- Episode Release
- New Season
- Trailer

## Manga / Manhwa / Manhua

- Chapter Release
- Official Release
- Hiatus
- Hiatus Ended

## Novel

- Chapter Release
- Volume Release
- Adaptation Announcement

---

# Feed Rules

Updates:

- Are sorted newest first.
- Are grouped by date.
- May be marked as Read or Unread.
- Never include unrelated news.

Only Titles already present in the user's Library generate updates.

---

# Display

Updates use the shared Update Card component.

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

Reading an update never modifies personal progress automatically.

---

# States

- Empty
- Loading
- Normal
- Offline
- Provider Unavailable

When provider information is unavailable, previously synchronized updates remain visible.

---

# Accessibility

The Updates view is fully keyboard accessible.

Users can:

- Navigate Updates
- Open Series
- Mark Updates as Read

without requiring a mouse.

---

# Principles

- Updates are relevant only to the user's Library.
- Personal data is never modified automatically.
- Provider failures never remove existing updates.
- The feed prioritizes clarity over volume.

---

# Acceptance Criteria

The component is complete when:

- Users can quickly identify new activity.
- Updates remain easy to scan.
- Read and unread states are clearly distinguishable.
- The feed behaves consistently across all supported media types.