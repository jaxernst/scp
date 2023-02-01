// @ts-nocheck
export function swipeColor(node, params) {
	const { duration, delay, easing } = params || {};
	const { color } = window.getComputedStyle(node);
	return {
		duration,
		delay,
		easing,
		css(t) {
			// transform t from range [0.5, 1] into percentage [0, 100]
			// t: 0.5 -> 1
			// u: 0 -> 0.5
			const u = t;
			// percentage: 0 -> 100
			const percentage = u * 200;
			return `background: linear-gradient(to left, transparent 0, ${percentage}%, ${color} ${percentage}%); color: ${color}`;
		}
	};
}
