# Amor Budget merch — first shirt via Printify

**Date:** 2026-08-06
**Status:** Approved for planning

## Goal

Sell one shirt carrying the Amor Budget logo, at zero fixed cost, linked from the
Merch section of amorbudget.com.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Storefront | Printify Pop-Up Store (free) | No monthly fee, no listing or transaction fees. Shopify Basic is $39/mo — roughly 40-50 shirts a year just to break even before the first dollar of profit. Prove demand first. |
| Brand | Amor Budget | The shirt is the app logo; the store should match. LGTM is parked for a possible later dev-humor line. |
| Garment | Bella+Canvas 3001, forest green | Printify's most common tee, and the one the 4500x5400 print spec is sized around. Green garment reproduces the app icon's look without printing a background box. |
| Artwork source | Rebuilt as SVG | The only existing logo is a 1024px PNG — about 100 DPI at full-front print size, too soft. The mark is pure geometry, so a vector rebuild is both feasible and reusable. |

## Artwork

Rebuild the heart-piggy-bank mark as clean SVG:

- Cream heart body (`#F2F0E4`-family, sampled from the source PNG)
- Gold coin with its concentric rings, overlapping the heart's top notch
- Rounded-rectangle coin slot, knocked out to the garment color

Drop the green square background. A printed background box reads as a sticker
stuck to the shirt rather than a design on it.

**Deliverables:**

- `src/assets/logo.svg` — the vector mark, transparent, no background square
- Print file: transparent PNG, 4500x5400px, 300 DPI, RGB (not CMYK — Printify's
  providers convert internally)
- `public/favicon.svg` — currently still Astro's stock icon; replace with the
  real mark

**Fidelity bar:** the rebuilt SVG rendered at 1024px should be visually
indistinguishable from `src/assets/app-icon.png` at normal viewing size.
Verify by rendering and comparing side by side, not by eyeballing the code.

## Site changes

`src/data/site.ts`:

- `shop.url` — the live `.printify.me` URL
- `shop.brand` — `LGTM` becomes `Amor Budget`
- `shop.label` — `Shop LGTM` becomes `Shop merch`
- `shop.blurb` — rewrite; currently references LGTM as a separate crew

`Merch.astro` needs no logic change. It already reads `hasShopUrl()` and flips
from the "coming soon" mailto state to a live shop button. That conditional is
the entire mechanism.

## Division of labor

**Claude:** SVG rebuild, print-ready PNG export, product title/description copy,
all `site.ts` edits, favicon replacement, build verification.

**User:** Create the Printify account (email verification), create the Pop-Up
Store, upload the print file, set the retail price, publish, hand back the live
URL. Payment and payout details are the user's alone.

The handoff point is the `.printify.me` URL. Everything on the Claude side can be
finished before the account exists; only the final `shop.url` value waits on it.

## Out of scope

- Shopify (revisit only if the shirt sells)
- More than one product or colorway
- Custom domain for the store — Pop-Up Stores use `*.printify.me`
- Payment, tax, or payout configuration

## Acceptance criteria

1. `src/assets/logo.svg` exists, renders identically to the app icon, has no
   background square.
2. Print file is 4500x5400px, 300 DPI, RGB, with a genuinely transparent
   background (verified, not assumed).
3. `npm run build` passes.
4. With `shop.url` empty, Merch still shows the "coming soon" state; with a URL
   set, it shows the live shop button pointing at that URL. Both states checked.
5. No remaining "LGTM" references in user-visible site copy.
