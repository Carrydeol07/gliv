# GLIV v2

# 04_DOMAIN_MODEL.md

> Version: 2.0
> Status: Locked Foundation

## Primary Domains

```text
Library
Collections
Discover
Updates
Settings
```

## Core Entity

### Title

### Format Constraints

A Title may contain at most one Format of each supported media type.

Examples:

✓ Anime
✓ Manga
✓ Manhwa
✓ Manhua
✓ Novel

Each supported media type may appear at most once within a Title.

A Title represents a single story or work.

A Title may contain one or more Formats:

- Anime
- Manga
- Manhwa
- Manhua
- Novel

Each Format maintains its own independent:

- Progress
- Status
- Publication information
- Contributors
- Provider relationships

## Supporting Entities

- Contributor
- Connection
- Genre
- Tag
- Scanlation Group

Publisher and Official Platforms are informational only.

## Contributors

Contributors are attached to individual Formats rather than the Title itself.

Supported roles in v1:

- Author
- Artist

Different Formats of the same Title may have different Contributors.

The Series Page aggregates Contributors across Formats for presentation while preserving Format-level relationships internally.

Contributors remain independently clickable throughout the application.

## Connections

Relationship types:

- Prequel
- Sequel
- Continuation
- Spin-off
- Side Story
- Shared Universe
- Adaptation
- Original Source
- Remake
- Reboot
- Crossover

Relationships such as **Same Author** and **Same Artist** are derived from Contributor relationships and are not stored as standalone Connection types.

## Availability

Each provider-backed Format may display:

- Official Platform
- Official Publisher
- Scanlation Groups
- Translation Status
- Latest Official Release
- Latest Scanlation Release
- License Status

Availability is provider-driven and presented as a Series Page capability.

## Progress

Each Format maintains independent progress.

Provider-backed Formats may calculate an Effective Latest value using provider information and an optional Progress Override.

Manual Titles maintain progress manually and do not support:

- Effective Latest
- Progress Override
- Live availability
- Provider synchronization

Detailed progress behavior is defined in the Progress Model and Business Rules.