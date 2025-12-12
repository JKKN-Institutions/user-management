---
name: ux-design
description: Comprehensive UX design skill for web and mobile applications. This skill should be used when users need UX audits, usability evaluations, user flow design, wireframe creation, accessibility reviews, UX writing guidance, or applying UX best practices to implementations.
---

# UX Design Skill

This skill provides comprehensive UX design capabilities for web and mobile applications, including audits, design creation, and implementation guidance.

## Capabilities

1. **UX Evaluation & Audits** - Heuristic evaluations, usability reviews, competitive analysis
2. **UX Design Creation** - User flows, wireframes, interaction patterns, prototypes
3. **Accessibility** - WCAG compliance, inclusive design, screen reader optimization
4. **UX Writing** - Microcopy, error messages, onboarding flows, CTAs
5. **Responsive Design** - Mobile-first principles, adaptive layouts, touch interactions

## When to Use This Skill

- Reviewing existing UI/UX for usability issues
- Designing user flows or wireframes
- Creating or improving form interactions
- Writing user-facing copy (buttons, errors, tooltips)
- Ensuring accessibility compliance
- Optimizing mobile experiences
- Planning navigation and information architecture

## Workflows

### UX Audit Workflow

To conduct a UX audit:

1. Read the reference file `references/heuristics.md` for Nielsen's 10 heuristics
2. Evaluate the interface against each heuristic
3. Document issues with severity ratings (Critical/Major/Minor/Enhancement)
4. Provide specific, actionable recommendations
5. Use the checklist template in `assets/ux-audit-checklist.md`

### User Flow Design Workflow

To create user flows:

1. Identify the user goal and entry points
2. Map the happy path first
3. Add error states and edge cases
4. Consider mobile vs desktop differences
5. Document decision points and branches
6. Output as Mermaid diagrams or structured markdown

### Accessibility Review Workflow

To conduct accessibility reviews:

1. Read `references/accessibility.md` for WCAG guidelines
2. Check color contrast ratios (minimum 4.5:1 for text)
3. Verify keyboard navigation
4. Review screen reader compatibility
5. Assess touch target sizes (minimum 44x44px mobile)
6. Document issues with WCAG success criteria references

### UX Writing Workflow

To improve UX copy:

1. Read `references/ux-writing.md` for guidelines
2. Apply voice and tone principles
3. Keep copy concise and actionable
4. Use positive framing where possible
5. Write clear error messages with recovery paths

## Platform-Specific Guidelines

### Web

- Minimum touch target: 44x44px
- Focus states visible for keyboard navigation
- Responsive breakpoints: 320px, 768px, 1024px, 1440px
- Loading states for actions >1 second
- Form validation: inline, real-time preferred

### Mobile

- Thumb zone optimization for primary actions
- Bottom navigation for frequent actions
- Swipe gestures for common operations
- Haptic feedback for confirmations
- Offline state handling

## Output Formats

### Code-Based Prototypes

When requested, output functional HTML/CSS/React prototypes demonstrating:
- Interaction patterns
- Responsive behavior
- Accessibility features
- Animation/transition states

### Documentation

- User flow diagrams (Mermaid syntax)
- Audit reports (structured markdown)
- Design specifications
- Accessibility compliance reports

## Quick Reference

### Severity Ratings for Issues

| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Blocks user from completing task | Fix immediately |
| Major | Causes significant frustration or confusion | Fix before release |
| Minor | Noticeable but doesn't prevent task completion | Fix when possible |
| Enhancement | Opportunity for improvement | Consider for future |

### Common UX Patterns

- **Progressive Disclosure** - Show only what's needed at each step
- **Recognition over Recall** - Make options visible, don't require memorization
- **Error Prevention** - Design to prevent errors, not just handle them
- **Forgiving Format** - Accept multiple input formats
- **Smart Defaults** - Pre-fill likely choices
