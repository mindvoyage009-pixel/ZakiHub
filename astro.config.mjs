import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zakihub.eu.org',
  // base: '/zakihub', // فعل هذا السطر لو استخدمت github.io/zakihub
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: true
    }
  }
});
