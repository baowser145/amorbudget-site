/**
 * Recommended money resources for the Resources section.
 *
 * Add entries when you're ready. Each item can use a full affiliate URL
 * in `url`, or a plain product URL plus `site.affiliate.amazonTag` in
 * site.ts (Amazon only).
 *
 * Disclosure: the Resources section shows a short affiliate notice when
 * any item has `affiliate: true`.
 */

export type ResourceType = 'book' | 'podcast' | 'article' | 'tool' | 'course';

export interface Resource {
  /** Display title */
  title: string;
  /** Author, host, or publisher — optional */
  author?: string;
  /** One or two sentences: why this is worth someone's time */
  description: string;
  /** Destination URL (affiliate or plain) */
  url: string;
  type: ResourceType;
  /**
   * When true, the card is marked as an affiliate link
   * (rel="sponsored noopener noreferrer") and counts toward the disclosure.
   */
  affiliate?: boolean;
}

/**
 * Empty by design — fill this list when you have picks and links.
 *
 * Example:
 *
 * {
 *   title: 'The Psychology of Money',
 *   author: 'Morgan Housel',
 *   description: 'Short stories on how people think about money, risk, and enough.',
 *   url: 'https://www.amazon.com/dp/EXAMPLE',
 *   type: 'book',
 *   affiliate: true,
 * },
 */
export const resources: Resource[] = [];

export const resourceTypeLabel: Record<ResourceType, string> = {
  book: 'Book',
  podcast: 'Podcast',
  article: 'Article',
  tool: 'Tool',
  course: 'Course',
};
