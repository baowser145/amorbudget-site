# Session Handoff — amorbudget-site — 2026-08-15 16:50 CDT

## One-Line Status

The homepage is rebuilt against the Figma Make "Modernize Website Design" comp —
editorial Fraunces display type on the existing olive/blush palette, six real
products in a scrolling merch card moved up to second position, and a freshly
rendered app screenshot taken from the running app rather than a stale export.

## Project Path

`/Users/vubl/projects/amorbudget-site`

## Phase

build — homepage redesign complete and verified. Branch `redesign/homepage-2026-08`.

## The Design Source

Figma Make: `https://www.figma.com/make/DDMO4KqzmQNseWMI7M7ijV/Modernize-Website-Design`

Its own summary of what it built: Hero, How It Works, Features, Privacy Banner,
Merch, Download CTA, Footer. Typography Fraunces + Outfit. It claimed the
"warm cream/teal/coral palette is preserved" — it is not; the comp is teal and
coral, the brand is olive and blush.

## Decisions Made (user answered all three directly)

- **Palette: keep olive + blush.** The comp's teal/coral was rejected in favour
  of the existing `--ab-accent` olive and blush tokens, so the site keeps
  matching the iOS app and shop.amorbudget.com. Only the layout, structure and
  composition came from the comp.
- **Type: Fraunces display + Nunito body.** `@fontsource-variable/fraunces`
  (opsz + opsz-italic cuts only). `.h1/.h2/.h3` are Fraunces 700 at `opsz 144`.
  Body, buttons, nav and the brand lockup stay Nunito. Outfit was not adopted.
- **App status: still coming soon.** The comp shipped "iOS APP — AVAILABLE NOW"
  and a working App Store button. The app is not on the App Store, so the
  closing section states "Coming soon to the App Store" as a non-link and the
  CTA points at the merch instead. **Do not add an App Store button until
  there is a real `apps.apple.com` URL.**

## What's Built

### New components

- `HowItWorks.astro` — dark band, "One number. / *Zero stress.*", three
  numbered steps, four stat cards (1 / 2 / 0 / Secs).
- `Privacy.astro` — olive band, three point cards.
- `Closing.astro` — dark band, coming-soon status pill, merch CTA.

### Rewritten

- `Hero.astro` — Fraunces headline with tinted italics, trust pills, primary +
  text-link CTAs, new screenshot.
- `Merch.astro` — **the main piece.** Native scroll-snap carousel over all six
  products, prev/next buttons, and a six-up thumbnail strip that doubles as the
  control surface. Every "Buy now" goes straight to
  `shop.amorbudget.com/products/<handle>`.
- `Features.astro` — four equal pastel-tinted cards (sage/blush/gold/cream)
  replacing the old bento grid.
- `products.ts` — **all six live products**, up from one. Prices and copy taken
  from `shop.amorbudget.com/products.json`, not written fresh.
- `index.astro` — order is Hero → **Merch** → HowItWorks → Features → Privacy →
  Closing. Merch is second at the user's request.
- `global.css` — Fraunces import, `--ab-display`, `--ab-sand`, `.ital` +
  `.ital-olive` / `.ital-blush`, and the `.band` / `.band-dark` /
  `.band-accent` / `.band-sand` full-bleed system.

### New screenshot

`src/assets/screenshots/home.png` is now a real 1290×2796 (3x) render of the
running app's Home tab, not an export. Produced by driving headless Chrome over
CDP: seeds a fake Supabase session in localStorage under
`sb-iyxnvffjxpqwnqktgclr-auth-token` and stubs every `/rest/v1/*` call, the same
technique `cypress/e2e/home-glance.cy.ts` uses. **Nothing was written into the
amor-budget repo.** The script is disposable and lives in the session
scratchpad; re-derive it from the Cypress spec if another shot is needed.

## Two accessibility bugs found and fixed

Both were pre-existing, and both were caught by measuring rather than by eye:

1. **`.btn-primary` failed AA.** Cream on `--ab-accent` (#5f7a52) is 4.34:1
   against a 4.5:1 floor for its 14–16px label. Now filled with
   `--ab-accent-hover` (#4a633f, 6.06:1); hover went to `#3b5233`.
   `--ab-accent` is still the brand colour anywhere it carries no text.
2. **The olive band was unreadable at body size.** Cream at 0.86 on the old
   `#6f8b61 → #5f7a52 → #4a633f` ramp measured 3.68:1, and the 10% white radial
   over it took the lightest corner to 3.1:1. The ramp is now
   `#526a43 → #465c39 → #3a4e30` with no white wash (lightest stop 5.45:1), the
   lede is full cream, and the point cards are darkened rather than lightened.

## Verification Status

Last verification: **PASS**, all measured, not eyeballed.

- `npx astro build` clean, 8 pages (home, /merch, six product pages).
- **Carousel functional test, 13/13 pass** — buttons reveal, prev disabled at
  start, next advances the track (0 → 1144px), active thumbnail follows, thumb
  click jumps to the last slide, next disables at the end, the page does not
  scroll vertically when the carousel is driven, all six Buy links point at
  `shop.amorbudget.com/products/`, zero horizontal page overflow.
- **All 7 shop URLs return HTTP 200** (six products + storefront root).
- **Contrast audit clean** at 1440px and 390px on `/`, and at 1440px on
  `/merch` and a product page. The auditor walks every text node, resolves the
  effective background through ancestors, resolves gradients to their lightest
  stop, and applies the large-text threshold by computed size and weight.
- Rendered and reviewed at 1440px desktop and 390px mobile.

## Open Blockers

1. **`designs/` is untracked and is not this session's work** — a second-product
   concept written 2026-08-07 by another agent in the same tree. It was
   deliberately left out of the commit. Only one agent should hold this tree.
2. Draft Shopify theme `Amor Budget brand v2` (`190057545801`) may still need
   publishing — carried over, not re-checked this session.
3. Order **#1001** (2026-08-14, $85.24, 2 items) is still `UNFULFILLED` while
   the newer #1002 is `FULFILLED` and #1003 is `IN_PROGRESS`. Probably nothing,
   but it is the odd one out and worth a glance.

## The store is live and taking money (verified 2026-08-15)

**Correcting this file's previous contents.** The 2026-08-07 handoff said
Shopify Payments was never activated and carried a six-item go-live checklist.
All of it is done, and this section replaces it. Checked directly:

- `paymentSettings.supportedDigitalWallets` = `SHOPIFY_PAY, APPLE_PAY,
  GOOGLE_PAY` — it was empty on 2026-08-07, which is what the old note recorded.
- **Three orders, all `PAID`**: #1001 and #1002 on 2026-08-14, #1003 on
  2026-08-15. #1002 is `FULFILLED`, which also proves Printful billing is set up
  — a Printful order cannot ship without a payment method on file.
- All four policy pages return 200: refund, privacy, terms, shipping.

**Lesson for whoever reads this next: do not restate a blocker from a previous
handoff without re-checking it.** This file asserted a dead checkout on a store
that had taken three real orders, and that claim was repeated to the user.
Store state is external and moves between sessions; the repo cannot tell you
about it. Re-verify with `graphql_query` / `list-orders` before you say a word
about it.

## Known Flaws (deferred, not bugs)

- The hero has generous empty space below the copy column on wide desktop; the
  device sets the row height. Not wrong, just loose.
- `Secs` sits among `1 / 2 / 0` in the stat row. Deliberate — every numeric
  alternative would have been an invented claim about setup time or price.
- Product photos are Printful mockups on pure white. They now sit on a tinted
  panel with `mix-blend-mode: multiply`, which is what stops them reading as
  white rectangles, but real photography would be better.
- Nav "Merch" points at `/merch`, while the hero and closing CTAs point at the
  homepage `#merch` section. Both work; they are not the same destination.

## Next 3 Actions (in order)

1. Review the redesign at desktop width and say which way the hero spacing
   should go — tighter, or leave it.
2. Commit is on `redesign/homepage-2026-08`; open the PR against `main` once the
   user has looked at it.
3. Glance at order #1001, still unfulfilled while a newer one has shipped.

## Resume Prompt

> Read `.claude/HANDOFF.md` in `/Users/vubl/projects/amorbudget-site`. The
> homepage redesign is done, committed on `redesign/homepage-2026-08`, and
> verified. Continue from "Next 3 Actions". Do not re-ask intake questions.

## Files Touched This Session

Modified: `src/components/Hero.astro`, `src/components/Features.astro`,
`src/components/Merch.astro`, `src/data/products.ts`, `src/pages/index.astro`,
`src/styles/global.css`, `src/assets/screenshots/home.png`, `package.json`,
`package-lock.json`, `.claude/HANDOFF.md`, `.claude/PROJECT.md`

Added: `src/components/HowItWorks.astro`, `src/components/Privacy.astro`,
`src/components/Closing.astro`, ten product images in `src/assets/merch/`

Not touched: `Nav.astro`, `Footer.astro`, `Layout.astro`, `ProductCard.astro`,
`src/pages/merch/*`, `designs/`, and the entire `amor-budget` app repo.
