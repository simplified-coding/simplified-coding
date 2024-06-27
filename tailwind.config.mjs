/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"sc-purple": "#442C80",
				"sc-purple-light": "#737fD5",
				"sc-background": "#4B2265",
				"sc-roadmap": "#A46AC9"
			}
		},
	},
	plugins: [],
}