# GLIV v2

# 61_PUBLICATION_MODEL.md

> Version: 2.0
> Status: Locked Architecture

## Purpose

The Publication Model stores publication and release information for each provider-backed Format.

Publication information is independent from personal progress and is refreshed through provider synchronization.

---

## Publication Information

Each Format may store:

- Publication Status
- Start Date
- End Date
- Chapter Count
- Episode Count
- Volume Count
- Latest Official Release
- Latest Scanlation Release
- Official Publisher
- Official Platforms
- License Status

---

## Availability

Availability is derived from publication information and provider data.

Examples include:

- Official Publisher
- Official Platforms
- Translation Status
- License Status
- Latest Official Release
- Latest Scanlation Release

Availability is displayed on the Series Page and is not a navigation destination.

---

## Provider Ownership

Publication information is provider-managed.

It may be refreshed during synchronization.

Personal information is never stored in the Publication Model.

---

## Manual Titles

Manual Titles do not participate in the Publication Model.

Publication information for Manual Titles is managed entirely by the user.

Features unavailable to Manual Titles include:

- Provider synchronization
- Availability
- Effective Latest
- Live publication updates

---

## Principles

- Publication information belongs to individual Formats.
- Publication data is independent from personal progress.
- Availability is derived from provider data.
- Personal data is never modified by publication updates.