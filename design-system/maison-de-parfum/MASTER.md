# Design System Master File — Maison de Parfum

> **LOGIC:** When building a specific page, first check `design-system/maison-de-parfum/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Maison de Parfum
**Category:** Luxury Haute Parfumerie E-commerce
**Design Language:** Light Luxury Editorial + Quiet Sophistication + Modern French-Inspired Minimalism
**Design Dials:** Variance 2/10 (Centered / Minimal) | Motion 3/10 (Subtle) | Density 2/10 (Spacious)

---

## CRITICAL DESIGN RULES

- The website is ALWAYS LIGHT — never dark, never neon, never cyberpunk
- Light luxury editorial is the only visual language
- When in doubt: choose elegant & restrained over "more impressive"
- When in doubt: choose typography + whitespace over effects
- DO NOT apply dark mode, glassmorphism-heavy, neon, or futuristic styles

---

## LOCKED COLOR SYSTEM

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | #0C134F (Cosmic Navy) | --color-primary | Primary buttons, headings, nav, footer, editorial |
| On Primary | #FFFFFF | --color-on-primary | Text on navy backgrounds |
| Secondary | #D4ADFC (Pastel Violet) | --color-secondary | Badges, highlights, selected states (sparingly) |
| On Secondary | #0C134F | --color-on-secondary | Text on violet backgrounds |
| Background | #FBF9F5 (Soft Ivory) | --color-background | Main page background (60%) |
| Surface | #FFFFFF (White) | --color-surface | Card backgrounds, panels |
| Foreground | #121735 (Deep Text) | --color-foreground | Primary text, headlines |
| Foreground Muted | #6B6F80 (Muted Text) | --color-foreground-muted | Secondary text, captions |
| Foreground Subtle | #9DA1B3 | --color-foreground-subtle | Placeholder, decorative text |
| Border | #E6E2EA (Soft Border) | --color-border | Dividers, card borders |
| Border Strong | #C9C5D0 | --color-border-strong | Input outlines |
| Accent | #C5A880 (Muted Champagne) | --color-accent | Restrained luxury accent |
| Destructive | #DC2626 | --color-destructive | Error states |

### Color Balance
60% — Soft Ivory (#FBF9F5) + White (#FFFFFF)
20% — Cosmic Navy (#0C134F)
15% — Pastel Violet (#D4ADFC) — use sparingly, never dominant
 5% — Muted Champagne (#C5A880) — restrained luxury accent

### Color Rules
- Navy for: primary CTA buttons, main headings, footer, nav accents
- Violet for: badges, tag highlights, selected states ONLY
- Champagne for: decorative lines/dots, small accents
- NO purple gradients | NO blue gradients | NO dark backgrounds
- Do NOT make violet the dominant color
- Do NOT use black backgrounds anywhere

---

## TYPOGRAPHY (LOCKED)

| Role | Font |
|------|------|
| Display / Editorial | Cormorant Garamond (serif) |
| UI / Body | Plus Jakarta Sans (sans-serif) |

### next/font/google Setup
```ts
// src/lib/fonts.ts
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});
```

### Usage
- Cormorant Garamond: hero headlines, product names, editorial headlines
- Plus Jakarta Sans: navigation, body, buttons, labels, forms, prices
- Generous line-height and whitespace
- Avoid excessive font weights

### Type Scale
| Token | Size | Weight | Line-height | Usage |
|-------|------|--------|-------------|-------|
| text-hero | 64-80px | 300-400 | 1.05 | Hero headlines |
| text-h1 | 48-56px | 400 | 1.1 | Section h1 |
| text-h2 | 36-44px | 400 | 1.15 | Section headlines |
| text-h3 | 24-30px | 400-500 | 1.2 | Card titles |
| text-lg | 18-20px | 300-400 | 1.6 | Lead/subtitle |
| text-base | 16px | 400 | 1.65 | Body text |
| text-sm | 14px | 400-500 | 1.5 | Labels, captions |
| text-xs | 11-12px | 500-600 | 1.4 | Eyebrows, tracking |

---

## SPACING SYSTEM (SPACIOUS / LUXURY)

| Token | Value | Usage |
|-------|-------|-------|
| --space-xs | 4px | Tight inline gaps |
| --space-sm | 8px | Icon gaps |
| --space-md | 24px | Standard padding |
| --space-lg | 48px | Section padding |
| --space-xl | 64px | Large section gaps |
| --space-2xl | 96px | Hero padding |
| --space-3xl | 128px | Full-bleed margins |

---

## COMPONENT SPECS

### Primary Button — Cosmic Navy
background: #0C134F | color: #FFFFFF | border: 1px solid #0C134F
padding: 14px 32px | border-radius: 2px (sharp — luxury feel)
font: Plus Jakarta Sans | font-size: 11px | font-weight: 500
letter-spacing: 0.18em | text-transform: uppercase
transition: all 200ms ease
hover: background #121735 | border-color #121735

### Secondary Button — Transparent/Ivory
background: transparent | color: #0C134F | border: 1px solid #0C134F
padding: 14px 32px | border-radius: 2px
Same font specs as primary
hover: background #0C134F | color #FFFFFF

### Product Card — Luxury Fragrance Object
background: #FFFFFF | border: 1px solid #E6E2EA
transition: all 300ms ease
hover: border-color #C5A880 | box-shadow: 0 4px 20px rgba(12,19,79,0.06)
NO heavy glassmorphism | NO neon | NO glowing borders
NO heavy rounding (max border-radius: 4px)

### Input Fields
padding: 12px 16px | border: 1px solid #E6E2EA | background: #FFFFFF
font: Plus Jakarta Sans 14px | color: #121735
focus: border-color #0C134F | box-shadow: 0 0 0 2px rgba(12,19,79,0.08)

### Shadow Scale
--shadow-subtle:  0 1px 3px rgba(18,23,53,0.04)
--shadow-card:    0 2px 8px rgba(18,23,53,0.06)
--shadow-hover:   0 4px 20px rgba(18,23,53,0.08)
--shadow-modal:   0 16px 40px rgba(18,23,53,0.12)

---

## ANIMATION / MOTION

Philosophy: Subtle, expensive, restrained — feels like luxury editorial magazine.

| Effect | Duration | Easing | Use For |
|--------|----------|--------|---------|
| Fade In | 600-800ms | ease-out | Section entrances |
| Fade In Up | 700ms | [0.22,1,0.36,1] | Content stagger |
| Image Reveal | 900ms | [0.25,1,0.5,1] | Hero visuals |
| Hover Scale | 250ms | ease | Product images |
| Stagger delay | 120ms | ease-out | Grid cards |

Framer Motion variants are in @/lib/motion.ts
Viewport: { once: true, amount: 0.15 }
ALWAYS respect prefers-reduced-motion

Motion DO:
- Fade, gentle translate-Y (12-24px max), image reveal, soft hover scale
- Staggered card entrances on scroll

Motion DON'T:
- Neon glow | Pulsing | Aggressive bouncing | Excessive transitions
- Continuous/infinite animations
- translate-Y > 24px

---

## HERO SECTIONS

- Background: Soft Ivory #FBF9F5 — ALWAYS LIGHT
- Typography: Cosmic Navy #0C134F
- Headline: Cormorant Garamond, large, generous letter-spacing
- Photography may have dark backgrounds (product shots) — UI itself is always light
- Restrained Pastel Violet/Champagne as eyebrow accents only
- One strong editorial headline
- Two CTAs: Primary (Navy) + Secondary (Transparent)

---

## MOBILE-FIRST (320px-390px)

- Generous but practical spacing
- Body text min 16px
- Primary CTA full-width on mobile
- No horizontal overflow
- Product imagery prominent
- Simple hamburger nav
- Touch targets min 44px

---

## ABSOLUTELY FORBIDDEN

- Dark website theme
- Black backgrounds
- Neon colors or neon duotone
- Cyberpunk styling
- Purple gradients or blue gradients
- Heavy glassmorphism or excessive transparency
- Glowing borders or glowing buttons
- Excessive shadows
- Heavily rounded product cards (border-radius > 8px)
- Generic SaaS dashboard styling
- Futuristic UI or gaming UI
- Emojis as icons (use Lucide SVGs)
- Missing cursor:pointer on clickable elements
- Low contrast text (minimum 4.5:1)
- Missing focus states or hover transitions
- Ignoring prefers-reduced-motion

---

## PRE-DELIVERY CHECKLIST

- [ ] Website theme is LIGHT — no dark backgrounds
- [ ] Colors match locked system (Navy/Violet/Ivory/Champagne)
- [ ] Fonts: Cormorant Garamond (display) + Plus Jakarta Sans (UI)
- [ ] No emojis as icons — SVG only (Lucide icons)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (200-300ms)
- [ ] Text contrast >= 4.5:1 (light mode)
- [ ] Focus states visible for keyboard navigation
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Product images use next/image component
- [ ] Fonts loaded via next/font/google (zero layout shift)

---

## STACK

Next.js 15 + React 19 + Tailwind CSS + Framer Motion + Lucide React

- Images: next/image (never img tags)
- Fonts: next/font/google (never link Google Fonts)
- Animations: Framer Motion (@/lib/motion.ts variants)
- Icons: lucide-react
- Loading UI: loading.tsx alongside page.tsx

---

This design system is the single source of truth for Maison de Parfum UI/UX.
All components, pages, and features must respect these rules.
