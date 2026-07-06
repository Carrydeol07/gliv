# GLIV v2

# 27_COLLECTIONS_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

Collections allow users to organize their Library beyond standard statuses.

Collections are entirely personal and never modified by provider synchronization.

---

# Built-in Collections

GLIV includes the following built-in Collections:

- Favorites
- Plan to Watch / Read

Built-in Collections cannot be deleted.

---

# Custom Collections

Users may create an unlimited number of custom Collections.

Each Collection supports:

- Custom Name
- Optional Description (Future)

Collections may be renamed or deleted at any time.

---

# Organization

Collections group Titles without duplicating them.

A Title may belong to multiple Collections simultaneously.

Removing a Title from a Collection never removes it from the Library.

---

# Grouping

Related Titles may be grouped naturally within a Collection.

Example:

```text
Naruto
├── Naruto
├── Naruto Shippuden
├── Boruto
└── Boruto: Two Blue Vortex
```

Grouping is purely visual and does not create Connections between Titles.

---

# Filtering

Users may filter Collections by:

- Media Type
- Genre
- Status
- Personal Tags

Filtering never changes Collection membership.

---

# Display

Collections use the shared Collection Card component.

Opening a Collection displays Titles using the shared Series Card component.

---

# States

- Normal
- Empty
- Loading
- Editing

---

# Accessibility

Collections are fully keyboard accessible.

Users can:

- Open Collections
- Rename Collections
- Delete Collections
- Navigate between Collections

without requiring a mouse.

---

# Principles

- Collections are personal organization tools.
- Collections never duplicate Library entries.
- Provider synchronization never modifies Collection membership.
- Built-in Collections remain consistent throughout the application.

---

# Acceptance Criteria

The component is complete when:

- Users can create and manage unlimited Collections.
- Titles can belong to multiple Collections.
- Collection membership remains entirely user-controlled.
- Collection behavior remains consistent across all views.