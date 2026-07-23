# GLIV v2

# 17_DECISIONS.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

Architecture Decision Records (ADRs) capture the major architectural decisions made throughout the project.

Each ADR records:
- The decision.
- The alternatives considered.
- The reason the decision was chosen.

ADRs are append-only. If a decision changes in the future, a new ADR should supersede the previous one rather than rewriting history.

---

## ADR-001 Desktop Application

**Decision**

Use Electron.

**Alternative**

Tauri.

**Reason**

Electron provides a mature ecosystem, excellent AI-assisted development support, long-term maintainability, and broad community adoption.

---

## ADR-002 Local First

**Decision**

Use SQLite with an offline-first architecture.

**Reason**

The library always remains available without an internet connection. Providers enrich the library but never own user data.

---

## ADR-003 Three-Layer Architecture

**Decision**

Separate all information into three independent layers.

- Layer 1 — Personal Data
- Layer 2 — Metadata
- Layer 3 — Live Information

**Reason**

Each layer has different ownership, update rules, and persistence requirements.

---

## ADR-004 Library First

**Decision**

GLIV always opens to the Library.

**Reason**

The Library is the primary workspace and the application's main purpose.

---

## ADR-005 Navigation

**Decision**

Top-level navigation consists of:

- Library
- Collections
- Discover
- Updates
- Settings

Availability is a Series Page capability rather than a navigation destination.

---

## ADR-006 Provider Strategy

**Decision**

Use a capability-driven provider architecture.

### Anime

Primary:
- AniList

Secondary:
- Jikan

### Manga / Manhwa / Manhua / Novel

Primary:
- MangaUpdates

Secondary:
- Comick (Manga / Manhwa / Manhua only)

Novels have no secondary provider.

Unsupported titles are handled as Manual Titles.

**Reason**

Use only stable official APIs as primary integrations while selecting the best provider for each capability.

---

## ADR-007 One Title, Multiple Formats

**Decision**

One Title may contain multiple independent Formats.

Each Format maintains its own:

- Progress
- Publication information
- Contributors
- Provider relationships

**Reason**

Different media formats of the same story should remain together while preserving independent tracking.

---

## ADR-008 Connection Model

**Decision**

Connections represent relationships between Titles.

Supported relationships include:

- Prequel
- Sequel
- Continuation
- Side Story
- Spin-off
- Shared Universe
- Adaptation
- Original Source
- Remake
- Reboot
- Crossover

Relationships such as Same Author and Same Artist are derived from Contributor relationships and are not stored as Connection types.

---

## ADR-009 Import Engine

**Decision**

All imports use a unified Import Engine regardless of entry point.

Supported entry points include:

- DOCX Import
- Search Import
- Restore
- Future import sources

Only deterministic matches may bypass Import Review.

External provider matches always require Import Review.

**Reason**

A single import pipeline provides consistent behavior while preventing incorrect automatic merges.

---

## ADR-010 Contributor Model

**Decision**

Replace separate Author and Artist entities with a unified Contributor model.

Each Contributor is attached to a Format using a role.

Supported roles in v1:

- Author
- Artist

**Reason**

This removes duplicate data, supports creators with multiple roles, and better reflects provider data.

---

## ADR-011 Manual Titles

**Decision**

Titles without a supported provider may be added as Manual Titles.

Manual Titles:

- remain fully user-managed,
- receive no provider synchronization,
- do not calculate Effective Latest,
- do not provide live availability information.

**Reason**

This allows unsupported series to exist without introducing unstable provider integrations.

---

## ADR-012 External References

**Decision**

External provider mappings are stored separately from personal data.

Mappings belong to individual Formats rather than Titles.

Each mapping records:

- Provider
- Provider Entity ID
- Verification State

**Reason**

Provider mappings remain independent from personal information and support multiple provider relationships for different Formats.

---

## ADR-013 Progress Override

**Decision**

Provider-backed Formats may define a Progress Override.

Progress Override:

- exists independently from provider values,
- contributes to Effective Latest,
- is manually editable,
- is automatically removed once provider data catches up.

Manual Titles do not support Progress Override.

**Reason**

This allows temporary provider gaps to be handled without permanently modifying provider data.

---

## ADR-014 External References Field Correction

**Context**

ADR-012 defined external_references with three fields: Provider, Provider Entity ID, Verification State. Two decisions made afterward assumed more than that schema could hold: 19_IMPORT_SYSTEM.md states "Confidence and Verification State are independent," and ADR-009 defines a deterministic-match path that bypasses Import Review entirely. The original schema had no field to store a confidence score, and no verification state that represented an automatic match distinct from a human-reviewed one.

**Decision**

Supersedes ADR-012.

external_references gains two fields ADR-012 omitted: `confidence` and `last_verified`. The `provider` field is renamed `provider_id`, since it is a foreign key into the `providers` table, not a raw string.

Verification state gains a fourth value, AUTO, to represent deterministic matches that bypass Import Review under ADR-009. The prior VERIFIED state is renamed USER_CONFIRMED, to distinguish "a person looked at this and approved it" from "the system linked this without review because the match was deterministic."

Final field set:

- format_id
- provider_id
- provider_entity_id
- confidence
- verification_state (AUTO / PENDING / USER_CONFIRMED / USER_REJECTED)
- last_verified

**Alternatives Considered**

- Compute confidence on demand instead of storing it. Rejected — once provider data changes, the original match confidence can't be reconstructed, and audit/history needs to show what confidence a mapping was created at.
- Fold AUTO into PENDING rather than adding a new state. Rejected — PENDING specifically means "awaiting user action." A deterministic match never needs user action, so labeling it PENDING would misrepresent it in the UI and in Edit History.

**Rationale**

This brings the schema in line with decisions already locked elsewhere (ADR-009, 19_IMPORT_SYSTEM.md) rather than introducing new scope. Nothing here changes provider strategy, routing, or any UI-facing behavior beyond what was already decided.

**Consequences**

- Every code path that creates an external_reference row (Import Engine, Search Import, manual linking) must supply `confidence` and pick the correct verification_state.
- Re-syncing a Title that already has a USER_CONFIRMED or AUTO reference for the same provider_id + provider_entity_id updates that row's `last_verified` rather than creating a new PENDING candidate.
- BR-002 (Title Identity & Import Resolution) can now be written against a schema that actually supports what ADR-009 and 19_IMPORT_SYSTEM.md already promise.

---

## ADR-015 Comick Provider Rejected

**Context**

Comick has no official, documented public API. Every available integration path found (PHP wrapper classes, Go wrappers, scraper-based "source APIs," third-party Apify actors) is an unofficial client built against an undocumented internal endpoint, maintained by unrelated third parties with no versioning, changelog, or stability guarantee.

ADR-006 listed Comick as the Secondary provider for Manga / Manhwa / Manhua (posters, covers, backup artwork). Because Comick was Secondary rather than Primary, 03_PRINCIPLES.md's "only stable official APIs for primary integrations" rule did not technically forbid it — but depending on an undocumented, unofficial endpoint for any production integration, even a fallback one, is a risk this project is choosing not to accept.

**Decision**

Supersedes ADR-006, Comick portion only. AniList, Jikan, and MangaUpdates are unaffected.

Comick is removed from GLIV entirely. The Secondary provider for Manga / Manhwa / Manhua becomes **None** — the same pattern already used for Novels, which have no Secondary provider.

No replacement Secondary is introduced for Poster/Cover fallback. When MangaUpdates artwork is unavailable, GLIV falls back directly to the placeholder-artwork behavior already defined in 23_SERIES_CARD_SPECIFICATION.md ("Empty Metadata") and the graceful-failure behavior already defined in 46_CACHE_SYSTEM_SPECIFICATION.md. No new component or logic is required to support this.

**Supersession Notice**

Every existing mention of Comick anywhere in the documentation set is superseded by this ADR and must be treated as void, including:

- `05_ARCHITECTURE.md` — the `CM[Comick]` node and `PM --> CM` edge in the architecture diagram; "Manga / Manhwa / Manhua Secondary: Comick"
- `07_PROVIDERS.md` — the "Secondary — Comick" line and the "Comick provides" section
- ADR-006 (`17_DECISIONS.md`) — "Secondary: Comick (Manga / Manhwa / Manhua only)"
- `20_PROVIDER_MANAGER.md` — "Manga / Manhwa / Manhua Secondary: Comick"
- `21_SEARCH_ENGINE.md` — "Comick (Secondary for Manga / Manhwa / Manhua only)"
- `60_PROVIDER_CAPABILITY_MATRIX.md` — the Comick cell in the Poster/Cover row, and the "Comick" provider summary section
- `23_SERIES_CARD_SPECIFICATION.md` — step 4 ("Comick") in the poster priority list
- `31_PROVIDER_MANAGER_SPECIFICATION.md` — "Secondary — Comick" and the Comick branch of the Search Flow diagram
- `GLIV_PROJECT_SUMMARY.md` — the "Comick" cell in the Providers table

None of these files need to be hand-edited before implementation begins. This ADR is binding wherever it conflicts with any of them, exactly as `18_DATABASE_SCHEMA.md` is already marked Superseded relative to `32_DATABASE_SPECIFICATION.md`. Any implementation agent or reviewer encountering "Comick" elsewhere in the docs should treat it as historical/void text.

**Alternatives Considered**

- Keep Comick since Secondary providers aren't held to the stable-API rule. Rejected — a fallback role still means production code depends on an undocumented target that could change or disappear without notice, for a capability (posters) that no Business Rule depends on.
- Hand-edit all nine locations above immediately. Rejected for now — the docs are already stabilized and locked; this ADR fully neutralizes every mention without touching locked files. Physical cleanup can happen later as routine housekeeping and doesn't block implementation.

**Rationale**

Same pattern already used twice in this doc set: NovelUpdates was removed as a provider during stabilization, and ADR-014 corrected external_references without rewriting ADR-012. ADRs are append-only specifically so a later decision can override an earlier one without touching every downstream file.

**Consequences**

- The Provider Manager (`20_PROVIDER_MANAGER.md`, `31_PROVIDER_MANAGER_SPECIFICATION.md`) is implemented with routing for AniList, Jikan, and MangaUpdates only. No Comick client, endpoint, or fallback path is built.
- `60_PROVIDER_CAPABILITY_MATRIX.md`'s Poster/Cover capability has a Secondary value of None for Manga / Manhwa / Manhua, matching every Novel row.
- `23_SERIES_CARD_SPECIFICATION.md`'s poster priority is effectively: User override (future) → MangaUpdates → AniList → Placeholder.
- Any future ADR reintroducing a secondary poster/cover source must supersede both this ADR and the relevant portion of ADR-006.

---

## ADR-016 Metadata and Notes Placement

**Context**

During the Database Schema implementation (Module 02), decisions were required on where to attach Metadata (Synopsis, Genres, Tags, Characters, Alternative Titles) and Personal Notes in the database schema. While Contributors were explicitly called out as a Format-level exception in the documentation, Metadata and Notes attachment was not explicitly locked. Additionally, `43_FILTER_SYSTEM_SPECIFICATION.md` requires Discover and Library filters to query by Genre, which SQLite cannot efficiently do if Genres are stored in a JSON column. Finally, a contradiction was identified in the `status` enum values between `08_LIBRARY.md` (5 values) and `43_FILTER_SYSTEM_SPECIFICATION.md` (6 values, including "Planning").

**Decision**

1. Metadata (Synopsis, Genres, Tags, Characters, Alternative Titles) and Personal Notes are attached to `title_id`, not `format_id`.
2. Genres, Tags, and Characters are stored in normalized junction tables (`genres`, `title_genres`, etc.) rather than as JSON columns in the `metadata` table.
3. The Format `status` enum is locked to exactly 5 values: `Reading`, `Watching`, `Completed`, `Paused`, `Dropped`.

**Rationale**

1. Attaching metadata and notes to Titles aligns with `12_SEARCH_SERIES.md`, where the Series Page layout displays Synopsis and Personal Notes once at the Series level rather than per Format Card.
2. Normalized junction tables provide the necessary performance and queryability for the filtering system specified in `43_FILTER_SYSTEM_SPECIFICATION.md`.
3. The "Planning" status in `43_FILTER_SYSTEM_SPECIFICATION.md` contradicts the Library's core scope rule ("Only Titles you have started appear in the Library") and is redundant with the "Plan to Watch / Read" built-in collection. Locking to 5 values resolves this contradiction correctly.

**Consequences**

- The database schema (Module 02) implements normalized junction tables and Title-level attachments for metadata and notes.
- The `formats.status` column is strictly constrained to the 5 approved values.
- As a routine documentation cleanup, `43_FILTER_SYSTEM_SPECIFICATION.md` should have "Planning" removed from its status filter list in a future housekeeping update. This does not block implementation.

---

## ADR-017 Personal Tags

**Context**

`43_FILTER_SYSTEM_SPECIFICATION.md` lists "Personal Tags" under the Personal
filter category (Layer 1, user-owned) — separate and distinct from "Genre"
under the Metadata category (Layer 2, provider-owned). The Module 02
schema and its patch (`003_ARCHITECTURE_PATCH_metadata_publication.md`)
built `tags` / `title_tags` to normalize provider-sourced Tags only, since
that patch's stated purpose was making Discover/Library able to filter
provider metadata efficiently. Nothing in the schema represents
user-created Personal Tags, leaving a real gap between two documents that
were never reconciled.

**Decision**

Add two new tables, distinct from `tags` / `title_tags`:

- `personal_tags` (id, name)
- `title_personal_tags` (title_id, personal_tag_id)

Personal Tags are Layer 1. They are created, renamed, and deleted only by
the user. Provider synchronization and the Import Engine never read or
write these tables.

**Alternatives Considered**

- Add a source column (`PROVIDER` / `USER`) to the existing `tags` table
instead of a second table. Rejected — every other Layer 1/Layer 2 split
in this schema uses separate tables (`metadata` vs `notes`,
`external_references` vs Progress Override), not a shared table with a
discriminator column. A shared table means every future provider
metadata refresh query must remember to filter by source, or it risks
touching personal data — the exact failure mode `03_PRINCIPLES.md` and
`45_SYNC_ENGINE_SPECIFICATION.md` exist to prevent. A separate table
makes that mistake structurally impossible instead of relying on every
future query remembering a `WHERE` clause.

**Rationale**

Consistent with the pattern already used throughout this schema: Layer 1
and Layer 2 data are never stored in the same table, even when the data
looks superficially similar (a "tag" is a tag either way, but ownership
and sync behavior differ completely).

**Consequences**

- `43_FILTER_SYSTEM_SPECIFICATION.md`'s Personal Tags filter queries
`title_personal_tags` directly, the same way its Genre filter queries
`title_genres`.
- Provider sync (`45_SYNC_ENGINE_SPECIFICATION.md`) and the Import Engine
require no changes — they were never touching Personal Tags and
continue not to.
- Deleting a `personal_tag` is a destructive action affecting every Title
using it; per `44_DIALOG_SYSTEM_SPECIFICATION.md`'s Confirmation Dialog
pattern, this should require confirmation. This is a Design-layer
follow-up, not a schema blocker — noted here so it isn't lost.

---

## ADR-018 Split-Tier Cache: Library Persistent / Discover In-Memory

**Context**

46_CACHE_SYSTEM_SPECIFICATION.md defines a single cache layer without specifying whether entries persist across application restarts. Module 05 planning surfaced this as a genuine gap — the roadmap calls it "Local Cache," which fits either an in-memory or a persistent implementation.

Two existing decisions bear on this. ADR-002 commits GLIV to offline-first behavior. Separately, 45_SYNC_ENGINE_SPECIFICATION.md and BR-002 already draw a line between provider-backed Formats that belong to a Title in the user's Library (which have an `external_reference` and participate in ongoing synchronization) and provider data encountered only through Discover/Search (which does not belong to the Library and is never synchronized). A single uniform cache tier ignores a distinction the rest of the architecture already makes.

**Decision**

The Cache System is split into two tiers.

**Library Tier (Persistent).** Applies to provider-backed Formats that belong to a Title in the user's Library. Stored in a new `cache_entries` table (see 32_DATABASE_SPECIFICATION.md patch). Survives application restarts.

**Discover Tier (In-Memory).** Applies to search/browse results not yet added to the Library. Never written to disk. Fully cleared when the application closes.

The caller (e.g., Import Engine or UI route controller) supplies the scope explicitly. Provider Manager simply forwards it to the Cache System without inferring or re-deciding it. The Cache System never infers scope by querying the database.

**No promotion on Library entry.** When a Discover result is added to the Library through Import Review (BR-002), its in-memory entry is not copied into the persistent tier. The persistent entry is populated naturally by the first Sync Engine cycle for that Format.

**Orphan grace period on Library removal.** When a Format is removed from the Library, its Library-tier `cache_entries` rows are not deleted immediately. Instead, `orphaned_at` is set to the removal time. If the same Format is added back to the Library before 7 days have passed, `orphaned_at` is cleared and the entry resumes normal behavior. If 7 days pass, the entry is permanently deleted by a startup cleanup routine.

The orphan window never overrides normal freshness. An entry past its `expires_at` is treated as a miss and triggers a normal provider refetch when read, regardless of whether it is also within its 7-day orphan window. `orphaned_at` governs only whether the row still exists on disk, never whether it is considered fresh.

**Alternatives Considered**

- *Single persistent tier for everything.* Rejected — Discover/search results churn constantly and have no "belongs to the Library" boundary to bound growth; persisting them indefinitely bloats the database for data unlikely to be reused.
- *Single in-memory tier for everything.* Rejected — this weakens the offline-first guarantee for data the user actually tracks: a full app restart would force re-fetching provider data for every Format already in the Library, which 45_SYNC_ENGINE_SPECIFICATION.md's design otherwise avoids.
- *CacheService or Provider Manager infers scope via a database lookup instead of an explicit caller-supplied parameter.* Rejected — this adds a database round-trip to every cache read/write. The caller already knows the context of the operation it's performing.
- *Delete Library-tier entries immediately on removal, no grace period.* Rejected — accidental removal, or removal/re-adding during routine library reorganization, would force an unnecessary provider refetch with no benefit.
- *Promote a Discover entry into the persistent tier at the moment Import Review commits.* Rejected — this is migration logic for a case the Sync Engine already handles naturally on its next cycle; unnecessary complexity for this module's first release.

**Rationale**

This aligns cache persistence with a boundary the architecture already draws elsewhere (BR-002, BR-003, 45_SYNC_ENGINE_SPECIFICATION.md) rather than inventing a new one. It keeps the Cache System's contract simple — the caller states which tier applies — and avoids scope creep into promotion or migration logic that no Business Rule currently requires.

**Consequences**

- `cache_entries` (32_DATABASE_SPECIFICATION.md) stores Library-tier entries only, and gains a nullable `orphaned_at` field.
- `CacheService.get` / `CacheService.set` require an explicit `scope: 'library' | 'discover'` parameter, supplied by the caller.
- The Discover tier is a simple in-memory structure with no schema, no persistence, and no orphan tracking. It is fully cleared on process exit.
- A startup cleanup routine deletes any `cache_entries` row whose `orphaned_at` is more than 7 days in the past.
- Removing a Format from the Library sets `orphaned_at` on its cache_entries rows rather than deleting them; re-adding the same Format within 7 days clears `orphaned_at`.
- Any future Diagnostics/Settings surface reporting cache size or status must account for two tiers, not one.

---

## ADR-019 Planned Titles Storage Model

**Context**
`09_COLLECTIONS.md` lists Plan to Watch/Read as a built-in Collection. `GLIV_PROJECT_SUMMARY.md` describes collection membership as if the Title already exists in the Library. But `08_LIBRARY.md` restricts the Library to started Titles only, and ADR-016 already rejected a "Planning" status for exactly that reason. No document ever defined what data structure a Plan to Watch/Read entry actually is. This has a real practical cost: 01_VISION.md's own stated Problem — duplicate entries in the original DOCX library — reappears inside GLIV if Search can't recognize "I already planned this," the same way it recognizes "I already own this."

**Decision**
Add `planned_titles`, separate from `titles`/`formats`:
```
planned_titles
id
display_title
media_type
provider_id        (nullable)
provider_entity_id (nullable)
added_at
```
- Created only through the Plan to Watch/Read collection — no separate nav destination.
- `provider_id`/`provider_entity_id` nullable: a planned entry may reference a provider result or be freeform, the same way Manual Titles handle "no provider" for real Library entries.
- Never becomes a Format. No status, no progress, no Effective Latest — it exists only to record intent and support duplicate detection.
- Universal Search checks `planned_titles` alongside `titles`/`formats` when flagging "already known" — distinctly, e.g. `libraryState: 'ALREADY_PLANNED'` vs `'IN_LIBRARY'`, so you can tell "I'm tracking this" from "I already meant to check this out."
- **Graduating** a planned entry into a real Format (you actually start it) goes through the normal Search/Import flow; the `planned_titles` row is deleted once the real `titles`/`formats` row exists. Exact UI for that is a future Collections module's job.
- The default Library screen is unchanged — started Titles only. Plan to Watch/Read lives in the Collections tab, using the sorting/filtering already specified in `27_COLLECTIONS_SPECIFICATION.md`.

**Alternatives Considered**
- *Reintroduce "Planning" as a status.* Rejected — reopens exactly what ADR-016 closed.
- *Relax `collection_items`' `title_id` requirement instead of a new table.* Rejected — turns every future query against `collection_items` into a "which kind of row did I get" check.
- *Leave it undefined until a Collections module exists.* Rejected — Search needs to know what "already known" means now, or it ships with the same duplicate-entry bug GLIV exists to fix.

**Consequences**
- `32_DATABASE_SPECIFICATION.md` needs a `planned_titles` patch, same pattern as ADR-018's `cache_entries` patch.
- Module 06 can't fully solve duplicate detection until this table exists — see below.
- A future Collections module owns creating/removing `planned_titles` rows and the graduation workflow.