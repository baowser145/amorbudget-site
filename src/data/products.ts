/**
 * The merch catalog.
 *
 * Shopify owns checkout; this file owns everything the customer sees before
 * they get there. Adding a product means adding an entry here and dropping
 * mockups in public/merch/ — no component edits.
 *
 * Products store a Shopify handle, not a full URL, so moving the storefront
 * to a new domain is one edit in site.ts. An empty handle renders the product
 * in its "not yet" state instead of shipping a Buy button that 404s, which is
 * why a design can live here before the Shopify listing exists.
 */
import type { ImageMetadata } from 'astro';
import { site } from './site';
import frontImage from '../assets/merch/v1-tee-front.jpg';
import backImage from '../assets/merch/v1-tee-back.jpg';

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
  /** Shopify product handle, e.g. 'amor-budget-v1-0-0-launch-edition'. */
  handle: string;
  /** First entry is the hero. Imported assets, so Astro can optimize them. */
  images: { src: ImageMetadata; alt: string }[];
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
    handle: 'amor-budget-v1-0-0-launch-edition',
    images: [
      {
        src: frontImage,
        alt: 'Front of the Amor Budget tee in faded cream, printed at center chest with the Amor Budget wordmark in stacked, overlapping letters in blue, teal, coral, peach and olive.',
      },
      {
        src: backImage,
        alt: 'Back of the Amor Budget tee in faded cream, unprinted, showing the relaxed cut and wide rib collar.',
      },
    ],
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

/** The Shopify product page, or '' when there is nothing to link to yet. */
export function productUrl(p: Product): string {
  const base = site.shop.url?.trim().replace(/\/$/, '');
  const handle = p.handle?.trim();
  return base && handle ? base + '/products/' + handle : '';
}

/** True when a product can show a working Buy button. */
export function isLive(p: Product): boolean {
  return Boolean(productUrl(p));
}
