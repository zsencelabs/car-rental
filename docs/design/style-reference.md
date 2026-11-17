# Visual style reference

- **Status:** Applied in `apps/web` (see `apps/web/src/app/globals.css`)
- **Source:** the client's existing site, https://vehicle-rental-management-system.b12sites.com/ ("KAIYA Rentals | Find your way"), inspected 2026-11-18
- **Method:** read the site's compiled stylesheet (`/_astro/index.*.css`) and the homepage HTML. Values below are copied from it, not estimated from screenshots.
- **Scope:** colors, typography, radius and overall feel only. Don't copy the site's markup, copy text, images or other assets.

## Overall feel
Calm and premium: warm off-white backgrounds, deep forest-green primary, soft sage tints, generous whitespace, rounded cards, and a large tight-tracked headline with an italic serif accent phrase (for example "Find your way. *We'll find the car.*").

## Color tokens
The site already uses shadcn/ui-style token names, which match our planned Tailwind CSS + shadcn/ui stack. These can be pasted into the `:root` theme in `globals.css` later.

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(98% 0.012 84)` | Page background: warm cream |
| `--foreground` | `oklch(25% 0.025 161)` | Main text: very dark green-gray |
| `--card` | `oklch(100% 0 0)` | Card surface: white |
| `--card-foreground` | `oklch(25% 0.025 161)` | |
| `--primary` | `oklch(37% 0.065 158)` | Buttons, links, brand: forest green (≈ `#315c44`) |
| `--primary-foreground` | `oklch(98.5% 0.004 84)` | Text on primary |
| `--secondary` | `oklch(95% 0.02 145)` | Pale sage surfaces |
| `--secondary-foreground` | `oklch(32% 0.045 158)` | |
| `--accent` | `oklch(93% 0.038 145)` | Highlight / hover tint |
| `--accent-foreground` | `oklch(31% 0.05 158)` | |
| `--muted` | `oklch(96% 0.012 84)` | Muted section background (warm) |
| `--muted-foreground` | `oklch(55% 0.025 161)` | Secondary text |
| `--border`, `--input` | `oklch(90% 0.016 154)` | Hairlines, inputs |
| `--ring` | `oklch(57% 0.078 158)` | Focus ring |
| `--destructive` | `oklch(55% 0.18 27)` | Errors |
| `--sidebar-accent` | `oklch(94% 0.026 148)` | Admin sidebar active item |

Literal hex colors also used on the site:

| Hex | Use on the site |
|---|---|
| `#315c44` | Primary green (most-used brand hex) |
| `#63866c` | Italic serif accent words in the hero headline |
| `#748078` | Hero paragraph text |
| `#3a4c40`, `#536157` | Dark text variants |
| `#edf0eb`, `#f0f2ef`, `#e8ece6` | Light sage panels and dividers |
| `#f4efdf`, `#fbfaf6` | Warm cream panels |
| `#ffffff` | Cards |

## Typography
- **Body / UI:** `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. With Next.js, load Inter via `next/font/google`.
- **Accent serif:** `Georgia, serif`, weight 400, italic, used only for an emphasized phrase inside headings (`h1 em`) in `#63866c`.
- **Hero h1:** weight 600, `font-size: clamp(43px, 5vw, 65px)`, `letter-spacing: -3px`, `line-height: 0.99`.
- **Hero paragraph:** 14px, `line-height: 1.8`, `#748078`, max-width about 475px.
- **Weights in use:** 400, 500, 600, 700.

## Shape
- `--radius: 0.8rem` (≈ 13px). The derived sizes are sm = radius − 4px, md = radius − 2px, lg = radius, xl = radius + 4px.

## Dark mode
The client site is **light-only** (`color-scheme: light`). Whether our product needs dark mode is an open question (requirements analysis Q31). If it does, derive dark tokens from the same hues (158/145/84) instead of inventing new brand colors.

## Accessibility notes
- **Applied deviation (2026-11-18):** in the web app, `--muted-foreground` is `oklch(48% 0.025 161)` instead of the site's 55%, so secondary text meets WCAG AA on the cream background. The reference site also uses 8–10px text in places; the web app uses a 12px minimum.
- Check contrast before use. `--muted-foreground` on `--background` and `#748078` on cream are mid-gray-green, so verify they reach WCAG AA (4.5:1) for body text at 14px.
- Keep the green focus ring (`--ring`) visible on all interactive elements.

## Open questions
- ~~Is "KAIYA Rentals" the product name?~~ Confirmed 2026-11-18. The logo mark is still a placeholder "K" tile.
- Should the admin and provider dashboards use the same palette, or a more neutral variant?
