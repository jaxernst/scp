import resolve from 'rollup-plugin-node-resolve';

export default {
	plugins: [
		resolve({
			dedupe: ['svelte', 'svelte/transition', 'svelte/internal'] // important!
		})
	]
};
