<script lang="ts">
	import StyledTitle from "../components/StyledTitle.svelte";
	import AlarmActiveDays from "../components/alarm-display/AlarmActiveDays.svelte";
	import ClockDisplay from "../components/alarm-display/ClockDisplay.svelte";
</script>

<div class="page-container">
	<StyledTitle/>
	<div class="spacing-large">
		<ClockDisplay class="spacing-large"/>
	</div>
	<AlarmActiveDays/>
	<div class="alarm-display-row">
		<div class="sep"></div>
		<AlarmActiveDays/>
	</div>
	<div class="alarm-display-row">
		<button>Submit Wakeup Confirmation</button>
	</div>
</div>

<style>
	.page-container {
		position: relative;
		margin-top: 8vh;
		margin-right: auto;
		margin-left: auto;
		max-width: 500px;
		flex-direction: column;
		padding: 1rem 5%;
		background-color: rgb(0, 0, 0, 0.2);
		border-radius: 20px;
	}

	.alarm-display-row {
		padding-top: 1em;
		display: flex;
        justify-content: center;
		align-items: center;
		grid-auto-columns: max-content auto max-content;
 		grid-auto-flow: column;
		width: 100%
	}

	.spacing-large {
		padding-top: 20px;
		padding-bottom: 20px;
	}

	button {
		background-color: transparent;
		padding: 1em;
        border: none;
        border-radius: 15px;
        color: white;
		
	}

    button:hover {
        background-color: rgb(255,255,255,.4);
    }

	.sep {
        outline: 1px solid white;
		position: absolute;
		left: 50%;
		height: 30px;
    }
</style>