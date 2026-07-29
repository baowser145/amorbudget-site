# Session Handoff — amorbudget-site — 2026-07-28T18:57:00-05:00

## One-Line Status
Marketing site scaffolded, modernized, and deployed live at amorbudget.com; now mid-rebrand of the icon mark (heart + growth-arrow, replacing heart+coin) across app/site/merch — the mark itself is confirmed and already applied to the Printful shirt design, but the app icon, site nav icon, and OG image regeneration are still pending.

## Project Path
/Users/vubl/projects/amorbudget-site
(sibling repo to /Users/vubl/projects/amor-budget, the native app this site markets)

## Phase
ship — icon rebrand in progress, step 2 of 3 (shirt done; app/site assets not started)

## Roast Verdict
N/A — not a `/create-new-project` pipeline session.

## Decisions Made
- **New repo, not folded into amor-budget.** Different stack (Astro vs Ionic/Capacitor) and deploy target (Vercel vs App Store) — user agreed a separate repo made sense.
- **Reuse amor-budget's exact brand tokens** (Olive & Blush palette, self-hosted Nunito) rather than generating a new identity via brandkit — user explicitly chose consistency with the app over a fresh visual world.
- **Astro over Next.js/Vite+React** for the site — zero-config static output, near-zero JS by default, simplest fit for a mostly-static marketing page.
- **Merch stays a "coming soon" teaser for now**, not a wired storefront — descoped after confirming Printful setup (see below) is still in progress.
- **Printful (not Printify) for merch**, DTG printing (not embroidery — embroidery doesn't sit well on soft tees, better suited to polos/hats). Public storefront eventually, not just a personal one-off.
- **Icon redesign: heart + upward growth-arrow**, chosen from 4 AI-generated concepts the user liked (wallet, pie-chart×2, growth-arrow). Colors mapped to real tokens: olive heart outline (`--ab-accent` #5F7A52), gold arrow (`--ab-gold` #D9B44A) — gold already means "savings/growth" elsewhere in the app, so the choice isn't arbitrary.
- **Heart geometry: reused verbatim from the user's own prior DesignSync work** (project `a06787d6-8087-4ce2-abbf-a6e45c064cef`, file "Amor Budget - New Sections.dc.html", section `28a` — "Slimmer heart · arrow gets a head"), not re-derived by hand. Two earlier from-scratch attempts this session (freehand bezier trace, then a two-circle-tangent construction) were both rejected by the user as looking off before section 28a was found — do not re-attempt hand-deriving heart geometry; the exact path data is captured below and is the source of truth going forward.
- **Corner-bracket arrowhead, not a filled triangle** — two line segments forming an "L" corner (from the 28a source), simpler and cleaner than a triangle polygon.
- **Background-color "cutout" mask under the gold stroke** where the arrow crosses the heart outline, so the crossing reads cleanly instead of a messy overlap — implemented via an SVG `<mask>` for the transparent-background version (a solid-color stroke-underneath trick doesn't work once the background isn't a flat color).

## What's Built
- **amorbudget-site repo** (github.com/baowser145/amorbudget-site, public) — Astro site, 3 commits (`c7a13df` scaffold, `d6ff18c` contrast fix, `37e0762` modernize, `c77d19a` editorial-confidence pass). **Live at https://amorbudget.com** (Vercel, DNS via Cloudflare, both apex + www records confirmed working).
- **Site sections**: floating pill nav (brand + Features/Screenshots/Merch links + "Get notified" CTA), Hero (bolder type, heart-icon watermark, accent-colored keyword, tilt-on-hover phone mockup), Features (asymmetric bento layout — flagship tile + 3 smaller, breaks the repeated-card anti-pattern the design skill's checklist flags), Screenshots (full-bleed dark "peak" section for scroll rhythm), Merch (teaser CTA, no storefront wiring yet), Footer.
- **Accessibility**: fixed body-copy contrast — app's `--ab-muted`/`--ab-faint` tokens are tuned for the native app (short labels, larger/bolder type) and read below 4.5:1 at marketing-copy sizes; added a darker `--muted-copy` (#6A6E5A, 4.95:1) and a `--muted-on-ink` (#B7BCA8, 7.1:1) for the dark section.
- **Motion**: scroll-reveal via IntersectionObserver, gated behind a `.js` class added synchronously in `<head>` so content stays visible if JS fails (progressive enhancement, per impeccable's animate.md).
- **Icon mark, confirmed direction**: heart outline + growth arrow, olive/gold, built from section 28a's exact SVG path data (see below). Print-ready transparent PNG generated and **already uploaded + placed on the Printful shirt design** (`icon-transparent.png`, 2000×2000, "Good / 167 DPI" — old opaque coin-version layer was deleted so only the new transparent mark sits on the fabric).
- **Printful**: account created (user, not me — account creation is something I can't do), store not yet connected (Step 2 of Printful's own onboarding), billing not yet set up (Step 4 — also something the user must do, it's payment info). Shirt: Gildan 64000 Unisex Basic Softstyle Tee, DTG printing, white/default color, new icon design placed front-center.
- **NOT yet done**: regenerating `amor-budget`'s actual `resources/icon.png` (and derived `public/favicon.png`, `public/icon-512.png`, iOS app icon) with the new heart+arrow mark, or updating this site's own nav icon / OG image to match. The site currently still shows the OLD heart+coin icon in its nav and hero screenshot (the hero's phone mockup is a real screenshot of the app's login screen, so it won't update until the app itself ships the new icon and a fresh screenshot is taken).

## The icon's source SVG (canonical — reuse this, don't re-derive)
```svg
<!-- heart outline, viewBox 0 0 100 100 -->
<path d="M46 84 C27 69 14 55 14 39.5 C14 28.5 22 20.5 31.5 20.5 C37.5 20.5 42.6 23.8 46 30 C49.4 23.8 54.5 20.5 60.5 20.5 C70 20.5 78 28.5 78 39.5 C78 55 65 69 46 84 Z"
      stroke="#5f7a52" stroke-width="5.5" stroke-linejoin="round" fill="none" />
<!-- growth-arrow zigzag + corner-bracket arrowhead -->
<path d="M16 73 L38 51 L44 57 L86 16 M73 16 L86 16 L86 29"
      stroke="#d9b44a" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
```
Stroke widths scale up slightly at smaller physical render sizes (5.5 at ~150px tile, 6 at 64px, 6.5 at 44px — confirmed legible down to 44px). For a solid-color tile background (app icon convention), add the background-color cutout stroke (width ~11, same path, drawn under the gold) so the arrow reads cleanly crossing the heart line. For transparent-background exports (print, OG image), use an SVG `<mask>` instead (a literal colored stroke would show as a visible box against transparency) — working example saved at `/private/tmp/claude-501/-Users-vubl-projects-amor-budget/69b33b1b-6078-4c96-ba0f-e5f8cf8d7e93/scratchpad/icon-transparent.svg` (this is a session scratchpad path and may not survive — treat the path data above as the durable source, not that file).

## Verification Status
- `npm run build` — PASS, clean, after every round of site changes this session.
- Mechanical design detector (`impeccable`'s `detect.mjs`) — zero findings, run before and after both the "modernize" and "editorial confidence" passes.
- Visually verified in-browser at desktop (1440px) and mobile (~390-500px) widths after every round; no horizontal overflow.
- Live site smoke-tested via `curl`/`dig` after DNS changes and after each deploy — confirmed apex 308→www redirect, valid SSL, correct HTML served.
- Icon mark: verified transparency by compositing over a checkerboard in Python (not just eyeballing); verified via Printful's own "Print quality: Good / 167 DPI" indicator after upload.

## Active Goals
- Finish the icon rebrand across all three surfaces: app (`amor-budget`'s `resources/icon.png` + derived favicons + iOS asset catalog), this site (nav icon component, OG image), and merch (done).
- Get the Printful store actually connected and billing set up (both require the user directly — account/payment actions I can't perform) so the shirt is purchasable, if that's still the goal (last explicit direction was "public storefront", not just a personal one-off).

## Open Blockers
- **Printful store not connected yet** — Step 2 of Printful's own setup checklist (connect store) and Step 4 (billing) are both outstanding; billing specifically requires entering payment details, which I won't do even with permission (prohibited action).
- **amor-budget's own icon.png/favicons still show the old heart+coin mark** — not yet regenerated with the new heart+arrow design. This is a separate repo (`/Users/vubl/projects/amor-budget`) from this one; its own `.claude/HANDOFF.md` has an unrelated, still-open blocker (Google Sign-In work uncommitted, waiting on the user's phone reconnecting) that this session did not touch or resolve — don't conflate the two.

## Next 3 Actions (in order)
1. Ask the user whether to proceed now with regenerating the app icon assets (amor-budget's `resources/icon.png`, `public/favicon.png`, `public/icon-512.png`, iOS `AppIcon` asset catalog) using the canonical SVG above — was offered, not yet confirmed as of this handoff.
2. Once the app icon is regenerated, update this site's `Nav.astro` icon image and add/update an Open Graph image using the same mark, so nav/site/app/shirt are all consistent.
3. Check back on Printful account setup (store connection + billing) — both need the user's direct action, not something to attempt via browser automation.

## Resume Prompt
Copy-paste this into a fresh session:

> Read `.claude/HANDOFF.md` in /Users/vubl/projects/amorbudget-site, then continue from "Next 3 Actions" item 1. Do not re-ask intake questions or re-derive the heart+arrow icon geometry — the canonical SVG path data is in this file's "The icon's source SVG" section, sourced from the user's own DesignSync work (project a06787d6-8087-4ce2-abbf-a6e45c064cef, section 28a). The site is live at amorbudget.com and the Printful shirt design is done; what's left is regenerating amor-budget's actual app icon/favicons with the new mark, then updating this site's nav icon/OG image to match, then following up on Printful's store-connection and billing steps (both need the user directly).

## Files Touched This Session
```
amorbudget-site/ (new repo, 4 commits: c7a13df, d6ff18c, 37e0762, c77d19a)
  src/pages/index.astro, src/layouts/Layout.astro
  src/components/{Nav,Hero,Features,Screenshots,Merch,Footer}.astro
  src/styles/global.css
  src/assets/app-icon.png, src/assets/screenshots/{login,home}.png
  public/favicon.{png,ico,svg}
.claude/HANDOFF.md (this file, new)

Read-only reference (no edits):
  /Users/vubl/projects/amor-budget/resources/icon.png (source for old mark's pixel geometry)
  /Users/vubl/projects/amor-budget/src/theme/variables.css (brand tokens)
  DesignSync project a06787d6-8087-4ce2-abbf-a6e45c064cef, section 28a (icon source)

External (browser automation, not local files):
  Printful design maker — uploaded icon-transparent.png, deleted old icon.png layer,
  placed new design on Gildan 64000 shirt front. Account/store/billing setup remains
  the user's own action.
```
