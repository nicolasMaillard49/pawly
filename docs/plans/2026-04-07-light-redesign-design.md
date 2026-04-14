# ClipBag Light Redesign — Inspired by Actuscore

## Decision

Shift from dark theme to white minimalist sport design. Hero becomes a product block (gallery + details). Sections below stay as landing page. Mobile-first.

## Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#ffffff` | Page background |
| `surface` | `#f5f5f5` | Alternating sections, cards |
| `surface-dark` | `#101010` | Footer, OrderSection, navbar accent |
| `text` | `#101010` | Headings, body |
| `text-muted` | `#6b7280` | Subtitles, labels |
| `accent` | `#a9f955` | Primary CTA, badges, accents |
| `accent-hover` | `#96e040` | Button hover |
| `urgency` | `#d43a35` | Promo badges (-40%) |
| `border` | `rgba(16,16,16,0.12)` | Subtle borders |

## Typography

- **Font**: Barlow (Condensed for headings, Regular for body)
- **Headings**: 700 weight, uppercase, tracking -0.01em, line-height 1.1
- **Body**: 400/500 weight, 16px base, line-height 1.5
- **Mobile title**: min 2rem, scale up with clamp()

## Components

### Buttons
- Pill shape: `border-radius: 3.75rem`
- Primary: bg `#a9f955`, text `#101010`, bold
- Secondary: bg `#101010`, text white
- Hover: invert colors, 200ms transition
- Mobile: full-width, min 48px height touch target

### Cards
- bg white or `#f5f5f5`, border `rgba(16,16,16,0.12)`
- No heavy shadows — flat + subtle border
- rounded-2xl

### Badges
- Promo: bg `#d43a35`, text white, rounded-full
- Trust: icon + text, minimal style

## Page Structure

1. **Navbar** — white bg, black logo, pill CTA accent
2. **Hero = Product Block** — 2-col desktop (gallery | details), stacked mobile (image → title → price → CTA → trust)
3. **ExplanationSection** — video + steps, bg `#f5f5f5`
4. **ProblemSection** — bg white
5. **FeaturesSection** — cards, bg `#f5f5f5`
6. **GallerySection** — bg white
7. **TestimonialsSection** — bg `#f5f5f5`
8. **SocialVideoSection** — bg white
9. **OrderSection** — bg `#101010` (dark contrast block)
10. **FaqSection** — bg white
11. **Footer** — bg `#101010`

## Mobile-First Priorities

- All layouts stacked by default, grid only at `sm:` / `lg:`
- Touch targets min 44x44px
- Title sizes: `text-2xl` mobile → `text-5xl` desktop via clamp
- Full-width CTAs on mobile
- Reduced spacing on mobile (py-12 vs py-24 desktop)
- Images: object-contain, no cropping
- Steps 1-2-3: always single column on mobile

## Animations

- Scroll-triggered: translateY(24px)→0, 700ms, cubic-bezier(0.16,1,0.3,1)
- Hero: immediate render, no entrance animation (product speaks)
- Hover buttons: color inversion 200ms
- Stagger on cards: 100ms increments
- prefers-reduced-motion respected

## Files to Modify

- `tailwind.config.ts` — new color tokens, Barlow font
- `nuxt.config.ts` — Google Fonts link (Barlow + Barlow Condensed)
- `assets/css/main.css` — remove dark base styles, add light theme, remove Horizon font-face
- `HeroSection.vue` — complete rewrite as product block
- `ExplanationSection.vue` — light theme
- `ProblemSection.vue` — light theme
- `FeaturesSection.vue` — light theme
- `GallerySection.vue` — light theme
- `TestimonialsSection.vue` — light theme
- `SocialVideoSection.vue` — light theme
- `OrderSection.vue` — dark contrast block
- `FaqSection.vue` — light theme
- `SiteNavbar.vue` — white bg
- `SiteFooter.vue` — dark bg
- `LiveViewers.vue` — adapt to light
- `PurchaseNotification.vue` — adapt to light
- `pages/index.vue` — floating CTA update
