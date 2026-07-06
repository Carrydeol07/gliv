# GLIV v2

# 25_SERIES_PAGE_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Series Page is the definitive home for a single Title.

It combines:

- Personal Data
- Metadata
- Live Information

without overwhelming the user.

The Series Page prioritizes personal information while presenting provider data as supporting information.

---

# Information Hierarchy

1. Identity
2. Personal Progress
3. Personal Rating & Favorite
4. Availability
5. Connections
6. Notes
7. Metadata

---

# Layout

```text
Banner
────────────────────────────────────────

Poster

Title

Primary Contributor(s)

Favorite
Rating

Current Status

Availability

Connections

Anime Format Card

Manga Format Card

Manhwa Format Card

Manhua Format Card

Novel Format Card

Personal Notes

Collections
```

---

# Header

The Header displays:

- Poster
- Banner
- Primary Title
- Alternative Titles
- Primary Contributor(s)
- Favorite
- Personal Rating
- Current Overall Status

The Header should immediately identify the Title while exposing the user's personal relationship with it.

---

# Format Cards

Each owned Format receives an independent Format Card.

Each Format Card contains:

- Personal Status
- Personal Progress
- Effective Latest
- Progress Override
- Start Date
- Finish Date
- Personal Notes (Future)
- Quick Edit

Unused Formats remain collapsed.

---

# Progress Override

Provider-backed Formats display:

```text
Latest Available

221

✏ Override
```

Selecting **Override** opens the Progress Override dialog.

Progress Overrides:

- Affect only Effective Latest.
- Never modify personal progress.
- Automatically clear when the provider catches up.

Manual Titles do not support Progress Overrides.

---

# Manual Titles

Manual Titles remain fully supported.

Unavailable provider features:

- Availability
- Live Updates
- Effective Latest
- Progress Override

Available personal features:

- Progress
- Status
- Rating
- Favorite
- Notes
- Collections

The interface should clearly distinguish Manual Titles from provider-backed Titles without reducing functionality.

---

# Availability

Availability is presented as a dedicated section of the Series Page.

It may include:

- Official Platforms
- Licensed Status
- Latest Official Release
- Latest Scanlation Release

Availability is informational only.

It is not a navigation destination.

---

# Connections

Connections are grouped by relationship.

Examples:

- Story Connections
- Shared Universe
- Adaptations
- Spin-offs
- Prequels
- Sequels

Contributor relationships are accessed through Contributor pages rather than appearing as connection types.

---

# Metadata

Metadata may include:

- Genres
- Themes
- Publication Status
- Release Dates
- Studios
- Publishers
- Contributors

Metadata is refreshable and never overwrites personal information.

---

# Accessibility

The entire Series Page is keyboard accessible.

Users can:

- Navigate between sections
- Edit Progress
- Edit Progress Override
- Open Contributors
- Open External Links

without requiring a mouse.

---

# Principles

- Personal information always takes priority over provider metadata.
- Every owned Format behaves independently.
- Provider data never overwrites personal data.
- Availability remains a Series Page capability.
- Manual Titles remain first-class citizens throughout the interface.

---

# Acceptance Criteria

The component is complete when:

- Every owned Format can be managed independently.
- Progress Override behaves consistently with the Progress Model.
- Manual Titles clearly communicate unavailable provider features.
- Rating and Favorite are immediately accessible.
- Availability remains integrated into the Series Page.
- Users never need multiple pages to understand a Title.