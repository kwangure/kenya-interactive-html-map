import adapter from '@sveltejs/adapter-static';
// import { preprocessConfig } from "@kwangure/strawberry/config/index.js";
import { viteSingleFile } from "vite-plugin-singlefile"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// preprocess: preprocessConfig,
	kit: {
		adapter: adapter(),
		inlineStyleThreshold: 100000000,
		vite: {
			optimizeDeps: {
				exclude: ["svelte-preprocess"]
			},
			plugins: [
				viteSingleFile(),
			],
			build: {
				assetsInlineLimit: 100000000,
				chunkSizeWarningLimit: 100000000,
				brotliSize: false,
				rollupOptions: {
					inlineDynamicImports: true,
					output: {
						manualChunks: () => "everything.js",
					},
				},
			}
		},
	},
};

export default config;
