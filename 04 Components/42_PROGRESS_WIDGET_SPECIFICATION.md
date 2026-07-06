# GLIV v2

# 42_PROGRESS_WIDGET_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

The Progress Widget displays and manages personal progress for a single Format.

It provides a consistent interface for viewing progress, updating progress, and managing Progress Overrides for provider-backed Formats.

---

# Supported Formats

- Anime (Episode)
- Manga (Chapter)
- Manhwa (Chapter)
- Manhua (Chapter)
- Novel (Chapter or Volume, according to the Format's canonical progress unit)
- Manual Formats

Each Format maintains its own independent Progress Widget.

---

# Layout

Provider-backed Formats display:

```text
Progress

214 / 221

Latest Available

221

✏ Override
```

Manual Titles display:

```text
Progress

214
```

Manual Titles do not display provider-derived information.

---

# Progress

Displays the user's personal progress.

Actions:

- Increment Progress
- Edit Progress

Progress always represents the user's own tracking data.

---

# Effective Latest

Provider-backed Formats display the current Effective Latest value.

Effective Latest is calculated by the business rules and represents the highest available progress after applying any active Progress Override.

The widget displays the calculated value but does not calculate it.

---

# Progress Override

Progress Override is available only for provider-backed Formats.

Selecting **Override** opens the Progress Override dialog.

Users may:

- Create an Override
- Edit an existing Override
- Remove an Override

Removing an Override immediately restores the provider-calculated Effective Latest.

When the provider catches up to the Override value, the Override is automatically removed.

---

# Manual Titles

Manual Titles do not support:

- Effective Latest
- Progress Override
- Provider synchronization

Manual Titles use only manually entered progress values.

---

# States

- Normal
- Editing Progress
- Editing Progress Override
- Provider Syncing
- Offline
- Manual Title

---

# Actions

Users may:

- Increment Progress
- Edit Progress
- Edit Progress Override (provider-backed Formats only)

---

# Accessibility

The widget is fully keyboard accessible.

Users can:

- Edit Progress
- Edit Progress Override
- Navigate fields

without requiring a mouse.

---

# Principles

- Personal Progress is never modified automatically.
- Provider data never overwrites personal progress.
- Progress Override only affects Effective Latest.
- Manual Titles remain completely manual.
- The widget displays calculated values but does not implement business logic.

---

# Acceptance Criteria

The component is complete when:

- Progress can be updated independently for every Format.
- Provider-backed Formats display Effective Latest correctly.
- Progress Override behaves consistently with the Business Rules.
- Manual Titles never expose provider-only functionality.
- The widget behaves consistently across all Series Pages.