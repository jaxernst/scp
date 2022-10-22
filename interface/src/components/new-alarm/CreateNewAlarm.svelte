<script>
	import NumMembers from './options-cards/NumMembers.svelte';
	import PoolPenalty from './options-cards/PoolPenalty.svelte';
	import WakeupTime from './options-cards/WakeupTime.svelte';
	import { backIn, bounceOut, circIn, circInOut, cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { alarmParams } from './alarmCreationStore';

	export const flyParams = {
		in: { x: 500, duration: 400, easing: cubicInOut },
		out: { x: 500, duration: 400, easing: cubicInOut },
		setFlyFromRight: function () {
			this.in.x = Math.abs(this.in.x);
			this.out.x = -Math.abs(this.out.x);
		},
		setFlyFromLeft: function () {
			this.in.x = -Math.abs(this.in.x);
			this.out.x = Math.abs(this.out.x);
		}
	};

	const ops = {
		comps: [NumMembers, PoolPenalty, WakeupTime],
		headers: ['Number of Pool Members', 'Missed wakeup penalty', "Pool's Wakeup Time"],
		i: 0,
		active: () => ops.comps[Math.abs(ops.i) % ops.comps.length],
		activeHeader: () => ops.headers[Math.abs(ops.i) % ops.comps.length],
		next: () => ops.i++,
		previous: () => ops.i--
	};

	let trigger = false;
	const triggerEffect = () => {
		trigger = !trigger;
	};

	function swipeColor(node, params) {
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
</script>

<h3 style="position:relative; color:dimgray" transition:swipeColor={{ duration: 850 }}>
	Create a New Alarm Pool /
	<span class="header">
		Select {ops.activeHeader()}
	</span>
</h3>

<div class="container">
	<button
		class="button-left"
		on:click={() => {
			ops.previous();
			flyParams.setFlyFromRight();
			triggerEffect();
		}}
	>
		{'<'}</button
	>
	<div>
		<svelte:component this={ops.active()} {flyParams} />
	</div>
	<button
		class="button-right"
		on:click={() => {
			ops.next();
            flyParams.setFlyFromLeft();
			triggerEffect();
		}}>{'>'}</button
	>
</div>

<div style="display:flex; justify-content: center; padding:1em;">
	<button class="button-primary" style="width:90%">Create</button>
</div>

<style>
	h3 {
		text-align: left;
		margin-top: 0;
		margin-left: 5px;
	}

	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 150px;
		position: relative;
	}

	button {
		margin: 1em;
	}

	.header {
		color: var(--theme-color1);
		position: absolute;
		padding-left: 5px;
	}

	.button-left,
	.button-right {
		border: none;
		background-color: rgb(73, 73, 73);
		height: 50px;
		transition: 0.1s;
		color: white;
	}

	.button-left:hover,
	.button-right:hover {
		outline: 1px solid white;
	}
</style>
