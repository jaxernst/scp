<script lang="ts">
	import ClockDisplay from "src/components/alarm-display/ClockDisplay.svelte";
	import AlarmInformationArea from "src/components/alarm-display/AlarmInformationArea.svelte";
	import AlarmActiveDays from "src/components/alarm-display/AlarmActiveDays.svelte";
</script>

<div class="spacing-large">
	<ClockDisplay class="spacing-large"/>
	<div class="left-in-flex" style="display:flex; ">
		<button class="button-primary">Confirm Wakeup</button>
		<div style="color:gray"> | </div>
		<button class="button-secondary">Pause Alarm</button>
		<div class="next-wakeup=display">
			<h>Wakeup</h>
		</div>
	</div>
</div>

<AlarmInformationArea/>
	<div class="alarm-display-row">
	</div>
<AlarmInformationArea/>

<style>
	.alarm-display-row {
		padding-top: 1em;
		padding-bottom: 1em;
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

	.left-in-flex {
		display: flex;
		justify-content: left;
		align-items: center;
	}

	button {
		padding: 1em;
		margin: 10px;
        border-radius: 12px;
		transition: .3s;
	}
	
	.button-primary {
		background-color: rgba(255, 255, 255, 0.035);
		border: 1px solid var(--theme-color3-dark);
		color: var(--theme-color1-dark);
	}

	.button-secondary {
		padding-left: .5em;
		padding-right: .5em;
		background-color: transparent;
		border: none;
		color: var(--theme-alert-color-dark);
	}


    button:hover {
		background-color: rgb(255,255,255,.2);
	}
	
	.button-primary:hover {
		color: var(--theme-color3);
		border: 1px solid var(--theme-color3)
    }

	.button-secondary:hover {
		color: var(--theme-alert-color);
		border: 1px solid var(--theme-alert-color-dark)
	}

</style>