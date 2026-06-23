---
name: rustic-pizzeria-design
description: Design system for an authentic, handcrafted small pizzeria website. Use when editing styles, colors, fonts, components, or pages for the Sare și Piper pizza place. Covers rustic earthy palette, chunky + handwritten typography, stamp/badge UI, and anti-AI design principles.
---

# Rustic Pizzeria Design System

A design language for **Sare și Piper** — a small, family-run pizzeria at the exit of the city. The site must feel like a real place a local built, not a template an AI stamped out.

## Core principle: anti-AI aesthetic

AI-generated sites share telltale signs. **Avoid all of them:**

| AI tell (avoid)                    | Rustic pizzeria (use instead)                          |
| ---------------------------------- | ----------------------------------------------------- |
| Perfect vertical centering         | Asymmetric, editorial layouts                         |
| Purple/indigo gradients            | Earthy flat colors: terracotta, cream, olive, char    |
| Glassmorphism + blur               | Opaque paper/wood textures, solid cards               |
| Inter/Geist everywhere             | Mix a chunky display + handwritten + humanist sans    |
| `rounded-2xl` on everything        | Mixed radii: sharp images, pill buttons, stamp circles|
| Outline icons in rounded squares   | Hand-drawn SVGs, stamps, badges, crossed-utensils     |
| "Elevate your experience" copy     | Honest, casual, local voice — "Vino, ești la casa noastră" |
| Symmetric 3-card feature grids     | Bento, editorial, one-big-image layouts               |
| Subtle fade-in on every element    | Motion only where it earns it (hero, menu reveal)     |
| Generic stock-photo gradients      | Real food colors, warm shadows, charcoal edges         |

## Color palette

Italian flag inspired — green, white, red. Minimalist, clean, food-honest.

```
--color-rosso:    #CD212A   /* Italian red — primary accent, prices, CTAs */
--color-rosso-dark: #B01B22
--color-rosso-light: #E0353E
--color-verde:    #008C45   /* Italian green — secondary accent, hours, tags */
--color-verde-dark: #00733A
--color-verde-light: #1AA557
--color-bianco:   #FAF9F6   /* warm white background */
--color-bianco-card: #FFFFFF /* cards, raised surfaces */
--color-carbone:  #1A1A1A   /* near-black — text + dark sections */
--color-cenere:   #7A7773   /* muted text */
--color-bordo:    #E5E3DF   /* warm border */
```

Use `bg-bianco` for the page, `bg-carbone` for dark sections (menu hero, featured, footer), `text-rosso` for prices and CTAs, `text-verde` for hours and secondary accents. The wordmark uses all three: **Sare** (carbone/bianco) + **ș** (verde) + **i** (carbone/bianco) + **Piper** (rosso) — the Italian flag in a word.

**Wordmark component**: `src/components/wordmark.tsx` — `<Wordmark variant="light|dark" />`. Use `variant="light"` on dark backgrounds, `variant="dark"` on light.

## Typography

Three families, each with a job. Loaded via `next/font/google` in `layout.tsx`.

| Role        | Font             | CSS var         | Usage                                  |
| ----------- | ---------------- | --------------- | -------------------------------------- |
| Display     | **Anton**        | `--font-display`| H1/H2, prices, section titles. ALL CAPS, tight tracking. Pizzeria-sign energy. |
| Handwritten | **Caveat**       | `--font-script` | Personal accents: "Vino la noi", signature, small notes. Never for body. |
| Body        | **DM Sans**      | `--font-body`   | Everything else: paragraphs, labels, buttons, menu descriptions. |

Rules:
- Display is ALL CAPS with `tracking-tight`. Never use it for long text.
- Script appears 1–3 times per page max — it's the human signature.
- Body stays at 16px+ for readability. Use `font-medium` for labels.
- No `font-display` on buttons (use body). No gradient text anywhere.

## Shapes & surfaces

- Images: **sharp corners** (`rounded-none` or `rounded-sm`). Food photos look honest unframed.
- Buttons: **pill** (`rounded-full`). One shape for all CTAs.
- Cards: `rounded-lg` (8px), `border-2 border-charcoal/10`, solid `bg-cream-light`, no shadow by default. On hover: `border-tomato/30` + slight `-translate-y-0.5`.
- Stamps/badges: **circles** with a 2px dashed or solid `border-tomato`. Rotated -2°/+2° for hand-stamped feel.
- Dark sections use `bg-charcoal` with `text-cream` and `text-mustard` accents — like a chalkboard menu.

## Motion

Motion is rare and earned. No staggered fade-ins on every card.

- Hero: one scale/opacity in on mount. Done.
- Menu categories: subtle hover lift (translate-y -2px), no entrance animation.
- Menu items: reveal on scroll only for the first viewport, then static.
- `prefers-reduced-motion`: disable everything, show content immediately.

## Layout patterns

- **Hero**: left-aligned, big ALL-CAPS headline, a handwritten tagline underneath, one food photo on the right (or full-bleed on mobile). Not centered. Not a gradient.
- **Menu categories**: a wrap of circular stamp-tiles, each with an icon + label. Like a menu board, not a feature grid.
- **Menu items**: a list, not cards. Name · dotted leader · price. Like a printed menu. Optional small thumbnail.
- **Location**: a real map with a hand-drawn "you are here" marker vibe. Address in a stamped box. Hours as a chalkboard list.
- **Footer**: dark charcoal, chalkboard feel. Hours, address, phone, Instagram. A handwritten "Vino pe la noi" sign-off.

## Voice & copy

Romanian, casual `tu` form. Short, honest, local.

- ✅ "Pizza fierbinte, ieși din oraș, intra la noi."
- ✅ "Făcut cu aluat de cu seară."
- ✅ "Ne găsești la ieșire. Parcare e liberă."
- ❌ "Descoperă o experiență culinară de neuitat."
- ❌ "Specialitățile casei noastre..."
- ❌ "Bucătărie premium cu ingrediente proaspete."

Prices in MDL, no decimals for round numbers. Portions in grams, honest.

## Components to use

- `Button` — pill, `bg-tomato text-cream` or outline `border-2 border-charcoal text-charcoal`.
- `Badge`/stamp — circle, dashed border, rotated, for "Nou", "Picant", veggie marks.
- `Section` — plain, no decorative borders. Just spacing + an ALL-CAPS title + a handwritten subtitle.
- Cards — solid cream, thin warm border, sharp image on top, no glass, no blur.

## Files that implement this

- `src/app/globals.css` — palette, font vars, base styles, stamp/card utilities.
- `src/app/layout.tsx` — loads Anton, Caveat, DM Sans via next/font.
- `src/components/sections/hero.tsx` — asymmetric hero.
- `src/components/sections/menu-categories.tsx` — stamp tiles.
- `src/components/layout/header.tsx` + `footer.tsx` — chalkboard/sign vibe.

When editing any of these, re-read this skill first.
