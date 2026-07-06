Here's the **updated Documentation Stabilization Checklist** based on everything we've finalized during the Foundation and Architecture audits.

---

# GLIV Documentation Stabilization (Updated)

## 1. Foundation

### ✅ Four Pillars

**Authoritative:**

- Library
    
- Collections
    
- Discover
    
- Updates
    

Availability remains a **Series Page capability**, not a navigation pillar.

---

### ✅ Effective Latest

Create **Business Rule – Effective Latest**.

Move all existing logic into one document.

Include:

- Formula
    
- Progress Override
    
- Null handling
    
- Unit normalization
    
- Remaining calculation
    
- Notifications
    

---

### ✅ Progress Override (NEW)

Progress Override replaces the earlier "manual override" idea.

Rules:

- Provider-backed formats only.
    
- Stored **per Format**.
    
- Dedicated field (`progress_override`).
    
- Not a metadata source.
    
- User can create/edit/delete.
    
- Auto-deletes when provider catches up.
    
- Manual Titles never support it.
- User may manually create, edit, or remove the Progress Override at any time.
- When the provider reaches or exceeds the override value, the Progress Override is automatically deleted.

---

### ✅ Title Identity & Import Resolution

Create Business Rule covering:

- Provider relationship matching.
    
- Import confidence.
    
- Import Review.
    
- Merge vs Create New.
    
- User confirmation.
    

No provider-derived match may auto-merge.

---

### ✅ Import Confidence

Confidence only changes the suggested action.

External provider matches always require Import Review.

Deterministic matches (e.g. exact provider ID already linked) may be processed automatically.

---

### ✅ Manual Titles (NEW)

Create Business Rule.

Manual Titles:

- Have no provider.
    
- No metadata sync.
    
- No live updates.
    
- No Effective Latest.
    
- No Progress Override.
    
- Manual metadata only.
    
- Manual progress only.
    

Future provider linking is **deferred (not v1).**
Manual Titles remain Manual Titles throughout v1.
Automatic linking to providers is explicitly out of scope.

---

### ✅ Novel Provider Strategy

NovelUpdates removed as a primary provider.

Primary:

- MangaUpdates
    

Secondary:

- None
    

Missing titles:

- Manual Title
    

NovelUpdates removed because no stable official API.

---

### ✅ Remove Redundant Connections

Remove:

- Same Author
    
- Same Artist
    

Relationship comes from Contributor links.

---

### ✅ Series Page

Restore:

- Rating
    
- Favorite
    

---

### ✅ Discover

Keep:

- Filters
    
- Upcoming Adaptations
    

---

# 2. Architecture

## ✅ Database Authority

32_DATABASE_SPECIFICATION

becomes the only authoritative schema.

All future schema changes must be applied to 32_DATABASE_SPECIFICATION first.
Superseded database documents (06 and 18) are retained for historical reference only and must not receive further schema updates.

Mark:

- 06 Database
    
- 18 Database Schema
    

as

> Superseded (Historical)

---

## ✅ edit_history

Document purpose:

Track Progress Override create, edit, and delete operations as edit history events.
Immutable history of personal edits.

---

## ✅ External References

Replace generic providers mapping.

New structure:

```text
external_references

format_id
provider_id
provider_entity_id
confidence
verification_state
last_verified
```

Remove:

- provider_url
    

Generate URLs in Provider Manager.

Verify slug requirements where applicable.

---

## ✅ Provider Configuration

Separate static provider configuration.

```text
providers
```

contains:

- provider
    
- api
    
- capabilities
    
- rate limits
    
- priority
    

---

## ✅ Verification State

Independent from confidence.

States:

- AUTO
    
- PENDING
    
- USER_CONFIRMED
    
- USER_REJECTED
    

Rejected mappings remain permanently until manually removed.

---

## ✅ Import Engine

Single Import Engine.

Entry points:

- DOCX
    
- Search
    
- Restore
    
- Future imports
    

Common pipeline afterwards.

---

## ✅ Contributor Model (NEW)

Replace:

```text
authors
artists
```

with

```text
contributors
```

and

```text
format_contributors

format_id
contributor_id
role
```

Role:

- Author
    
- Artist
    

Attach contributors to **Format**, not Title.

Different Formats of the same Title may have different contributors.
The Series Page aggregates contributors across Formats for presentation while preserving Format-level relationships internally.

Author and Artist remain independently clickable.

---

## ✅ Provider Capability Matrix (UPDATED)

Keep columns:

| Capability | Primary | Secondary | Manual | Stored As |

Do **not** remove "Stored As."

Keep "Secondary" terminology everywhere.

Manual is **not** part of Provider routing.

---

## ✅ Provider Manager

Routing remains:

```
Primary

↓

Cache

↓

Secondary

↓

Graceful Failure
```

Manual Title creation is outside Provider Manager.

---

## ✅ Manual Title Creation (NEW)

Search flow:

```
Search

↓

Provider Found?

YES
↓

Provider-backed Title

NO
↓

Create Manual Title
```

Document this entry point.

---

## ✅ ADR Improvements

Every ADR should include:

- Context
    
- Decision
    
- Alternatives
    
- Rationale
    
- Consequences
    

---

# 3. Project Improvements

## ✅ Create

```
AUDIT_LOG.md
```

Append-only.

Never rewrite history.

---

## ✅ Create

```
Business Rules/
```

Initially include:

- BR-001 Effective Latest
    
- BR-002 Title Identity & Import Resolution
    
- BR-003 Progress Override
    
- BR-004 Manual Titles
    

---

## ✅ Documentation Lock

After stabilization:

- Foundation locked.
    
- Architecture locked.
    
- Begin Design/Component audits.
    
- No new features unless absolutely necessary.
    

---

# New Decisions Finalized During This Review

1. **Progress Override** replaces general Manual Override.
    
2. **Progress Override** is per **Format**, not Title.
    
3. Progress Override is a dedicated field, not a source tag.
    
4. Progress Override auto-deletes when the provider catches up.
    
5. Progress Override applies **only** to provider-backed formats.
    
6. **Manual Titles** are a separate concept from Progress Override.
    
7. Manual Titles never gain automatic provider linking in v1.
    
8. **Contributor + Role** replaces separate Author and Artist tables.
    
9. Contributors attach to **Format**, allowing different creators across formats.
    
10. Author and Artist remain independently clickable in the UI.
    
11. `external_references` now references **format_id** instead of `title_id`.
    
12. Provider URLs are generated by the Provider Manager rather than stored.
    
13. NovelUpdates is removed as a primary provider due to the lack of a stable official API.
    
14. MangaUpdates becomes the primary provider for supported novels; unsupported novels use **Manual Titles**.
    
15. The Provider Capability Matrix remains **capability-driven** and retains the **Stored As** column.
    

---

I think this is now a strong stabilization baseline. Most of these changes are **architectural refinements**, not new features, which means we're improving implementation quality without expanding GLIV's scope.

Yes. These are **accepted design decisions**, so they belong in the **Documentation Stabilization** document under a new section like **Design (03_All_Design)**.

I'd add this exactly:

---

# Design (03_All_Design)

## ✅ Remove Redundant Connection Types

Remove from the Series Page Connections list:

- Same Author
    
- Same Artist
    

These relationships are now derived from the **Contributor + Role** model and should not exist as standalone connection types.

---

## ✅ Discover Provider List

Update Universal Search.

Remove:

- NovelUpdates
    

Novels are now searched through **MangaUpdates**.

Titles not found become **Manual Titles**.

---

## ✅ Series Page

Restore:

- Rating
    
- Favorite
    

Update both:

- `12_SEARCH_SERIES.md`
    
- `15_WIREFRAMES.md`
    

---

## ✅ Manual Title Creation (NEW)

Add a Manual Title entry point to Discover.

When a search returns no provider results:

```text
No results found.

──────────────

Create Manual Title
```

Selecting **Create Manual Title** opens the Manual Title creation flow.

This is **not** part of the Provider Manager routing.

---

## ✅ Progress Override UI (NEW)

Provider-backed formats display:

```text
Latest Available

221

✏ Override
```

Selecting **Override** opens a lightweight popup:

```text
Latest Available

223

[ Save ]
```

This edits the **Progress Override** value.

It is **not** a general Edit Progress dialog.

The override automatically disappears when the provider catches up.

---

## ✅ Rating & Favorite Components

Add reusable UI components:

- ⭐ Rating
    
- ❤️ Favorite
    

These are reusable interface components used on:

- Series Page
    
- Library
    
- Collections (where applicable)
    

They are **not** standalone pages or modules.

---

## ✅ Empty State for Manual Titles

When viewing a Manual Title, indicate that live provider features are unavailable.

Example:

```text
Manual Title

This title is not linked to a supported provider.

Automatic updates, availability tracking, and live progress are unavailable.
```

This clarifies why Update tracking and other live features are absent.

---

I would also add **one more item** that came out of the review but wasn't in my previous reply:

---

## ✅ Contributor Display

Series Pages display contributors by role.

Supported roles in v1:

- Author
    
- Artist
    

Both are independently clickable and navigate to the contributor's page showing all associated series.

Contributor data is attached to the **Format** internally, while the UI presents a unified Series view.

---

I think this is the complete set of **accepted Design stabilization changes** from the review. Everything here is either:

- fixing a contradiction,
    
- filling a missing UI for an already-approved feature, or
    
- reflecting an architectural decision already made.
    

None of it expands GLIV's scope, which is exactly what the stabilization document should contain.

## Documentation Ownership

Define a single canonical document for every feature.

Recommended:

03 Design
- User experience
- Navigation
- Layout
- Wireframes

04 Components
- Detailed behavior
- UI components
- Interaction logic
- Implementation specification

Avoid maintaining the same specification in multiple locations.

Mark duplicate specifications as reference-only or merge them where appropriate.

## Engieneering 

---

# Engineering (005_All_Engineering)

## ✅ Roadmap Phase 4

Update the roadmap so **Availability** is not presented as a top-level feature alongside Discover and Updates.

Replace:

```text
Phase 4

• Discover
• Updates
• Availability
• Connections
```

with:

```text
Phase 4

• Discover
• Updates
• Series Page Features
    • Availability
    • Connections
```

Availability remains a **Series Page capability**, not a navigation pillar.

---

## ✅ Import Engine Terminology

Standardize terminology across all Engineering documentation.

Replace:

```text
Importer
```

with:

```text
Import Engine
```

This aligns Engineering with the Architecture documentation, where the Import Engine is defined as a single engine with multiple entry points:

- DOCX
    
- Search
    
- Restore
    
- Future Imports
    

---

## ✅ Folder Structure Clarification

Update `34_FOLDER_STRUCTURE.md`.

Add a clarification near the beginning of the document:

> This document describes the internal structure of the **App/** directory only. The overall GLIV project (Obsidian vault) follows the repository structure defined in the Project Summary.

This removes ambiguity between the documentation vault structure and the application source code structure.

---

## ✅ Provider Strategy Consistency

When updating Engineering documents, ensure all provider references follow the stabilized provider strategy:

- MangaUpdates is the primary provider for supported novels.
    
- NovelUpdates is removed as an integrated provider.
    
- Unsupported titles become Manual Titles.
    
- No HTML scraping or unofficial wrappers are used as primary integrations.
    

This is a consistency update only and should follow the Architecture documentation.

---

I would **not** add anything else from the Engineering review. Everything else was either:

- already captured elsewhere in the stabilization document,
    
- a future implementation concern rather than a documentation issue,
    
- or corrected by the reviewer after seeing the actual project structure.
    

This should be the final addition to the stabilization document before you begin the documentation stabilization pass.