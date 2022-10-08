<script>
    import AlarmStatus from "./AlarmStatus.svelte";
</script>

<div class="alarm-actions">
	<button id=1> Confirm Wakeup </button>
    <div class="sep"></div>
	
</div>

<style>

	.alarm-actions {
		padding-top: 1em;
		display: flex;
        justify-content: space-around;
		grid-auto-columns: max-content auto max-content;
 		grid-auto-flow: column;
	}

	

    .sep {
        outline: 1px solid white;
    }


</style>