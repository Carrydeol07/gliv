# GLIV v2

# BR-004_MANUAL_TITLES.md

> Version: 1.1
> Status: Locked
> Location: 02 Architecture / Business Rules
> Depends on: ADR-011, ADR-014, 32_DATABASE_SPECIFICATION.md, 60_PROVIDER_CAPABILITY_MATRIX.md, BR-001 Effective Latest, BR-002 Title Identity & Import Resolution
>
> **Amendment (v1.1):** Added the "Manual Format Determination" section. BR-004 previously defined a Manual Format only by absence ("a Format without an `external_reference` behaves as a Manual Format"), but never addressed a Format that has an `external_reference` row sitting in PENDING or USER_REJECTED — a case BR-002 explicitly allows to exist. Module 08 (Series Page) surfaced the gap while implementing the provider-backed/Manual branching used throughout the UI. This is a clarification, not a behavior change — it makes explicit what BR-002's existing principles ("no automatic merge may occur while a mapping is pending," "manual confirmation always overrides provider suggestions") already implied.

---

# Purpose

Manual Titles provide a fallback for content that cannot be represented by a provider-backed Format.

This rule defines the behavior of Manual Titles, the capabilities they support, the provider-backed features they intentionally exclude, and how they may later become provider-backed through the standard Import Review process.

---

# Terminology

The documentation commonly refers to **Manual Titles**.

Architecturally, provider relationships exist at the **Format** level.

For the purposes of this rule, a Format without a qualifying `external_reference` behaves as a **Manual Format** — see "Manual Format Determination" below for what qualifies.

User-facing terminology remains **Manual Title**, while provider relationships continue to be managed independently for each Format.

---

# Manual Format Determination

A Format is treated as **provider-backed** only when it has an `external_reference` row whose `verification_state` is:

- `AUTO`, or
- `USER_CONFIRMED`

Every other case behaves as a **Manual Format**, including:

- No `external_reference` row exists at all.
- An `external_reference` row exists with `verification_state: PENDING` — a candidate match proposed by Search or the Import Engine that has not yet been reviewed.
- An `external_reference` row exists with `verification_state: USER_REJECTED` — a match the user explicitly declined, per BR-002's "Rejected mappings remain rejected until manually removed by the user."

While a Format is in either of these states, none of BR-001 (Effective Latest), BR-003 (Progress Override), Availability, or Live Updates apply — the same restrictions defined below under "Provider-Backed Features" — even though a candidate `external_reference` row physically exists in the database.

This is not a new restriction. It follows directly from two things BR-002 already states:

- "No automatic merge may occur while a mapping is pending."
- "Manual confirmation always overrides provider suggestions."

A PENDING or USER_REJECTED row is, by definition, not yet confirmed. Allowing Effective Latest or Progress Override to activate on an unconfirmed match would let provider data influence Layer 1 calculations before the user approved the relationship — the exact outcome BR-002 exists to prevent.

Once Import Review resolves a PENDING candidate to `USER_CONFIRMED` (or a future deterministic path produces `AUTO`), the Format immediately becomes provider-backed per "Becoming Provider-Backed" below. A `USER_REJECTED` row never transitions on its own; the Format remains Manual unless the user takes further action (a fresh search creating a new candidate, or removing the rejected row and re-matching).

---

# Creation

Manual Formats may be created only through the following workflows:

- Universal Search / Discover
  - No suitable provider match found.
  - User selects **Create Manual Title**.

- Import Review
  - No suitable provider match found.
  - User selects **Create Manual Title**.

- Existing Series Page → Add Another Format
  - No suitable provider match found.
  - User selects **Add Manual Format**.

GLIV never creates Manual Formats automatically.

GLIV never silently falls back to Manual Formats.

A Format sitting in PENDING or USER_REJECTED state (per "Manual Format Determination" above) is not "created" as Manual through this section — it behaves as Manual only until Import Review resolves it, and was never routed through the Manual creation workflows above.

---

# Canonical Progress Unit

Every Manual Format has a canonical progress unit.

The canonical progress unit is selected by the user when the Manual Format is created.

Supported units include:

- Episode
- Chapter
- Volume

Once assigned, the canonical progress unit is immutable.

All progress-related values for the Manual Format use the same canonical progress unit.

Unit conversion is never performed.

---

# Provider-Backed Features

Manual Formats never receive provider-backed functionality.

Unavailable features include:

- Provider Synchronization
- Availability
- Latest Official Release
- Latest Scanlation Release
- Effective Latest
- Remaining
- Progress Override
- Update Feed Events

These features become available only after the Format becomes provider-backed, as defined by "Manual Format Determination" above.

---

# Personal Data

Manual Formats support the same Layer 1 personal data as provider-backed Formats.

Supported features include:

- Personal Progress
- Status
- Rating
- Favorite
- Personal Notes
- Collection Membership

Personal Progress is always recorded using the Format's canonical progress unit.

---

# Metadata

Manual Formats do not receive provider metadata.

Metadata available to a Manual Format is limited to information entered by the user.

Provider metadata becomes available only after the Format becomes provider-backed.

---

# Becoming Provider-Backed

A Manual Format may become provider-backed only through the Import Review workflow defined by BR-002.

Automatic provider linking is never performed.

When a user explicitly approves a provider match during Import Review:

- A `USER_CONFIRMED` external_reference is created.
- The Format becomes provider-backed.
- Provider-backed business rules immediately apply.
- BR-001 Effective Latest becomes applicable.
- BR-003 Progress Override becomes applicable.

This transition always requires explicit user confirmation.

A Format already sitting at PENDING (per "Manual Format Determination") follows this same transition when the existing candidate is confirmed — no new `external_reference` row is created; the existing row's `verification_state` is updated in place, consistent with BR-002's Pending Match Management ("the existing PENDING candidate is reused").

---

# Edit History

The following events are recorded in Edit History:

- Manual Title Created
- Manual Title Updated

Provider linking is recorded as an Import operation rather than a Manual Title event.

A Format's temporary Manual behavior while an `external_reference` sits at PENDING or USER_REJECTED does not itself generate a Manual Title event — no Manual Format was created or updated. Only an actual Manual Format creation (per "Creation" above) logs these events.

---

# Principles

- A Format without a qualifying `external_reference` (`AUTO` or `USER_CONFIRMED`) behaves as a Manual Format.
- Manual Formats are created only through explicit user action.
- Manual Formats support the full Layer 1 personal data model.
- Provider-backed functionality is unavailable until a provider relationship exists **and** is confirmed.
- Manual Formats never receive automatic provider synchronization.
- Provider relationships are always established through the Import Review process.
- Manual Formats always use their assigned canonical progress unit.
- A PENDING or USER_REJECTED `external_reference` does not make a Format provider-backed.

---

# Acceptance Criteria

This rule is complete when:

- Manual Formats support all Layer 1 personal data.
- Provider-backed functionality remains unavailable.
- Manual Formats never calculate Effective Latest.
- Manual Formats never participate in Progress Override.
- Manual Formats never generate Update events.
- Manual Formats never receive automatic provider synchronization.
- Manual Formats may become provider-backed only through Import Review.
- Manual Formats consistently use their canonical progress unit.
- A Format with a PENDING or USER_REJECTED `external_reference` is treated identically to a Format with no `external_reference` for the purposes of BR-001, BR-003, Availability, and Live Updates.
- The behavior is consistent across all supported media types.
