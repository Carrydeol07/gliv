# GLIV v2

# 08_LIBRARY.md

## Purpose

The Library is GLIV's default screen and the center of the application.

It contains **only titles you have started**.

## Views

-   Grid (default)
-   Shelf
-   List

Sorting: - Original Order - Recently Added - Alphabetical - Last Updated

## Filters

Media: - Anime - Manga - Manhwa - Manhua - Novel

Status: - Reading - Watching - Completed - Paused - Dropped

Metadata: - Genre - Author - Artist

Personal: - Collections - Personal Tags

## Navigation

``` mermaid
flowchart LR
Library-->Search
Library-->Series
Series-->Edit
Series-->Library
```

## Rules

-   No planned titles appear here.
-   Original Order is immutable.
-   Fast editing should require at most two clicks.

# GLIV v2

# 09_COLLECTIONS.md

## Purpose

Collections organize your library without changing it.

## Built-in Collections

-   Favorites
-   Plan to Watch / Read

## Custom Collections

Unlimited.

Examples: - Murim - Romance - Movies - Comfort - Peak Fiction

## Collection Layout

Each collection supports:

-   Grid
-   Shelf
-   List

Filters: - Media Type - Genres - Personal Tags

## Grouping

Collections can group related titles.

Example:

Naruto - Naruto - Naruto Shippuden - Boruto - Boruto: Two Blue Vortex

Grouping is based on Connections data.


# GLIV v2

# 10_DISCOVER.md

## Purpose

Discover is for media not yet in your active library.

## Sections

### Universal Search

Searches across:

-   AniList
-   Jikan
-   MangaUpdates
-   Comick
-   NovelUpdates

### Seasonal Anime

Current Spring Summer Fall Winter

### Upcoming

Upcoming anime Upcoming adaptations Upcoming movies

## Search Result

Every result should display:

-   Poster
-   Formats
-   Status
-   Author
-   Artist
-   Availability
-   Connections
-   Add to Library
-   Add to Plan to Watch / Read

No additional page should be required to make a planning decision.


# GLIV v2

# 11_UPDATES.md

## Purpose

Updates answer one question:

What changed in the titles I already care about?

## Categories

Anime

-   New episode
-   New season
-   Trailer

Manga / Manhwa / Manhua

-   New chapter
-   Hiatus
-   Hiatus ended
-   Official release
-   Scanlation change

Novel

-   New translated chapter
-   Volume release
-   Adaptation

## Feed

``` mermaid
flowchart TD
Providers-->ProviderManager
ProviderManager-->PersonalFilter
PersonalFilter-->UpdatesFeed
```

Only library titles appear.


# GLIV v2

# 12_SEARCH_SERIES.md

## Search Philosophy

Search is one of GLIV's defining features.

Users should be able to decide whether to start a title without opening
multiple websites.

## Series Page

Header

-   Banner
-   Poster
-   Title
-   Author (clickable)
-   Artist (clickable)

Formats

-   Anime
-   Manga
-   Manhwa
-   Manhua
-   Novel

Each has independent progress.

## Availability

Shows:

-   Official platform
-   Official publisher
-   Scanlation groups
-   Translation status
-   Latest release

Publishers and platforms are informational only.

## Connections

Relationship types:

-   Prequel
-   Sequel
-   Continuation
-   Shared Universe
-   Adaptation
-   Original Source
-   Same Author
-   Same Artist

## Author Page

Sections:

-   In Your Library
-   Other Works
-   Biography

## Artist Page

Sections:

-   In Your Library
-   Other Works
-   Biography


# GLIV v2

# 13_COMPONENT_MODEL.md

## Philosophy

Every screen is assembled from reusable components.

## Core Components

-   Sidebar
-   Top Search
-   Series Card
-   Collection Card
-   Update Card
-   Discover Card
-   Availability Panel
-   Connections Panel
-   Author Card
-   Artist Card
-   Metadata Chips
-   Status Badge
-   Progress Widget

## Component Hierarchy

``` mermaid
flowchart TD
App-->Sidebar
App-->Page
Page-->Cards
Cards-->SeriesCard
SeriesCard-->AvailabilityPanel
SeriesCard-->ConnectionsPanel
SeriesCard-->MetadataChips
```

## Rules

-   Components own presentation.
-   Business logic belongs to services.
-   Components remain reusable across Library, Discover and Collections.

# GLIV v2

# 14_NAVIGATION.md

## Primary Navigation

``` mermaid
flowchart LR
Library-->Series
Collections-->Series
Discover-->Series
Updates-->Series
Series-->Author
Series-->Artist
Series-->Connections
```

## Navigation Rules

-   Library is the default landing page.
-   Every common action should take no more than two clicks.
-   Context should be preserved when returning from Series pages.
-   Secondary pages (Author, Artist, Connections) are never shown in the
    sidebar.


# GLIV v2

# 15_WIREFRAMES.md

## Library

``` text
┌────────────────────────────────────────────────────────────┐
│ Search                              Grid Shelf List        │
├────────────────────────────────────────────────────────────┤
│ Filters                                            Sort    │
├────────────────────────────────────────────────────────────┤
│ □□□□□   □□□□□   □□□□□   □□□□□   □□□□□                │
│ □□□□□   □□□□□   □□□□□   □□□□□   □□□□□                │
└────────────────────────────────────────────────────────────┘
```

## Series

``` text
Banner
────────────────────────────────────────────

Poster   Title

Author • Artist

Availability

Connections

Anime
Manga
Novel

Notes
```

## Discover

``` text
Search

Seasonal

Upcoming

Results
```

## Updates

``` text
Today

Yesterday

This Week
```


# GLIV v2

# 22_UI_DESIGN_SYSTEM.md

## Philosophy

The interface should feel calm, premium and personal.

## Visual Principles

-   Content first
-   Posters are the primary visual element
-   Soft elevation, minimal borders
-   Consistent spacing
-   Motion should communicate, never distract

## Typography

-   Large title
-   Medium section headings
-   Compact metadata
-   Highly readable body text

## Design Tokens

Spacing: 4 / 8 / 12 / 16 / 24 / 32 px Corner Radius: 12 px (cards), 20
px (dialogs) Animation: 150--200ms ease Poster Ratio: 2:3

## Color Philosophy

-   Neutral dark UI by default
-   Artwork provides most color
-   Accent color reserved for actions and status

## States

Loading • Empty • Error • Offline • Syncing




# 43_FILTER_SYSTEM_SPECIFICATION.md

Supports: - Media type - Status - Genre - Author - Artist -
Collections - Personal tags

Filters are composable and persist per page.

# 44_DIALOG_SYSTEM_SPECIFICATION.md

Common dialogs: - Confirm delete - Edit progress - Import review - Merge
titles - Backup restore

Dialogs follow a consistent layout and keyboard model.


# 50_KEYBOARD_SHORTCUTS.md

## Global

Ctrl+K : Search Ctrl+, : Settings Esc : Close dialog

## Library

Enter : Open Ctrl+E : Edit Delete : Remove

All shortcuts are customizable.


# 51_ANIMATION_GUIDELINES.md

Motion should communicate state changes.

Durations - Hover: 180ms - Dialog: 220ms - Page transition: 250ms

Avoid decorative animations.


# 52_EMPTY_STATES.md

Every empty state should explain: - Why it is empty - What the user can
do next

Examples: - Empty Library - Empty Collection - No Search Results - No
Updates

# 53_ERROR_HANDLING.md

Errors should be actionable.

Categories: - Provider unavailable - Network offline - Import failure -
Database error

Always preserve personal data.

# 54_ACCESSIBILITY.md

Requirements - Full keyboard support - Screen reader labels - High
contrast - Focus indicators - Scalable typography

Accessibility is a first-class requirement.


# 62_DISCOVER_FILTERS.md

## Filters

Media - Anime - Manga - Manhwa - Manhua - Novel

Status - Ongoing - Completed - Hiatus - Upcoming

Genres

Categories / Themes

Availability - Official English - Scanlated - Licensed - Anime
Adaptation

Release - This Season - Next Season - Upcoming - Recently Released

Creators - Author - Artist

Sort - Popularity - Rating - Newest - Latest Release - Alphabetical

Filters are combinable and persist while browsing.

