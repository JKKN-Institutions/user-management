# UX Writing Guidelines

## Core Principles

### 1. Clear
Write so anyone can understand immediately. Avoid jargon, technical terms, and ambiguity.

| Instead of | Write |
|------------|-------|
| Authentication failed | Wrong email or password |
| Invalid input | Enter a valid email address |
| Transaction pending | Payment processing |
| Session terminated | You've been signed out |

### 2. Concise
Use the fewest words possible while maintaining clarity. Every word should earn its place.

| Instead of | Write |
|------------|-------|
| Click the button below to continue | Continue |
| Please enter your password in the field below | Password |
| Are you sure you want to delete this item? | Delete this item? |
| Successfully completed | Done |

### 3. Useful
Provide information that helps users accomplish their goals. Include next steps when relevant.

| Instead of | Write |
|------------|-------|
| Error | Can't connect. Check your internet and try again. |
| File too large | File must be under 10MB. Compress or choose another file. |
| Invalid date | Enter a date in the future |

---

## UI Element Guidelines

### Buttons

**Primary Actions:**
- Use verbs: Save, Send, Create, Delete, Continue
- Be specific: "Save changes" vs "Save", "Send message" vs "Submit"
- Match the action: "Add to cart" not "Continue"

**Destructive Actions:**
- Be explicit: "Delete account" not "Remove"
- Use confirmation: "Yes, delete" / "No, keep it"

| Context | Button Text |
|---------|-------------|
| Form submission | Save, Submit, Send |
| Creation | Create, Add, New |
| Navigation | Continue, Next, Back |
| Destructive | Delete, Remove, Cancel subscription |
| Confirmation | Yes, delete / No, keep it |

### Form Labels

**Best Practices:**
- Use nouns: "Email address" not "Enter your email"
- Be specific: "Work email" vs "Email"
- Include format hints: "Phone (e.g., 555-123-4567)"

**Placeholder Text:**
- Use for examples only, not labels
- Format: "e.g., john@example.com"
- Never rely on placeholder as the only label

### Error Messages

**Structure:**
1. What happened (briefly)
2. Why it happened (if helpful)
3. How to fix it

**Examples:**
```
❌ Error 422
✅ Email already registered. Sign in or use a different email.

❌ Invalid input
✅ Password must be at least 8 characters.

❌ Something went wrong
✅ Couldn't save changes. Check your connection and try again.

❌ Request failed
✅ This file type isn't supported. Upload a JPG, PNG, or PDF.
```

### Success Messages

**Best Practices:**
- Confirm what happened
- Mention next steps if relevant
- Be brief

**Examples:**
```
✅ Changes saved
✅ Message sent. You'll receive a reply within 24 hours.
✅ Account created. Check your email to verify.
✅ Password updated. Use it next time you sign in.
```

### Empty States

**Structure:**
1. What this area is for
2. Why it's empty
3. How to fill it (CTA)

**Examples:**
```
No messages yet
Start a conversation by sending a message.
[New message]

No results found
Try different keywords or check your spelling.
[Clear search]

Your cart is empty
Browse our products and add items you like.
[Start shopping]
```

### Loading States

**Guidelines:**
- For short waits (<3s): Simple spinner, no text
- For longer waits: Explain what's happening
- For very long waits: Show progress

**Examples:**
```
Loading...
Saving your changes...
Uploading (3 of 10 files)...
Almost done...
```

### Tooltips & Help Text

**When to Use:**
- Complex features needing explanation
- Unfamiliar terminology
- Form fields requiring specific format

**Format:**
- Keep under 150 characters
- Use sentence fragments OK
- Lead with the benefit

**Examples:**
```
"Public profile"
Tooltip: Visible to anyone on the internet

"Two-factor authentication"
Tooltip: Adds extra security with a code sent to your phone

"API key"
Tooltip: Used to connect external apps. Keep this secret.
```

---

## Tone by Context

### Neutral (Default)
For most UI interactions.
```
Save changes
Email address
Continue to checkout
```

### Encouraging
For completions, achievements, onboarding.
```
Great choice!
You're all set.
One more step to go.
```

### Reassuring
For errors, destructive actions, sensitive data.
```
Your data is safe and encrypted.
You can restore this within 30 days.
We'll never share your email.
```

### Urgent
For time-sensitive or critical situations.
```
Session expires in 5 minutes
Unsaved changes will be lost
This action cannot be undone
```

---

## Mobile-Specific Writing

### Space Constraints
- Shorter labels: "Email" not "Email address"
- Abbreviate when standard: "min" "hr" "qty"
- Use icons + text: 🔔 Notifications

### Touch Interactions
- Use tap/swipe language: "Tap to edit"
- Be explicit: "Swipe left to delete"

### Notifications
```
[App Name]
Brief headline
Supporting detail if needed
```

Example:
```
MyApp
Order shipped
Arrives Thursday, Dec 5
```

---

## Inclusive Language

### Avoid Gendered Terms
| Instead of | Write |
|------------|-------|
| Hey guys | Hey everyone |
| Mankind | Humanity |
| He/she | They |
| Manpower | Workforce |

### Avoid Ableist Language
| Instead of | Write |
|------------|-------|
| Crazy/insane | Surprising, unexpected |
| Blind to | Unaware of |
| Crippled | Disabled, broken |
| Dumb | Silent, muted |

### Cultural Sensitivity
- Don't assume holidays (not everyone celebrates Christmas)
- Use inclusive examples (diverse names)
- Avoid idioms that don't translate

---

## Checklist for UX Copy

- [ ] Can users understand this without context?
- [ ] Is every word necessary?
- [ ] Does it use familiar vocabulary?
- [ ] Is the action clear?
- [ ] Does it help users recover from errors?
- [ ] Is the tone appropriate for the context?
- [ ] Is it inclusive?
- [ ] Does it work on small screens?
