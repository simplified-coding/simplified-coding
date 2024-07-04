// SPDX-FileCopyrightText: 2024 The Simplified Coding Team <main@simplifiedcoding.org>
//
// SPDX-License-Identifier: CC0-1.0

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"sc-purple": "#442C80",
				"sc-purple-light": "#737fD5",
				"sc-background": "#4B2265",
				"sc-roadmap": "#A46AC9",
				"sc-navbar": "#9fA1A4",
				"sc-card-bg-light": "#434549",
				"sc-card-header": "#252A2E", 
				"sc-card-bg": "#212529",
				"sc-white": "#AEB5BD"
			},
			maxHeight: {
				'timeline-height': '47rem',
			  },
			margin: {
				'920px': '-720px',
			}
		},
	},
	plugins: [],
}
