# GLIV — Project Summary & Roadmap

> Living project summary. Reflects the stabilized documentation set (Foundation, Architecture, Business Rules, Design, Components, Engineering). This replaces the earlier pre-stabilization summary.

---

# 1. Vision

GLIV is a **personal desktop application** for managing anime, manga, manhwa, manhua, and novels.

The goal is **not** to replace sites like AniList or MangaUpdates.

The goal is to become **your personal library**, enriched with information from those services.

GLIV should feel like premium desktop software, not a crowded database website.

---

# 2. Core Goals

Four pillars, all locked in Foundation:

## A. Library

Your permanent collection — only Titles you've started.

- Original order preserved forever
- Progress
- Status
- Notes
- Rating
- Favorites
- Collections

Personal information (Layer 1) is never overwritten by providers.

## B. Collections

Personal organization, independent of progress or status.

- Built-in: Favorites, Plan to Watch/Read
- Unlimited custom collections
- A Title may belong to multiple collections
- Removing a Title from a collection never removes it from the Library

## C. Discover

Find new things to watch or read.

- Universal Search
- Seasonal Anime
- Upcoming Anime
- Upcoming Adaptations
- Powerful filtering
- Manual Title creation when no provider match exists

## D. Updates

Know what changed — for Titles already in your Library only.

- New episode / chapter
- Hiatus / hiatus ended
- New season announced
- Trailer released
- Official English release

> **Availability is a Series Page capability, not a navigation pillar.** It answers "where can I read/watch this" from inside a Title's own page — it does not get its own place in the sidebar.

---

# 3. Design Philosophy

GLIV should be:

- Calm, personal, fast
- Desktop-first, offline-first
- Minimal

Avoid: busy dashboards, social features, community comments, clutter.

---

# 4. Main Navigation

Library · Collections · Discover · Updates · Settings

No Timeline. No Availability tab. Library is the application's home (ADR-004, ADR-005).

Secondary pages (Contributor, Connections) are reached only from a Series Page and never appear in the primary sidebar.

---

# 5. Data Layers

**Layer 1 — Personal.** Progress, Progress Override, Notes, Rating, Favorites, Collections, Original Order. Never overwritten.

**Layer 2 — Metadata.** Titles, Formats, Contributors, Genres, Connections, Publication Information. Refreshable.

**Layer 3 — Live Information.** Latest chapters/episodes, season announcements, trailers, hiatus/returns. Automatically refreshed.

---

# 6. Providers (Locked — ADR-006)

|Media|Primary|Secondary|
|---|---|---|
|Anime|AniList|Jikan|
|Manga / Manhwa / Manhua|MangaUpdates|Comick|
|Novels|MangaUpdates|_None_|

NovelUpdates has been **removed** as a provider (no stable official API). Novels unsupported by MangaUpdates, and any title with no suitable provider match, become **Manual Titles**.

GLIV is capability-driven, not provider-driven — the Provider Manager picks the right provider per capability (see `60_PROVIDER_CAPABILITY_MATRIX.md`).

---

# 7. Core Domain Model

- A **Title** represents one story; it may contain one Format per supported media type (Anime, Manga, Manhwa, Manhua, Novel) — never two of the same type.
- Each **Format** independently owns: Progress, Status, Publication data, Contributors, Provider relationship (`external_reference`).
- **Contributors** (Author/Artist) attach to a Format, not a Title — different Formats of the same Title can have different contributors. The Series Page aggregates them for display. Author and Artist remain independently clickable.
- **Connections** (Prequel, Sequel, Shared Universe, Adaptation, etc.) relate Titles. "Same Author"/"Same Artist" are _not_ stored as Connections — they're derived from the Contributor model.
- **external_references**: `format_id, provider_id, provider_entity_id, confidence, verification_state, last_verified`. Verification states: `AUTO / PENDING / USER_CONFIRMED / USER_REJECTED`. Only `AUTO` (deterministic matches) skip Import Review.

---

# 8. Business Rules (Locked)

- **BR-001 Effective Latest** — `MAX(Latest Official Release, Latest Scanlation Release, Progress Override)`, using only defined inputs. Undefined until a provider value exists (never a false zero). Never negative. Only provider-driven _increases_ generate Update events.
- **BR-002 Title Identity & Import Resolution** — Provider Identity Matching and Library Duplicate Matching are independent operations. Only deterministic matches (existing `external_reference` with matching `provider_id` + `provider_entity_id`, state AUTO or USER_CONFIRMED) skip Import Review. Everything else requires it. Personal data always wins on merge.
- **BR-003 Progress Override** — Per-Format, provider-backed only, Layer 1 personal data. User creates/edits/removes it; only provider sync can auto-remove it (once provider data catches up). Never lowers Effective Latest. Invalidated automatically if the Format's `external_reference` changes.
- **BR-004 Manual Titles** — A Format without an `external_reference` is a Manual Format. Full Layer 1 support (progress, status, rating, favorite, notes, collections). No sync, no Effective Latest, no Progress Override, no Availability, no Update events. Becomes provider-backed only through explicit Import Review approval — never automatically.

---

# 9. Important Features

- Original order preserved
- Universal search
- Clickable authors, artists
- Story connections / shared universes
- Publication information
- Effective Latest (BR-001)
- Progress Override (BR-003)
- Import Review for ambiguous titles (BR-002)
- Manual Titles as first-class fallback (BR-004)
- Automatic metadata refresh
- Automatic live updates

---

# 10. Documentation Status

**Complete and locked:**

✓ Foundation (Vision, Scope, Principles, Domain Model) ✓ Architecture (System Architecture, Database, Providers, Decisions/ADRs, Import System, Provider Manager, Search Engine, Database Spec, Sync/Cache, Provider Capability Matrix, Publication Model, Scanlation Groups, Progress Model) ✓ Business Rules (BR-001 through BR-004) ✓ Design (Library, Collections, Discover, Updates, Series Page, Component Model, Navigation, Wireframes, UI Design System, Filters, Dialogs, Shortcuts, Animation, Empty States, Error Handling, Accessibility, Discover Filters) ✓ Components (Series Card, Search System, Series Page, Library, Collections, Discover, Updates, Import System, Provider Manager, UI System, Author/Artist Pages, Settings, Sidebar, Search Result Card, Update Card, Collection Card, Progress Widget, Backup System, Edit History) ✓ Engineering (Roadmap, Folder Structure, Logging & Diagnostics, State Management, Testing Strategy, Release Process, Configuration, Packaging)

Documentation is fully stabilized. Implementation now follows the priority order: ADRs → Business Rules → Architecture → Foundation → Components → Design → Engineering.

---

# 11. Locked Technology Stack

Electron + React + TypeScript + SQLite. Local-first, offline-first.

> Note: `AI_IMPLEMENTATION_PROMPT.md` contains a leftover "Flutter Standards" section from an earlier draft. It contradicts every architecture document and is treated as void.

---

# 12. Development Strategy

Module-by-module. Each module:

1. Implementation Plan (documentation review, dependencies, risk check)
2. Implementation Brief handed to the coding agent
3. Implementation
4. Architecture Review
5. Fixes
6. Commit
7. Next module

No large one-shot generation. No jumping ahead before the current module is reviewed and committed.

---

# 13. Repository Structure

```
GLIV/
  docs/
  design/
  modules/
  prompts/
  reviews/
  reference/
  App/
```

Documentation remains the project's source of truth. Internal `App/` structure (Electron/React source) is defined separately in `34_FOLDER_STRUCTURE.md`.

---

# 14. Roadmap (Engineering, `16_IMPLEMENTATION_ROADMAP.md`)

- **Phase 1** — Electron, React, TypeScript, SQLite, theme, navigation
- **Phase 2** — Database, Provider Manager, Import Engine, local cache
- **Phase 3** — Library, Collections, Search, Series Page
- **Phase 4** — Discover, Updates, Series Page Features (Availability, Connections)
- **Phase 5** — Polish, performance, backups, diagnostics, packaging

---

# 15. Module Implementation Log

Tracks which modules are done and any scoping decisions made along the way, so later planning doesn't lose track of what was deferred and why.

- **Module 01 — Foundation Scaffold** — Merged. Electron/React/TypeScript shell, navigation, theme. Database included as a connection/migration scaffold only — no schema yet. Full schema deferred to Module 02.
- **Module 02 — Database** — Merged. Full schema per `32_DATABASE_SPECIFICATION.md`.
- **Module 03 — Provider Manager** — Merged. Cache included as a pass-through stub only (no real invalidation/expiry logic). Real Cache System deferred to its own later module.
- **Module 04 — Import Engine** — Merged. Shared matching/review/commit engine (BR-002) plus two entry points — Search Import and Add Another Format. **DOCX Import and Backup Restore are deferred to their own future modules**, each requiring a dedicated parser (legacy Google Doc structure; GLIV backup file format) before they can feed this engine. The original Google Doc library cannot be brought into GLIV until the DOCX Import module ships. Reversibility implemented via a `better-sqlite3` transaction plus an undo record in `edit_history`. All 7 tests pass. Implementation surfaced a real gap in BR-003 (the "provider reference changed" removal case had no Edit History event name) — patched as BR-003 v1.1, adding **Progress Override Removed (Provider Reference Changed)** as a fifth event, distinct from **Provider Caught Up**.

---

# 16. Long-Term Goal

Create a polished desktop application that replaces the existing DOCX workflow while remaining maintainable for the next 10–20 years.

Every design and implementation decision should support that goal.