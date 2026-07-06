# GLIV v2

# 64_PROGRESS_MODEL.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

The Progress Model defines how personal progress is tracked independently from provider information.

Personal progress always belongs to the user and is never overwritten by synchronization.

---

## Personal Progress

Each Format maintains independent personal progress.

Examples:

- Anime → Episodes watched
- Manga → Chapters read
- Manhwa → Chapters read
- Manhua → Chapters read
### Novel

Novel progress uses the Format's canonical progress unit.

The canonical progress unit is assigned when the Format is created.

For provider-backed Formats, the unit is determined from provider metadata during the initial import or synchronization.

For Manual Titles, the unit is selected by the user during creation.

Once assigned, the canonical progress unit is immutable.

Provider synchronization never changes the assigned progress unit for an existing Format.

Supported units include:

- Chapter
- Volume

All progress-related values for the Format use the same canonical progress unit, including:

- Personal Progress
- Progress Override
- Latest Official Release
- Latest Scanlation Release
- Effective Latest
- Remaining

Unit conversion is never performed.

---

## Provider Progress

Provider-backed Formats may contain:

- Latest Official Release
- Latest Scanlation Release

These values belong to provider-managed data.

---

## Progress Override

Provider-backed Formats may define a Progress Override.

Progress Override:

- is stored independently from provider data,
- contributes to Effective Latest,
- may be edited or removed by the user,
- is automatically removed when provider data reaches or exceeds the overridden value.

Manual Titles do not support Progress Override.

---

## Effective Latest

Effective Latest represents the highest available progress for a provider-backed Format.

It is calculated using:

- Latest Official Release
- Latest Scanlation Release
- Progress Override (when present)

Effective Latest always uses the highest available value.

---

## Display

Provider-backed Formats display progress as:

```
Personal Progress / Effective Latest
```

Example:

```
210 / 223
```

Manual Titles display only personal progress because no provider information exists.

---

## Synchronization

Synchronization may update:

- Latest Official Release
- Latest Scanlation Release

Synchronization never modifies:

- Personal Progress
- Progress Override

---

## Principles

- Personal progress always belongs to the user.
- Every Format maintains independent progress.
- Effective Latest is computed from provider information and Progress Override.
- Manual Titles remain completely independent of provider progress.