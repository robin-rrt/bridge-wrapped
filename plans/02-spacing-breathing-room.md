# Spacing Improvements: Breathing Room

**Type:** refactor
**Scope:** Spacing and layout only
**Estimated time:** 1-2 hours
**Depends on:** Complete after color refactor (01-neutral-color-palette.md)

---

## Goal

Increase breathing room throughout the app with consistent spacing for a more polished, premium feel.

---

## Spacing Principles

Use Tailwind's existing scale (already 4px-based):
- `p-4` = 16px (tight)
- `p-6` = 24px (comfortable)
- `p-8` = 32px (spacious)
- `p-12` = 48px (section breaks)
- `p-16`+ = hero/major sections

**Rule:** Prefer larger values for main content areas. Don't be afraid of whitespace.

---

## Changes Required

### 1. SlideContainer Padding

```tsx
// Current
className="px-6 py-20 md:px-16 md:py-24"

// Updated - more breathing room
className="px-8 py-24 md:px-20 md:py-32 lg:px-24 lg:py-40"
```

### 2. Main Page (`page.tsx`)

```tsx
// Increase vertical spacing in content sections
// space-y-8 → space-y-10 or space-y-12
// Add more padding to main container
```

### 3. StatsSummary Dashboard

```tsx
// Increase grid gaps
gap-6 md:gap-8 → gap-8 md:gap-10

// Increase card padding
p-5 md:p-6 → p-6 md:p-8
```

### 4. Individual Slide Content

Review each slide for:
- Space between heading and subheading (`mb-4` → `mb-6`)
- Space between sections (`space-y-8` → `space-y-10`)
- Padding around stat displays

---

## Files to Update

| File | Focus Area |
|------|------------|
| `src/components/wrapped/slides/SlideContainer.tsx` | Container padding |
| `src/app/page.tsx` | Main page vertical rhythm |
| `src/components/wrapped/StatsSummary.tsx` | Grid gaps, card padding |
| `src/components/wrapped/slides/*.tsx` | Internal spacing per slide components |
| `src/components/ui/StatCard.tsx` | Card internal padding |

---

## Testing Approach

1. View each slide at mobile (375px) and desktop (1440px)
2. Ensure content doesn't feel cramped on mobile
3. Ensure content doesn't feel lost in space on large screens
4. Check that navigation arrows and progress dots remain accessible

---

## Done When

- [ ] Slides feel spacious but not empty
- [ ] Consistent spacing rhythm across all views
- [ ] Mobile experience remains usable (not too much padding)
- [ ] Desktop has generous breathing room
