// SPDX-FileCopyrightText: 2024 The Simplified Coding Team <main@simplifiedcoding.org>
//
// SPDX-License-Identifier: CC0-1.0

import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [mdx()],
  adapter: vercel()
});