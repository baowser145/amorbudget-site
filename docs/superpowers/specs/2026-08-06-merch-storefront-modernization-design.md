# Merch storefront modernization

**Date:** 2026-08-06
**Status:** Approved for planning

## Goal

Make the two halves of the merch experience read as one brand. Today a customer
moves from a designed, on-brand page at `amorbudget.com/merch` to a stock Shopify
Horizon storefront, and the handoff looks like two different companies. Close
that gap from both sides.

## Current state

| Fact | Value |
|---|---|
| Shopify store | `tcniga-y0.myshopify.com`, Basic plan, password protection off |
| Theme | Horizon (`gid://shopify/OnlineStoreTheme/190034018377`), role MAIN, only theme installed |
| Product | `amor-budget-v1-0-0-launch-edition`, active, $36-$39, sizes S-3XL |
| Product media | Two 2000x2000 mockups on Shopify CDN (front, back), alt text `"Product mockup"` |
| Site | Astro 7.1.4, self-hosted Nunito via `@fontsource/nunito` |
| Site merch images | None. `public/merch/` is empty and the product page renders a placeholder |

The site already links correctly to Shopify: `site.shop.url` plus a per-product
`handle`, resolved by `productUrl()`. That wiring is done and is not in scope here.

## Direction

Keep the existing brand tokens: cream `#f7f4ec`, sage `#5f7a52`, ink `#2b2e23`,
Nunito, radii 14-44px, layered soft shadows. Apply them with more editorial
confidence, and extend them onto Shopify.

The `ui-ux-pro-max` design system recommended Swiss Modernism 2.0 with a pink
`#EC4899` accent on near-black. Rejected. It is a reasonable generic e-commerce
direction, but the brand already exists and is tied to the app; replacing it at
the moment of purchase works against the goal. Adopted from that output instead:
spacious density (24-96px scale), the single-CTA product focus, grid discipline,
and stagger-reveal motion on the catalog.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Scope | Both surfaces | A branded Shopify theme alone still leaves the site's product page image-less; fixing only the site leaves checkout looking generic. |
| Theme depth | Theme settings plus a custom CSS asset | Settings alone cannot reach the shadow softness and spring easing. A full Liquid rewrite means owning theme code and losing clean Horizon updates, which is not worth it for one product. |
| Theme delivery | Duplicate to an unpublished copy, user publishes | The Admin API blocks writes to the live MAIN theme and blocks publishing. Also means the live store is never in a half-styled state. |
| Product images | Commit to `src/assets/merch/`, render with `astro:assets` | Build-time optimization and srcset, version control, no runtime dependency on Shopify's CDN. Matches the `<Image>` pattern already used in `Hero`, `Nav`, `Footer`, `Screenshots`. |
| Cart | None on the site | Shopify owns checkout. One place to be right instead of two that drift. |

## Surface A: amorbudget.com/merch

1. **Product photography.** Download both Shopify mockups to
   `src/assets/merch/v1-tee-front.jpg` and `v1-tee-back.jpg`. Extend the `Product`
   interface to carry image imports. Replace the raw `<img>` tags in
   `ProductCard.astro` and `merch/[slug].astro` with `<Image>` from `astro:assets`.
2. **Gallery.** Front image as hero, back as the second view, swappable by click
   and keyboard. Two images, so no carousel dependency.
3. **Product layout.** Two columns on desktop, media left and a sticky buy panel
   right; single column on mobile. Buy remains an outbound link to Shopify.
4. **Size chips.** Render S-3XL from `products.ts` as display-only chips, with
   copy making clear that size is selected on Shopify. Avoids implying a cart.
5. **View transitions.** Add Astro's `ClientRouter` so the product image morphs
   between catalog and product page rather than hard-cutting.
6. **Alt text.** Replace `"Product mockup"` with descriptive alt on both the site
   and the Shopify media records.
7. **Catalog reveal.** Stagger the product grid on scroll, respecting
   `prefers-reduced-motion`.

## Surface B: Shopify Horizon theme

1. `themeDuplicate` Horizon into an unpublished copy named for the brand.
2. Read `config/settings_schema.json` from the duplicate to learn Horizon's real
   setting names. Do not guess them.
3. `themeFilesUpsert` on the duplicate:
   - `config/settings_data.json`: color scheme (cream background, sage accent,
     ink text), Nunito typography, large corner radius, solid sage buttons.
   - Custom CSS for what settings cannot express: `--shadow-card` softness,
     spring easing on hover, card and image treatment. Horizon may expose this
     as a theme setting or require an asset file; the schema read in step 2
     decides which, and the spec does not presume one.
4. Hand off. The user previews the duplicate and publishes it.

## Constraints

- No Admin API mutation exists for theme publishing, password protection, or the
  shop address. Those stay manual.
- Writes to the MAIN theme are blocked, hence the duplicate.
- Typography match depends on whether Nunito is in Shopify's font picker.
  Unverified. Confirm against the theme's font settings during implementation;
  if absent, fall back to the closest available face rather than injecting a
  webfont, and record the substitution.

## Out of scope

- Storefront API cart or checkout on amorbudget.com
- Custom Liquid section or template rewrites
- The `shop.amorbudget.com` subdomain (separate DNS task, tracked elsewhere)
- Additional products; the catalog already scales to them

## Acceptance criteria

- [ ] `/merch` and `/merch/v1-launch-tee` show real product photography, no placeholder
- [ ] Merch pages use `<Image>`; no raw `<img>` remains in merch components
- [ ] Front and back views are reachable by mouse and keyboard
- [ ] Buy button links to the live Shopify product and returns HTTP 200
- [ ] `npx astro build` passes
- [ ] Reveal and transition motion is suppressed under `prefers-reduced-motion`
- [ ] Text contrast meets 4.5:1 on cream backgrounds
- [ ] An unpublished, brand-styled theme exists in Shopify, ready to preview
- [ ] The live theme is untouched until the user publishes
