# Merch Storefront Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/merch` real product photography and a keyboard-accessible gallery, then extend the Amor Budget brand onto a duplicated Shopify Horizon theme, so the site and checkout read as one brand.

**Architecture:** Two independent phases. Phase A changes the Astro site: images move into the repo as build-optimized assets, and the existing two-column product page gains a swappable front/back gallery. Phase B never touches the site; it duplicates the live Horizon theme and writes brand settings onto the copy, which the user publishes by hand.

**Tech Stack:** Astro 7.1.4, `astro:assets`, `@fontsource/nunito`, Shopify Admin GraphQL API via MCP, Vercel (deploys on push to `main`).

## Global Constraints

- **No test runner exists in this repo.** `package.json` has exactly two dependencies (`astro`, `@fontsource/nunito`) and no test script. Verification in every task is `npm run build` plus assertions against the generated `dist/` HTML. Do not add a test framework as part of this work.
- **Never write to the MAIN theme.** Theme ID `gid://shopify/OnlineStoreTheme/190034018377` is live. The Admin API blocks writes to it and blocks publishing. All theme writes target a duplicate.
- **Brand tokens are fixed** and defined in `src/styles/global.css`: cream `#f7f4ec`, sage `#5f7a52`, sage-hover `#4a633f`, ink `#2b2e23`, Nunito, radii 14-44px.
- **Contrast floor is 4.5:1** for body-size text. `--ab-accent` on cream measures 4.35:1 and must not be used for small text.
- **Pushing to `main` deploys to production.** Commit freely; push only when a phase is complete and verified.
- Product: handle `amor-budget-v1-0-0-launch-edition`, GID `gid://shopify/Product/15643563130953`.

---

## File Structure

| File | Responsibility | Change |
|---|---|---|
| `src/assets/merch/v1-tee-front.jpg` | Front mockup, build-optimized | Create |
| `src/assets/merch/v1-tee-back.jpg` | Back mockup | Create |
| `src/data/products.ts` | Catalog data; now carries typed image imports | Modify |
| `src/components/ProductCard.astro` | Catalog tile | Modify |
| `src/pages/merch/[slug].astro` | Product page and gallery | Modify |
| `src/styles/global.css` | Contrast-safe accent token | Modify |

---

## Phase A: Astro site

### Task 1: Bring product photography into the repo

**Files:**
- Create: `src/assets/merch/v1-tee-front.jpg`, `src/assets/merch/v1-tee-back.jpg`
- Modify: `src/data/products.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `Product.images` retyped as `{ src: ImageMetadata; alt: string }[]`. Tasks 2 and 3 consume this type.

- [ ] **Step 1: Download both mockups**

```bash
mkdir -p src/assets/merch
curl -sL -o src/assets/merch/v1-tee-front.jpg \
  "https://cdn.shopify.com/s/files/1/0988/8055/3033/files/unisex-garment-dyed-heavyweight-cotton-tee-faded-cream-front-6a741c86ef7a8.jpg?v=1785994390"
curl -sL -o src/assets/merch/v1-tee-back.jpg \
  "https://cdn.shopify.com/s/files/1/0988/8055/3033/files/unisex-garment-dyed-heavyweight-cotton-tee-faded-cream-back-6a741c86f08c3.jpg?v=1785994392"
```

- [ ] **Step 2: Verify both files are real 2000x2000 JPEGs, not HTML error pages**

```bash
file src/assets/merch/*.jpg
```

Expected: both report `JPEG image data`, `2000x2000`. If either says `HTML document`, the CDN URL expired. Re-fetch the current URL with the Shopify MCP `graphql_query` on `product.media` before continuing.

- [ ] **Step 3: Retype the image field in `src/data/products.ts`**

Add the type import at the top of the file, next to the existing `import { site } from './site';`:

```ts
import type { ImageMetadata } from 'astro';
import frontImage from '../assets/merch/v1-tee-front.jpg';
import backImage from '../assets/merch/v1-tee-back.jpg';
```

Change the interface field from `images: { src: string; alt: string }[];` to:

```ts
  /** First entry is the hero. Imported assets, so Astro can optimize them. */
  images: { src: ImageMetadata; alt: string }[];
```

- [ ] **Step 4: Populate the tee's images with real alt text**

Replace `images: [],` in the `v1-launch-tee` entry with:

```ts
    images: [
      {
        src: frontImage,
        alt: 'Front of the Amor Budget v1 tee in faded cream, with the heart piggy bank logo at center chest.',
      },
      {
        src: backImage,
        alt: 'Back of the Amor Budget v1 tee in faded cream, showing the plain garment-dyed body.',
      },
    ],
```

- [ ] **Step 5: Build and confirm the type change compiles**

Run: `npm run build`
Expected: PASS. If it fails with a type error in `ProductCard.astro` or `[slug].astro`, that is expected at this point; those consume `hero.src` as a string. Proceed to Task 2, which fixes them, then re-run.

- [ ] **Step 6: Commit**

```bash
git add src/assets/merch src/data/products.ts
git commit -m "Bring merch product photography into the repo"
```

---

### Task 2: Render merch images through astro:assets

**Files:**
- Modify: `src/components/ProductCard.astro:1-20`
- Modify: `src/pages/merch/[slug].astro:44-64`

**Interfaces:**
- Consumes: `Product.images[].src` as `ImageMetadata` from Task 1.
- Produces: optimized `<picture>`/`<img>` markup with srcset. Task 3 restructures the thumbnails this task emits.

- [ ] **Step 1: Update `ProductCard.astro`**

Add to the frontmatter, below `import type { Product } from '../data/products';`:

```ts
import { Image } from 'astro:assets';
```

Replace the `<img ... />` line inside `.card-media` with:

```astro
<Image
  src={hero.src}
  alt={hero.alt}
  widths={[400, 600, 900]}
  sizes="(max-width: 720px) 90vw, 340px"
  loading="lazy"
  class="card-shot"
/>
```

- [ ] **Step 2: Update the hero image in `[slug].astro`**

Add `import { Image } from 'astro:assets';` to the frontmatter. Replace the hero `<img class="shot" ... />` with:

```astro
<Image
  class="shot"
  src={hero.src}
  alt={hero.alt}
  widths={[600, 900, 1200]}
  sizes="(max-width: 900px) 92vw, 560px"
  loading="eager"
/>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Assert the placeholder is gone and srcset is present**

```bash
grep -c "Product photo coming" dist/merch/v1-launch-tee/index.html || echo "placeholder gone (0 matches)"
grep -o 'srcset="[^"]\{0,60\}' dist/merch/v1-launch-tee/index.html | head -2
grep -o '\.webp' dist/merch/v1-launch-tee/index.html | head -1
```

Expected: zero matches for the placeholder string; at least one `srcset`; at least one `.webp` reference.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.astro "src/pages/merch/[slug].astro"
git commit -m "Render merch images through astro:assets"
```

---

### Task 3: Make the front/back gallery swappable by mouse and keyboard

**Files:**
- Modify: `src/pages/merch/[slug].astro` (the `.product-media` block and its `<style>`)

**Interfaces:**
- Consumes: `Product.images` from Task 1, `<Image>` usage from Task 2.
- Produces: nothing consumed downstream.

The current markup renders non-interactive `<li><img></li>` thumbnails. Replace them with real `<button>` elements so they are focusable and operable by keyboard without custom key handling.

- [ ] **Step 1: Replace the `.product-media` inner markup**

```astro
<div class="product-media" data-reveal>
  <div class="stage">
    {product.images.map((img, i) => (
      <Image
        class:list={['shot', { 'is-active': i === 0 }]}
        data-shot={i}
        src={img.src}
        alt={img.alt}
        widths={[600, 900, 1200]}
        sizes="(max-width: 900px) 92vw, 560px"
        loading={i === 0 ? 'eager' : 'lazy'}
      />
    ))}
    {product.images.length === 0 && (
      <div class="shot shot-empty"><span>Product photo coming</span></div>
    )}
  </div>
  {product.images.length > 1 && (
    <ul class="thumbs">
      {product.images.map((img, i) => (
        <li>
          <button
            type="button"
            class:list={['thumb', { 'is-active': i === 0 }]}
            data-thumb={i}
            aria-label={`View image ${i + 1} of ${product.images.length}`}
            aria-pressed={i === 0 ? 'true' : 'false'}
          >
            <Image src={img.src} alt="" widths={[120, 240]} sizes="72px" loading="lazy" />
          </button>
        </li>
      ))}
    </ul>
  )}
</div>
```

Note: thumbnail `alt` is intentionally empty. The button's `aria-label` carries the accessible name, so alt text there would be read twice.

- [ ] **Step 2: Add the stage styles to the existing `<style>` block**

```css
  .stage {
    position: relative;
    display: grid;
  }

  .stage .shot {
    grid-area: 1 / 1;
    width: 100%;
    height: auto;
    opacity: 0;
    transition: opacity 240ms var(--ease-out);
  }

  .stage .shot.is-active {
    opacity: 1;
  }

  .thumb {
    padding: 0;
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    background: none;
    cursor: pointer;
    overflow: hidden;
    line-height: 0;
  }

  .thumb.is-active {
    border-color: var(--ab-accent);
  }

  .thumb img {
    width: 72px;
    height: 72px;
    object-fit: cover;
  }

  @media (prefers-reduced-motion: reduce) {
    .stage .shot {
      transition: none;
    }
  }
```

- [ ] **Step 3: Add the swap script at the end of the file, outside the `<style>` block**

```astro
<script>
  document.querySelectorAll<HTMLElement>('.product-media').forEach((media) => {
    const shots = media.querySelectorAll<HTMLElement>('[data-shot]');
    const thumbs = media.querySelectorAll<HTMLButtonElement>('[data-thumb]');

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = thumb.dataset.thumb;
        shots.forEach((s) => s.classList.toggle('is-active', s.dataset.shot === index));
        thumbs.forEach((t) => {
          const on = t.dataset.thumb === index;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-pressed', String(on));
        });
      });
    });
  });
</script>
```

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Assert both images and two buttons render**

```bash
grep -c 'data-shot=' dist/merch/v1-launch-tee/index.html
grep -c 'data-thumb=' dist/merch/v1-launch-tee/index.html
```

Expected: 2 and 2.

- [ ] **Step 6: Check it by hand in a browser**

Run: `npm run dev`, open `http://localhost:4321/merch/v1-launch-tee`.
Confirm: clicking the second thumbnail swaps the main image; pressing Tab reaches both thumbnails and Enter/Space activates them; the active thumbnail shows a sage border.

- [ ] **Step 7: Commit**

```bash
git add "src/pages/merch/[slug].astro"
git commit -m "Make the merch gallery swappable by mouse and keyboard"
```

---

### Task 4: Fix accent contrast on cream

**Files:**
- Modify: `src/styles/global.css`
- Modify: any merch rule using `--ab-accent` for body-size text

`--ab-accent` `#5f7a52` on `--ab-bg` `#f7f4ec` measures 4.35:1, under the 4.5:1 floor for text below 18.66px bold / 24px regular. It remains fine for borders, icons, large headings, and button fills.

- [ ] **Step 1: Add a text-safe accent token**

In the `:root` block of `src/styles/global.css`, directly after `--ab-accent-hover: #4a633f;`:

```css
  /* 6.07:1 on --ab-bg. Use for accent-colored text at body size;
     --ab-accent is 4.35:1 and is for fills, borders, and large type only. */
  --ab-accent-text: #4a633f;
```

- [ ] **Step 2: Find small text currently using the un-safe token**

```bash
grep -rn "color: var(--ab-accent)" src/
```

For each hit, decide by rendered size: if the rule's `font-size` is below 18px, change it to `var(--ab-accent-text)`. Leave fills, borders, and headings 24px and up on `--ab-accent`. Known candidates are `.next-eyebrow` and `.next-link` in `src/pages/merch/index.astro`, both around 11-15px.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Verify the substitution landed**

```bash
grep -rn "ab-accent-text" src/ | wc -l
```

Expected: at least 3 (one definition plus the replaced usages).

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/pages/merch/index.astro
git commit -m "Add a contrast-safe accent token for body-size text"
```

---

### Task 5: Sticky buy panel on desktop

**Files:**
- Modify: `src/pages/merch/[slug].astro` `<style>` block

- [ ] **Step 1: Read the existing `.product` grid rule first**

```bash
grep -n -A12 "\.product {" "src/pages/merch/[slug].astro"
```

The two-column layout already exists. Only add stickiness; do not restructure the grid.

- [ ] **Step 2: Add the sticky rule, scoped to wide viewports and motion-safe**

```css
  @media (min-width: 900px) {
    .product-info {
      position: sticky;
      top: 96px;
      align-self: start;
    }
  }
```

`top: 96px` matches the `scroll-padding-top` already set on `html` in `global.css`, so the panel clears the fixed nav.

- [ ] **Step 3: Build and check by hand**

Run: `npm run build && npm run dev`
Confirm at 1440px wide: scrolling the page keeps the buy panel visible while the image column scrolls. At 375px the panel is not sticky and nothing overlaps.

- [ ] **Step 4: Commit**

```bash
git add "src/pages/merch/[slug].astro"
git commit -m "Keep the buy panel in view while the product images scroll"
```

---

### Task 6: Correct the alt text on Shopify's product media

**Files:** none in the repo. This is a Shopify API change.

Both media records carry the alt text `"Product mockup"`, which is what screen readers announce on the storefront.

- [ ] **Step 1: Confirm the mutation name and input shape before calling it**

Use the Shopify MCP `graphql_schema` tool on `Mutation` and locate the media update mutation. Do not guess the name. Then validate with `validate_graphql_codeblocks` before executing.

- [ ] **Step 2: Update both media records**

Media IDs:
- Front: `gid://shopify/MediaImage/71843415457865`
- Back: `gid://shopify/MediaImage/71843415490633`

Use the same alt strings written in Task 1 Step 4, so the site and the storefront describe the product identically.

- [ ] **Step 3: Verify**

```graphql
{ product(id: "gid://shopify/Product/15643563130953") {
    media(first: 10) { edges { node { ... on MediaImage { alt } } } } } }
```

Expected: neither record still reads `"Product mockup"`.

---

### Task 7: Ship Phase A

- [ ] **Step 1: Full build from clean**

```bash
rm -rf dist && npm run build
```

Expected: PASS, 3 pages built.

- [ ] **Step 2: Push**

```bash
git push origin main
```

- [ ] **Step 3: Verify production**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.amorbudget.com/merch/v1-launch-tee
curl -s https://www.amorbudget.com/merch/v1-launch-tee | grep -c "Product photo coming"
```

Expected: `200`, and `0` placeholder matches. Allow roughly 30 seconds for Vercel to build.

---

## Phase B: Shopify Horizon theme

Phase B is independent of Phase A and can be done before, after, or in parallel. It changes nothing in this repo.

### Task 8: Duplicate the live theme

- [ ] **Step 1: Duplicate**

```graphql
mutation {
  themeDuplicate(id: "gid://shopify/OnlineStoreTheme/190034018377", name: "Amor Budget brand") {
    theme { id name role }
    userErrors { field message }
  }
}
```

Validate with `validate_graphql_codeblocks` first. Record the returned theme ID; every later step targets it.

- [ ] **Step 2: Confirm the duplicate is unpublished**

```graphql
{ themes(first: 10) { edges { node { id name role } } } }
```

Expected: the new theme has role `UNPUBLISHED` or `DEVELOPMENT`, and Horizon still holds `MAIN`. **If the new theme reports `MAIN`, stop and report it.** Something published it, and that is not the intended state.

---

### Task 9: Learn Horizon's real setting names

Horizon's setting keys are not guessable and differ between theme versions. Read them.

- [ ] **Step 1: Fetch the schema and current settings from the duplicate**

Query `theme.files` on the duplicate for `config/settings_schema.json` and `config/settings_data.json`, reading the file bodies.

- [ ] **Step 2: Write down the exact keys for**

- The color scheme group (Horizon uses named schemes, not flat color settings)
- Heading font and body font pickers, and whether `nunito` is an available handle
- Corner radius or border radius settings
- Button style settings
- Whether a custom CSS setting exists, or whether an asset file is required

**Findings, recorded 2026-08-06.** Duplicate theme: `gid://shopify/OnlineStoreTheme/190048370761`.

| Question | Answer |
|---|---|
| Colour model | A single `color_palette` object with four keys: `background`, `foreground`, `color1`, `color2`. Around thirty other settings interpolate it as `{{ settings.color_palette.X }}`, so changing the four cascades. Per-element overrides accept literal hex. |
| Fonts | `type_body_font`, `type_subheading_font`, `type_heading_font`, `type_accent_font`. Format is `family_weight`, e.g. `inter_n4`. |
| Nunito available? | **Yes.** `nunito_n4` and `nunito_n7` both validated and the preview serves `nunito_n4...woff2`. No substitution needed. |
| Radius settings | `card_corner_radius`, `product_corner_radius`, `button_border_radius_primary`/`_secondary`, `inputs_border_radius`, `popover_border_radius`, `variant_button_radius`, `badge_corner_radius`. |
| Radius limits | `card_corner_radius` and `popover_border_radius` are **capped at 16**; the API rejects anything higher. `product_corner_radius` and the button radii accept larger values. So `--radius-lg: 28px` cannot be matched on cards. |
| Custom CSS | No custom-CSS setting is present in `settings_data.json`. Not pursued: the palette and radius settings carried the brand on their own, and an asset file would be maintenance for shadow softness alone. |

- [x] **Step 3: Record the answers in the plan file before writing anything**

If Nunito is unavailable in the font picker, choose the closest available face and note the substitution here. Do not inject a webfont via custom CSS as a workaround.

---

### Task 10: Write brand settings onto the duplicate

- [ ] **Step 1: Compose the settings change**

Using only the keys confirmed in Task 9, map:

| Brand value | Target |
|---|---|
| `#f7f4ec` | Scheme background |
| `#2b2e23` | Scheme text |
| `#5f7a52` | Button fill, accent |
| `#4a633f` | Button hover, accent text |
| Nunito | Heading and body font |
| 28px | Corner radius, matching `--radius-lg` |

- [ ] **Step 2: Upsert onto the duplicate only**

```graphql
mutation ThemeWrite($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
  themeFilesUpsert(themeId: $themeId, files: $files) {
    upsertedThemeFiles { filename }
    userErrors { field message }
  }
}
```

Double-check `$themeId` is the duplicate from Task 8, not `190034018377`.

- [ ] **Step 3: Add custom CSS for what settings cannot express**

Only if Task 9 confirmed the mechanism. Target the soft shadow and spring easing:

```css
:root {
  --ab-shadow-card: 0 20px 50px -24px rgba(43, 46, 35, 0.2);
  --ab-ease-spring: cubic-bezier(0.32, 0.72, 0, 1);
}
.card, .product-card, .card-gallery {
  box-shadow: var(--ab-shadow-card);
  transition: transform 320ms var(--ab-ease-spring);
}
@media (prefers-reduced-motion: reduce) {
  .card, .product-card, .card-gallery { transition: none; }
}
```

Selector names are placeholders until Task 9 confirms Horizon's actual classes. Verify against the theme's own CSS before writing.

- [ ] **Step 4: Hand off for preview**

Give the user the preview URL for the duplicated theme and confirm the live store is unchanged:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://tcniga-y0.myshopify.com/products/amor-budget-v1-0-0-launch-edition
```

Expected: `200`, still rendering the original Horizon styling. Publishing is the user's call and cannot be done through the API.

---

## Self-Review

**Spec coverage:**

| Spec item | Task |
|---|---|
| A1 photography into `src/assets/merch/`, `<Image>` | 1, 2 |
| A2 front/back gallery, click and keyboard | 3 |
| A3 two-column with sticky buy panel | 5 (grid already exists) |
| A4 size chips S-3XL | Already implemented; no task needed |
| A5 view transitions | **Deferred, see below** |
| A6 real alt text | 1 (site), 6 (Shopify) |
| A7 catalog stagger reveal | **Deferred, see below** |
| B1-B4 duplicate, read schema, upsert, hand off | 8, 9, 10 |
| Contrast 4.5:1 | 4 |

**Two deferrals, both deliberate:**

- **A5 view transitions.** Astro renamed `ViewTransitions` to `ClientRouter` in Astro 5, and this project is on 7.1.4. Rather than write steps against an API I have not confirmed for this version, this needs a docs check first, per the project's rule about building against third-party APIs. It is also the least valuable item on the list: nice motion on a two-page catalog. Pulled from this plan; raise it as a follow-up once the current API is confirmed.
- **A7 catalog stagger.** `data-reveal` scroll-reveal already exists site-wide and fires on the merch grid. Adding a second, GSAP-flavored stagger would mean a new dependency for one grid of one card. YAGNI. Revisit when the catalog has enough products for the effect to read.

**Placeholder scan:** One knowing placeholder remains, in Task 10 Step 3, where the CSS selectors depend on Task 9's schema read. It is labeled as such with an instruction to verify. Everything else carries real values.

**Type consistency:** `Product.images[].src` is `ImageMetadata` from Task 1 onward, consumed as `hero.src` and `img.src` in Tasks 2 and 3. `--ab-accent-text` is defined in Task 4 Step 1 and used in Step 2. Media GIDs in Task 6 match the values returned by the Shopify query. Theme ID `190034018377` is referenced only as the duplication source and as a guard against writing to it.
