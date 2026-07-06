# GLIV v2

# BR-001_EFFECTIVE_LATEST.md

> Version: 1.0
> Status: Locked
> Location: 02 Architecture / Business Rules

---

# Purpose

Effective Latest is the single computed value that tells the user how far behind they are on a Format.

Library, Updates, the Series Page, and the Progress Widget all compare Personal Progress against this value.

This rule defines exactly how Effective Latest is calculated, where it has no value, how Progress Override participates, and what triggers an Update event.

---

# Scope

This rule applies only to provider-backed Formats.

Manual Titles never calculate Effective Latest.

See **BR-004 Manual Titles**.

---

# Inputs

Effective Latest is computed independently for each Format using only that Format's own values.

Possible inputs are:

- Latest Official Release
- Latest Scanlation Release
- Progress Override

Anime and some Novel Formats may not have a Latest Scanlation Release. In those cases, only the available inputs participate in the calculation.

---

# Formula

```
Effective Latest = MAX(all defined inputs)
```

Defined inputs are:

- Latest Official Release
- Latest Scanlation Release
- Progress Override

Undefined or unavailable values do not participate in the calculation.

---

# Null Handling

## No inputs available

Example:

- New Library entry
- First synchronization has not completed

Effective Latest is undefined.

The application must not display a false zero.

Instead, Personal Progress is displayed while Effective Latest and Remaining are omitted until provider data becomes available.

---

## Exactly one input available

Effective Latest equals that value.

---

## Multiple inputs available

Effective Latest equals the highest available value.

---

## Progress Override present

Progress Override participates in the calculation exactly like any other input.

It never suppresses provider values.

It only raises Effective Latest when it is greater than the currently available provider values.

---

# Unit Normalization

Every Format has a canonical progress unit.

The canonical progress unit is assigned when the Format is created.

For provider-backed Formats, the unit is determined from provider metadata.

For Manual Titles, the unit is selected by the user during creation.

Once assigned, the canonical progress unit is immutable.

Provider synchronization never changes the assigned progress unit for an existing Format.

Supported units include:

- Episode
- Chapter
- Volume

All values participating in the Effective Latest calculation must use the Format's canonical progress unit, including:

- Personal Progress
- Latest Official Release
- Latest Scanlation Release
- Progress Override

Effective Latest never performs unit conversion.

Values from different Formats or different Titles are never compared.
---

# Remaining Calculation

```
Remaining = max(Effective Latest − Personal Progress, 0)
```

Remaining is undefined whenever Effective Latest is undefined.

Remaining is used by:

- Library
- Series Page
- Progress Widget

When Personal Progress exceeds Effective Latest, Remaining is zero.

Applications may present an additional visual indicator (such as "Ahead of tracked releases"), but Remaining itself never becomes negative.

---

# Progress Override Interaction

Progress Override is stored independently from provider values.

It participates in the Effective Latest calculation but is never modified by provider synchronization.

When either:

- Latest Official Release

or

- Latest Scanlation Release

reaches or exceeds the stored Progress Override value,

the Progress Override is automatically deleted during the next synchronization.

After deletion, Effective Latest is recalculated using provider values only.

---

# Notifications & Update Feed

An Update event is generated only when all of the following are true:

1. The Title exists in the user's Library.
2. The newly computed Effective Latest is greater than the previously stored Effective Latest for that Format.

Progress Override creation, modification, or removal never generates Update events.

These are personal edits and belong in Edit History.

Provider corrections or decreases in Effective Latest never generate Update events.

---

# Manual Titles

Manual Titles are outside the scope of this rule.

Manual Titles display:

- Personal Progress

only.

They never calculate:

- Effective Latest
- Remaining
- Update events

See **BR-004 Manual Titles**.

---

# Principles

- Effective Latest is always the highest available progress signal.
- Effective Latest is a computed value, not stored provider metadata.
- Progress Override may raise Effective Latest but never replaces provider data.
- Only provider synchronization may reduce Effective Latest through automatic Progress Override removal.
- Effective Latest is calculated independently for every Format.
- Values are never shared across different Formats belonging to the same Title.
- The Progress Widget displays Effective Latest but never performs the calculation itself.

---

# Acceptance Criteria

This rule is complete when:

- Effective Latest is calculated consistently for every provider-backed Format.
- Only defined inputs participate in the calculation.
- Progress Override participates without replacing provider metadata.
- Remaining is never negative.
- Remaining is omitted when Effective Latest is undefined.
- Manual Titles never calculate Effective Latest.
- Only provider-driven increases generate Update events.
- The calculation behaves consistently across all supported media types.
```