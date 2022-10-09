<script>
	import { onMount } from 'svelte';
	
	let date = new Date();
	$: time = date.toLocaleTimeString();
	const time0 = new Date(0).toLocaleTimeString()

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
	<div class="clock-text">
		{time}
	</div>
	<div class="clock-text background">
		88:88:88 80
	</div>
</div>

<style>
	/* latin */
	@font-face {
		font-family: 'digital-7';
		src: url('fonts/digital-7.ttf');
	}

	.clock-text-box {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
	}

	.clock-text {
		font-family: 'digital-7', sans-serif;
		font-weight: 500;
		font-size: 100px;
		color: white;
		white-space: nowrap;
		overflow: hidden;
	}

	.background {
		color: white;
		opacity: .05;
		position: absolute;
		left: 0%;
		top: 0%;
		z-index: -100 ;
	}
</style>
