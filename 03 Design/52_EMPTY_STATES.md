# GLIV v2

# 52_EMPTY_STATES.md

> Version: 2.0
> Status: Locked Design

## Purpose

Empty States explain why content is unavailable and guide users toward the next appropriate action.

An empty state should always be informative, reassuring, and actionable.

---

# Empty Library

Message:

> Your Library is empty.

Actions:

- Discover Titles
- Import Library
- Create Manual Title

---

# Empty Collection

Message:

> This Collection doesn't contain any Titles yet.

Actions:

- Browse Library
- Add Titles

---

# No Search Results

Message:

> No matching Titles were found.

Actions:

- Refine Search
- Create Manual Title

---

# Empty Updates

Message:

> You're completely up to date.

Actions:

- Open Library
- Discover Titles

---

# Manual Title Information

Displayed for Manual Titles.

Message:

> This Title is managed entirely by you.

Unavailable features:

- Provider synchronization
- Availability
- Effective Latest
- Live updates

Available features:

- Personal Progress
- Status
- Rating
- Favorite
- Notes
- Collections

---

# Provider Unavailable

Message:

> Provider information is temporarily unavailable.

Actions:

- Retry
- Continue Offline

Personal information remains fully available.

---

# Empty Contributor

Message:

> No additional Titles are available for this Contributor.

Actions:

- Return to Library
- Discover Titles

---

# Principles

- Every empty state explains why content is unavailable.
- Every empty state provides a clear next action.
- Empty states should never feel like errors.
- Personal data remains accessible even when provider information is unavailable.