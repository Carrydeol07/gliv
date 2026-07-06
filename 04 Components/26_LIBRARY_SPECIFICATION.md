# GLIV v2

# 26_LIBRARY_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Library is the primary workspace of GLIV.

It provides fast access to every Title in the user's collection while preserving the user's personal organization and progress.

The Library prioritizes personal data over provider metadata.

---

# Philosophy

The Library is GLIV.

It is:

- Personal
- Fast
- Offline-first
- Content-focused

The Library should never feel like a recommendation feed or dashboard.

---

# Views

Supported views:

- Grid
- Shelf
- List

Users may switch views without affecting sorting or filtering.

---

# Sorting

Supported sorting:

- Original Order
- Alphabetical
- Recently Added
- Recently Updated
- Personal Rating

Original Order remains the default and is always preserved.

---

# Filtering

Users may filter by:

- Media Type
- Status
- Genre
- Contributor
- Collections
- Personal Tags
- Rating
- Favorites

Multiple filters may be combined.

---

# Search

Library Search operates entirely on the local database.

Results appear immediately without contacting external providers.

---

# Display

Library items use the shared Series Card component.

Each card displays personal information before provider metadata.

---

# Performance

Requirements:

- Virtualized scrolling
- Lazy poster loading
- Cached metadata
- No provider requests while browsing
- Smooth performance with large libraries

---

# Empty State

When the Library is empty, guide users to:

- Discover Titles
- Import Library
- Create a Manual Title

---

# Accessibility

The Library is fully keyboard accessible.

Users can:

- Navigate Titles
- Open Titles
- Edit Progress
- Access context menus

without requiring a mouse.

---

# Principles

- Personal organization is never modified automatically.
- Original Order is always preserved.
- Provider synchronization never blocks Library access.
- Personal data remains available offline.

---

# Acceptance Criteria

The component is complete when:

- Users can efficiently browse large libraries.
- Sorting and filtering remain responsive.
- Original Order is preserved.
- The same behavior is consistent across every Library view.