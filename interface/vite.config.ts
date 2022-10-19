import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from "path"

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			src: path.resolve('./src'),
			protocol: path.resolve('../protocol')
		}
	}
};

export default config;
