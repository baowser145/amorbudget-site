// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Needed for absolute og:image / og:url — social scrapers reject relative
  // paths. Must be the www host: the apex 308-redirects here, and pointing
  // canonical or og:image at a redirect is what we're avoiding.
  site: 'https://www.amorbudget.com',
});
