# GLIV v2

# 54_ACCESSIBILITY.md

> Version: 2.0
> Status: Locked Design

## Purpose

Accessibility ensures GLIV remains usable for as many users as possible without compromising the desktop-first experience.

Accessibility should be considered throughout the application rather than added afterward.

---

# Keyboard Navigation

Every interactive element must be reachable using the keyboard.

Users should be able to:

- Navigate
- Select
- Edit
- Confirm
- Cancel

without requiring a mouse.

---

# Focus

The currently focused element must always be visually distinguishable.

Focus order should follow the visual layout of the application.

---

# Contrast

Text, icons, and interactive controls should provide sufficient contrast for comfortable reading.

Color should never be the only indicator of meaning.

---

# Typography

Typography should prioritize readability.

Guidelines:

- Clear hierarchy
- Consistent sizing
- Comfortable spacing
- Avoid unnecessary font variations

---

# Icons

Icons should always be accompanied by descriptive labels or tooltips.

Icons should enhance recognition rather than replace text.

---

# Dialogs

Dialogs should:

- Receive keyboard focus when opened.
- Trap focus until closed.
- Support keyboard confirmation and cancellation.
- Return focus to the originating control when closed.

---

# Animations

Animations should respect the operating system's reduced motion preference.

Users who disable motion should still receive clear visual feedback.

---

# Error Messages

Error messages should:

- Clearly explain the problem.
- Identify the affected field when appropriate.
- Suggest a recovery action.

Errors should never rely solely on color to communicate meaning.

---

# Principles

- Accessibility is part of the core design, not an optional feature.
- Every feature should remain usable with keyboard navigation.
- Readability always takes priority over decoration.
- Accessibility improvements should never reduce functionality.