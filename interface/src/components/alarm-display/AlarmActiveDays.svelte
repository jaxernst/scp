<script>
	import LabeledDiv from "../LabeledDiv.svelte";

    let alarmDaysActive =  ["Monday", "Wednesday", "Thursday"]
    const days = [
        'Monday', 
        'Tuesday', 
        'Wednesday', 
        'Thursday', 
        'Friday', 
        'Saturday', 
        'Sunday'
    ];
</script>

<LabeledDiv label="Alarm Active On Days">
	<div class="days-row">
		{#each days as day}
		{#if alarmDaysActive.includes(day)}
		<div class="day active">{day}</div>
		{:else}
		<div class="day">{day}</div>
		{/if}
		{/each}
	</div>
</LabeledDiv>

<style>
    .days-row {
		display: inline-flex;
		flex-wrap: wrap;
		flex-direction: row;
		font-size: var(--font-small);
		justify-content: center;
	}

	.day {
		padding: 1em;
		color: white;
		opacity: .3
	}

	.active {
		opacity: 1;
		color: var(--text-color3)
	}
</style>