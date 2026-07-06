# GLIV v2

# 35_AUTHOR_PAGE_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Author Page presents information about a Contributor whose role includes Author.

It allows users to explore the Contributor's biography, Titles in their Library, and other published works.

---

# Sections

The Author Page contains:

- Contributor Information
- Biography
- Titles in Your Library
- Other Works
- External Links

---

# Contributor Information

Displays:

- Name
- Role (Author)
- Portrait (when available)

A Contributor may have multiple roles, but this page is presented in the context of the Author role.

---

# Titles in Your Library

Titles already owned by the user appear first.

Titles use the shared Series Card component.

Library state is always immediately visible.

---

# Other Works

Displays additional provider-backed Titles associated with the Contributor.

Titles not already in the Library may be opened or added through the standard Search workflow.

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
- Open External Links

without requiring a mouse.

---

# Principles

- Library Titles always receive visual priority.
- Contributor pages never modify personal data.
- Provider information remains clearly separated from personal information.

---

# Acceptance Criteria

The component is complete when:

- Library Titles appear before external works.
- Contributor information remains easy to understand.
- Navigation between Contributors and Series feels seamless.