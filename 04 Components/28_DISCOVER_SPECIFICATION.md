# GLIV v2

# 28_DISCOVER_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

Discover helps users find new Titles and add them to their personal Library.

It combines Universal Search with curated discovery features while keeping the interface simple and content-focused.

---

# Sections

Discover contains:

- Universal Search
- Seasonal Anime
- Upcoming Releases

Universal Search remains the primary entry point.

---

# Universal Search

Universal Search searches across all supported media types through the Provider Manager.

Results may include:

- Anime
- Manga
- Manhwa
- Manhua
- Novels

Provider routing remains transparent to the user.

---

# Search Results

Each result displays:

- Poster
- Primary Title
- Available Formats
- Primary Contributor
- Availability Summary
- Connection Summary
- Library State

Search Results use the shared Search Result Card component.

---

# Quick Actions

Available actions:

- View Series
- Add to Library
- Add to Collection

If no suitable provider-backed Title is found, users may instead:

- Create Manual Title

---

# Manual Title Workflow

When Universal Search cannot find a suitable provider-backed Title, users may create a Manual Title.

Manual Titles:

- Are fully supported within the Library.
- Do not receive provider synchronization.
- Do not display provider-only features such as Availability or Live Updates.

---

# Seasonal Anime

Displays the current anime season by default.

Users may browse:

- Current Season
- Previous Seasons
- Upcoming Seasons

---

# Upcoming Releases

Displays upcoming provider-backed content, including:

- Anime
- Movies
- Adaptations

Only supported provider information is displayed.

---

# States

- Empty
- Searching
- Results
- No Results
- Offline
- Provider Unavailable

Offline mode continues to support Library search.

---

# Accessibility

Discover is fully keyboard accessible.

Users can:

- Search
- Navigate Results
- Open Series
- Add Titles

without requiring a mouse.

---

# Principles

- Universal Search remains the primary discovery method.
- Provider routing is never exposed to the user.
- Manual Titles are offered only when no suitable provider-backed Title exists.
- Discover never modifies personal data without user confirmation.

---

# Acceptance Criteria

The component is complete when:

- Users can discover Titles quickly.
- Search Results remain easy to compare.
- Manual Title creation integrates naturally into the search workflow.
- Seasonal and Upcoming sections remain secondary to Universal Search.