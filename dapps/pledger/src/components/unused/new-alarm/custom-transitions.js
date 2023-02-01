import { cubicOut } from 'svelte/easing';

// @ts-ignore
export function expand(node, params) {
	const { delay = 0, duration = 400, easing = cubicOut } = params;

	const w = parseFloat(getComputedStyle(node).strokeWidth);

	return {
		delay,
		duration,
		easing,
		// @ts-ignore
		css: (t) => `opacity: ${t}; stroke-width: ${t * w}`
	};
}
