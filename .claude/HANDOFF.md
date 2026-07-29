# Session Handoff — amorbudget-site — 2026-07-28T19:20:00-05:00

## One-Line Status
Marketing site is live at amorbudget.com and mobile-nav/hero bugs reported from a real phone are fixed and deployed; still mid-rebrand of the icon mark (heart + growth-arrow, replacing heart+coin) — the mark is confirmed and already applied to the Printful shirt design, but the app icon, site nav icon, and OG image regeneration are still pending.

## Project Path
/Users/vubl/projects/amorbudget-site
(sibling repo to /Users/vubl/projects/amor-budget, the native app this site markets)

## Phase
ship — icon rebrand in progress, step 2 of 3 (shirt done; app/site icon assets not started). Mobile bug-fix cycle just completed and verified live.

## Roast Verdict
N/A — not a `/create-new-project` pipeline session.

## Decisions Made
- **New repo, not folded into amor-budget.** Different stack (Astro vs Ionic/Capacitor) and deploy target (Vercel vs App Store).
- **Reuse amor-budget's exact brand tokens** (Olive & Blush palette, self-hosted Nunito) rather than a new identity via brandkit.
- **Astro over Next.js/Vite+React** — zero-config static output, near-zero JS by default.
- **Merch stays a "coming soon" teaser for now**, not a wired storefront — Printful store connection/billing still outstanding.
- **Printful (not Printify) for merch**, DTG printing (not embroidery). Public storefront eventually, not a personal one-off.
- **Icon redesign: heart + upward growth-arrow**, olive outline (`--ab-accent` #5F7A52) + gold arrow (`--ab-gold` #D9B44A) — gold already means "savings/growth" elsewhere in the app.
- **Heart geometry reused verbatim from the user's own prior DesignSync work** (project `a06787d6-8087-4ce2-abbf-a6e45c064cef`, section `28a`), not re-derived by hand — two earlier freehand attempts were rejected first. Canonical path data is in the previous handoff entry / still valid, repeated below.
- **No "Get notified" CTAs anywhere on the site** (new this session, user's direct instruction after seeing it on their phone) — replaced with a plain, non-interactive "Coming soon" text label in both the nav and the hero. Don't re-add an email-capture CTA without the user asking again.
- **Mobile nav keeps all three links visible** (Features/Screenshots/Merch) instead of hiding them below 640px — the old mobile CSS hid every text link and showed only the "Get notified" button, which is why the user couldn't find Merch on their phone. Fixed by tightening gap/font-size at the mobile breakpoint rather than hiding content.

## What's Built
- **amorbudget-site repo** (github.com/baowser145/amorbudget-site, public) — Astro site, 5 commits (`c7a13df` scaffold, `d6ff18c` contrast fix, `37e0762` modernize, `c77d19a` editorial-confidence pass, `cdeb205` mobile nav/hero CTA fix). **Live at https://amorbudget.com** (Vercel, DNS via Cloudflare).
- **Site sections**: floating pill nav (brand + Features/Screenshots/Merch links, no CTA button anymore), Hero (bolder type, heart-icon watermark, accent-colored keyword, tilt-on-hover phone mockup, "See how it works" button + plain "Coming soon" text), Features (asymmetric bento layout), Screenshots (full-bleed dark "peak" section), Merch (teaser CTA — this one still says "Tell me when it's live", untouched by this round's CTA removal since the user's complaint was specifically about "Get notified"), Footer.
- **Accessibility**: `--muted-copy` (#6A6E5A, 4.95:1) and `--muted-on-ink` (#B7BCA8, 7.1:1) added since the app's own `--ab-muted`/`--ab-faint` read below 4.5:1 at marketing-copy sizes.
- **Motion**: scroll-reveal via IntersectionObserver, gated behind a `.js` class so content stays visible if JS fails.
- **Icon mark, confirmed direction**: heart outline + growth arrow, olive/gold, from DesignSync section 28a's exact SVG path (below). Print-ready transparent PNG already uploaded and placed on the Printful shirt design (old opaque coin-version layer deleted).
- **Printful**: account created by the user; store connection and billing setup are still outstanding (both are the user's own steps — account/payment actions).
- **NOT yet done**: regenerating `amor-budget`'s actual `resources/icon.png` (+ derived favicons + iOS app icon) with the new heart+arrow mark, or updating this site's own nav icon/OG image to match. The site's nav icon and the hero's phone-mockup screenshot still show the OLD heart+coin design.

## The icon's source SVG (canonical — reuse this, don't re-derive)
```svg
<!-- heart outline, viewBox 0 0 100 100 -->
<path d="M46 84 C27 69 14 55 14 39.5 C14 28.5 22 20.5 31.5 20.5 C37.5 20.5 42.6 23.8 46 30 C49.4 23.8 54.5 20.5 60.5 20.5 C70 20.5 78 28.5 78 39.5 C78 55 65 69 46 84 Z"
      stroke="#5f7a52" stroke-width="5.5" stroke-linejoin="round" fill="none" />
<!-- growth-arrow zigzag + corner-bracket arrowhead -->
<path d="M16 73 L38 51 L44 57 L86 16 M73 16 L86 16 L86 29"
      stroke="#d9b44a" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
```
Stroke widths scale up slightly at smaller physical render sizes (5.5 at ~150px tile, 6 at 64px, 6.5 at 44px — confirmed legible down to 44px). For a solid-color tile background (app icon convention), add a background-color cutout stroke (width ~11, same path, drawn under the gold) so the arrow reads cleanly crossing the heart line. For transparent-background exports (print, OG image), use an SVG `<mask>` instead of a literal colored stroke.

## Verification Status
- `npm run build` — PASS after every round of changes this session, including the mobile fix.
- Mechanical design detector (`impeccable`'s `detect.mjs`) — zero findings throughout.
- Mobile fix specifically verified in-browser at ~500px and ~340px-requested viewports (Chrome automation's resize tool is unreliable on reused tabs in this environment — opening a fresh tab before resizing made it work; noting this in case it recurs) — confirmed Features/Screenshots/Merch all visible in nav, no phantom "Get notified" button, "Coming soon" reads as plain non-interactive text next to the hero's real button.
- **Live-site confirmed post-deploy**: `curl`'d amorbudget.com after the push, saw stale content briefly (`x-vercel-cache: MISS` but old HTML — deploy still building), waited ~60s via a scheduled wakeup, re-checked, confirmed 0 occurrences of "Get notified" and "Coming soon" present; loaded the live URL in-browser at mobile width and visually confirmed.

## Active Goals
- Finish the icon rebrand across all three surfaces: app (regenerate `resources/icon.png` etc.), this site (nav icon, OG image), merch (done).
- Get the Printful store connected and billing set up (both need the user directly).

## Open Blockers
- **Printful store not connected yet**, billing not set up — both require the user's direct action (account/payment details).
- **amor-budget's own icon.png/favicons still show the old heart+coin mark** — separate repo (`/Users/vubl/projects/amor-budget`), whose own `.claude/HANDOFF.md` has an unrelated, still-open blocker (Google Sign-In uncommitted, waiting on phone reconnect) that this thread hasn't touched — don't conflate the two.

## Next 3 Actions (in order)
1. Ask the user whether to proceed now with regenerating the app icon assets (amor-budget's `resources/icon.png`, `public/favicon.png`, `public/icon-512.png`, iOS `AppIcon` asset catalog) using the canonical SVG above.
2. Once the app icon is regenerated, update this site's `Nav.astro` icon image and add/update an Open Graph image using the same mark.
3. Check back on Printful account setup (store connection + billing) — needs the user directly.

## Resume Prompt
Copy-paste this into a fresh session:

> Read `.claude/HANDOFF.md` in /Users/vubl/projects/amorbudget-site, then continue from "Next 3 Actions" item 1. Do not re-ask intake questions or re-derive the heart+arrow icon geometry — the canonical SVG path data is in this file's "The icon's source SVG" section, sourced from the user's own DesignSync work (project a06787d6-8087-4ce2-abbf-a6e45c064cef, section 28a). The site is live at amorbudget.com, the mobile nav/CTA bugs the user reported from their phone are fixed and confirmed live, and the Printful shirt design is done. What's left: regenerate amor-budget's actual app icon/favicons with the new mark, update this site's nav icon/OG image to match, then follow up on Printful's store-connection and billing steps (both need the user directly).

## Files Touched This Session (this fork)
```
amorbudget-site/ — commit cdeb205 "Fix mobile nav and hero CTA"
  src/components/Nav.astro   — removed "Get notified" button; mobile media query no
                               longer hides Features/Screenshots/Merch, just tightens
                               gap/font-size instead
  src/components/Hero.astro — removed "Get notified at launch" mailto button;
                               hero-actions now has "See how it works" + a plain
                               static "Coming soon" text label
  .claude/HANDOFF.md, .claude/PROJECT.md — added in a prior fork, present in this commit
```
