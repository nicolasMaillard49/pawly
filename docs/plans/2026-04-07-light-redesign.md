# ClipBag Light Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the dark-theme ClipBag landing page into a white minimalist sport design inspired by Actuscore, mobile-first.

**Architecture:** Swap Tailwind color tokens from dark to light palette. Rewrite HeroSection as a product block (gallery + details). Alternate white/gray sections. OrderSection + Footer stay dark for contrast.

**Tech Stack:** Nuxt 3, Vue 3, Tailwind CSS, Barlow font (Google Fonts)

---

### Task 1: Tailwind Config + Fonts + CSS Base

**Files:**
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/nuxt.config.ts`
- Modify: `frontend/assets/css/main.css`

**Step 1: Update tailwind.config.ts with new light palette**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#a9f955',
          hover: '#96e040',
          dark: '#7ec832',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f5f5f5',
          dark: '#101010',
          darker: '#0a0a0a',
        },
        text: {
          DEFAULT: '#101010',
          muted: '#6b7280',
          inverse: '#ffffff',
        },
        urgency: {
          DEFAULT: '#d43a35',
          light: '#e85550',
        },
        border: {
          DEFAULT: 'rgba(16,16,16,0.12)',
          strong: 'rgba(16,16,16,0.24)',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '3.75rem',
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(16,16,16,0.06)',
        card: '0 4px 16px rgba(16,16,16,0.08)',
      },
    },
  },
} satisfies Config
```

**Step 2: Update nuxt.config.ts Google Fonts link**

Replace the current font link with:
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700;800&display=swap
```

Remove Horizon font references. Update `theme-color` meta to `#ffffff`.

**Step 3: Rewrite main.css base layer**

- Remove `@font-face` for Horizon/HorizonOutlined
- Remove `liquid-glass`, `btn-neon` component classes
- Change `body` from `bg-surface text-white` to `bg-surface text-text`
- Change `::selection` from `bg-brand/30 text-white` to `bg-accent/30 text-text`
- Update scrollbar colors to light theme
- Keep all scroll animation utilities but update color references (`brand` → `accent`)
- Update `pulse-glow` keyframe colors from `rgba(16, 185, 129, ...)` to `rgba(169, 249, 85, ...)`

**Step 4: Commit**

```
feat: switch to light theme palette, Barlow font, Actuscore-inspired tokens
```

---

### Task 2: SiteNavbar — White Background

**Files:**
- Modify: `frontend/components/SiteNavbar.vue`

**Changes:**
- Root: `bg-white/80 backdrop-blur-lg border-b border-border` (scrolled state)
- Logo: `text-text font-display font-bold uppercase`
- Nav links: `text-text-muted hover:text-text`
- CTA button: `bg-accent text-text font-display font-bold rounded-pill px-6 py-2.5 hover:bg-accent-hover`
- Mobile menu: `bg-white` instead of dark surface
- Mobile CTA: same accent pill style
- Remove all `bg-surface`, `text-white`, `border-surface-lighter`, `btn-neon` references

**Step: Commit**
```
feat: navbar white theme with accent pill CTA
```

---

### Task 3: HeroSection — Product Block (biggest change)

**Files:**
- Modify: `frontend/components/HeroSection.vue`

**New structure (mobile-first):**

```
MOBILE (stacked):
  [Product Image — full width, rounded-2xl, object-contain]
  [Badge: -40% urgency]
  [H1: font-display uppercase text-3xl]
  [Stars + reviews count]
  [Price: old barré + new big + badge -40%]
  [Pack selector: Solo/Duo/Equipe pills]
  [CTA: COMMANDER — full width accent pill]
  [Trust badges: 3 cols icons]

DESKTOP (2-col at lg:):
  LEFT: Product image gallery (main + thumbnails)
  RIGHT: All text content + CTA
```

**Key classes:**
- Section: `bg-white pt-24 pb-12 sm:pt-32 sm:pb-20`
- H1: `font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-text leading-[1.1]`
- Price current: `font-display font-bold text-3xl sm:text-4xl text-text`
- Price old: `font-display text-text-muted line-through text-lg`
- Badge -40%: `bg-urgency text-white text-sm font-bold px-3 py-1 rounded-full`
- CTA: `w-full lg:w-auto bg-accent hover:bg-accent-hover text-text font-display font-bold text-lg uppercase tracking-wider py-4 px-10 rounded-pill`
- Trust: `text-text-muted text-sm` with simple SVG icons

**Remove:** particles, parallax, glow divs, grid pattern SVG, gradient text effect on "Encombrées". Keep it clean and minimal.

**Step: Commit**
```
feat: hero as product block — gallery + details, mobile-first
```

---

### Task 4: ExplanationSection — Light Theme

**Files:**
- Modify: `frontend/components/ExplanationSection.vue`

**Changes:**
- Section bg: `bg-surface-alt` (#f5f5f5)
- All `text-white` → `text-text`
- All `text-gray-400` → `text-text-muted`
- All `text-brand` → `text-accent-dark` or `text-text`
- Step number badges: `bg-accent/20 text-text` with `border border-accent/30`
- Video container: `border-border` instead of `border-surface-lighter`
- Video controls bar: `bg-white border-t border-border`
- Remove glow divs

**Step: Commit**
```
feat: explanation section light theme
```

---

### Task 5: ProblemSection — Light Theme

**Files:**
- Modify: `frontend/components/ProblemSection.vue`

**Changes:**
- Section bg: `bg-white`
- Card: `bg-surface-alt border border-border rounded-3xl`
- "Sans ClipBag" column: `bg-urgency/5` header
- "Avec ClipBag" column: `bg-accent/10` header
- Text colors: `text-text`, `text-text-muted`
- Check/cross icons: keep green/red but adjust for light bg
- Remove glow divs

**Step: Commit**
```
feat: problem section light theme
```

---

### Task 6: FeaturesSection — Light Theme

**Files:**
- Modify: `frontend/components/FeaturesSection.vue`

**Changes:**
- Section bg: `bg-surface-alt`
- Cards: `bg-white border border-border rounded-2xl hover:border-accent/40 hover:shadow-card`
- Card number: `text-surface-alt` large background number
- Heading: `text-text`
- Description: `text-text-muted`
- Remove glow divs, simplify hover effects

**Step: Commit**
```
feat: features section light theme
```

---

### Task 7: GallerySection — Light Theme

**Files:**
- Modify: `frontend/components/GallerySection.vue`

**Changes:**
- Section bg: `bg-white`
- All dark text/bg references → light equivalents
- Image borders: `border border-border rounded-2xl`

**Step: Commit**
```
feat: gallery section light theme
```

---

### Task 8: TestimonialsSection — Light Theme

**Files:**
- Modify: `frontend/components/TestimonialsSection.vue`

**Changes:**
- Section bg: `bg-surface-alt`
- Cards: `bg-white border border-border rounded-2xl`
- Name: `text-text font-bold`
- Review text: `text-text-muted`
- Stars: keep `text-yellow-400`
- Remove all hardcoded `rgba(34, 197, 94, ...)` → use accent tokens
- Remove glow divs

**Step: Commit**
```
feat: testimonials section light theme
```

---

### Task 9: SocialVideoSection — Light Theme

**Files:**
- Modify: `frontend/components/SocialVideoSection.vue`

**Changes:**
- Section bg: `bg-white`
- All dark references → light
- Video cards: `bg-surface-alt border border-border rounded-2xl`

**Step: Commit**
```
feat: social video section light theme
```

---

### Task 10: OrderSection — Dark Contrast Block

**Files:**
- Modify: `frontend/components/OrderSection.vue`

**Changes:**
- Section bg: `bg-surface-dark` (#101010) — this stays dark for contrast
- Text: `text-white`, `text-gray-400` — keep current dark theme text
- CTA button: `bg-accent text-text font-bold rounded-pill` (accent pops on dark)
- Pack cards: `bg-white/10 border border-white/20` (glass on dark)
- Inputs: `bg-white/10 border border-white/20 text-white`
- Trust badges: `text-gray-400` with white icons
- Remove countdown timer (clean minimal approach)
- Price: `text-white` big, old price `text-gray-500 line-through`
- Savings badge: `bg-accent/20 text-accent`

**Step: Commit**
```
feat: order section as dark contrast block with accent CTA
```

---

### Task 11: FaqSection — Light Theme

**Files:**
- Modify: `frontend/components/FaqSection.vue`

**Changes:**
- Section bg: `bg-white`
- Accordion items: `bg-surface-alt border border-border rounded-2xl`
- Open state: `border-accent/30`
- Question text: `text-text`
- Answer text: `text-text-muted`
- Remove glow divs

**Step: Commit**
```
feat: faq section light theme
```

---

### Task 12: SiteFooter — Dark Footer

**Files:**
- Modify: `frontend/components/SiteFooter.vue`

**Changes:**
- Keep dark: `bg-surface-dark text-gray-400`
- Logo: `text-white font-display font-bold`
- Links: `text-gray-400 hover:text-white`
- Border: `border-white/10`
- Accent links: `text-accent`
- Remove glow divs

**Step: Commit**
```
feat: footer dark theme with accent links
```

---

### Task 13: Utility Components — Light Adaptation

**Files:**
- Modify: `frontend/components/LiveViewers.vue`
- Modify: `frontend/components/PurchaseNotification.vue`
- Modify: `frontend/pages/index.vue`

**LiveViewers:**
- Container: `bg-surface-alt/80 border border-border rounded-full`
- Dot: `bg-accent` (was `bg-green-500`)
- Text: `text-text-muted` label, `text-text` count

**PurchaseNotification:**
- Toast: `bg-white border border-border shadow-card rounded-2xl`
- Accent bar: `bg-accent`
- Text: `text-text` name, `text-text-muted` description

**index.vue floating CTA:**
- Button: `bg-accent text-text font-display font-bold rounded-pill`

**Step: Commit**
```
feat: utility components adapted to light theme
```

---

### Task 14: Final Review + Cache Clear

- Clear cache: `rm -rf frontend/.nuxt frontend/.output frontend/node_modules/.cache frontend/node_modules/.vite`
- Restart dev server
- Visual review on mobile (375px) and desktop (1440px)
- Fix any remaining dark-theme artifacts
- Verify all text has sufficient contrast on white bg (4.5:1 minimum)

**Step: Commit**
```
fix: final light theme polish and contrast fixes
```
