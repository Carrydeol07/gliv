## 01 Vision 
# GLIV v2

# 01_VISION.md

> Version: 2.0 Status: Locked Foundation

## What is GLIV?

GLIV is a personal desktop library for anime, manga, manhwa, manhua, and
novels. It preserves your own reading and watching journey while
enriching it with trusted metadata, publication information,
relationships, and release updates---without becoming a cluttered
database.

## The Problem

The current library exists in a Google Docs file. It preserves order but
lacks posters, metadata, search, relationships, updates, and easy
editing. The original order of the library is valuable and must never be
lost.

## The Mission

GLIV should be the application you open every day to:

-   Browse your library
-   Add new series
-   Discover upcoming releases
-   Stay informed about titles you already care about

Nothing more.

## Four Pillars

### Library

Your permanent collection containing only titles you've started.

### Collections

Personal organization with built-in Favorites and Plan to Watch / Read
plus unlimited custom collections.

### Discover

Universal Search, Seasonal Anime, and Upcoming Releases.

### Updates

Personalized updates only for titles already in your library.

## Three-Layer Data Model

### Layer 1 -- Personal

Permanent: - Progress - Notes - Ratings - Collections - Original Order -
Dates

### Layer 2 -- Metadata

Refreshable: - Posters - Synopsis - Genres - Authors - Artists -
Characters - Connections

### Layer 3 -- Live

Temporary: - New episodes - New chapters - Hiatus status - Seasonal
schedules - Announcements

## Guiding Principles

1.  Your data always comes first.
2.  Simplicity over feature count.
3.  Every feature must support Library, Collections, Discover, or
    Updates.
4.  Providers enrich your data but never replace it.
5.  GLIV should feel like a personal library, not a dashboard.
6.  Beauty is a feature.
7.  Daily usability is the measure of success.

## Success

GLIV succeeds if it quickly answers:

1.  What have I watched or read?
2.  What do I want to consume next?
3.  What changed in the series I care about?
4.  What new series should I discover?

## 02 Scope 
# GLIV v2

# 02_SCOPE.md

> Status: Locked

## Version 1 Goals

GLIV v1 focuses on solving one problem exceptionally well: maintaining a
beautiful, long-term personal media library.

## Included

### Library

-   Personal library
-   Original order
-   Grid, Shelf and List views
-   Fast editing
-   Multi-format titles (Anime, Manga, Manhwa, Manhua, Novel)

### Collections

Built-in: - Favorites - Plan to Watch / Read

Custom collections.

Filtering: - Media type - Genres - Personal tags

### Discover

-   Universal search
-   Seasonal anime
-   Upcoming releases

### Updates

Personal updates only: - New episodes - New chapters - Hiatus / return -
New season announcements - Trailer releases - Official English releases

### Series Pages

-   Progress
-   Notes
-   Connections
-   Author
-   Artist
-   Availability
-   Metadata

## Out of Scope (v1)

-   Social features
-   Cloud sync
-   Achievements
-   Reviews
-   Chat
-   Statistics dashboards
-   AI recommendations
-   Mobile app

## Success

If GLIV replaces the user's DOCX permanently, v1 is successful.

## 03 Principles 
# GLIV v2

# 03_PRINCIPLES.md

## Core Principles

1.  Personal data is sacred.
2.  One title exists exactly once.
3.  Metadata enriches, never overwrites.
4.  Beauty and clarity are features.
5.  Every screen answers one question.
6.  Fewer clicks are better.
7.  Search should be powerful enough that users rarely browse manually.
8.  Every new feature must improve:
    -   Library
    -   Collections
    -   Discover
    -   Updates

## Design Rules

-   No dashboard mentality.
-   No duplicate navigation.
-   No unnecessary pages.
-   Keep navigation shallow.
-   Prefer context over configuration.

## Non-Negotiables

-   Original order is preserved forever.
-   Offline-first.
-   Local-first.
-   Manual edits always win over provider data.


## 04 Domain
# GLIV v2

# 04_DOMAIN_MODEL.md

## Primary Domains

``` text
Library
Collections
Discover
Updates
Settings
```

## Core Entity

Title

A Title may contain:

-   Anime
-   Manga
-   Manhwa
-   Manhua
-   Novel

Each format has independent progress and status.

## Supporting Entities

Series Detail Author Artist Connections Genre Tag Scanlation Group

Publisher and Official Platforms are informational only.

## Connections

Relationship types:

-   Prequel
-   Sequel
-   Continuation
-   Spin-off
-   Side Story
-   Shared Universe
-   Adaptation
-   Original Source
-   Remake
-   Reboot
-   Crossover
-   Same Author
-   Same Artist

## Availability

Each Title may display:

Official Platform

Official Publisher

Scanlation Groups

Translation Status

Latest Release

License Status

This information is provider driven.
