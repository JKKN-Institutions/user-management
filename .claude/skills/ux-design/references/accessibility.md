# Accessibility Guidelines (WCAG 2.1)

## Quick Reference

### Conformance Levels
- **Level A**: Minimum accessibility (must have)
- **Level AA**: Standard accessibility (should have, legally required in many jurisdictions)
- **Level AAA**: Enhanced accessibility (nice to have)

---

## 1. Perceivable

Information and UI components must be presentable in ways users can perceive.

### 1.1 Text Alternatives (Level A)

**Requirements:**
- All non-text content has text alternatives
- Decorative images marked as decorative (alt="")
- Complex images have detailed descriptions

**Implementation:**
```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2">

<!-- Decorative image -->
<img src="decoration.png" alt="" role="presentation">

<!-- Complex image -->
<img src="flowchart.png" alt="User registration flow" aria-describedby="flow-desc">
<p id="flow-desc">Detailed description of the flowchart...</p>
```

### 1.2 Time-based Media (Level A/AA)

**Requirements:**
- Captions for video content
- Audio descriptions for video
- Transcripts for audio content

### 1.3 Adaptable (Level A)

**Requirements:**
- Proper semantic structure (headings, lists, tables)
- Logical reading order
- No reliance on sensory characteristics alone

**Implementation:**
```html
<!-- Proper heading hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

<!-- Semantic structure -->
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

### 1.4 Distinguishable (Level AA)

**Color Contrast Requirements:**

| Element | Minimum Ratio | Enhanced (AAA) |
|---------|--------------|----------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18px+ or 14px+ bold) | 3:1 | 4.5:1 |
| UI components & graphics | 3:1 | N/A |

**Additional Requirements:**
- Color not sole means of conveying information
- Text resizable to 200% without loss
- Text spacing adjustable
- Content reflows at 320px width

---

## 2. Operable

UI components and navigation must be operable.

### 2.1 Keyboard Accessible (Level A)

**Requirements:**
- All functionality available via keyboard
- No keyboard traps
- Keyboard shortcuts can be disabled

**Focus Management:**
```css
/* Visible focus indicator */
:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Never remove focus outline without replacement */
:focus:not(:focus-visible) {
  outline: none;
  box-shadow: 0 0 0 2px #005fcc;
}
```

**Tab Order:**
- Logical, follows visual order
- Use tabindex="0" for custom interactive elements
- Avoid tabindex > 0

### 2.2 Enough Time (Level A)

**Requirements:**
- Adjustable time limits
- Pause/stop/hide moving content
- No time-based interactions required

### 2.3 Seizures and Physical Reactions (Level A)

**Requirements:**
- No content flashing more than 3 times per second
- Motion can be disabled

### 2.4 Navigable (Level A/AA)

**Requirements:**
- Skip navigation link
- Descriptive page titles
- Logical focus order
- Descriptive link text
- Multiple navigation methods

**Implementation:**
```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Descriptive link -->
<a href="/report.pdf">Download Q4 Sales Report (PDF, 2.3MB)</a>
<!-- NOT: <a href="/report.pdf">Click here</a> -->
```

### 2.5 Input Modalities (Level A/AA)

**Touch Targets:**
- Minimum 44x44 CSS pixels
- Adequate spacing between targets (8px minimum)

**Requirements:**
- Pointer gestures have alternatives
- Pointer actions can be cancelled
- Motion-based inputs have alternatives

---

## 3. Understandable

Information and UI operation must be understandable.

### 3.1 Readable (Level A/AA)

**Requirements:**
- Page language declared
- Language of parts identified
- Unusual words explained

```html
<html lang="en">
  <p>The French phrase <span lang="fr">c'est la vie</span> means...</p>
</html>
```

### 3.2 Predictable (Level A/AA)

**Requirements:**
- No unexpected context changes on focus
- No unexpected context changes on input
- Consistent navigation
- Consistent identification

### 3.3 Input Assistance (Level A/AA)

**Error Handling:**
```html
<!-- Error identification -->
<label for="email">Email</label>
<input
  type="email"
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
>
<span id="email-error" role="alert">Please enter a valid email address</span>
```

**Requirements:**
- Errors clearly identified
- Labels/instructions provided
- Error suggestions offered
- Error prevention for legal/financial data

---

## 4. Robust

Content must be robust enough for diverse user agents.

### 4.1 Compatible (Level A/AA)

**Requirements:**
- Valid HTML
- Proper ARIA usage
- Status messages announced

**ARIA Best Practices:**
```html
<!-- Custom button -->
<div role="button" tabindex="0" aria-pressed="false">Toggle</div>

<!-- Live region for updates -->
<div aria-live="polite" aria-atomic="true">
  3 items in cart
</div>

<!-- Dialog -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Action</h2>
</div>
```

---

## Testing Checklist

### Automated Testing
- [ ] Run axe DevTools or WAVE
- [ ] Check with Lighthouse accessibility audit
- [ ] Validate HTML

### Manual Testing
- [ ] Navigate with keyboard only
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Check color contrast
- [ ] Test at 200% zoom
- [ ] Test at 320px width
- [ ] Verify focus visibility
- [ ] Check form error handling

### Screen Reader Testing
- [ ] NVDA (Windows, free)
- [ ] VoiceOver (Mac/iOS, built-in)
- [ ] TalkBack (Android, built-in)
- [ ] JAWS (Windows, commercial)

---

## Common ARIA Patterns

### Disclosure (Show/Hide)
```html
<button aria-expanded="false" aria-controls="content">Show more</button>
<div id="content" hidden>Additional content</div>
```

### Tabs
```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel2">Tab 2</button>
</div>
<div role="tabpanel" id="panel1">Content 1</div>
<div role="tabpanel" id="panel2" hidden>Content 2</div>
```

### Modal Dialog
```html
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <h2 id="title">Dialog Title</h2>
  <button aria-label="Close dialog">×</button>
</div>
```

### Loading State
```html
<div aria-busy="true" aria-live="polite">
  Loading...
</div>
```
