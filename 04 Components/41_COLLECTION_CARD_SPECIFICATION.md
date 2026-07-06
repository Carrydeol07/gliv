# GLIV v2

# 41_COLLECTION_CARD_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Collection Card represents a single Collection within the Collections view.

It provides a concise summary of the Collection while allowing quick navigation to its contents.

---

# Displays

Each Collection Card displays:

- Cover Collage
- Collection Name
- Item Count
- Last Updated

---

# Cover Collage

The cover collage is automatically generated from Titles contained within the Collection.

Rules:

- Up to four posters are displayed.
- Empty Collections display a placeholder illustration.
- Poster order remains consistent unless the Collection changes.

---

# Collection Information

Displays:

- Collection Name
- Number of Titles
- Last Updated timestamp

The Collection Name should always remain the primary visual element.

---

# Actions

Available actions:

- Open Collection
- Rename Collection
- Edit Collection
- Delete Collection

Deletion always requires confirmation.

---

# Views

Collection Cards support:

- Grid View
- List View

The displayed information remains consistent across both layouts.

---

# States

- Normal
- Hover
- Focused
- Empty Collection
- Loading

---

# Accessibility

The entire card is keyboard accessible.

Users can:

- Open the Collection
- Navigate between Collections
- Access the context menu

without requiring a mouse.

---

# Principles

- Collections should be recognizable at a glance.
- The Collection Name takes priority over decorative artwork.
- Empty Collections should encourage adding Titles rather than appearing broken.
- Collection Cards should remain visually consistent throughout the application.

---

# Acceptance Criteria

The component is complete when:

- Collections are immediately identifiable.
- Empty Collections remain informative.
- Navigation requires no more than one interaction.
- The same component works consistently across every Collection view.