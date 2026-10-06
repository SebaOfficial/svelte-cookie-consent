import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: { customElement: true },
			adapter: adapter({ pages: 'build/demo', assets: 'build/demo' }),
			paths: { base: (process.env.BASE_PATH as `/${string}`) ?? '' },
		}),
	],
});
