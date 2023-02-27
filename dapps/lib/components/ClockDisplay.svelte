<script lang="ts">
	import { onMount } from 'svelte';
	export let overrideTime: string | null = null
	export let fontSize: string = "5rem"

	let date = new Date();
	
	$: time = overrideTime ? overrideTime :
		date.toLocaleTimeString()[1] === ":" ? 
		"0" + date.toLocaleTimeString() :
		date.toLocaleTimeString();

	onMount(() => {
		const timerId = setInterval(() => {
			date = new Date();
		}, 1000);

		return () => {
			clearInterval(timerId);
		};
	});

	const backgroundText = () => {
		let background = ""
		for (let i=0; i<time.length; i++) {
			if (["A", "M", "P"].includes(time[i])) {
				background += "8"
			} else if (time[i] === " " || isNaN(Number(time[i]))) {
				background += time[i]
			} else {
				background += "8"
			}
		}
		return background
	}

</script>

<div class="clock-text-container" style="--font-size: {fontSize}">
	<div class="clock-text">
		{time}
	</div>
	<div class="clock-text background"> 
		{backgroundText()}
	</div>
</div>

<style>
	/* latin */
	@font-face {
		font-family: 'digital-clock';
		src: url('fonts/digital-7.ttf');
	}

	.clock-text-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.clock-text {
		align-items: center;
		font-size: var(--font-size);
		font-family: "digital-clock", sans-serif;
		font-weight: 400;
		color: white;
	}

	.background {
		opacity: .05;
		position: absolute;
		text-shadow: 5px 3px #000000;
	}
</style>
