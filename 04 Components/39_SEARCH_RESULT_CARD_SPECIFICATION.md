# GLIV v2

# 39_SEARCH_RESULT_CARD_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Search Result Card presents Titles returned by Universal Search.

It provides enough information for users to identify a Title and decide whether to view it, add it to their Library, or create a Manual Title when no suitable provider-backed result exists.

---

# Displays

Each Search Result Card displays:

- Poster
- Primary Title
- Media Type
- Primary Contributor
- Current Publication Status
- Availability Summary
- Library State (Already in Library / Not in Library)

---

# Actions

Available actions:

- View Series
- Add to Library
- Add to Collection

If no suitable provider-backed result exists, users may instead choose:

- Create Manual Title

---

# Availability Summary

Displays compact provider information when available.

Examples:

- Officially Available
- Licensed
- Latest Official Release
- Latest Scanlation Release

Availability information is hidden for Manual Titles.

---

# Contributor

Displays the primary Contributor.

The displayed role may be:

- Author
- Artist

Selecting the Contributor opens the Contributor page.

Only the primary Contributor is displayed to preserve readability.

---

# Library State

The card clearly indicates whether the Title already exists in the user's Library.

Possible states:

- Already in Library
- Not in Library

---

# States

- Normal
- Hover
- Focused
- Loading
- Offline
- Already Added

---

# Accessibility

The entire card is keyboard accessible.

Users can:

- Open the Series
- Add to Library
- Navigate results

without requiring a mouse.

---

# Principles

- Search Results remain compact and easy to scan.
- Provider routing remains invisible to the user.
- Manual Title creation is offered only when no suitable provider-backed result exists.
- Search Results never modify personal data without user confirmation.

---

# Acceptance Criteria

The component is complete when:

- Users can identify a Title quickly.
- Search Results remain readable with incomplete provider metadata.
- Library state is immediately visible.
- Manual Title creation integrates naturally into the search workflow.
- The component behaves consistently across all Discover views.