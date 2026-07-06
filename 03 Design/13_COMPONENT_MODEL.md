# GLIV v2

# 13_COMPONENT_MODEL.md

> Version: 2.0
> Status: Locked Design

## Purpose

The Component Model defines the reusable user interface components used throughout GLIV.

Components should remain modular, reusable, and independent of business logic.

---

# Core Components

## Series Card

Displays:

- Poster
- Title
- Progress
- Status
- Rating
- Favorite

Used in:

- Library
- Collections
- Discover
- Contributor Pages

---

## Format Card

Displays information for a single Format.

Contents:

- Personal Progress
- Effective Latest (provider-backed Formats only)
- Progress Override
- Status
- Start Date
- Finish Date

Actions:

- Edit Progress
- Edit Progress Override
- Change Status

---

## Availability Panel

Displays:

- Official Platforms
- Official Publisher
- License Status
- Latest Official Release
- Latest Scanlation Release
- Scanlation Groups

Hidden for Manual Titles.

---

## Publication Panel

Displays:

- Publication Status
- Start Date
- End Date
- Chapter Count
- Episode Count
- Volume Count

---

## Contributor Card

Displays:

- Contributor Name
- Role (Author / Artist)
- Portrait (when available)

Selecting a Contributor opens the Contributor page.

---

## Connections Panel

Displays:

- Prequel
- Sequel
- Continuation
- Shared Universe
- Adaptation
- Original Source

---

## Synopsis Panel

Displays the provider synopsis.

---

## Notes Panel

Displays personal notes.

Editable by the user.

---

## Rating Component

Allows users to rate a Title.

Rating is personal data.

---

## Favorite Toggle

Allows users to mark or unmark a Title as a Favorite.

Favorites are personal data.

---

## Progress Override Control

Available only for provider-backed Formats.

Allows users to:

- Create a Progress Override
- Edit a Progress Override
- Remove a Progress Override

---

## Manual Title Information Panel

Displayed when the currently selected Format is a Manual Format.

Explains that the following features are unavailable:

- Provider synchronization
- Availability
- Effective Latest
- Live updates

---

# Principles

- Components remain reusable.
- Components do not contain business logic.
- Personal data components never depend on provider data.
- Provider-backed and Manual Title components remain visually consistent where possible.