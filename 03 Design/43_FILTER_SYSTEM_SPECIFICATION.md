# GLIV v2

# 43_FILTER_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Design

## Purpose

The Filter System allows users to quickly narrow displayed Titles throughout GLIV.

Filtering should remain fast, consistent, and reusable across all application sections.

---

# Filter Categories

## Media

- Anime
- Manga
- Manhwa
- Manhua
- Novel

---

## Status

- Watching
- Reading
- Completed
- Paused
- Dropped
- Planning

---

## Personal

- Rating
- Favorites
- Collections
- Personal Tags

---

## Contributors

- Author
- Artist

---

## Metadata

- Genre
- Studio
- Publication Status

---

## Availability

- Officially Available
- Licensed
- Hiatus

Availability filters apply only to provider-backed Titles.

---

## Date

- Recently Added
- Recently Updated
- Release Date

---

# Excluded Filters

Content rating and maturity/age filtering are intentionally not implemented in v1. All results — personal Library and provider-backed — are shown without restriction.

This is a deliberate decision recorded in 21_SEARCH_ENGINE.md, not an omission. A future coding agent or contributor must not add a rating/maturity filter, toggle, or default-hidden content behavior without a new decision record.

---

# Filter Behavior

- Multiple filters may be combined.
- Filters update results immediately.
- Active filters remain visible.
- Users can clear all filters with a single action.

---

# Search Integration

Search and Filters work together.

Users may search first, filter first, or combine both.

---

# Principles

- Filtering never modifies data.
- Filter behavior remains consistent throughout the application.
- Personal filters operate on Layer 1 data.
- Provider-backed filters operate on provider-managed information.