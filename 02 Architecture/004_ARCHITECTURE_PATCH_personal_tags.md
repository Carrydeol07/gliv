# GLIV v2 — Architecture Patch
# 004_ARCHITECTURE_PATCH_personal_tags.md

> Status: Locked
> Context: Module 02 follow-up for Personal Tags gap

## PATCH — Add `personal_tags` and `title_personal_tags` to `32_DATABASE_SPECIFICATION.md`

**Add after the `tags` / `title_tags` section:**
personal_tags / title_personal_tags
User-created tags, entirely distinct from provider-sourced tags.
personal_tags:

id
name (UNIQUE)

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

## PATCH — Add to `17_DECISIONS.md`, after ADR-016

ADR-017 Personal Tags
Context
43_FILTER_SYSTEM_SPECIFICATION.md lists "Personal Tags" under the Personal
filter category (Layer 1, user-owned) — separate and distinct from "Genre"
under the Metadata category (Layer 2, provider-owned). The Module 02
schema and its patch (003_ARCHITECTURE_PATCH_metadata_publication.md)
built tags / title_tags to normalize provider-sourced Tags only, since
that patch's stated purpose was making Discover/Library able to filter
provider metadata efficiently. Nothing in the schema represents
user-created Personal Tags, leaving a real gap between two documents that
were never reconciled.
Decision
Add two new tables, distinct from tags / title_tags:

personal_tags (id, name)
title_personal_tags (title_id, personal_tag_id)

Personal Tags are Layer 1. They are created, renamed, and deleted only by
the user. Provider synchronization and the Import Engine never read or
write these tables.
Alternatives Considered

Add a source column (PROVIDER / USER) to the existing tags table
instead of a second table. Rejected — every other Layer 1/Layer 2 split
in this schema uses separate tables (metadata vs notes,
external_references vs Progress Override), not a shared table with a
discriminator column. A shared table means every future provider
metadata refresh query must remember to filter by source, or it risks
touching personal data — the exact failure mode 03_PRINCIPLES.md and
45_SYNC_ENGINE_SPECIFICATION.md exist to prevent. A separate table
makes that mistake structurally impossible instead of relying on every
future query remembering a WHERE clause.

Rationale
Consistent with the pattern already used throughout this schema: Layer 1
and Layer 2 data are never stored in the same table, even when the data
looks superficially similar (a "tag" is a tag either way, but ownership
and sync behavior differ completely).
Consequences

43_FILTER_SYSTEM_SPECIFICATION.md's Personal Tags filter queries
title_personal_tags directly, the same way its Genre filter queries
title_genres.
Provider sync (45_SYNC_ENGINE_SPECIFICATION.md) and the Import Engine
require no changes — they were never touching Personal Tags and
continue not to.
Deleting a personal_tag is a destructive action affecting every Title
using it; per 44_DIALOG_SYSTEM_SPECIFICATION.md's Confirmation Dialog
pattern, this should require confirmation. This is a Design-layer
follow-up, not a schema blocker — noted here so it isn't lost.
