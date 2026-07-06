# GLIV v2

# 60_PROVIDER_CAPABILITY_MATRIX.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

This matrix defines which provider supplies each capability.

GLIV is capability-driven rather than provider-driven.

The Provider Manager selects the most appropriate provider for each capability.

---

| Capability | Primary | Secondary | Stored As |
|------------|----------|------------|-----------|
| Title | AniList / MangaUpdates | — | Metadata |
| Alternative Titles | MangaUpdates | AniList | Metadata |
| Synopsis | AniList | MangaUpdates | Metadata |
| Poster / Cover | AniList / MangaUpdates | Comick | Metadata |
| Contributors | MangaUpdates | AniList | Metadata |
| Genres | AniList | MangaUpdates | Metadata |
| Characters | AniList | — | Metadata |
| Studios | AniList | — | Metadata |
| Publication Information | MangaUpdates | AniList | Publication |
| Story Connections | MangaUpdates | AniList | Connections |
| Official Publisher | MangaUpdates | — | Publication |
| Official Platforms | MangaUpdates | — | Availability |
| License Status | MangaUpdates | — | Availability |
| Latest Official Release | MangaUpdates | — | Live |
| Latest Scanlation Release | MangaUpdates | — | Live |
| Scanlation Groups | MangaUpdates | — | Live |
| Hiatus Status | MangaUpdates | AniList | Live |
| Airing Information | AniList | Jikan | Live |
| Trailers | AniList | Jikan | Live |

---

## Provider Summary

### AniList

Primary for:

- Anime metadata
- Genres
- Characters
- Studios
- Airing information
- Trailers

Secondary for:

- Publication information
- Story connections
- Alternative titles
- Contributors

---

### MangaUpdates

Primary for:

- Manga
- Manhwa
- Manhua
- Novels
- Publication information
- Story connections
- Contributors
- Official releases
- Scanlation information
- Availability

---

### Comick

Secondary provider for:

- Posters
- Covers

---

### Jikan

Secondary provider for:

- Anime information
- Airing information
- Trailers

---

## Manual Titles

Manual Titles have no provider capabilities.

Information is entered and maintained entirely by the user.

They do not receive:

- Provider synchronization
- Availability
- Live updates
- Effective Latest

---

## Principles

- Capabilities determine provider selection.
- Provider routing is transparent to the user.
- Personal data never depends on provider data.
- Only stable official APIs are used as primary providers.