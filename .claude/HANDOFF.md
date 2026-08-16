# Session Handoff — amorbudget-site — 2026-08-15 ~20:00 CDT

## One-Line Status
Both surfaces shipped a full copy-and-type overhaul today — the marketing site now runs Helvetica Neue with deduplicated, de-slopped copy and storefront-direct merch links, and the Shopify storefront got the same treatment plus a live chat widget — everything is published and verified live.

## Project Path
`/Users/vubl/projects/amorbudget-site`
(the Shopify storefront work targets store `tcniga-y0` / shop.amorbudget.com — no repo, all via API + user publish clicks; see the `shopify-theme-edit-workflow` memory)

## Phase
ship — both sites live and stable. No branch in flight; `main` in sync with `origin/main` at `39dbb52`.

## Roast Verdict
N/A — not a `/create-new-project` pipeline session.

## Decisions Made
- **Site typeface is Helvetica Neue everywhere** (user asked for "one of Steve Jobs' most liked fonts", picked for screen readability). Replaced self-hosted Nunito + Fraunces; the site now ships zero font files, hierarchy comes from size/weight, headline sizes stepped down since Helvetica reads full-size where Fraunces read small. **The iOS app and shop wordmark still use Nunito** — the site intentionally diverges now.
- **Every claim gets one home** (dedupe pass): hero owns the value prop, Features owns the feature claims, Privacy owns the bank story. Trust pills, HowItWorks lede + stat notes, and the closing lede were deleted as duplicates; the stat cards were later deleted entirely (user confirmed) and the three steps now lay out in a row.
- **All "Merch" clicks go straight to shop.amorbudget.com** in a new tab — nav, footer, closing CTA. The hero's secondary merch link and the carousel's six-up thumbnail strip are deleted; `/merch` and product pages still exist but only carousel "Details" links reach them.
- **Stop-slop is the copy standard on both sites.** Shopify homepage sections and product descriptions were rewritten via API; the two Printful-boilerplate tees lost their duplicated filler; size guides and shipping lead times were kept as functional info.
- **Shopify hero says "Wear the / budget, / *you AMOR.*"** with eyebrow "Launch Edition (V1.0.0)" and a SHOP NOW button, no body paragraph, at all widths (user's exact wording via AskUserQuestion).
- **Shopify Inbox chat is live with Shopify's AI Agent answering.** The user originally asked to power it with Fable 5 — impossible, no model selection exists in Shopify Inbox; user accepted Shopify's own AI ("then dont use fable 5").
- **Carousel leads with the App Icon Tee** (user request, last change of the session).

## What's Built
Site (all on `main`, pushed, live at www.amorbudget.com):
- `479be2a` Cut the homepage copy down to the point (stop-slop pass)
- `88f238b` Set the whole site in Helvetica Neue and say each claim once
- `22994e7` Send Merch clicks straight to the storefront and slim the carousel
- `43ee732` Drop the stat cards from How it works
- `39dbb52` Lead the merch carousel with the App Icon Tee

Shopify (store `tcniga-y0`, all published by the user and verified live):
- Product descriptions trimmed: V1.0.0 tee, App Icon tee (big cuts), Heart & Receipt (one word). I'm Due pair and sticker were already clean.
- Homepage copy de-slopped in `templates/index.json` (hero, story, newsletter, manifesto). Story + manifesto sections since **disabled by the user** in the editor.
- Accessories section → newsletter-only: product card removed, grid goes single-column when no product set (Liquid edit in `sections/amor-accessories.liquid`), eyebrow "02 — Newsletter".
- Hero rewrite (see Decisions).
- Inbox chat app embed enabled in `config/settings_data.json` (`shopify://apps/shopify-inbox/blocks/chat/5c413ee331721e49374ce06d0a7edc1b`); Agent toggle flipped on by the user.
- Published theme history today: copy pass → loop only → hero v2 → **chat on (current MAIN, `190202773577`)**. Each publish creates a new theme ID; always re-read live files before editing.

## Verification Status
Last verification: **PASS** (2026-08-15, this session) — all measured:
- `npx astro build` clean (8 pages) after every site change; every deploy polled live with curl until the new markup served (new copy present, old slop phrases absent, zero thumbnail markup, first carousel slide = App Icon Tee confirmed live).
- Site visually checked at 1440px in-browser after the font swap and section deletions.
- Shopify: every de-slop phrase verified present/absent on live shop.amorbudget.com; chat widget confirmed live (17 `shopifyChat` refs in served HTML); all product-description updates confirmed serving.

## Active Goals
- none (both /goal hooks satisfied: the stop-slop storefront goal and the Inbox chat goal, the latter amended by the user to drop the Fable 5 requirement)

## Open Blockers
- none. Standing constraint, not a blocker: **agents cannot publish Shopify themes or write to the MAIN theme** (MCP policy + permission classifier, confirmed repeatedly). Workflow: `themeDuplicate` via API → edit draft via `themeFilesUpsert` → user clicks Publish. Admin content iframes (themes page, Inbox app, theme editor) are unreachable by browser automation; the standalone inbox.shopify.com IS clickable via find→ref.

## Next 3 Actions (in order)
1. Watch the first Shopify Inbox conversations now that chat + AI Agent are live; consider drafting Instant Answers (shipping times, sizing, returns) for the user to paste in — they were offered and haven't sent Q&A content yet.
2. Housekeeping when convenient: the superseded draft themes on Shopify (brand, brand v2, two "Updated copy" dupes, homepage grid, editorial redesign, copy pass, loop only, hero v2) are clutter the user may want to delete — ask before deleting anything.
3. `designs/` in this repo remains untracked and belongs to another agent's second-product concept — leave it alone unless the user brings it up.

## Resume Prompt
Copy-paste this into a fresh session:

> Read `.claude/HANDOFF.md` and `.claude/PROJECT.md` in /Users/vubl/projects/amorbudget-site, then continue from "Next 3 Actions" item 1. Current phase: ship — both www.amorbudget.com and shop.amorbudget.com are live and verified. Do not re-ask intake questions. Key constraints: Shopify theme edits go duplicate→edit→user-publishes (see the shopify-theme-edit-workflow memory; agents cannot publish or write to MAIN); the site typeface is Helvetica Neue by explicit user choice (do not reintroduce Nunito/Fraunces on the site); copy on both surfaces follows stop-slop with "the less the better" — keep it that way.

## Files Touched This Session
```
amorbudget-site (main, all pushed):
  src/components/Hero.astro        — lede trimmed; trust pills + merch text-link removed
  src/components/HowItWorks.astro  — lede + stat cards removed; steps 3-across
  src/components/Features.astro    — lede + card bodies rewritten; card 4 = logging (pencil icon)
  src/components/Privacy.astro     — lede trimmed; point 3 = data-source angle
  src/components/Closing.astro     — lede removed; CTA → shop.amorbudget.com
  src/components/Merch.astro       — thumbnail strip removed; copy trimmed
  src/components/Nav.astro         — Merch → shop.amorbudget.com (external)
  src/components/Footer.astro      — note removed; Merch → shop
  src/styles/global.css            — Helvetica Neue; font imports removed; display sizes stepped down
  src/data/products.ts             — App Icon Tee moved to front

Shopify theme "chat on" 190202773577 (via API, user-published):
  templates/index.json, sections/amor-accessories.liquid, config/settings_data.json
Shopify products (live immediately): 3 descriptions rewritten
```
