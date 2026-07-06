# GLIV v2

# 48_EDIT_HISTORY_SPECIFICATION.md

> Version: 2.0
> Status: Locked Component

---

# Purpose

Edit History records significant changes made to personal library data.

It provides an audit trail for user actions while remaining readable and easy to understand.

Provider synchronization events are not part of Edit History unless they require user intervention.

---

# Tracked Events

Edit History records:

- Progress Changes
- Status Changes
- Rating Changes
- Favorite Changes
- Collection Changes
- Personal Note Changes
- Progress Override Created
- Progress Override Modified
- Progress Override Removed
- Manual Title Created
- Manual Title Updated
- Format Added (Import)
- Manual Format Added

---

# Event Information

Each history entry records:

- Timestamp
- Action
- Previous Value
- New Value
- Format (when applicable)

Entries should clearly describe what changed.
When a provider-backed Format is added to an existing Title through the Import workflow, the event is recorded as an Import event.

When a Manual Format is added to an existing Title, the event is recorded as a Manual Title event for that specific Format.

---

# Display

History is presented in chronological order.

Newest entries appear first.

Each entry should be concise while providing enough information to understand the change.

---

# Progress Override History

Progress Override events record:

- Override Created
- Override Modified
- Override Removed

Automatic removal after provider synchronization is also recorded so users can understand why the override disappeared.

---

# Excluded Events

The following are not recorded:

- Background metadata refreshes
- Provider cache updates
- Artwork changes
- Automatic provider synchronization
- Temporary UI state changes

The history should focus on meaningful personal actions.

---

# States

- Empty
- Loading
- Normal

---

# Accessibility

The Edit History view is fully keyboard accessible.

Users can:

- Navigate entries
- Read change details

without requiring a mouse.

---

# Principles

- Edit History records meaningful personal changes.
- Provider synchronization does not create unnecessary history entries.
- Entries remain chronological and easy to read.
- History supports understanding rather than debugging.

---

# Acceptance Criteria

The component is complete when:

- Personal changes are consistently recorded.
- Progress Override events are fully tracked.
- Automatic provider synchronization does not clutter the history.
- Users can easily understand what changed and when.