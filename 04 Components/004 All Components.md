# GLIV v2

# 23_SERIES_CARD_SPECIFICATION.md

> Status: Implementation Specification (Draft) Version: 1.0

------------------------------------------------------------------------

# Purpose

The Series Card is the single most frequently used component in GLIV.

It appears in:

-   Library
-   Collections
-   Discover
-   Search Results
-   Related Connections
-   Author pages
-   Artist pages

Because of this, the Series Card defines much of GLIV's visual identity.

------------------------------------------------------------------------

# Design Goals

The card should answer, at a glance:

1.  What is this title?
2.  Which formats do I have?
3.  Where am I in each format?
4.  Has anything changed recently?
5.  Can I act on it immediately?

The card should never feel crowded.

------------------------------------------------------------------------

# Anatomy

``` text
┌──────────────────────────────┐
│          Poster              │
├──────────────────────────────┤
│ Title                        │
│ Author                       │
│                              │
│ Anime  ✓ 12/12               │
│ Manga  ✓ 205                 │
│ Novel  ⏸ 516                 │
│                              │
│ ★ Favorite    ● Update       │
└──────────────────────────────┘
```

------------------------------------------------------------------------

# Regions

1.  Poster
2.  Title
3.  Creator
4.  Format Summary
5.  Status Indicators
6.  Update Indicator
7.  Favorite Indicator

------------------------------------------------------------------------

# Poster

Uses provider artwork.

Priority:

1.  User override (future)
2.  MangaUpdates / Novel provider artwork
3.  AniList
4.  Comick
5.  Placeholder

Poster ratio: **2:3**

Never crop faces where avoidable.

------------------------------------------------------------------------

# Title Rules

-   Prefer English title when available.
-   Fall back to Romaji.
-   Native title shown on Series page only.
-   Two lines maximum.
-   Overflow uses ellipsis.

------------------------------------------------------------------------

# Author

Displays the primary creator.

Clickable.

Opens Author Page.

Artist appears below only when different.

------------------------------------------------------------------------

# Format Summary

Each owned format receives a compact row.

Examples:

``` text
Anime   Watching   8 / 12

Manga   Reading    214

Novel   Paused     516
```

Formats not owned are hidden.

------------------------------------------------------------------------

# Indicators

Favorite

-   Filled star
-   Always visible

Updates

-   Blue dot = new content
-   Yellow dot = announcement
-   Red badge = manual attention (import conflict)

------------------------------------------------------------------------

# Hover

On hover:

Reveal quick actions.

``` text
Continue

Edit

Collections

More…
```

Hover animation:

-   180 ms
-   Subtle elevation
-   Slight poster brighten

------------------------------------------------------------------------

# Context Menu

Right click:

-   Open
-   Edit Progress
-   Edit Notes
-   Favorite
-   Add to Collection
-   Remove from Collection
-   Copy Title
-   Open External Sources

------------------------------------------------------------------------

# Keyboard

Enter → Open

Space → Quick Preview

Ctrl+E → Edit

Delete → Confirm removal

------------------------------------------------------------------------

# States

Normal

Hover

Focused

Loading

Offline

Missing Poster

Provider Syncing

Import Review

------------------------------------------------------------------------

# Empty Metadata

If provider data cannot be found:

-   Preserve personal record.
-   Show placeholder artwork.
-   Offer "Search Again".

Never hide the title.

------------------------------------------------------------------------

# Accessibility

-   Full keyboard navigation
-   Screen reader labels
-   High contrast support
-   Poster alt text
-   Visible focus outline

------------------------------------------------------------------------

# Performance

Library should comfortably display thousands of cards.

Requirements:

-   Lazy image loading
-   Virtualized scrolling
-   Cached posters
-   No provider requests during scroll

------------------------------------------------------------------------

# Future Extensions

Potential additions:

-   Reading time estimate
-   Personal bookmarks
-   Inline notes preview
-   Smart collections badges

These are optional and must not complicate the default card.

------------------------------------------------------------------------

# Acceptance Criteria

The component is complete when:

-   Every common action is available within two interactions.
-   Cards remain readable with missing metadata.
-   Performance remains smooth with large libraries.
-   The same component works consistently across Library, Collections,
    Discover and Search.

------------------------------------------------------------------------

# Design Rationale

The Series Card intentionally prioritizes the user's own progress over
external metadata.

Artwork attracts attention, but the card's purpose is to answer: **"What
is my relationship with this title?"**

Everything else is secondary.


# GLIV v2

# 24_SEARCH_SYSTEM_SPECIFICATION.md

> Status: Implementation Specification (Draft) Version: 1.0

------------------------------------------------------------------------

# Purpose

Search is the gateway to GLIV.

Every workflow begins with search:

-   Add a new title
-   Open an existing title
-   Discover something new
-   Verify availability
-   Explore creators
-   Explore connected works

The goal is to answer most questions from a single search result without
sending the user to multiple websites.

------------------------------------------------------------------------

# Design Principles

1.  Fast enough to feel instant.
2.  One search box across every media type.
3.  Personal library always takes priority.
4.  Rich information before navigation.
5.  Never hide useful information behind unnecessary clicks.

------------------------------------------------------------------------

# Search Sources

Priority order:

1.  Personal Library
2.  AniList (Anime)
3.  MangaUpdates (Manga / Manhwa / Manhua)
4.  NovelUpdates (Novels)
5.  Jikan (fallback)
6.  Comick (artwork / fallback)

------------------------------------------------------------------------

# Search Layout

``` text
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                                 │
├──────────────────────────────────────────────────────────────┤
│ Filters: All Anime Manga Manhwa Manhua Novel                 │
├──────────────────────────────────────────────────────────────┤
│ Poster │ Title                                               │
│        │ Formats: Anime • Novel • Webtoon                    │
│        │ Author: Sing-Shong                                  │
│        │ Availability: Webtoon • Tapas                       │
│        │ Connections: Shared Universe                        │
│        │ Actions: [Library] [Plan]                           │
├──────────────────────────────────────────────────────────────┤
│ ...                                                          │
└──────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# Search Result Contents

Every result may display:

-   Poster
-   Primary title
-   Alternate title indicator
-   Formats available
-   Current publication status
-   Author (clickable)
-   Artist (clickable)
-   Availability summary
-   Latest release
-   Connection summary
-   "Already in Library" indicator
-   Quick actions

------------------------------------------------------------------------

# Quick Actions

Without opening the Series page:

-   Add to Library
-   Add to Plan to Watch / Read
-   Open Details

If already in Library:

-   Open
-   Update Progress

------------------------------------------------------------------------

# Keyboard

-   Enter → Open first result
-   ↑ ↓ → Navigate results
-   Ctrl + Enter → Add to Library
-   Alt + Enter → Add to Plan
-   Esc → Clear search

------------------------------------------------------------------------

# Search Ranking

Order:

1.  Exact Library match
2.  Exact external match
3.  Alternate titles
4.  Native titles
5.  Author match
6.  Artist match

Library results should always appear before external results.

------------------------------------------------------------------------

# Search States

-   Empty
-   Searching
-   Results
-   No Results
-   Offline
-   Provider Error

Offline mode should still search the local database.

------------------------------------------------------------------------

# Provider Aggregation

``` mermaid
flowchart LR
Query-->Library
Query-->ProviderManager
ProviderManager-->AniList
ProviderManager-->MangaUpdates
ProviderManager-->NovelUpdates
ProviderManager-->Jikan
ProviderManager-->Comick
Library-->Merge
ProviderManager-->Merge
Merge-->Results
```

------------------------------------------------------------------------

# Performance

Goals:

-   Local results \<100 ms
-   Cached external results \<300 ms
-   Progressive loading for remote providers
-   Debounced typing
-   Image lazy loading

------------------------------------------------------------------------

# Edge Cases

-   Duplicate titles across providers
-   Missing artwork
-   Multiple authors
-   Multiple formats
-   Different localized titles
-   Same series already in Library

------------------------------------------------------------------------

# Acceptance Criteria

A user should be able to decide whether to start a title using the
search results alone in most cases.

The Series page should provide depth---not information that was
unnecessarily hidden.


# GLIV v2

# 25_SERIES_PAGE_SPECIFICATION.md

## Purpose

The Series Page is the definitive home for a single Title.

It combines: - Personal data - Metadata - Live updates

without overwhelming the user.

## Information Hierarchy

1.  Identity
2.  Personal Progress
3.  Availability
4.  Connections
5.  Notes
6.  Metadata

## Layout

``` text
Banner
────────────────────────────────────────

Poster   Title

Author • Artist

Status

Availability
Connections

Anime Card
Manga Card
Manhwa Card
Manhua Card
Novel Card

Notes

Collections
```

## Format Cards

Each format contains: - Status - Progress - Start / Finish dates -
Personal notes (future) - Quick edit

Collapsed if unused.

## Connections

Grouped by relationship: - Story Connections - Shared Universe - Creator
Connections

## Acceptance Criteria

A user should never need multiple pages to understand a title.

# GLIV v2

# 26_LIBRARY_SPECIFICATOIN.md

## Philosophy

Library is GLIV.

No dashboards. No widgets. No recommendations.

## Views

-   Grid
-   Shelf
-   List

## Sorting

-   Original Order
-   Alphabetical
-   Recently Added
-   Last Updated

## Filters

Media Status Genre Author Artist Collections Personal Tags

## Performance

-   Virtual scrolling
-   Lazy poster loading
-   Cached metadata

## Empty State

Guide the user toward Discover.


# GLIV v2

# 27_COLLECTIONS_SPECIFICATOINS.md

## Built-in

-   Favorites
-   Plan to Watch / Read

## Custom

Unlimited.

## Grouping

Connections may be grouped together.

Example:

Naruto ├─ Naruto ├─ Naruto Shippuden ├─ Boruto └─ Boruto: Two Blue
Vortex

## Filters

Media Genres Tags Status

Collections never duplicate Titles.

# GLIV v2

# 28_DISCOVER_SPECIFICATION.md

## Sections

-   Universal Search
-   Seasonal Anime
-   Upcoming Releases

## Search Results

Display: - Poster - Formats - Author - Artist - Availability -
Connections - Latest release

Quick Actions: - Add to Library - Add to Plan

## Seasonal

Current season only by default.

Future seasons browsable.

## Upcoming

Anime Movies Adaptations


# GLIV v2

# 29_UPDATES_SPECIFICATION.md

## Purpose

Only show updates for Titles already in Library.

## Feed Types

Anime - Episode - Season - Trailer

Manga - Chapter - Hiatus - Return - Official release

Novel - Chapter - Volume - Adaptation

## Feed Rules

Newest first.

Group by date.

Mark read/unread.

No unrelated news.

# GLIV v2

# 30_IMPORT_SYSTEM_SPECIFICATION.md

## Purpose

Import existing libraries without losing personal information.

## Supported Sources

-   DOCX
-   TXT (future)
-   JSON backup
-   CSV (future)

## Import Pipeline

``` mermaid
flowchart LR
A[Source]-->B[Parser]
B-->C[Normalizer]
C-->D[Provider Matching]
D-->E[Import Review]
E-->F[Database]
```

## Parsing

Recognize: - Original order - M / N markers - Progress - Status -
Notes - Raw text

## Confidence

90%+ : auto-match \<90% : Import Review

## Import Review

Shows: - Parsed title - Suggested match - Confidence - Merge
suggestions - Manual search - Skip

## Rules

-   Never silently infer.
-   Preserve raw import text.
-   Import is fully reversible.


# GLIV v2

# 31_PROVIDER_MANAGER_SPECIFICATION.md

## Purpose

Single gateway to every external provider.

## Providers

Anime - AniList - Jikan

Manga - MangaUpdates - Comick

Novel - NovelUpdates - AniList

## Responsibilities

-   Search
-   Metadata
-   Availability
-   Connections
-   Updates
-   Caching
-   Rate limiting
-   Retry logic

## Failure Policy

Use cache first. Fallback to secondary provider. Never block UI. Never
overwrite Layer 1.


# GLIV v2

# 33_UI_DESIGN_SYSTEM_SPECIFICATION.md

## Philosophy

Calm. Personal. Premium. Content-first.

## Design Tokens

Spacing: 4,8,12,16,24,32 Radius: 12 Animation: 180ms Poster: 2:3

## Components

-   Sidebar
-   Search Bar
-   Series Card
-   Availability Panel
-   Connections Panel
-   Update Card
-   Collection Card

## States

Loading Empty Offline Error Normal Syncing

Consistency across every screen is mandatory.


# 35_AUTHOR_PAGE_SPECIFICATION.md

## Purpose

Provide a creator-centric view focused on authors.

## Sections

-   Biography
-   In Your Library
-   Other Works
-   Connections
-   External Links

## Rules

-   Titles in your library appear first.
-   Other works are discoverable but visually secondary.
-   Clicking a work opens its Series Page.


# 36_ARTIST_PAGE_SPECIFICATION.md

## Purpose

Mirror the Author page for illustrators/artists.

## Sections

-   Biography
-   In Your Library
-   Other Works
-   Collaborations
-   External Links

Artists are treated as first-class entities.


# 37_SETTINGS_SPECIFICATION.md

## Categories

-   Appearance
-   Library
-   Providers
-   Updates
-   Import / Export
-   Backups
-   Advanced

## Design

Settings are grouped into simple categories with search. Advanced
options remain hidden unless expanded.


# 38_SIDEBAR_SPECIFICATION.md

## Navigation

-   Library
-   Collections
-   Discover
-   Updates
-   Settings

## Rules

-   Collapsible
-   Persistent width
-   Keyboard accessible
-   Never contains secondary entities.


# 39_SEARCH_RESULT_CARD_SPECIFICATION.md

Displays: - Poster - Title - Formats - Author - Availability - Latest
release - Library state

Actions: - Add to Library - Add to Plan - Open Details


# 40_UPDATE_CARD_SPECIFICATION.md

Represents a single update.

Supports: - Episode - Chapter - Trailer - Hiatus - Return - Adaptation

Grouped by date and sorted newest first.


# 41_COLLECTION_CARD_SPECIFICATION.md

Displays: - Cover collage - Title - Item count - Last updated

Collections support Grid and List views.


# 42_PROGRESS_WIDGET_SPECIFICATION.md

Shows progress independently for every format.

Supports: - Anime episodes - Manga chapters - Novel chapters - Manual
values

One-click increment where appropriate.


# 47_BACKUP_SYSTEM_SPECIFICATION.md

## Goals

Protect the user's library for decades.

## Backup Types

-   Automatic daily
-   Weekly
-   Manual
-   Before restore

## Contents

-   SQLite database
-   Settings
-   Collections
-   Notes

## Rules

Backups are versioned and restorable at any time.


# 48_EDIT_HISTORY_SPECIFICATION.md

## Purpose

Track important changes.

Records: - Progress edits - Status changes - Collection changes - Manual
metadata corrections

Each entry stores: - Timestamp - Old value - New value - Source of
change
