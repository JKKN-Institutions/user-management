# Nielsen's 10 Usability Heuristics

## 1. Visibility of System Status

The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.

**Checklist:**
- [ ] Loading indicators for operations >1 second
- [ ] Progress bars for multi-step processes
- [ ] Success/failure confirmations for actions
- [ ] Current location in navigation hierarchy
- [ ] Form validation feedback (real-time preferred)
- [ ] Upload progress indicators
- [ ] Save status indicators (saved/saving/unsaved)

**Examples:**
- Spinner during data fetch
- "3 of 5 steps completed" indicator
- Toast notification after successful action
- Breadcrumbs showing current location

---

## 2. Match Between System and Real World

The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon.

**Checklist:**
- [ ] User-friendly terminology (not technical jargon)
- [ ] Familiar icons and metaphors
- [ ] Logical information ordering
- [ ] Cultural appropriateness
- [ ] Date/time/currency in user's locale

**Examples:**
- "Shopping Cart" not "Order Queue"
- Trash can icon for delete
- Calendar for date picker

---

## 3. User Control and Freedom

Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process.

**Checklist:**
- [ ] Undo functionality for destructive actions
- [ ] Cancel buttons on dialogs/forms
- [ ] Back navigation available
- [ ] Easy exit from modal states
- [ ] Clear way to deselect/reset
- [ ] Confirmation for irreversible actions

**Examples:**
- Undo after deleting email
- "Cancel" button on checkout
- Close button on modals
- "Clear all filters" option

---

## 4. Consistency and Standards

Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.

**Checklist:**
- [ ] Consistent terminology throughout
- [ ] Consistent button placement
- [ ] Consistent icon usage
- [ ] Follows platform conventions (iOS/Android/Web)
- [ ] Consistent color meanings (red=error, green=success)
- [ ] Consistent interaction patterns

**Examples:**
- Primary action always on right
- Same icon for same action everywhere
- Consistent form field styling

---

## 5. Error Prevention

Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.

**Checklist:**
- [ ] Confirmation dialogs for destructive actions
- [ ] Input constraints (character limits, format masks)
- [ ] Disabled states for unavailable actions
- [ ] Clear instructions before input
- [ ] Smart defaults to reduce errors
- [ ] Autosave to prevent data loss

**Examples:**
- "Are you sure you want to delete?"
- Phone number format mask
- Disabled submit until form valid
- Password strength indicator

---

## 6. Recognition Rather Than Recall

Minimize the user's memory load by making elements, actions, and options visible. Users should not have to remember information from one part of the interface to another.

**Checklist:**
- [ ] Visible options rather than hidden menus
- [ ] Recent/frequently used items accessible
- [ ] Search with suggestions/autocomplete
- [ ] Contextual help available
- [ ] Labels visible (not just placeholders)
- [ ] Persistent navigation

**Examples:**
- Recent searches shown
- Autocomplete in search
- Visible labels above form fields
- "You viewed" history

---

## 7. Flexibility and Efficiency of Use

Shortcuts—hidden from novice users—can speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users.

**Checklist:**
- [ ] Keyboard shortcuts for power users
- [ ] Customizable interface options
- [ ] Bulk actions for efficiency
- [ ] Recent/favorites for quick access
- [ ] Touch gestures (swipe, long-press)
- [ ] Search as alternative to navigation

**Examples:**
- Cmd+K for command palette
- Swipe to delete in lists
- Bulk select and action
- Saved filters/views

---

## 8. Aesthetic and Minimalist Design

Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with relevant information.

**Checklist:**
- [ ] Only essential information visible
- [ ] Progressive disclosure for complexity
- [ ] Adequate white space
- [ ] Clear visual hierarchy
- [ ] No decorative elements that distract
- [ ] Focused, single-purpose screens

**Examples:**
- "Show more" for additional details
- Clean, uncluttered forms
- Clear primary action emphasis
- Hidden advanced options

---

## 9. Help Users Recognize, Diagnose, and Recover from Errors

Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.

**Checklist:**
- [ ] Plain language error messages
- [ ] Specific problem description
- [ ] Constructive solution suggestion
- [ ] Visual error indication (red, icons)
- [ ] Error location highlighted
- [ ] Recovery path provided

**Examples:**
- "Email address is invalid. Please check the format." not "Error 422"
- Red border on invalid field
- "Try again" or "Contact support" link
- Clear next steps after error

---

## 10. Help and Documentation

It's best if the system doesn't need any additional explanation. But it may be necessary to provide documentation to help users understand how to complete their tasks.

**Checklist:**
- [ ] Contextual help (tooltips, hints)
- [ ] Searchable help documentation
- [ ] Onboarding for new users
- [ ] FAQ for common issues
- [ ] Contact support option
- [ ] Task-focused help content

**Examples:**
- Info icon with tooltip
- "?" help button
- First-time user tutorial
- Inline hints for complex fields

---

## Severity Rating Scale

When documenting issues, use this severity scale:

| Rating | Level | Description | Priority |
|--------|-------|-------------|----------|
| 4 | Critical | Usability catastrophe; must fix before release | Immediate |
| 3 | Major | Major usability problem; important to fix | High |
| 2 | Minor | Minor usability problem; low priority fix | Medium |
| 1 | Cosmetic | Cosmetic issue only; fix if time permits | Low |
| 0 | Not an issue | Disagree this is a usability problem | None |
