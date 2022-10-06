<script lang="ts">
	import { onMount } from 'svelte';

	let dispTime = renderTime(new Date());
	onMount(() => {
		setInterval(() => {
			dispTime = renderTime(new Date());
		}, 1000);
	});

	function renderTime(time: Date) {
		return {
            day: time.getDay(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds()      
	}}
</script>

<div class="clock-container">
	<div class="clock-col">
		<p class="clock-digit">{dispTime.day}</p>
		<p class="clock-label">Day</p>
	</div>
	<div class="clock-col">
		<p class="clock-digit">{dispTime.hour}</p>
		<p class="clock-label">Hours</p>
	</div>
	<div class="clock-col">
		<p class="clock-digit">{dispTime.minute}</p>
		<p class="clock-label">Minutes</p>
	</div>
	<div class="clock-col">
		<p class="clock-digit">{dispTime.second}</p>
		<p class="clock-label">Seconds</p>
	</div>
</div>

<style>
	.clock-container {
		background-color: azure;
        border-radius: 30%;
		font-family: 'Montserrat', 'sans-serif';
        width: 'min-content';
        padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    .clock-label {
        font-size: small;
    }

    .clock-digit {
        font-size: large;
    }
</style>
