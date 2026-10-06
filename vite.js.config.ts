import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(import.meta.dirname, 'dist/index.js'),
			name: 'CookieConsent',
			fileName: 'cookie-consent',
		},
		outDir: 'dist-js',
	},
	plugins: [
		svelte({
			preprocess: vitePreprocess(),
			compilerOptions: {
				customElement: true,
			},
		}),
	],
});
