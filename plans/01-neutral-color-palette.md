# Color Refactor: Neutral Palette

**Type:** refactor
**Scope:** Visual only (colors)
**Estimated time:** 2-3 hours

---

## Goal

Replace colorful purple/pink gradients with grayscale neutral tones for an Apple-like aesthetic.

---

## Changes Required

### 1. `src/app/globals.css`

```css
/* Change background from purple-black to pure black */
--background: #000000;  /* was #0f0a1a */

/* Update scrollbar colors from purple to gray */
scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);

/* Update selection colors from purple to gray */
::selection { background: rgba(255, 255, 255, 0.2); }
```

### 2. `src/lib/constants.ts`

Replace colorful gradients with neutral variations:

```typescript
export const SLIDE_GRADIENTS = {
  intro: 'from-black via-neutral-900 to-black',
  total_bridges: 'from-neutral-900 via-neutral-800 to-neutral-900',
  top_source: 'from-black to-neutral-900',
  top_destination: 'from-neutral-900 to-black',
  volume: 'from-black via-neutral-900 to-neutral-800',
  top_token: 'from-neutral-900 via-black to-neutral-900',
  busiest_day: 'from-neutral-800 via-neutral-900 to-black',
  avail_nexus: 'from-black via-neutral-900 to-black',
  summary: 'from-neutral-900 to-black',
};
```

### 3. Component Color Replacements

Find and replace across all components:

| Find | Replace With |
|------|--------------|
| `purple-600` | `white` or `neutral-200` |
| `purple-500` | `white` or `neutral-300` |
| `purple-400` | `neutral-400` |
| `pink-600` | `white` or `neutral-200` |
| `pink-500` | `neutral-300` |
| `from-purple-600 to-pink-600` | `bg-white text-black` (buttons) |
| `border-purple-500` | `border-white` or `border-neutral-400` |
| `text-purple-400` | `text-neutral-400` |
| `text-yellow-400` | `text-white` |
| `text-yellow-300` | `text-neutral-300` |

---

## Files to Update

| File | Changes |
|------|---------|
| `src/app/globals.css` | Background, scrollbar, selection colors |
| `src/lib/constants.ts` | SLIDE_GRADIENTS |
| `src/app/page.tsx` | Background gradient, button colors, title gradient |
| `src/components/ui/LoadingSpinner.tsx` | `border-purple-*` → `border-white` |
| `src/components/ui/StatCard.tsx` | `text-purple-400` → `text-neutral-400` |
| `src/components/wallet/ConnectButton.tsx` | Button gradient → solid white/gray |
| `src/components/wrapped/WrappedContainer.tsx` | Progress dots (keep white) |
| `src/components/wrapped/StatsSummary.tsx` | Chart gradients, accent colors |
| `src/components/wrapped/slides/*.tsx` | Text colors (most use white, minimal changes) |

**Special attention:**
- `UserClassSlide.tsx` - Replace golden border with white/gray gradient, neutralize stat bars
- `BusiestDaySlide.tsx` - Remove yellow accent color
- `SummarySlide.tsx` - Remove yellow accent, update card styling

---

## Decisions (Pre-made)

1. **Error states** - Keep red (`text-red-400`) for accessibility
2. **Charts** - Use grayscale gradient, rely on labels for differentiation
3. **User Class card** - White/gray border instead of golden gradient
4. **Chain colors** - Grayscale (accept reduced pie chart differentiation)

---

## Done When

- [ ] No purple, pink, violet, cyan, yellow visible in UI
- [ ] Build passes with no errors
- [ ] All text remains readable (white on dark backgrounds)
- [ ] App looks cohesive in grayscale aesthetic
