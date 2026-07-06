
> **Status:** Superseded (Historical)
>
> This document is retained for historical reference only.
>
> The authoritative database schema is defined in **32_DATABASE_SPECIFICATION.md**.
>
> All future schema changes must be made only to **32_DATABASE_SPECIFICATION.md**.
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
