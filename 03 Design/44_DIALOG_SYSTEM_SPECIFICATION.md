# GLIV v2

# 44_DIALOG_SYSTEM_SPECIFICATION.md

> Version: 2.0
> Status: Locked Design

## Purpose

Dialogs allow users to perform focused tasks without leaving their current context.

Every dialog should present a single clear action and minimize unnecessary decisions.

---

# Edit Progress

Allows users to update personal progress.

Displays:

- Current Progress
- New Progress
- Status (optional)

Actions:

- Save
- Cancel

---

# Progress Override

Available only for provider-backed Formats.

Allows users to:

- Create a Progress Override
- Edit an existing Progress Override
- Remove a Progress Override

Displays:

- Current Effective Latest
- Override Value
- Explanation of Progress Override

Actions:

- Save
- Remove Override
- Cancel

Removing a Progress Override immediately restores the provider-calculated Effective Latest.

---

# Import Review

Displayed whenever provider-backed imports require user confirmation.

Displays:

- Import candidate
- Existing library match (if applicable)
- Suggested action
- Match confidence

Actions:

- Merge
- Create New Title
- Create Manual Title
- Search Again
- Skip

Import Review is required for all non-deterministic provider matches.

---

# Confirmation Dialog

Used for destructive actions.

Examples:

- Delete Collection
- Remove Title
- Delete Notes
- Clear Progress Override

Actions:

- Confirm
- Cancel

---

# Merge Titles

Allows users to merge duplicate Titles.

Displays:

- Source Title
- Target Title
- Merge Summary

Actions:

- Merge
- Cancel

---

# Backup Restore

Shown before restoring a backup.

Displays:

- Backup Date
- Backup Version
- Items to Restore

Actions:

- Restore
- Cancel

---

# Error Dialog

Displays recoverable errors.

Examples:

- Provider unavailable
- Import failed
- Backup failed

Actions should always provide a clear recovery path when possible.

---

# Principles

- Dialogs perform one task only.
- Dialogs never hide important consequences.
- Destructive actions always require confirmation.
- Personal data changes are always initiated by the user.
- Dialogs should preserve the user's context whenever possible.