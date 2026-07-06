# GLIV v2

# BR-003_PROGRESS_OVERRIDE.md

> Version: 1.0
> Status: Locked
> Location: 02 Architecture / Business Rules
> Depends on: ADR-013, 32_DATABASE_SPECIFICATION.md, 64_PROGRESS_MODEL.md, BR-001 Effective Latest

---

# Purpose

Progress Override allows the user to temporarily raise the Effective Latest for a provider-backed Format without modifying provider data.

It exists to bridge the gap between "the user knows newer content exists" and "the provider has not yet recorded that release."

This rule defines the ownership, lifecycle, validation, storage, and synchronization behavior of Progress Override.

The Effective Latest calculation itself is defined by **BR-001 Effective Latest**.

---

# Scope

Progress Override applies only to provider-backed Formats.

Manual Formats never support Progress Override.

See **BR-004 Manual Titles**.

---

# Definition

Progress Override is:

- A per-Format value.
- Layer 1 Personal Data.
- Independent of provider metadata.
- Independent of provider publication data.

Each Format manages its own Progress Override.

Multiple Formats belonging to the same Title never share an Override.

---

# Storage

Progress Override is stored as part of the Format record.

It is:

- Included in Backups.
- Restored during Restore operations.
- Recorded by Edit History.

Provider synchronization never writes or modifies the stored value directly.

---

# Lifecycle

## Create

Progress Override is created only through explicit user action.

It may be created whenever the Format is provider-backed, including before the first successful provider synchronization.

---

## Edit

Users may edit the Progress Override at any time.

Each edit replaces the previous value.

Historical values are not retained beyond Edit History.

---

## Manual Removal

Users may remove the Progress Override at any time.

Removal immediately causes Effective Latest to be recalculated using provider values only, as defined by BR-001.

---

## Automatic Removal

Progress Override is automatically removed when provider synchronization determines that either:

- Latest Official Release

or

- Latest Scanlation Release

has reached or exceeded the stored Progress Override value.

Automatic removal is evaluated once after the Format's synchronization cycle has completed.

The decision is never made while individual provider values are still being refreshed.

After removal, Effective Latest is recalculated using provider values only.

---

# Value Validation

Progress Override must always be greater than the current Personal Progress.

Values less than or equal to Personal Progress are rejected.

Values less than or equal to the current provider-derived Effective Latest are permitted.

Such values simply have no effect because BR-001 always calculates Effective Latest using the highest available value.

---

# Synchronization

Provider synchronization may:

- Read Progress Override.
- Compare Progress Override with provider publication data.
- Automatically remove Progress Override after provider data catches up.

Provider synchronization never:

- Creates Progress Override.
- Modifies Progress Override.

Only the user may create or edit an Override.

---

# External Reference Changes

If a Format's `external_reference` is replaced with a different provider entity through the Import Review process:

- Any existing Progress Override is automatically removed.
- The previous Override is considered invalid because it references the numbering of the previous provider entity.
- The removal is recorded in Edit History.

A new Progress Override may be created by the user after the new provider relationship has been established.

---

# Relationship to Effective Latest

Progress Override participates in the Effective Latest calculation defined by BR-001.

Progress Override:

- Never replaces provider values.
- Never lowers Effective Latest.
- May raise Effective Latest when it exceeds the provider's current publication progress.

The calculation itself is outside the scope of this rule.

---

# Edit History

The following events are recorded:

- Progress Override Created
- Progress Override Modified
- Progress Override Removed (Manual)
- Progress Override Removed (Provider Caught Up)

Automatic removal entries must clearly indicate that provider synchronization caused the removal.

---

# Principles

- Progress Override is Layer 1 Personal Data.
- Progress Override is temporary.
- Provider data remains the authoritative publication source.
- Users may create, edit, and remove Progress Override.
- Provider synchronization may only remove Progress Override.
- Provider synchronization never creates or edits Progress Override.
- Progress Override never lowers Effective Latest.
- Manual Formats never participate in Progress Override.

---

# Acceptance Criteria

This rule is complete when:

- Progress Override exists only for provider-backed Formats.
- Users can create, edit, and remove Progress Override.
- Provider synchronization never creates or edits Progress Override.
- Provider synchronization removes Progress Override only after provider data catches up.
- External reference changes automatically invalidate existing Progress Overrides.
- Progress Override participates in BR-001 Effective Latest calculations.
- Every lifecycle event is recorded in Edit History.
- The behavior is consistent across all supported media types.