/**
 * Site-wide links and labels. Update these when Shopify or affiliate
 * accounts go live — no component edits required for the URL itself.
 */
export const site = {
  name: 'Amor Budget',
  tagline: "Budgeting you'll actually love",
  /**
   * Routed through Cloudflare Email Routing on amorbudget.com, not a personal
   * inbox. It is the address filed as the App Store support contact, printed
   * in the app's Privacy and Terms screens, and named in the domain's DMARC
   * record, so it has to keep receiving for as long as the app is listed.
   */
  contactEmail: 'support@amorbudget.com',

  /**
   * The live App Store listing (released 2026-08). Every download button on
   * the site points here — Hero, Nav, and Closing all read from this one
   * field.
   */
  appStore: {
    url: 'https://apps.apple.com/us/app/amor-budget/id6802398906',
    label: 'Download on the App Store',
  },

  /**
   * Shopify storefront. Shopify cannot be hosted at amorbudget.com/merch —
   * subdomains only — so /merch is our own Astro page and Shopify handles
   * checkout from there. Swap this for shop.amorbudget.com once that domain
   * is pointed at Shopify; product URLs in products.ts need the same swap.
   */
  shop: {
    url: 'https://shop.amorbudget.com',
    brand: 'Amor Budget',
    label: 'Shop merch',
    blurb: 'Wearable proof you budget on purpose.',
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

/** True when the Shopify storefront link is configured. */
export function hasShopUrl(): boolean {
  return Boolean(site.shop.url?.trim());
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
