// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Needed for absolute og:image / og:url — social scrapers reject relative paths.
  site: 'https://amorbudget.com',
});
