# GLIV v2

# BR-004_MANUAL_TITLES.md

> Version: 1.0
> Status: Locked
> Location: 02 Architecture / Business Rules
> Depends on: ADR-011, 32_DATABASE_SPECIFICATION.md, 60_PROVIDER_CAPABILITY_MATRIX.md, BR-001 Effective Latest, BR-002 Title Identity & Import Resolution

---

# Purpose

Manual Titles provide a fallback for content that cannot be represented by a provider-backed Format.

This rule defines the behavior of Manual Titles, the capabilities they support, the provider-backed features they intentionally exclude, and how they may later become provider-backed through the standard Import Review process.

---

# Terminology

The documentation commonly refers to **Manual Titles**.

Architecturally, provider relationships exist at the **Format** level.

For the purposes of this rule, a Format without an `external_reference` behaves as a **Manual Format**.

User-facing terminology remains **Manual Title**, while provider relationships continue to be managed independently for each Format.

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

These features become available only after the Format becomes provider-backed.

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

---

# Edit History

The following events are recorded in Edit History:

- Manual Title Created
- Manual Title Updated

Provider linking is recorded as an Import operation rather than a Manual Title event.

---

# Principles

- A Format without an `external_reference` behaves as a Manual Format.
- Manual Formats are created only through explicit user action.
- Manual Formats support the full Layer 1 personal data model.
- Provider-backed functionality is unavailable until a provider relationship exists.
- Manual Formats never receive automatic provider synchronization.
- Provider relationships are always established through the Import Review process.
- Manual Formats always use their assigned canonical progress unit.

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
- The behavior is consistent across all supported media types.