# Amor Budget merch — first shirt via Printify

**Date:** 2026-08-06
**Status:** Approved for planning

## Goal

Sell one shirt carrying the Amor Budget logo through a Shopify store fulfilled by
Printify, linked from the Merch section of amorbudget.com.

## Cost note

Basic is $39/mo after the promotional period. At typical print-on-demand margins
that is roughly 40-50 shirts a year before the store clears its own subscription.
Flagged, and the user has chosen to proceed. Revisit if the shirt does not sell
by the time full pricing kicks in.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Storefront | Shopify Basic + Printify app | User's decision. Real storefront and product pages, room to grow. $1/mo for the first 3 months, then $39/mo ($29 annual). The free Printify Pop-Up Store was considered and rejected. |
| Store domain | Default `*.myshopify.com` | No DNS work, fastest launch. Shopify keeps this address permanently, so pointing `shop.amorbudget.com` at it later is a settings change plus one Cloudflare CNAME, not a migration. |
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

- `shop.url` — the live Shopify store URL
- `shop.brand` — `LGTM` becomes `Amor Budget`
- `shop.label` — `Shop LGTM` becomes `Shop merch`
- `shop.blurb` — rewrite; currently references LGTM as a separate crew

`/merch` is a real catalog on our own site, not a Shopify embed. Shopify cannot
serve `amorbudget.com/merch` — subdomains only — so Astro owns the URL and the
design, and Shopify owns checkout.

- `src/data/products.ts` — the catalog. Adding a product is one entry plus
  mockups in `public/merch/`; no component edits.
- `src/pages/merch/index.astro` — grid. Uses `auto-fill`, not `auto-fit`, so a
  single product does not stretch across the full width and look broken. A
  "next drop" tile fills the grid honestly below 4 products and removes itself
  above that.
- `src/pages/merch/[slug].astro` — product page, generated per product.

An empty `url` puts a product in its "not yet" state rather than shipping a dead
Buy button, so a design can exist on the site before its Shopify listing does.

`Merch.astro` on the homepage becomes a teaser linking to `/merch`. The live vs
coming-soon split lives on `/merch` alone, so there is one place to be right
instead of two places to drift.

Nav and Footer anchors are root-relative (`/#features`, not `#features`) so they
work from `/merch`. Bare hashes point at nothing once a second page exists.

## Store setup

Printify connects to Shopify by installing the Printify app from the Shopify App
Store and authorizing it; the Shopify store then appears in the Printify
dashboard, and products created in Printify sync across with images, description,
and price.

Order of operations:

1. Shopify account and store created (3-day trial, checkout disabled)
2. Start the $1/mo subscription — required before the store can take an order
3. Install the Printify app, authorize the connection
4. Build the product in Printify from the print file, publish to Shopify
5. Payments, refund and shipping policies, store name configured in Shopify
6. Copy the live product or store URL back into `site.ts`

## Division of labor

**Claude:** SVG rebuild, print-ready PNG export, product title and description
copy, store copy (tagline, about, policy starting points), all `site.ts` edits,
favicon replacement, build verification.

**User:** Create the Shopify account and the Printify account, both requiring
email verification. Start the paid subscription. Install and authorize the
Printify app. Upload the print file, pick the garment colorway, set retail price,
publish. Configure payments and payouts — these are the user's alone and Claude
should not touch them.

The handoff point is the live store URL. Everything on the Claude side can be
finished before either account exists; only the final `shop.url` value waits on
it.

## Out of scope

- More than one product or colorway
- Custom domain — deferred, `*.myshopify.com` for now
- Payment, tax, or payout configuration
- Shopify theme customization beyond what ships by default
- Shopify Buy Buttons / Storefront API cart on our own page. `/merch` links out
  to Shopify for checkout. Worth revisiting only past one product.

## Acceptance criteria

1. `src/assets/logo.svg` exists, renders identically to the app icon, has no
   background square.
2. Print file is 4500x5400px, 300 DPI, RGB, with a genuinely transparent
   background (verified, not assumed).
3. `npm run build` passes.
4. With `shop.url` empty, Merch still shows the "coming soon" state; with a URL
   set, it shows the live shop button pointing at that URL. Both states checked.
5. No remaining "LGTM" references in user-visible site copy.
