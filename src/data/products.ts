/**
 * The merch catalog.
 *
 * Shopify owns checkout; this file owns everything the customer sees before
 * they get there. Adding a product means adding an entry here and dropping
 * mockups in public/merch/ — no component edits.
 *
 * `url` is the Shopify product page. Empty means the product renders in its
 * "not yet" state instead of shipping a Buy button that 404s, which is why
 * a design can live here before the Shopify listing exists.
 */
export interface Product {
  /** URL segment: /merch/<slug> */
  slug: string;
  name: string;
  eyebrow: string;
  /** Lowest variant price. Bigger sizes cost more, so this is a floor. */
  priceFrom: string;
  /** One line for the catalog card. */
  tagline: string;
  /** Full paragraph for the product page. */
  blurb: string;
  url: string;
  images: { src: string; alt: string }[];
  sizes: string[];
  specs: string[];
  note?: string;
}

export const products: Product[] = [
  {
    slug: 'v1-launch-tee',
    name: 'Amor Budget v1 Tee',
    eyebrow: 'Launch edition',
    priceFrom: '$36',
    tagline: 'Garment-dyed heavyweight cotton, natural.',
    blurb:
      'Amor Budget v1 shipped. This shirt marks it. Soft, heavy, and broken in from the first wear, on a garment-dyed tee that keeps fading and softening the longer you own it.',
    url: '',
    images: [],
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
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** True when a product can show a working Buy button. */
export function isLive(p: Product): boolean {
  return Boolean(p.url?.trim());
}
