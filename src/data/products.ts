/**
 * The merch catalog.
 *
 * Shopify owns checkout; this file owns everything the customer sees before
 * they get there. Adding a product means adding an entry here and dropping
 * mockups in src/assets/merch/ — no component edits.
 *
 * Products store a Shopify handle, not a full URL, so moving the storefront
 * to a new domain is one edit in site.ts. An empty handle renders the product
 * in its "not yet" state instead of shipping a Buy button that 404s, which is
 * why a design can live here before the Shopify listing exists.
 *
 * Prices and copy below are taken from the live storefront
 * (shop.amorbudget.com/products.json), not written fresh. `priceFrom` is the
 * cheapest variant — sizes above L and the bigger sticker sizes cost more —
 * so it must stay prefixed with "from" wherever it renders.
 */
import type { ImageMetadata } from 'astro';
import { site } from './site';

import v1Front from '../assets/merch/v1-tee-front.jpg';
import v1Back from '../assets/merch/v1-tee-back.jpg';
import appIconTee1 from '../assets/merch/app-icon-tee-1.jpg';
import appIconTee2 from '../assets/merch/app-icon-tee-2.jpg';
import heartTee1 from '../assets/merch/heart-receipt-tee-1.jpg';
import heartTee2 from '../assets/merch/heart-receipt-tee-2.jpg';
import imDueTee1 from '../assets/merch/im-due-tee-1.jpg';
import imDueTee2 from '../assets/merch/im-due-tee-2.jpg';
import imDueSweat1 from '../assets/merch/im-due-sweatshirt-1.jpg';
import imDueSweat2 from '../assets/merch/im-due-sweatshirt-2.jpg';
import sticker1 from '../assets/merch/app-icon-sticker-1.jpg';
import sticker2 from '../assets/merch/app-icon-sticker-2.jpg';

export interface Product {
  /** URL segment: /merch/<slug> */
  slug: string;
  name: string;
  /** Short name for the carousel thumbnails, where the full one won't fit. */
  shortName: string;
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
  /** Colourways, when the product has more than one. */
  colors?: string[];
  specs: string[];
  note?: string;
}

export const products: Product[] = [
  {
    slug: 'heart-receipt-tee',
    name: 'Heart & Receipt Oversized Tee',
    shortName: 'Heart & Receipt',
    eyebrow: 'Oversized',
    priceFrom: '$35',
    tagline: 'Two hand-drawn frames: a heart, and a receipt.',
    blurb:
      'Two hand-drawn frames across the chest: a heart in one, a receipt in the other. The whole argument about money in two small pictures. Printed in soft olive line art on a boxy organic cotton tee with a high ribbed neck and a deliberately roomy cut.',
    handle: 'amor-budget-heart-receipt-oversized-tee',
    images: [
      {
        src: heartTee1,
        alt: 'Front of the Heart & Receipt oversized tee in white, printed at centre chest with two olive line-art panels, a heart in one and a receipt in the other.',
      },
      {
        src: heartTee2,
        alt: 'Front of the Heart & Receipt oversized tee in black, showing the same two olive line-art panels and the high ribbed neckline.',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White'],
    specs: [
      '100% organic cotton, heavyweight',
      'Oversized boxy fit, drops off the shoulder',
      'High ribbed neckline',
      'Front print',
    ],
    note: 'Cut roomy on purpose. Size down for a closer fit.',
  },
  {
    slug: 'im-due-sweatshirt',
    name: "I'm Due Sweatshirt",
    shortName: "I'm Due Crew",
    eyebrow: 'Heavyweight crewneck',
    priceFrom: '$26',
    tagline: 'A back-neck print for the last week of the month.',
    blurb:
      "“I'm due” sits upside down at the back of the neck, small and quiet, the way a due date turns up whether you were ready for it or not. A heavyweight crewneck for the last week of the month — pre-shrunk, classic fit, air-jet spun yarn for a soft hand.",
    handle: 'amor-budget-im-due-sweatshirt',
    images: [
      {
        src: imDueSweat1,
        alt: "Front of the I'm Due crewneck sweatshirt in forest green, unprinted, showing the ribbed collar and classic fit.",
      },
      {
        src: imDueSweat2,
        alt: "Front of the I'm Due crewneck sweatshirt in black, showing the same ribbed collar and classic fit.",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    colors: ['Black', 'Forest Green', 'Dark Heather', 'Ash'],
    specs: [
      '50% cotton, 50% polyester',
      'Pre-shrunk, classic fit',
      '1x1 athletic rib knit collar with spandex',
      'Double-needle stitched collar, shoulders, armholes, cuffs and hem',
      'Back neck print',
    ],
    note: 'The Ash colourway reads warmer in daylight than it does on screen.',
  },
  {
    slug: 'im-due-tee',
    name: "I'm Due Oversized Tee",
    shortName: "I'm Due Tee",
    eyebrow: 'Oversized',
    priceFrom: '$30',
    tagline: 'The same line, said out loud at centre chest.',
    blurb:
      "“I'm due” in marker script at centre chest, right way up. The sweatshirt hides it at the back of the neck — this one says it out loud. A boxy organic cotton tee with a high ribbed neck, cut roomy on purpose, in deep French navy.",
    handle: 'amor-budget-im-due-oversized-tee',
    images: [
      {
        src: imDueTee1,
        alt: "Front of the I'm Due oversized tee in French navy, printed at centre chest with “I'm due” in marker script.",
      },
      {
        src: imDueTee2,
        alt: "Back of the I'm Due oversized tee in French navy, unprinted, showing the boxy cut and high ribbed neckline.",
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    specs: [
      '100% organic cotton, heavyweight',
      'Oversized boxy fit, drops off the shoulder',
      'High ribbed neckline',
      'Centre chest print',
    ],
    note: 'Cut roomy on purpose. Size down for a closer fit.',
  },
  {
    slug: 'app-icon-tee',
    name: 'App Icon Tee',
    shortName: 'App Icon Tee',
    eyebrow: 'Garment dyed',
    priceFrom: '$22',
    tagline: 'The app icon and wordmark, in pixel type.',
    blurb:
      'The app icon, worn. The Amor Budget heart mark sits in its rounded olive tile next to the wordmark set in pixel type, printed across the chest in a single olive green on faded cream. A heavyweight tee with a broken-in feel from day one.',
    handle: 'amor-budget-app-icon-tee',
    images: [
      {
        src: appIconTee1,
        alt: 'Front of the App Icon tee in faded cream, printed across the chest with the Amor Budget heart mark in a rounded olive tile beside the wordmark in pixel type.',
      },
      {
        src: appIconTee2,
        alt: 'Back of the App Icon tee in faded cream, unprinted, showing the relaxed cut and wide rib collar.',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    specs: [
      '100% cotton',
      '6.0 oz./yd.² (203.4 g/m²)',
      'Relaxed fit',
      'Garment-dyed for a vintage finish',
      'Wide rib collar',
    ],
    note: 'Printed after you order, so allow 2 to 5 business days before it ships.',
  },
  {
    slug: 'v1-launch-tee',
    name: 'Amor Budget v1 Tee',
    shortName: 'v1 Launch Tee',
    eyebrow: 'Launch edition',
    priceFrom: '$22',
    tagline: 'Garment-dyed heavyweight cotton, faded cream.',
    blurb:
      'Amor Budget v1.0.0 shipped. This shirt marks it. Soft, heavy, and broken in from the first wear, on a garment-dyed tee that keeps fading and softening the longer you own it.',
    handle: 'amor-budget-v1-0-0-launch-edition',
    images: [
      {
        src: v1Front,
        alt: 'Front of the Amor Budget tee in faded cream, printed at center chest with the Amor Budget wordmark in stacked, overlapping letters in blue, teal, coral, peach and olive.',
      },
      {
        src: v1Back,
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
  {
    slug: 'app-icon-sticker',
    name: 'App Icon Sticker',
    shortName: 'App Icon Sticker',
    eyebrow: 'Kiss-cut vinyl',
    priceFrom: '$3.50',
    tagline: 'Olive tile, cream heart, gold ring.',
    blurb:
      'The Amor Budget app icon, off the phone and onto your laptop. Kiss-cut vinyl with a matte finish and a white border. Goes on flat without bubbles and peels off without residue.',
    handle: 'amor-budget-app-icon-sticker',
    /*
     * Shopify's first image for this product is a laptop lifestyle shot, which
     * is the odd one out beside five flat garment mockups. The straight product
     * shot leads here instead; the lifestyle photo stays as the second image.
     */
    images: [
      {
        src: sticker2,
        alt: 'The Amor Budget app icon sticker: an olive rounded tile with a cream heart and a small gold ring, cut with a white border.',
      },
      {
        src: sticker1,
        alt: 'The Amor Budget app icon sticker applied to the lid of a laptop, beside a notebook and pens.',
      },
    ],
    sizes: ['3″×3″', '4″×4″', '5.5″×5.5″', '15″×3.75″'],
    specs: [
      'Durable vinyl, matte finish',
      'Bubble-free application',
      'Water resistant',
      'Four sizes, including a 15″ bumper strip',
    ],
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
