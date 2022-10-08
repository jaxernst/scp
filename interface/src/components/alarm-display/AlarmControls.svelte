<script>
    import AlarmStatus from "./AlarmStatus.svelte";
</script>

<div class="alarm-actions">
	<button id=1> Confirm Wakeup </button>
    <div class="sep"></div>
	<button> Pause Alarm </button>
</div>

<style>

	.separator {
		left: 50%
	}

	.alarm-actions {
		padding-top: 1em;
		display: flex;
        justify-content: space-around;
		grid-auto-columns: max-content auto max-content;
 		grid-auto-flow: column;
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
    }


</style>