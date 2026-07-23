############################################################
## 23_SERIES_CARD_SPECIFICATION.md
############################################################

# GLIV v2

# 23_SERIES_CARD_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Series Card is the single most frequently used component in GLIV.

It appears in:

- Library
- Collections
- Discover
- Search Results
- Related Connections
- Contributor pages

Because of this, the Series Card defines much of GLIV's visual identity.

---

# Design Goals

The card should answer, at a glance:

1. What is this Title?
2. Which Formats do I have?
3. Where am I in each Format?
4. Has anything changed recently?
5. Can I act on it immediately?

The card should never feel crowded.

---

# Anatomy

```text
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
│ ★ Favorite   ★ Rating  ● Update │
└──────────────────────────────┘
```

---

# Regions

1. Poster
2. Title
3. Contributor
4. Format Summary
5. Status Indicators
6. Update Indicator
7. Favorite Indicator
8. Rating Indicator

---

# Poster

Uses provider artwork.

Priority:

1. User override (future)
2. MangaUpdates
3. AniList
4. Comick
5. Placeholder

Poster ratio: **2:3**

Never crop faces where avoidable.

---

# Title Rules

- Prefer English title when available.
- Fall back to Romaji.
- Native title is shown on the Series Page only.
- Maximum two lines.
- Overflow uses ellipsis.

---

# Contributor

Displays the primary contributor.

The UI presents contributor roles such as:

- Author
- Artist

Each displayed contributor is clickable and opens the appropriate Contributor page.

Only the primary contributor is shown on the Series Card to preserve readability.

---

# Format Summary

Each owned Format receives a compact row.

Examples:

```text
Anime   Watching   8 / 12

Manga   Reading    214

Novel   Paused     516
```

Formats not owned are hidden.

---

# Indicators

Favorite

- Filled star
- Always visible

Rating

- Personal rating
- Displayed when available

Updates

- Blue dot = new content
- Yellow dot = announcement
- Red badge = manual attention (Import Review)

---

# Hover

On hover:

Reveal quick actions.

```text
Continue

Edit

Collections

More…
```

Hover animation:

- 180 ms
- Subtle elevation
- Slight poster brighten

---

# Context Menu

Right click:

- Open
- Edit Progress
- Edit Notes
- Edit Rating
- Toggle Favorite
- Add to Collection
- Remove from Collection
- Copy Title
- Open External Sources

---

# Keyboard

Enter → Open

Space → Quick Preview

Ctrl + E → Edit Progress

Delete → Confirm Removal

---

# States

- Normal
- Hover
- Focused
- Loading
- Offline
- Missing Poster
- Provider Syncing
- Import Review

---

# Empty Metadata

If provider data cannot be found:

- Preserve the personal record.
- Show placeholder artwork.
- Offer "Search Again."

Never hide the Title.

---

# Accessibility

The entire card is keyboard accessible.

Interactive elements remain reachable without a mouse.

Visual focus indicators are always visible.

---

# Performance

Library should comfortably display thousands of cards.

Requirements:

- Lazy image loading
- Virtualized scrolling
- Cached posters
- No provider requests during scrolling

---

# Future Extensions

Potential additions:

- Reading time estimate
- Personal bookmarks
- Inline notes preview
- Smart collection badges

These are optional and must not complicate the default card.

---

# Acceptance Criteria

The component is complete when:

- Every common action is available within two interactions.
- Cards remain readable with missing metadata.
- Performance remains smooth with large libraries.
- The same component works consistently across Library, Collections, Discover, and Search.

---

# Design Rationale

The Series Card intentionally prioritizes the user's personal library information over external metadata.

Artwork attracts attention, but the card's primary purpose is to answer:

> **"What is my relationship with this Title?"**

Everything else is secondary.

############################################################
## 24_SEARCH_SYSTEM_SPECIFICATION.md
############################################################

# GLIV v2

# 24_SEARCH_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component
> **Amendment (v2.1):** Universal Search ranking now prioritizes Provider Manager results over Personal Library matches. Discover exists to help the user find titles they don't yet have — surfacing already-owned titles first worked against that. Library matches are still returned and clearly marked, just ranked after provider results. This applies only to Universal Search (`scope: 'discover'`); Library's own in-app search (`26_LIBRARY_SPECIFICATION.md`) is local-only and unaffected.

---

# Purpose

Search is the primary entry point into GLIV.

Users should be able to:

- Find Titles already in their Library.
- Discover new Titles.
- Open existing Series.
- Add new Titles.
- Create Manual Titles when no suitable provider-backed Title exists.
- Explore Contributors and related Titles.

The Search System should answer most questions without requiring users to visit external websites.

---

# Design Principles

1. Fast enough to feel instant.
2. One search interface across every supported media type.
3. Provider results are prioritized in Discover; the Library tab is the path back to titles already tracked.
4. Rich results before navigation.
5. Provider routing remains invisible to the user.
6. Never hide useful information behind unnecessary clicks.

---

# Search Sources

Search order (Universal Search / Discover):
1. Provider Manager
2. Personal Library

Provider-backed results are prioritized because Discover exists to surface
titles the user doesn't yet have. Personal Library matches are still
returned, marked as already-owned, but ranked below provider results.

Provider Manager automatically routes requests to the appropriate provider based on media type.

---

# Search Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Search...                                                 │
├──────────────────────────────────────────────────────────────┤
│ Filters: All Anime Manga Manhwa Manhua Novel                 │
├──────────────────────────────────────────────────────────────┤
│ Poster │ Title                                               │
│        │ Formats                                              │
│        │ Contributor                                          │
│        │ Availability                                         │
│        │ Connections                                          │
│        │ Actions                                               │
├──────────────────────────────────────────────────────────────┤
│ ...                                                          │
└──────────────────────────────────────────────────────────────┘
```

---

# Search Result Contents

Each Search Result may display:

- Poster
- Primary Title
- Alternative Title Indicator
- Available Formats
- Publication Status
- Primary Contributor
- Availability Summary
- Latest Release Summary
- Connection Summary
- Library State
- Quick Actions

Search Results use the shared Search Result Card component.

---

# Quick Actions

Without opening the Series Page:

- View Series
- Add to Library
- Add to Collection

If the Title already exists:

- Open Series
- Update Progress

If no suitable provider-backed Title exists:

- Create Manual Title

---

# Search Ranking

Provider results are ordered by:
1. Exact Match
2. Alternative Titles
3. Native Titles
4. Contributor Match

Personal Library matches follow the same four-tier ordering internally,
but are appended after all provider results rather than appearing first.

---

# Search States

- Empty
- Searching
- Results
- No Results
- Offline
- Provider Unavailable

Offline mode continues to search the local Library.

If no suitable provider-backed Title exists, users may create a Manual Title.

---

# Provider Routing

The Search System communicates only with the Provider Manager.

The Provider Manager is responsible for:

- Provider selection
- Provider fallback
- Result aggregation
- Caching
- Duplicate resolution

The Search System never communicates directly with individual providers.

---

# Search Flow

```text
User Search
      │
      ▼
Local Library
      │
      ▼
Provider Manager
      │
      ▼
Merged Results
      │
      ▼
Search Result Cards
      │
      ▼
Series Page
      │
      └── No suitable provider-backed result
               │
               ▼
        Create Manual Title
```

---

# Performance

Goals:

- Local results <100 ms
- Cached provider results <300 ms
- Progressive provider loading
- Debounced typing
- Lazy image loading

---

# Edge Cases

- Duplicate Titles across providers
- Missing artwork
- Multiple Contributors
- Multiple Formats
- Different localized Titles
- Existing Library entries
- Provider unavailable

---

# Accessibility

The Search System is fully keyboard accessible.

Users can:

- Search
- Navigate Results
- Open Series
- Add Titles

without requiring a mouse.

---

# Principles

- Search never modifies personal data automatically.
- Provider routing remains transparent to the user.
- Provider results are prioritized in Discover; the Library tab is the path back to titles already tracked.
- Manual Titles are offered only when no suitable provider-backed Title exists.

---

# Acceptance Criteria

The component is complete when:

- Users can identify Titles quickly.
- Provider results rank above Library matches in Discover, while Library matches remain clearly flagged.
- Provider routing is invisible to the user.
- Manual Title creation integrates naturally into the search workflow.
- Search remains responsive across all supported media types.

############################################################
## 25_SERIES_PAGE_SPECIFICATION.md
############################################################

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

############################################################
## 26_LIBRARY_SPECIFICATION.md
############################################################

# GLIV v2

# 26_LIBRARY_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Library is the primary workspace of GLIV.

It provides fast access to every Title in the user's collection while preserving the user's personal organization and progress.

The Library prioritizes personal data over provider metadata.

---

# Philosophy

The Library is GLIV.

It is:

- Personal
- Fast
- Offline-first
- Content-focused

The Library should never feel like a recommendation feed or dashboard.

---

# Views

Supported views:

- Grid
- Shelf
- List

Users may switch views without affecting sorting or filtering.

---

# Sorting

Supported sorting:

- Original Order
- Alphabetical
- Recently Added
- Recently Updated
- Personal Rating

Original Order remains the default and is always preserved.

---

# Filtering

Users may filter by:

- Media Type
- Status
- Genre
- Contributor
- Collections
- Personal Tags
- Rating
- Favorites

Multiple filters may be combined.

---

# Search

Library Search operates entirely on the local database.

Results appear immediately without contacting external providers.

---

# Display

Library items use the shared Series Card component.

Each card displays personal information before provider metadata.

---

# Performance

Requirements:

- Virtualized scrolling
- Lazy poster loading
- Cached metadata
- No provider requests while browsing
- Smooth performance with large libraries

---

# Empty State

When the Library is empty, guide users to:

- Discover Titles
- Import Library
- Create a Manual Title

---

# Accessibility

The Library is fully keyboard accessible.

Users can:

- Navigate Titles
- Open Titles
- Edit Progress
- Access context menus

without requiring a mouse.

---

# Principles

- Personal organization is never modified automatically.
- Original Order is always preserved.
- Provider synchronization never blocks Library access.
- Personal data remains available offline.

---

# Acceptance Criteria

The component is complete when:

- Users can efficiently browse large libraries.
- Sorting and filtering remain responsive.
- Original Order is preserved.
- The same behavior is consistent across every Library view.

############################################################
## 27_COLLECTIONS_SPECIFICATION.md
############################################################

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

############################################################
## 28_DISCOVER_SPECIFICATION.md
############################################################

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

############################################################
## 29_UPDATES_SPECIFICATION.md
############################################################

# GLIV v2

# 29_UPDATES_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Updates view presents meaningful changes for Titles already in the user's Library.

It helps users stay informed about new content without overwhelming them with unrelated information.

---

# Feed Types

## Anime

- Episode Release
- New Season
- Trailer

## Manga / Manhwa / Manhua

- Chapter Release
- Official Release
- Hiatus
- Hiatus Ended

## Novel

- Chapter Release
- Volume Release
- Adaptation Announcement

---

# Feed Rules

Updates:

- Are sorted newest first.
- Are grouped by date.
- May be marked as Read or Unread.
- Never include unrelated news.

Only Titles already present in the user's Library generate updates.

---

# Display

Updates use the shared Update Card component.

Each Update Card displays:

- Poster
- Title
- Update Type
- Update Summary
- Timestamp

---

# Actions

Available actions:

- Open Series
- Mark as Read

When appropriate:

- Update Progress

Reading an update never modifies personal progress automatically.

---

# States

- Empty
- Loading
- Normal
- Offline
- Provider Unavailable

When provider information is unavailable, previously synchronized updates remain visible.

---

# Accessibility

The Updates view is fully keyboard accessible.

Users can:

- Navigate Updates
- Open Series
- Mark Updates as Read

without requiring a mouse.

---

# Principles

- Updates are relevant only to the user's Library.
- Personal data is never modified automatically.
- Provider failures never remove existing updates.
- The feed prioritizes clarity over volume.

---

# Acceptance Criteria

The component is complete when:

- Users can quickly identify new activity.
- Updates remain easy to scan.
- Read and unread states are clearly distinguishable.
- The feed behaves consistently across all supported media types.

############################################################
## 30_IMPORT_SYSTEM_SPECIFICATION.md
############################################################

# GLIV v2

# 30_IMPORT_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Import Engine brings external library data into GLIV while preserving personal information and preventing incorrect provider matches.

Every import follows the same validation and review pipeline regardless of its source.

---

# Supported Entry Points

Current:

- DOCX Import
- Backup Restore

Future:

- Search Import
- CSV Import
- TXT Import

All entry points use the same Import Engine after initial parsing.

---

# Import Pipeline

```text
Import Source
      │
      ▼
Parser
      │
      ▼
Normalizer
      │
      ▼
Provider Matching
      │
      ▼
Import Review
      │
      ▼
Database
```

---

# Parsing

The Import Engine recognizes:

- Original Order
- Progress
- Status
- Notes
- Collections
- Raw Source Text

Unknown data is preserved whenever possible.

---

# Provider Matching

Provider matching attempts to identify the imported Title using provider metadata.

Deterministic matches may proceed automatically.

All non-deterministic provider matches require Import Review.

The Import Engine never silently merges ambiguous Titles.

---

# Import Review

Import Review displays:

- Imported Title
- Suggested Provider Match
- Existing Library Match (if applicable)
- Match Confidence
- Suggested Action

Available actions:

- Merge with Existing Title
- Create New Title
- Create Manual Title
- Search Again
- Skip

---

# Manual Titles

If no suitable provider-backed match exists, users may create a Manual Title directly from Import Review.

Manual Titles preserve all imported personal information but do not receive provider synchronization.

---

# Conflict Resolution

When conflicts occur:

- Personal Progress always wins.
- Personal Status always wins.
- Personal Notes are preserved.
- Provider metadata may be refreshed later.

No personal information is discarded automatically.

---

# Import States

- Parsing
- Matching
- Import Review
- Importing
- Completed
- Cancelled
- Failed

---

# Accessibility

Import Review is fully keyboard accessible.

Users can:

- Review matches
- Search again
- Merge
- Create Manual Titles

without requiring a mouse.

---

# Principles

- The Import Engine never silently guesses.
- Personal information is always preserved.
- Provider matching never overwrites Layer 1 data.
- Ambiguous provider matches always require user confirmation.
- Every import remains reversible.

---

# Acceptance Criteria

The component is complete when:

- Multiple import sources use the same pipeline.
- Deterministic provider matches import correctly.
- Ambiguous matches always require Import Review.
- Manual Titles provide a valid fallback.
- Personal information is never lost.

############################################################
## 31_PROVIDER_MANAGER_SPECIFICATION.md
############################################################

# GLIV v2

# 31_PROVIDER_MANAGER_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Provider Manager is the single gateway between GLIV and every external metadata provider.

All provider communication passes through the Provider Manager.

No other component communicates directly with external providers.

---

# Responsibilities

The Provider Manager is responsible for:

- Search Routing
- Metadata Retrieval
- Publication Information
- Availability
- Connections
- Contributor Information
- Update Retrieval
- Provider Caching
- Rate Limiting
- Retry Logic
- Duplicate Resolution

---

# Provider Routing

Provider routing is capability-driven rather than provider-driven.

Current routing:

## Anime

Primary

- AniList

Secondary

- Jikan

---

## Manga / Manhwa / Manhua

Primary

- MangaUpdates

Secondary

- Comick

---

## Novels

Primary

- MangaUpdates

Secondary

- None

If no suitable provider-backed Title exists, the Provider Manager allows the workflow to continue through Manual Title creation.

---

# Search Flow

```text
Search Request
      │
      ▼
Provider Manager
      │
      ├──────────────► AniList
      │
      ├──────────────► MangaUpdates
      │
      ├──────────────► Comick
      │
      └──────────────► Jikan
               │
               ▼
      Aggregated Results
               │
               ▼
      Duplicate Resolution
               │
               ▼
      Search Results
```

---

# Caching

The Provider Manager maintains a local cache to improve responsiveness.

Cached information may include:

- Metadata
- Artwork
- Publication Information
- Availability
- Connections

Personal data is never cached by the Provider Manager.

---

# Failure Policy

Provider requests follow this order:

1. Primary Provider
2. Local Cache
3. Secondary Provider
4. Graceful Failure

Provider failures never block access to personal data.

---

# Duplicate Resolution

When multiple providers return equivalent Titles, the Provider Manager merges provider information into a single result before presenting it to the user.

Duplicate resolution never merges personal Library entries automatically.

---

# Manual Titles

If no supported provider can supply the requested Title:

- Search continues normally.
- Users may create a Manual Title.
- Manual Titles bypass Provider synchronization.

The Provider Manager never attempts to fabricate provider metadata.

---

# States

- Idle
- Searching
- Fetching Metadata
- Cached
- Provider Unavailable
- Offline

---

# Accessibility

Provider operations remain invisible to users.

The application should always remain responsive while provider requests execute in the background.

---

# Principles

- All provider communication flows through the Provider Manager.
- Provider routing remains transparent to the user.
- Personal data is never modified by provider operations.
- Capability determines provider selection.
- Manual Titles provide the fallback for unsupported content.

---

# Acceptance Criteria

The component is complete when:

- Every provider request uses the Provider Manager.
- Provider routing follows the capability matrix.
- Primary → Cache → Secondary → Graceful Failure is consistently applied.
- Duplicate provider results are merged before presentation.
- Manual Titles integrate seamlessly when no provider-backed Title exists.

############################################################
## 33_UI_DESIGN_SYSTEM_SPECIFICATION.md
############################################################

# GLIV v2

# 33_UI_DESIGN_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

This specification defines how shared UI components are implemented consistently throughout GLIV.

It complements the Design System by translating visual guidelines into reusable implementation components.

---

# Design Philosophy

GLIV should feel:

- Calm
- Personal
- Premium
- Content-first

Implementation should always prioritize consistency over visual novelty.

---

# Design Tokens

## Spacing

- 4 px
- 8 px
- 12 px
- 16 px
- 24 px
- 32 px

---

## Border Radius

- 12 px

---

## Standard Animation

- 180 ms

---

## Poster Ratio

- 2 : 3

---

# Shared Components

The UI is built from reusable shared components.

Core components include:

- Sidebar
- Search Bar
- Series Card
- Search Result Card
- Progress Widget
- Collection Card
- Update Card
- Availability Panel
- Connections Panel

All screens should reuse these components rather than creating custom implementations.

---

# Component States

Every shared component should support appropriate visual states.

Common states include:

- Normal
- Hover
- Focused
- Loading
- Empty
- Offline
- Error
- Syncing

Individual components may define additional states where required.

---

# Consistency

Implementation should ensure:

- Consistent spacing
- Consistent typography
- Consistent interaction patterns
- Consistent animations
- Consistent accessibility behavior

The same interaction should always behave the same way throughout the application.

---

# Accessibility

All shared components must support:

- Keyboard navigation
- Visible focus indicators
- Screen reader compatibility
- High contrast themes
- Reduced motion preferences

Accessibility is a core implementation requirement rather than an optional enhancement.

---

# Principles

- Reuse existing components whenever possible.
- Avoid duplicate implementations.
- Keep interactions predictable.
- Personal information always receives visual priority.
- Components remain consistent across every screen.

---

# Acceptance Criteria

The specification is complete when:

- Shared components behave consistently.
- Design tokens are applied uniformly.
- Accessibility requirements are met.
- New screens reuse existing components rather than introducing unnecessary variations.

############################################################
## 35_AUTHOR_PAGE_SPECIFICATION.md
############################################################

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

############################################################
## 36_ARTIST_PAGE_SPECIFICATION.md
############################################################

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

############################################################
## 37_SETTINGS_SPECIFICATION.md
############################################################

# GLIV v2

# 37_SETTINGS_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Settings page allows users to configure GLIV without exposing unnecessary complexity.

Frequently used settings should be easy to find, while advanced options remain available without overwhelming the interface.

---

# Categories

Settings are grouped into the following categories:

- Appearance
- Library
- Providers
- Updates
- Import & Export
- Backups
- Advanced

---

# Appearance

Examples:

- Theme
- Font Size (Future)
- Reduced Motion

---

# Library

Examples:

- Default Library View
- Default Sort
- Default Filters

---

# Providers

Examples:

- Provider Preferences
- Cache Limits
- Metadata Refresh

Provider selection remains automatic where defined by the Provider Manager.

---

# Updates

Examples:

- Update Frequency
- Background Synchronization
- Notification Preferences (Future)

---

# Import & Export

Examples:

- Import Library
- Export Library
- Restore Backup

Import operations use the shared Import Engine.

---

# Backups

Examples:

- Automatic Backup Schedule
- Backup Location
- Manual Backup
- Restore Backup

---

# Advanced

Examples:

- Logging
- Diagnostics
- Database Maintenance

Advanced settings should remain collapsed by default.

---

# Search

Settings include an integrated search feature.

Users should be able to quickly locate settings by name.

---

# States

- Normal
- Searching
- Loading
- Saving

---

# Accessibility

The Settings page is fully keyboard accessible.

Users can:

- Navigate categories
- Modify settings
- Save changes

without requiring a mouse.

---

# Principles

- Defaults should work without configuration.
- Advanced options should not distract typical users.
- Provider routing remains automatic.
- Configuration changes should never place personal data at risk.

---

# Acceptance Criteria

The component is complete when:

- Settings remain easy to discover.
- Categories remain logically organized.
- Search quickly locates settings.
- Default configuration provides a complete out-of-the-box experience.

############################################################
## 38_SIDEBAR_SPECIFICATION.md
############################################################

# GLIV v2

# 38_SIDEBAR_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Sidebar provides persistent primary navigation throughout GLIV.

It remains visible across the application and allows users to quickly move between the application's primary sections.

---

# Navigation

The Sidebar contains the following primary destinations:

- Library
- Collections
- Discover
- Updates
- Settings

These are the only permanent navigation destinations.

---

# Layout

The Sidebar displays:

- Application Logo
- Primary Navigation
- Active Section Indicator
- Collapse / Expand Control

The active section should always remain visually identifiable.

---

# Behavior

The Sidebar:

- Remains visible throughout the application.
- Supports collapsed and expanded modes.
- Preserves its width between sessions.
- Does not change based on the current page.

Navigation should remain predictable.

---

# Navigation Rules

The Sidebar contains only primary application navigation.

It never contains:

- Individual Titles
- Contributors
- Collections
- Search Results
- Temporary navigation items

Secondary navigation is handled within the current page.

---

# States

- Expanded
- Collapsed
- Hover
- Focused

---

# Accessibility

The Sidebar is fully keyboard accessible.

Users can:

- Navigate between sections
- Activate navigation items
- Collapse or expand the Sidebar

without requiring a mouse.

---

# Principles

- Navigation should always remain consistent.
- Primary navigation should never be hidden.
- The Sidebar should not become a dashboard.
- Every destination should represent a major application area.

---

# Acceptance Criteria

The component is complete when:

- Navigation remains consistent throughout the application.
- The active section is always visible.
- The Sidebar behaves consistently in both collapsed and expanded modes.
- Users can navigate the application entirely from the keyboard.

############################################################
## 39_SEARCH_RESULT_CARD_SPECIFICATION.md
############################################################

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

############################################################
## 40_UPDATE_CARD_SPECIFICATION.md
############################################################

# GLIV v2

# 40_UPDATE_CARD_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Update Card represents a single update for a Title already in the user's Library.

It provides a concise summary of what changed and allows users to quickly open the affected Series.

---

# Supported Update Types

Anime

- Episode Release
- New Season
- Trailer

Manga / Manhwa / Manhua

- Chapter Release
- Official Release
- Hiatus
- Hiatus Ended

Novel

- Chapter Release
- Volume Release
- Adaptation Announcement

---

# Displays

Each Update Card displays:

- Poster
- Title
- Update Type
- Update Summary
- Timestamp

---

# Actions

Available actions:

- Open Series
- Mark as Read

When appropriate:

- Update Progress

---

# Grouping

Update Cards are:

- Grouped by Date
- Sorted Newest First

Examples:

- Today
- Yesterday
- This Week
- Earlier

---

# States

- Unread
- Read
- Hover
- Focused
- Loading

---

# Accessibility

The entire card is keyboard accessible.

Users can:

- Open the Series
- Mark the update as Read
- Update Progress (when available)

without requiring a mouse.

---

# Principles

- Only display updates for Titles already in the user's Library.
- Updates should be easy to scan.
- Multiple updates for the same Title remain separate events.
- Reading an update never modifies personal progress automatically.

---

# Acceptance Criteria

The component is complete when:

- Updates are immediately understandable.
- Users can reach the affected Series in one interaction.
- Read and unread states are clearly distinguishable.
- The component behaves consistently throughout the Updates view.

############################################################
## 41_COLLECTION_CARD_SPECIFICATION.md
############################################################

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

############################################################
## 42_PROGRESS_WIDGET_SPECIFICATION.md
############################################################

# GLIV v2

# 42_PROGRESS_WIDGET_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Progress Widget displays and manages personal progress for a single Format.

It provides a consistent interface for viewing progress, updating progress, and managing Progress Overrides for provider-backed Formats.

---

# Supported Formats

- Anime (Episode)
- Manga (Chapter)
- Manhwa (Chapter)
- Manhua (Chapter)
- Novel (Chapter or Volume, according to the Format's canonical progress unit)
- Manual Formats

Each Format maintains its own independent Progress Widget.

---

# Layout

Provider-backed Formats display:

```text
Progress

214 / 221

Latest Available

221

✏ Override
```

Manual Titles display:

```text
Progress

214
```

Manual Titles do not display provider-derived information.

---

# Progress

Displays the user's personal progress.

Actions:

- Increment Progress
- Edit Progress

Progress always represents the user's own tracking data.

---

# Effective Latest

Provider-backed Formats display the current Effective Latest value.

Effective Latest is calculated by the business rules and represents the highest available progress after applying any active Progress Override.

The widget displays the calculated value but does not calculate it.

---

# Progress Override

Progress Override is available only for provider-backed Formats.

Selecting **Override** opens the Progress Override dialog.

Users may:

- Create an Override
- Edit an existing Override
- Remove an Override

Removing an Override immediately restores the provider-calculated Effective Latest.

When the provider catches up to the Override value, the Override is automatically removed.

---

# Manual Titles

Manual Titles do not support:

- Effective Latest
- Progress Override
- Provider synchronization

Manual Titles use only manually entered progress values.

---

# States

- Normal
- Editing Progress
- Editing Progress Override
- Provider Syncing
- Offline
- Manual Title

---

# Actions

Users may:

- Increment Progress
- Edit Progress
- Edit Progress Override (provider-backed Formats only)

---

# Accessibility

The widget is fully keyboard accessible.

Users can:

- Edit Progress
- Edit Progress Override
- Navigate fields

without requiring a mouse.

---

# Principles

- Personal Progress is never modified automatically.
- Provider data never overwrites personal progress.
- Progress Override only affects Effective Latest.
- Manual Titles remain completely manual.
- The widget displays calculated values but does not implement business logic.

---

# Acceptance Criteria

The component is complete when:

- Progress can be updated independently for every Format.
- Provider-backed Formats display Effective Latest correctly.
- Progress Override behaves consistently with the Business Rules.
- Manual Titles never expose provider-only functionality.
- The widget behaves consistently across all Series Pages.

############################################################
## 47_BACKUP_SYSTEM_SPECIFICATION.md
############################################################

# GLIV v2

# 47_BACKUP_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Backup System protects the user's personal library and application data against accidental loss, corruption, or migration failures.

Backups should be reliable, versioned, and simple to restore.

---

# Backup Types

GLIV supports:

- Automatic Daily Backups
- Automatic Weekly Backups
- Manual Backups
- Pre-Restore Backups
- Pre-Migration Backups

Every backup is fully restorable.

---

# Backup Contents

Each backup includes:

- SQLite Database
- Personal Library
- Collections
- Personal Notes
- Settings
- Edit History
- Progress Overrides

Provider caches are not required for successful restoration.

---

# Backup Process

Every backup should:

1. Validate the database.
2. Create the backup.
3. Verify backup integrity.
4. Record backup metadata.

Failed backups never replace existing backups.

---

# Restore Process

Before restoring:

- Display Backup Date
- Display Backup Version
- Display Items to Restore

Before restoration begins, GLIV automatically creates a new safety backup of the current database.

---

# States

- Creating Backup
- Verifying Backup
- Completed
- Failed
- Restoring

---

# Accessibility

The Backup interface is fully keyboard accessible.

Users can:

- Create Backups
- Browse Backups
- Restore Backups

without requiring a mouse.

---

# Principles

- Personal data always takes priority.
- Every restore operation is reversible.
- Backup integrity is verified before completion.
- Failed backups never overwrite valid backups.
- Restoring a backup never permanently destroys the current database without first creating a safety backup.

---

# Acceptance Criteria

The component is complete when:

- Backups can be created automatically and manually.
- Every backup can be restored successfully.
- Backup integrity is verified.
- Restore operations automatically create a safety backup.
- Personal information is preserved throughout the process.

############################################################
## 48_EDIT_HISTORY_SPECIFICATION.md
############################################################

# GLIV v2

# 48_EDIT_HISTORY_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

Edit History records significant changes made to personal library data.

It provides an audit trail for user actions while remaining readable and easy to understand.

Provider synchronization events are not part of Edit History unless they require user intervention.

---

# Tracked Events

Edit History records:

- Progress Changes
- Status Changes
- Rating Changes
- Favorite Changes
- Collection Changes
- Personal Note Changes
- Progress Override Created
- Progress Override Modified
- Progress Override Removed
- Manual Title Created
- Manual Title Updated
- Format Added (Import)
- Manual Format Added

---

# Event Information

Each history entry records:

- Timestamp
- Action
- Previous Value
- New Value
- Format (when applicable)

Entries should clearly describe what changed.
When a provider-backed Format is added to an existing Title through the Import workflow, the event is recorded as an Import event.

When a Manual Format is added to an existing Title, the event is recorded as a Manual Title event for that specific Format.

---

# Display

History is presented in chronological order.

Newest entries appear first.

Each entry should be concise while providing enough information to understand the change.

---

# Progress Override History

Progress Override events record:

- Override Created
- Override Modified
- Override Removed

Automatic removal after provider synchronization is also recorded so users can understand why the override disappeared.

---

# Excluded Events

The following are not recorded:

- Background metadata refreshes
- Provider cache updates
- Artwork changes
- Automatic provider synchronization
- Temporary UI state changes

The history should focus on meaningful personal actions.

---

# States

- Empty
- Loading
- Normal

---

# Accessibility

The Edit History view is fully keyboard accessible.

Users can:

- Navigate entries
- Read change details

without requiring a mouse.

---

# Principles

- Edit History records meaningful personal changes.
- Provider synchronization does not create unnecessary history entries.
- Entries remain chronological and easy to read.
- History supports understanding rather than debugging.

---

# Acceptance Criteria

The component is complete when:

- Personal changes are consistently recorded.
- Progress Override events are fully tracked.
- Automatic provider synchronization does not clutter the history.
- Users can easily understand what changed and when.

