## 05 Architecture 
# GLIV v2

# 05_ARCHITECTURE.md

## High-Level Architecture

``` mermaid
flowchart TD
    UI[React UI]
    APP[Application Layer]
    PM[Provider Manager]
    DB[(SQLite)]
    AL[AniList]
    JK[Jikan]
    MU[MangaUpdates]
    CM[Comick]
    NU[NovelUpdates]

    UI-->APP
    APP-->DB
    APP-->PM
    PM-->AL
    PM-->JK
    PM-->MU
    PM-->CM
    PM-->NU
```

## Technology

-   Electron
-   React
-   TypeScript
-   SQLite
-   Local-first
-   Offline-first

## Data Layers

Layer 1: Personal (permanent)

Layer 2: Metadata (refreshable)

Layer 3: Live (temporary)

## Provider Priority

Anime: - AniList - Jikan

Manga / Manhwa / Manhua: - MangaUpdates - Comick

Novel: - NovelUpdates - AniList

## Principle

The UI never communicates directly with providers. Everything passes
through the Provider Manager.


## 06 Database 
# GLIV v2

# 06_DATABASE.md

## Core Model

``` mermaid
erDiagram

TITLE ||--o{ FORMAT : contains
TITLE ||--o{ NOTE : has
TITLE ||--o{ COLLECTION : belongs_to
TITLE ||--o{ CONNECTION : links
TITLE ||--|| METADATA : enriches

AUTHOR ||--o{ TITLE : writes
ARTIST ||--o{ TITLE : illustrates
```

## Main Entities

Title

Format

Metadata

Author

Artist

Connections

Collections

Notes

## Format

One title may contain:

-   Anime
-   Manga
-   Manhwa
-   Manhua
-   Novel

Each keeps:

-   Progress
-   Status
-   Dates
-   Format-specific information

Original Order belongs to the Title, never the format.

## Rule

There must never be duplicate Titles.


## 07 Providers 
# GLIV v2

# 07_PROVIDERS.md

## Philosophy

Providers enrich GLIV.

They never own the user's data.

## Anime

Primary: - AniList

Secondary: - Jikan

Used for:

-   Posters
-   Airing
-   Trailers
-   Characters
-   Studios

## Manga / Manhwa / Manhua

Primary: - MangaUpdates

Secondary: - Comick

MangaUpdates provides:

-   Latest chapter
-   Scanlation groups
-   Official publishers
-   Official reading platforms
-   License status
-   Hiatus
-   Related series
-   Alternative titles

Comick provides:

-   Posters
-   Covers
-   Backup artwork

## Novels

Primary: - NovelUpdates

Secondary: - AniList

Provides:

-   Latest translated chapter
-   Translation status
-   Adaptations
-   Related works

## Availability Panel

Every searchable title should expose:

-   Official platform
-   Official publisher
-   Scanlation groups
-   Translation status
-   Latest release
-   Connections

## Sync

``` mermaid
flowchart LR
Providers-->ProviderManager
ProviderManager-->Cache
Cache-->Library
```

## 17 Decisions 
# GLIV v2

# 17_DECISIONS.md

## Purpose

Record every major architectural decision and its rationale.

## ADR-001 Desktop

Decision: Electron Alternative: Tauri Reason: long-term maintainability.

## ADR-002 Local First

SQLite, offline-first, no account required.

## ADR-003 Three Layers

Layer 1 Personal Layer 2 Metadata Layer 3 Live

## ADR-004 Library First

GLIV opens to Library.

## ADR-005 Navigation

Library • Collections • Discover • Updates • Settings

## ADR-006 Providers

Anime: AniList→Jikan Manga: MangaUpdates→Comick Novel:
NovelUpdates→AniList

## ADR-007 One Title

One Title may contain multiple formats.

## ADR-008 Connections

Unified model for Prequel, Sequel, Continuation, Shared Universe,
Adaptation, Same Author, Same Artist.


## 18 Database schema 
# GLIV v2

# 18_DATABASE_SCHEMA.md

``` mermaid
erDiagram
TITLE ||--o{ FORMAT : contains
TITLE ||--|| METADATA : enriches
TITLE ||--o{ CONNECTION : links
AUTHOR ||--o{ TITLE : creates
ARTIST ||--o{ TITLE : illustrates
```

## Tables

Title Format Metadata Author Artist Connections Collections Notes

Rules: - UUID keys - No duplicate Titles - Original Order belongs to
Title - Layer 1 never overwritten


## 19 Import System 
# GLIV v2

# 19_IMPORT_SYSTEM.md

``` mermaid
flowchart LR
DOCX-->Parser-->Matcher-->Review-->Database
```

Pipeline: - Parse original order - Parse M/N markers - Parse progress -
Match providers - Review low-confidence entries - Commit

Never silently infer data. Every import is reversible.



## 20 Provider Manager 
# GLIV v2

# 20_PROVIDER_MANAGER.md

Responsibilities: - Search - Metadata - Availability - Connections -
Updates - Cache

Routing: Anime: AniList→Jikan Manga: MangaUpdates→Comick Novel:
NovelUpdates→AniList

If primary fails: Cache → Secondary → Graceful failure.

UI never talks directly to providers.


## 21 Search Engine 
# GLIV v2

# 21_SEARCH_ENGINE.md

Search Sources: - Library - AniList - Jikan - MangaUpdates - Comick -
NovelUpdates

Result card includes: - Poster - Formats - Author - Artist -
Availability - Connections - Latest release - Add to Library - Add to
Plan

Ranking: Exact title → Alternative titles → Native title → Author →
Artist.


## 32 Database Specification 
# GLIV v2

# DATABASE.md

## Principles

-   UUID primary keys
-   Local SQLite
-   Soft deletes
-   Layer separation

## Core Tables

-   titles
-   formats
-   metadata
-   authors
-   artists
-   collections
-   collection_items
-   notes
-   connections
-   providers
-   sync_history
-   edit_history

## Rules

One Title exists exactly once. Multiple formats belong to one Title.
Provider IDs are stored separately from personal data.


## 45 Sync Engine Specification 
# SYNC_ENGINE.md

## Purpose

Synchronize metadata and live information while preserving personal
data.

## Sync Types

-   Startup sync
-   Manual refresh
-   Scheduled metadata refresh
-   Live update refresh

## Rules

-   Layer 1 is never modified.
-   Failed providers never interrupt the application.
-   Incremental sync preferred over full refresh.
-   Sync history is recorded.


## 46 Cache System Specification 
# CACHE_SYSTEM.md

## Purpose

Provide a fast, offline-first experience.

## Cached Items

-   Posters
-   Metadata
-   Search results
-   Provider responses

## Strategy

-   Memory cache
-   SQLite cache
-   Image cache

## Expiration

Metadata and live data use independent refresh intervals.


## 60 Provider Capability Matrix 
# PROVIDER_CAPABILITY_MATRIX.md

## Philosophy

GLIV is capability-driven, not provider-driven.

Every feature asks the best provider for a specific capability rather
than depending on one provider.

  ------------------------------------------------------------------------
  Capability          Primary        Secondary          Stored As
  ------------------- -------------- ------------------ ------------------
  Anime metadata      AniList        Jikan              Metadata

  Manga metadata      MangaUpdates   Comick             Metadata

  Novel metadata      NovelUpdates   AniList            Metadata

  Posters             AniList /      Comick             Media Cache
                      MangaUpdates                      

  Banner              AniList        None               Media Cache

  Alternative Titles  MangaUpdates / NovelUpdates       Metadata
                      AniList                           

  Authors             MangaUpdates / AniList            Metadata
                      NovelUpdates                      

  Artists             MangaUpdates   AniList            Metadata

  Genres              AniList /      \-                 Metadata
                      MangaUpdates                      

  Categories / Themes MangaUpdates   AniList Tags       Metadata

  Story Connections   MangaUpdates   AniList            Connections

  Shared Universe     MangaUpdates   GLIV cache         Connections

  Adaptations         AniList        MangaUpdates       Connections

  Serialization       MangaUpdates   NovelUpdates       Publication

  Official            MangaUpdates   NovelUpdates       Publication
  Translation                                           

  Official Platforms  MangaUpdates   NovelUpdates       Publication

  Scanlation Groups   MangaUpdates   \-                 Publication

  Latest Official     MangaUpdates / \-                 Live
  Release             NovelUpdates                      

  Latest Scanlation   MangaUpdates   Comick             Live
  Release                                               

  Effective Latest    GLIV           \-                 Computed

  Anime Airing        AniList        Jikan              Live

  Upcoming Anime      AniList        Jikan              Live

  Trailer             AniList        Jikan              Live

  Hiatus / Return     MangaUpdates   Comick             Live
  ------------------------------------------------------------------------

## Effective Latest

Effective Latest = max(Latest Official, Latest Scanlation)

Library progress always compares against Effective Latest.


## 61 Publication Model 
# PUBLICATION_MODEL.md

## Purpose

Collect only publication information useful to readers.

## Publication Section

-   Status
-   Serialized In
-   Official Translation
-   Official Platforms
-   Latest Official Chapter / Episode / Volume
-   Latest Scanlation Chapter
-   Effective Latest
-   Active Scanlation Groups

## Excluded

-   Original Publisher
-   English Publisher
-   Print Publisher

Reason: These rarely affect reading decisions.

## Progress

User Progress is permanent.

Effective Latest is refreshed automatically.

Example:

210 / 223

210 = User Progress 223 = Effective Latest


## 63 Scanlation Groups 
# SCANLATION_GROUPS.md

## Purpose

Scanlation Groups are first-class entities.

## Group Page

Displays:

-   Group name
-   Active titles
-   Completed titles
-   Dropped titles
-   Latest releases

Clicking a series opens its Series Page.

Group pages are informational and not editable.


## 64 Progress Model 

# PROGRESS_MODEL.md

## Personal Progress

Never overwritten.

## Live Progress

Automatically refreshed.

Example

Personal: 210

Official Latest: 220

Scanlation Latest: 223

Effective Latest: 223

Library displays:

210 / 223

## Remaining

Remaining = Effective Latest - Personal Progress

Used by: - Library - Updates - Series Page

