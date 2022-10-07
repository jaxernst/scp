<script>
	import { onMount } from 'svelte';

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

<link href="https://fonts.googleapis.com/css?family=Orbitron" rel="stylesheet" type="text/css" />
ß<div class="clock-text">
	{time}
</div>

<style>
	.clock-text {
		font-family: 'Orbitron', sans-serif;
		font-weight: 500;
		font-size: 13vh;
		color: white;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
