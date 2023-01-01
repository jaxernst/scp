<script>
	export let daysActive = [];
	const days = [
		{ name: 'Sun', id:7, class:"day" },
		{ name:'Mon', id:1, class:"day" }, 
		{ name: 'Tue', id:2, class:"day" },
		{ name: 'Wed', id:3, class:"day" },
		{ name: 'Thur', id:4, class:"day" },
		{ name: 'Fri', id:5, class:"day" } , 
		{ name: 'Sat', id:6, class:"day" }, 
	]

	let today = new Date().getDay()

	$: {
		const dayClass = []
		for (let day of days) {
			if (daysActive.includes(day.id)) {
				day.class += " active"
			}
			if (day.id === today) {
				day.class += " today"
			}
		}
	}

</script>

<div class="days-row">
	{#each days as day}
		<div class={day.class}>{day.name}</div>
	{/each}
</div>

<style>
	.days-row {
		display: inline-flex;
		flex-wrap: wrap;
		flex-direction: row;
		width: 100%;
		font-size: var(--font-medium);
		justify-content: center;
		padding-bottom: 1em;
	}

	.day {
		padding: 1em;
		color: white;
		opacity: 0.3;
	}

	.today {
		border-bottom: 2px solid white;
		opacity: 1;
	}

	.active {
		opacity: 1;
		color: var(--theme-color3);
	}
</style>
