<script lang="ts">
	import { onMount } from 'svelte';
	export let widthVw = 15;
	export let overrideTime: null | string = null;

	let date = new Date();

	$: time = overrideTime
		? overrideTime
		: date.toLocaleTimeString()[1] === ':'
		? '0' + date.toLocaleTimeString()
		: date.toLocaleTimeString();
	const time0 = new Date(0).toLocaleTimeString();

	onMount(() => {
		const timerId = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => {
			clearInterval(timerId);
		};
	});

</script>

<div class="clock-text-box">
	{#if ['am', 'pm'].includes(time.slice(-2).toLowerCase())}
		<div class="clock-text">
			<p style="font-size:{widthVw}vw" data-end={time.slice(-2)}>
				{time.slice(0, -2)}
			</p>
		</div>
	{:else}
		<div class="clock-text">
			<p style="font-size:{widthVw}vw" data-end={time.slice(-2)}>
				{time}
			</p>
		</div>
	{/if}

	{#if !overrideTime}
		<div class="clock-text background">
			<p style="font-size:{widthVw}vw">
				88:88:88 80
			</p>
		</div>
	{/if}
</div>

<style>
	/* latin */
	@font-face {
		font-family: 'digital-7';
		src: url('fonts/digital-7.ttf');
	}

	.clock-text-box {
		left: 50%;
		transform: translatey(0);
		text-align: center;
		width: 100%;
		max-width: 500
	}

	p::after {
		content: attr(data-end) ;
		background-color: #f3ec78;
		background-image: var(--background-gradient);
		background-size: 100%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent; 
	}	



	.clock-text p {
		font-family: 'digital-7', sans-serif;
		font-weight: 500;
		color: white;
		white-space: nowrap;
		overflow: hidden;
		margin: 0;
	}

	.background {
		position: absolute;
		color: white;
		opacity: 0.09;
		top: 0%;
		left: 50%;
		transform: translateX(-50%);
		z-index: -100;
	}
</style>
