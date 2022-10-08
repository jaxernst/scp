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


<div class="clock-text">
	{time}
</div>

<style>
	/* latin */
	@font-face {
		font-family: 'digital-7';
		src: url('fonts/digital-7.ttf');
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
