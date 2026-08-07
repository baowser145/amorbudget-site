# Session Handoff — amorbudget-site — 2026-08-06 20:24 CDT

## One-Line Status

The merch funnel is live end to end (site → Shopify → checkout) and a brand-styled
Shopify theme is built and previewable, waiting only on the user to click Publish.

## Project Path

`/Users/vubl/projects/amorbudget-site`

## Phase

ship — Phase A shipped and verified in production; Phase B built, blocked on a
manual publish step.

## Roast Verdict

Not run. `/roast` was never invoked for this workstream; it is a merch feature on
an existing site, not a new product. No `.claude/roast-verdict.md` exists.

## Decisions Made

- **Both surfaces, one look**: modernize the Astro `/merch` pages *and* the Shopify
  storefront, so the handoff at purchase does not read as two companies.
- **Keep the existing brand**: `ui-ux-pro-max` recommended Swiss Modernism with a
  pink `#EC4899` accent. Rejected — the cream/sage identity is tied to the app.
  Adopted only its spacious density, single-CTA focus, and grid discipline.
- **Theme depth = settings + optional CSS, not a Liquid rewrite**: not worth owning
  theme code for a one-product store. Custom CSS ended up unnecessary.
- **Duplicate, never touch MAIN**: all theme writes went to an unpublished copy.
- **Products store a Shopify `handle`, not a full URL**: `productUrl()` composes it
  against `site.shop.url`, so a domain move is one edit. This paid off immediately
  when `shop.amorbudget.com` went live mid-session.
- **No cart on amorbudget.com**: Shopify owns checkout, one place to be right.

## What's Built

- `src/assets/merch/v1-tee-{front,back}.jpg` — done. Real 2000×2000 mockups, committed.
- `src/data/products.ts` — done. `images` typed `ImageMetadata`; `productUrl()`/`isLive()`.
- `src/components/ProductCard.astro` — done. `<Image>`, plus `height:auto` bug fix.
- `src/pages/merch/[slug].astro` — done. Cross-fading stage, real `<button>` thumbnails,
  keyboard operable, `prefers-reduced-motion` respected.
- `src/styles/global.css` — done. `--ab-accent-text: #4a633f` (6.07:1).
- `src/data/site.ts` — done. Points at `https://shop.amorbudget.com`.
- Shopify theme "Amor Budget brand" (`gid://shopify/OnlineStoreTheme/190048370761`) —
  **built, UNPUBLISHED**. Cream/sage palette, Nunito, pill buttons.
- Shopify product media alt text — done, both records updated via `fileUpdate`.

## Verification Status

Last verification: **PASS** (2026-08-06, production). No `.claude/build-log.md` exists;
this project has no test runner, so verification is build + built-HTML assertions +
live curl + browser check.

- `npm run build` passes, 3 pages.
- Production `/merch` and `/merch/v1-launch-tee` both 200, placeholder gone,
  2 stage images + 2 thumb buttons, WebP srcsets present.
- Buy link → `shop.amorbudget.com` returns 200 with no redirect hop.
- Gallery swap verified in-browser by mouse and by keyboard (focus ring + Enter).
- Live Horizon theme confirmed unchanged after all theme writes.

## Active Goals

- Get the branded Shopify theme live so the purchase path is on-brand end to end.

## Open Blockers

- **Theme publish is blocked to Claude.** `themePublish` validates against Shopify's
  schema, but the MCP server's safety policy refuses it by design ("making a theme
  live must be done manually"). **The user must publish by hand:**
  Shopify Admin → Online Store → Themes → "Amor Budget brand" → ⋯ → Publish.
  Direct link: `https://admin.shopify.com/store/tcniga-y0/themes`
  Rollback is easy: the original Horizon theme is still in the library, so
  republishing it reverts everything.

## Next 3 Actions (in order)

1. **Confirm the user published the theme, then verify**: check `themes` role flipped
   to `MAIN` for `190048370761`, curl the live product page for `nunito` and `f7f4ec`,
   and re-confirm `amorbudget.com/merch` Buy still returns 200.
2. **Decide the Shopify home page content.** It still shows Horizon's stock hero
   ("Browse our latest products" over a generic illustration). That is section content
   in `templates/index.json`, not theme styling, and needs the user's copy decision.
   Low urgency: buyers arrive at the product page directly from `/merch`.
3. **Offer the site-wide contrast follow-up.** 8 usages of `color: var(--ab-accent)`
   still measure 4.35:1 in `Hero`, `Nav`, `Footer`, `Features`, `Resources`. The
   `--ab-accent-text` token exists, so it is a find-and-replace. Deliberately left
   out of scope this session.

## Deferred, with reasons

- **View transitions** (spec item A5): Astro renamed `ViewTransitions` to `ClientRouter`
  in v5 and this project is on 7.1.4. Needs a docs check before implementing; lowest
  value item on the list.
- **Catalog stagger** (spec item A7): `data-reveal` already fires on the merch grid.
  A second animation would mean a new dependency for one card. Revisit when the
  catalog grows.
- **Custom CSS on the Shopify theme**: palette + radius settings carried the brand
  without it; an asset file is maintenance across theme updates for shadow softness alone.

## Gotchas discovered this session

- **The shirt is NOT the heart piggy bank on forest green.** It is a multicolor
  "AMOR BUDGET" wordmark in stacked overlapping letters on a cream American Apparel
  1301GD. `docs/superpowers/specs/2026-08-06-merch-printify-design.md` describes the
  old plan and is **stale on garment and artwork**. Alt text was written from looking
  at the actual image.
- **`<Image>` emits `height="2000"`**, and that presentational attribute beats
  `aspect-ratio` unless the rule also sets `height: auto`. This silently rendered a
  2000px-tall crop on the catalog card.
- **Astro does not strict-typecheck `.astro` templates.** A build can pass while
  emitting `src="[object Object]"`. Assert against built HTML, not just exit code.
- **Scoped styles land in `dist/_astro/*.css`, not inline HTML** in production builds.
  Grepping the HTML for a media query gives a false negative.
- **Horizon caps `card_corner_radius` and `popover_border_radius` at 16.** The API
  rejects higher, so `--radius-lg` (28px) cannot be matched on Shopify cards.
- **Nunito IS in Shopify's font library** as `nunito_n4` / `nunito_n7`. Verified by
  the preview serving `nunito_n4...woff2`.
- **Shopify blocks these via MCP**: theme publish, storefront password protection,
  shop address, domain creation. All are manual admin actions.

## Resume Prompt

Copy-paste this into a fresh session:

> Read `.claude/HANDOFF.md` and `.claude/PROJECT.md` in
> `/Users/vubl/projects/amorbudget-site`, then continue from "Next 3 Actions" item 1.
> Do not re-ask intake questions. Current phase: ship.

## Files Touched This Session

Commits `5cc3115`, `25b3baa`, `f131e4f`, `5b560af`, `307d79a`, `4434e23` — all pushed,
working tree clean.

```
docs/superpowers/plans/2026-08-06-merch-storefront-modernization.md   | 624 ++
docs/superpowers/specs/2026-08-06-merch-storefront-modernization-design.md | 110 ++
src/assets/merch/v1-tee-back.jpg                                      | Bin
src/assets/merch/v1-tee-front.jpg                                     | Bin
src/components/ProductCard.astro                                      |  14 +-
src/data/products.ts                                                  |  17 +-
src/data/site.ts                                                      |   2 +-
src/pages/merch/[slug].astro                                          | 128 +-
src/pages/merch/index.astro                                           |   4 +-
src/styles/global.css                                                 |   8 +-
```

Changed outside the repo (Shopify, not version controlled):
- Theme `190048370761` "Amor Budget brand" created, `config/settings_data.json` written.
- Product media alt text on `MediaImage/71843415457865` and `.../71843415490633`.
