<script>
	import LabeledDiv from '../LabeledDiv.svelte';

	let alarmDaysActive = [1, 3, 4];
	const days = [
		{ name:'Monday', id:1 }, 
		{ name: 'Tuesday', id:2 },
		{ name: 'Wednesday', id:3 },
		{ name: 'Thursday', id:4 },
		{ name: 'Friday', id:5 } , 
		{ name: 'Saturday', id:6 }, 
		{ name: 'Sunday', id:7 }
	]

	let today = new Date()

</script>

<div class="days-row">
	{#each days as day}
		{#if alarmDaysActive.includes(day.id)}
			<div class="day active">{day.name}</div>
		{:else}
			<div class="day">{day.name}</div>
		{/if}
	{/each}
</div>

<style>
	.days-row {
		display: inline-flex;
		flex-wrap: wrap;
		flex-direction: row;
		font-size: var(--font-small);
		justify-content: center;
		padding-bottom: 1em;
	}

	.day {
		padding: 1em;
		color: white;
		opacity: 0.3;
	}

	.active {
		opacity: 1;
		color: var(--theme-color3);
	}
</style>
