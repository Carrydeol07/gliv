# GLIV v2

# 32_DATABASE_SPECIFICATION.md

> Version: 2.0
> Status: Authoritative Database Schema

## Purpose

This document defines the authoritative database schema for GLIV.

All future database changes must be made here.

---

## Core Tables

- titles
- formats
- publication_info
- official_platforms
- scanlation_groups
- metadata
- genres
- title_genres
- tags
- title_tags
- personal_tags
- title_personal_tags
- characters
- title_characters
- alternative_titles
- contributors
- format_contributors
- connections
- collections
- collection_items
- notes
- external_references
- providers
- sync_history
- edit_history
- cache_entries

---

## titles

Stores one logical story.

A Title may contain one or more Formats.

Layer:

- Personal
- Metadata

---

## formats

Each Format belongs to exactly one Title.

Supported Formats:

- Anime
- Manga
- Manhwa
- Manhua
- Novel

Each Format maintains independent:

- Progress
- Status
- Publication Information
- Availability
- Provider relationships

progress_unit

Enum

Values:

- Episode
- Chapter
- Volume

The canonical progress unit is assigned when the Format is created.

For provider-backed Formats, it is determined from provider metadata.

For Manual Titles, it is selected by the user.

Once assigned, the value is immutable and is never modified by provider synchronization.

---

## publication_info

One row per provider-backed Format.

Fields:
- format_id (FK → formats, unique — one-to-one)
- publication_status
- start_date
- end_date
- chapter_count
- episode_count
- volume_count
- latest_official_release
- latest_scanlation_release
- official_publisher
- license_status

Layer: Publication (Layer 3), refreshable, never overwrites personal data.

---

## official_platforms

Many rows per Format — a Format may be available on more than one official platform.

Fields:
- id
- format_id (FK → formats)
- platform_name

Layer: Publication.

---

## scanlation_groups

Many rows per Format.

Fields:
- id
- format_id (FK → formats)
- group_name
- latest_release
- release_date
- translation_status
- active_status

Layer: Live (Layer 3). Informational only, never affects personal progress.

---

## metadata

One row per Title. Refreshable provider metadata.

Fields:
- title_id (FK → titles, unique — one-to-one)
- synopsis

Genres, Tags, Characters, and Alternative Titles are normalized into their own
tables (below) rather than stored as columns here, so Discover/Library filters
can query them directly.

---

## genres / title_genres

genres: id, name
title_genres: title_id (FK), genre_id (FK) — many-to-many

---

## tags / title_tags

tags: id, name
title_tags: title_id (FK), tag_id (FK) — many-to-many

---

## personal_tags / title_personal_tags

User-created tags, entirely distinct from provider-sourced tags.

personal_tags:
id, name (UNIQUE)

title_personal_tags:
title_id (FK → titles)
personal_tag_id (FK → personal_tags)
UNIQUE(title_id, personal_tag_id)

Layer: Personal (Layer 1).
personal_tags are created, renamed, and deleted only through explicit user
action. Provider synchronization and the Import Engine never read from or
write to personal_tags or title_personal_tags.
A personal_tag may be attached to multiple Titles. Deleting a personal_tag
detaches it from every Title that used it; it does not delete the Titles
themselves.

---

## characters / title_characters

characters: id, name
title_characters: title_id (FK), character_id (FK) — many-to-many

---

## alternative_titles

id, title_id (FK), alt_title — one-to-many

---

## contributors

Stores people.

Examples:

- Author
- Artist

A single Contributor may perform multiple roles across different Formats.

---

## format_contributors

Associates Contributors with Formats.

Fields:

- format_id
- contributor_id
- role

Supported roles (v1):

- Author
- Artist

Unique constraint:

- contributor_id
- format_id
- role

---

## connections

Relationships between Titles.

Supported relationships:

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

Relationships such as Same Author and Same Artist are derived from Contributor relationships and are not stored.

---

## collections

User collections.

Includes built-in collections:

- Favorites
- Plan to Watch / Read

Supports unlimited custom collections.

---

## collection_items

Many-to-many relationship between Titles and Collections.

---

## notes

Fields:
- title_id (FK → titles)
- content

Personal Notes are attached to the Title, not the Format — matching
12_SEARCH_SERIES.md, where Personal Notes appear once per Series Page.

---

## ## external_references

Stores provider mappings for provider-backed Formats.

Fields:

- format_id
- provider_id
- provider_entity_id
- confidence
- verification_state
- last_verified

`provider_id` references the `providers` table. The mapping never stores a raw provider name inline.

`confidence` is the match confidence recorded when this reference was created or last re-matched by the Import Engine or Search. It is stored independently from `verification_state` and is never overwritten by a manual confirmation.

Verification states:

- AUTO
- PENDING
- USER_CONFIRMED
- USER_REJECTED

AUTO is used only for deterministic matches that bypass Import Review (see ADR-009). Every other provider-derived match is created as PENDING and requires Import Review to move to USER_CONFIRMED or USER_REJECTED.

USER_REJECTED mappings are never automatically retried and remain until manually removed by the user.

`last_verified` records the timestamp verification_state was last set, including the moment an AUTO mapping is created.

Provider URLs are generated by the Provider Manager and are not stored.
---

## providers

Configuration for supported providers.

Stores provider-level configuration such as:

- Provider name
- Priority
- Capabilities
- API configuration

---

## sync_history

Stores synchronization history.

Examples:

- Last sync
- Provider
- Result
- Duration

---

## edit_history

Stores user edit history.

Examples:

- Progress changes
- Progress Override changes
- Rating changes
- Collection changes
- Notes changes

---

## cache_entries

Stores persistent cache entries for the **Library tier** only — provider-backed Formats belonging to a Title currently in the user's Library. Discover/search results are cached in-memory only (see 46_CACHE_SYSTEM_SPECIFICATION.md) and never appear in this table.

Fields:

- key
- provider_id
- provider_entity_id
- capability
- payload
- cached_at
- expires_at
- orphaned_at

`key` is a unique identifier composed from `provider_id` + `capability` + `provider_entity_id`.

`payload` stores the cached provider-sourced value only. Layer 1 personal data is never stored here.

`expires_at` governs normal freshness. An entry past `expires_at` is treated as a miss and triggers a fresh provider fetch, regardless of `orphaned_at`.

`orphaned_at` is set when the owning Format is removed from the Library, and cleared if the Format is added back to the Library before 7 days have passed. Entries with `orphaned_at` older than 7 days are deleted automatically on application startup.

`orphaned_at` never affects freshness — it governs only whether the row still exists.

Manual Formats never have `cache_entries` rows, at either tier.

---

## Progress Override

Progress Override belongs to individual provider-backed Formats.

It exists independently from provider values.

Effective Latest is computed using:

- Latest Official Release
- Latest Scanlation Release
- Progress Override (if present)

Progress Override is automatically removed once provider data reaches or exceeds the overridden value.

Manual Titles do not support Progress Override.

---

## Manual Titles

Manual Titles have no External References.

They:

- do not synchronize with providers,
- do not calculate Effective Latest,
- do not expose provider availability,
- remain fully user-managed.

---

## Design Principles

- One Title may contain multiple Formats.
- Formats own provider relationships.
- Contributors belong to Formats through roles.
- Provider mappings remain separate from personal data.
- Personal data is never overwritten.
- External providers enrich the library but never own it.