# GLIV v2

# 38_SIDEBAR_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Sidebar provides persistent primary navigation throughout GLIV.

It remains visible across the application and allows users to quickly move between the application's primary sections.

---

# Navigation

The Sidebar contains the following primary destinations:

- Library
- Collections
- Discover
- Updates
- Settings

These are the only permanent navigation destinations.

---

# Layout

The Sidebar displays:

- Application Logo
- Primary Navigation
- Active Section Indicator
- Collapse / Expand Control

The active section should always remain visually identifiable.

---

# Behavior

The Sidebar:

- Remains visible throughout the application.
- Supports collapsed and expanded modes.
- Preserves its width between sessions.
- Does not change based on the current page.

Navigation should remain predictable.

---

# Navigation Rules

The Sidebar contains only primary application navigation.

It never contains:

- Individual Titles
- Contributors
- Collections
- Search Results
- Temporary navigation items

Secondary navigation is handled within the current page.

---

# States

- Expanded
- Collapsed
- Hover
- Focused

---

# Accessibility

The Sidebar is fully keyboard accessible.

Users can:

- Navigate between sections
- Activate navigation items
- Collapse or expand the Sidebar

without requiring a mouse.

---

# Principles

- Navigation should always remain consistent.
- Primary navigation should never be hidden.
- The Sidebar should not become a dashboard.
- Every destination should represent a major application area.

---

# Acceptance Criteria

The component is complete when:

- Navigation remains consistent throughout the application.
- The active section is always visible.
- The Sidebar behaves consistently in both collapsed and expanded modes.
- Users can navigate the application entirely from the keyboard.