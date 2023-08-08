import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [mdx()],
  adapter: vercel()
});