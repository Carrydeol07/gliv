# GLIV v2

# BR-002_TITLE_IDENTITY_AND_IMPORT_RESOLUTION.md

> Version: 1.0
> Status: Locked
> Location: 02 Architecture / Business Rules
> Depends on: ADR-009, ADR-014, 19_IMPORT_SYSTEM.md, 30_IMPORT_SYSTEM_SPECIFICATION.md, 44_DIALOG_SYSTEM_SPECIFICATION.md

---

# Purpose

Every import—whether originating from DOCX, Search, Backup Restore, or a future import source—eventually asks the same question:

- Is this a Title that already exists in the Library?
- Is this a provider-backed Title that should be added?
- Is there no suitable provider match, requiring a Manual Title?

This rule defines how those questions are answered and exactly when the Import Engine is permitted to complete the process without user confirmation.

This rule exists because the principle **"One Title exists exactly once"** is a core architectural constraint, and provider matching is the only place where an incorrect automatic merge could violate that principle.

---

# Scope

This rule applies to every workflow that creates or updates provider relationships, including:

- DOCX Import
- Search Import
- Backup Restore
- Future Import Sources

All entry points use the same Import Engine and therefore follow this rule.

---

# Matching Operations

Import processing consists of two completely independent matching operations.

## Provider Identity Matching

Determines which provider entity the imported data represents.

Produces:

- Suggested Provider Match
- Match Confidence

---

## Library Duplicate Matching

Determines whether the matched provider entity already exists in the user's Library.

Produces:

- Existing Library Match

Provider confidence and Library duplication are independent signals.

Possible outcomes include:

- High-confidence provider match with no Library duplicate.
- Existing Library duplicate with no suitable provider match.
- Neither provider nor Library match.
- Both provider and Library match.

Both matching operations must complete before a commit action is selected.

---

# Matching Flow

```text
Import Source
      │
      ▼
Provider Identity Matching
      │
      ▼
Library Duplicate Matching
      │
      ▼
Deterministic Match?
      │
 ┌────┴────┐
 │         │
Yes        No
 │         │
 ▼         ▼
Commit   Import Review
```

## Adding a Format to an Existing Title

When adding a Format to an existing Title, the destination Title is already known.

Therefore:

- Provider Identity Matching is performed exactly as defined by this rule.
- Library Duplicate Matching is skipped because the destination Title has already been selected.
- Confidence, Verification State, and Import Review behavior remain unchanged.

If Provider Identity Matching identifies an acceptable provider match, the new Format is attached to the existing Title through the standard Import Review workflow defined by this rule.

If no suitable provider match exists, the workflow proceeds to Manual Format creation as defined by BR-004.

---

# Deterministic Match

A deterministic match is the only situation where Import Review may be skipped.

Currently, the only deterministic case is:

- The Format already contains an existing `external_reference` with the same:
  - `provider_id`
  - `provider_entity_id`

and its `verification_state` is either:

- AUTO
- USER_CONFIRMED

Deterministic matches:

- Bypass Import Review.
- Update `last_verified`.
- Never create duplicate `external_reference` rows.

Additional deterministic match types may be introduced by future Architecture Decisions.

Unless explicitly defined by a future ADR, every non-deterministic provider match must proceed through Import Review.

---

# Confidence

Confidence is produced by the Import Engine's matching algorithm.

The calculation itself is implementation-specific and outside the scope of this rule.

This rule defines only how Confidence is used.

Confidence:

- Is stored on the `external_reference`.
- Influences the suggested Import Review action.
- Never bypasses Import Review.
- Never overrides manual confirmation.

Only deterministic matches may bypass Import Review.

---

# Verification State

Each `external_reference` has one verification state.

## AUTO

Created only by deterministic matching.

Requires no user review.

## Pending Match Management

A Format may have only one PENDING external_reference candidate for a given provider at any time.

If a new import or search produces another candidate for the same provider while a PENDING candidate already exists:

- The existing PENDING candidate is reused.
- Import Review is reopened using the existing candidate.
- A second PENDING candidate is never created.

This prevents duplicate review items and ensures that Import Review always operates on a single pending candidate per provider.

---

## PENDING

Waiting for Import Review.

No automatic merge may occur while a mapping is pending.

---

## USER_CONFIRMED

Explicitly approved by the user.

Confirmed mappings are considered authoritative.

---

## USER_REJECTED

Explicitly rejected by the user.

Rejected mappings remain rejected until manually removed by the user.

Automatic matching never retries a rejected mapping.

---

# Import Review

Import Review displays:

- Imported Title
- Suggested Provider Match
- Existing Library Match
- Match Confidence
- Suggested Action

Available actions are:

| Action | Result |
|--------|--------|
| Merge with Existing Title | Imported data is attached to the matched Library Title. The corresponding external_reference becomes USER_CONFIRMED. |
| Create New Title | Creates a new provider-backed Title with a USER_CONFIRMED external_reference. |
| Create Manual Title | Creates a Manual Title with no external_reference. From this point onward BR-004 governs the Title. |
| Search Again | Performs a new Provider Identity Matching operation. No data is written. |
| Skip | No changes are committed. Imported data remains available for future import attempts. |

---

# No Provider Match

If no acceptable provider match exists:

- Provider Identity Matching fails.
- Import Review may offer **Create Manual Title**.
- Manual Titles follow BR-004 from that point onward.

The Import Engine never fabricates provider relationships.

---

# Personal Data Conflict Resolution

When merging into an existing Library entry:

- Personal Progress always wins.
- Personal Status always wins.
- Personal Notes are always preserved.
- Personal Rating is preserved.
- Favorites are preserved.
- Collections are preserved.

Provider metadata may be refreshed because provider metadata is not Layer 1 personal data.

Personal information is never overwritten by provider information.

---

# Confirmed Mappings

Once an `external_reference` reaches either:

- AUTO
- USER_CONFIRMED

it is considered stable.

Future imports:

- Never silently replace it.
- Never downgrade it.
- Never replace it with a higher-confidence candidate.

Changing a confirmed mapping always requires explicit user action.

---

# Reversibility

Every completed import must be reversible.

The mechanism used to implement reversibility (transaction log, snapshots, or another implementation strategy) is outside the scope of this rule.

Regardless of implementation, users must always be able to recover from an incorrect import without losing personal information.

---

# Principles

- Provider Identity Matching and Library Duplicate Matching are independent operations.
- Deterministic matches are the only matches that may bypass Import Review.
- Confidence informs suggestions but never grants authority.
- Manual confirmation always overrides provider suggestions.
- Confirmed mappings remain stable until explicitly changed.
- Personal data is never overwritten during import.
- Import decisions are evaluated independently for every Format.
- The Import Engine never fabricates provider relationships.

---

# Acceptance Criteria

This rule is complete when:

- Provider Identity Matching and Library Duplicate Matching remain independent.
- Deterministic matches bypass Import Review only when explicitly defined.
- Confidence never bypasses Import Review.
- Verification states behave consistently.
- Manual confirmation always overrides provider suggestions.
- Personal data is never overwritten during import.
- Manual Titles remain the fallback when no provider-backed match exists.
- Every completed import is reversible.
- The rule behaves consistently across every Import Engine entry point.