<script>
	import { onMount } from 'svelte';
	let today = 'Friday';
	const days = [
		'Monday', 
		'Tuesday', 
		'Wednesday', 
		'Thursday', 
		'Friday', 
		'Saturday', 
		'Sunday'
	];

	let date = new Date();
	$: time = date.toLocaleTimeString();

	onMount(() => {
		const timerId = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => {
			clearInterval(timerId);
		};
	});
</script>

<div class="auto-row" style="--today:{today}">
	{#each days as day}
		{#if day === today}
			<div class={`day + ${day}`}>{day}</div>
		{:else}
			<div class={`day + ${day}`} style="opacity:.3">{day}</div>
		{/if}
	{/each}
</div>
<div class="clock-text">
	{time}
</div>

<style>
	/* latin */
	@font-face {
		font-family: 'digital-7';
		src: url('fonts/digital-7.ttf');
	}

	.auto-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		overflow: hidden;
    	text-overflow:clip
	}

	.day {
		padding: 1em;
		color: white;
		white-space: nowrap;
    
	}

	.clock-text {
		display: flex;
		justify-content: center;
		font-family: 'digital-7', sans-serif;
		font-weight: 500;
		font-size: 100px;
		color: white;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
