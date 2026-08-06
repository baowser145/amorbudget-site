/**
 * Site-wide links and labels. Update these when Shopify or affiliate
 * accounts go live — no component edits required for the URL itself.
 */
export const site = {
  name: 'Amor Budget',
  tagline: "Budgeting you'll actually love",
  contactEmail: 'baohuylamvu@gmail.com',

  /**
   * Shopify storefront. Paste the live URL when the store is ready, e.g.
   *   'https://amor-budget.myshopify.com'
   * Shopify cannot be hosted at amorbudget.com/merch — subdomains only — so
   * /merch is our own Astro page and Shopify handles checkout from there.
   */
  shop: {
    url: '',
    brand: 'Amor Budget',
    label: 'Shop merch',
    blurb: 'Wearable proof you budget on purpose.',
  },

  /**
   * The single product on /merch. Add more only when there is more than one
   * thing to sell — a one-product array is worse than a one-product object.
   *
   * `url` is the direct Shopify product page; leaving it empty puts /merch in
   * its "not yet" state instead of shipping a dead Buy button.
   *
   * `images` are paths under public/. Export mockups from Printify and drop
   * them in public/merch/. Empty renders a placeholder frame, not a broken img.
   */
  product: {
    url: '',
    eyebrow: 'Launch edition',
    name: 'Amor Budget v1 Tee',
    // PLACEHOLDER — set this to the real Shopify retail price.
    price: '$34',
    blurb:
      'Amor Budget v1 shipped. This shirt marks it. Garment-dyed heavyweight cotton that keeps fading and softening the longer you own it.',
    images: [] as { src: string; alt: string }[],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    specs: [
      '100% cotton',
      '6.0 oz./yd.² (203.4 g/m²)',
      'Relaxed fit',
      'Garment-dyed for a vintage finish',
      'Wide rib collar',
      'American Apparel 1301GD',
    ],
    note: 'Every shirt takes the dye a little differently, so yours will vary slightly from the photo. That is the finish doing its job, not a flaw.',
  },

  /**
   * Affiliate setup for Recommended Resources.
   * After you join Amazon Associates (or another network), either:
   *   1. Put full affiliate URLs on each resource in resources.ts, or
   *   2. Set amazonTag and use plain Amazon product URLs — the
   *      Resources section appends ?tag= when the host is amazon.
   */
  affiliate: {
    amazonTag: '',
  },
} as const;

/** True when Merch should open the external store. */
export function hasShopUrl(): boolean {
  return Boolean(site.shop.url?.trim());
}

/** True when /merch can show a working Buy button. */
export function hasProductUrl(): boolean {
  return Boolean(site.product.url?.trim());
}

/**
 * Append Amazon Associates tag to amazon product URLs when configured.
 * Non-Amazon URLs and already-tagged links are returned unchanged.
 */
export function withAffiliate(url: string): string {
  const tag = site.affiliate.amazonTag?.trim();
  if (!tag || !url) return url;

  try {
    const u = new URL(url);
    const isAmazon =
      /(^|\.)amazon\.(com|co\.uk|ca|de|fr|es|it|com\.au)$/i.test(u.hostname);
    if (!isAmazon) return url;
    if (!u.searchParams.has('tag')) {
      u.searchParams.set('tag', tag);
    }
    return u.toString();
  } catch {
    return url;
  }
}
