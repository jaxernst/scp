<script>
    import ClockText from "./ClockText.svelte";
</script>

<div class='clock-container'>
	<ClockText/>
	<div class="alarm-actions">
		<button> Confirm Wakeup </button>
        <div class="separator"> | </div>
		<button> Pause Alarm </button>
	</div>
</div>

<style>
	.clock-container {
		position: absolute; /* or absolute */
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding-left: 5%;
		padding-right: 5%;
		padding-top: 2%;
		padding-bottom: 2%;
		background-color: rgb(0, 0, 0, 0.2);
	}

	.separator {
		left: 50%
	}

	.alarm-actions {
		padding-top: 1em;
		display: grid;
		grid-auto-columns: max-content auto max-content;
 		grid-auto-flow: column;
		
        outline: 1px solid white;
	}

	button {
		background-color: transparent;
		padding: 1em;
        border: none;
        color: white;
	}

</style>