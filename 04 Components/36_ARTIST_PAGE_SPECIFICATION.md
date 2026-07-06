# GLIV v2

# 36_ARTIST_PAGE_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Artist Page presents information about a Contributor whose role includes Artist.

It allows users to explore the Contributor's portfolio, Titles in their Library, and other illustrated works.

---

# Sections

The Artist Page contains:

- Contributor Information
- Biography
- Titles in Your Library
- Other Works
- Collaborations
- External Links

---

# Contributor Information

Displays:

- Name
- Role (Artist)
- Portrait (when available)

A Contributor may have multiple roles, but this page is presented in the context of the Artist role.

---

# Titles in Your Library

Titles already owned by the user appear first.

Titles use the shared Series Card component.

Library state is always immediately visible.

---

# Other Works

Displays additional provider-backed Titles illustrated by the Contributor.

Titles not already in the Library may be opened or added through the standard Search workflow.

---

# Collaborations

Displays notable collaborations between the Artist and other Contributors when provider information is available.

Selecting another Contributor opens the appropriate Contributor page.

---

# External Links

When available:

- Official Website
- Publisher Page
- Provider Page

External links always open outside GLIV.

---

# States

- Loading
- Normal
- Empty Library
- Offline
- Provider Unavailable

---

# Accessibility

The page is fully keyboard accessible.

Users can:

- Navigate Titles
- Open Series
- Open Contributor pages
- Open External Links

without requiring a mouse.

---

# Principles

- Library Titles always receive visual priority.
- Contributor pages never modify personal data.
- Provider information remains clearly separated from personal information.
- Collaborations provide additional discovery without distracting from the primary Contributor.

---

# Acceptance Criteria

The component is complete when:

- Library Titles appear before external works.
- Contributor information remains easy to understand.
- Collaborations are clearly distinguished from the Contributor's own works.
- Navigation between Contributors and Series feels seamless.