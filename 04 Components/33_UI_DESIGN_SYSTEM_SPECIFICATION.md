# GLIV v2

# 33_UI_DESIGN_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

This specification defines how shared UI components are implemented consistently throughout GLIV.

It complements the Design System by translating visual guidelines into reusable implementation components.

---

# Design Philosophy

GLIV should feel:

- Calm
- Personal
- Premium
- Content-first

Implementation should always prioritize consistency over visual novelty.

---

# Design Tokens

## Spacing

- 4 px
- 8 px
- 12 px
- 16 px
- 24 px
- 32 px

---

## Border Radius

- 12 px

---

## Standard Animation

- 180 ms

---

## Poster Ratio

- 2 : 3

---

# Shared Components

The UI is built from reusable shared components.

Core components include:

- Sidebar
- Search Bar
- Series Card
- Search Result Card
- Progress Widget
- Collection Card
- Update Card
- Availability Panel
- Connections Panel

All screens should reuse these components rather than creating custom implementations.

---

# Component States

Every shared component should support appropriate visual states.

Common states include:

- Normal
- Hover
- Focused
- Loading
- Empty
- Offline
- Error
- Syncing

Individual components may define additional states where required.

---

# Consistency

Implementation should ensure:

- Consistent spacing
- Consistent typography
- Consistent interaction patterns
- Consistent animations
- Consistent accessibility behavior

The same interaction should always behave the same way throughout the application.

---

# Accessibility

All shared components must support:

- Keyboard navigation
- Visible focus indicators
- Screen reader compatibility
- High contrast themes
- Reduced motion preferences

Accessibility is a core implementation requirement rather than an optional enhancement.

---

# Principles

- Reuse existing components whenever possible.
- Avoid duplicate implementations.
- Keep interactions predictable.
- Personal information always receives visual priority.
- Components remain consistent across every screen.

---

# Acceptance Criteria

The specification is complete when:

- Shared components behave consistently.
- Design tokens are applied uniformly.
- Accessibility requirements are met.
- New screens reuse existing components rather than introducing unnecessary variations.