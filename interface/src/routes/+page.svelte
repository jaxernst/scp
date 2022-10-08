<script lang="ts">
	import AlarmControls from "../components/alarm-display/AlarmControls.svelte";
	import ClockDisplay from "../components/alarm-display/ClockDisplay.svelte";
</script>

<div class="page-container">
	<ClockDisplay/>
	<AlarmControls/>
</div>

<style>
	.page-container {
		position: relative;
		margin-top: 20vh;
		margin-right: auto;
		margin-left: auto;
		max-width: 500px;
		flex-direction: column;
		padding: 1rem 5%;
		background-color: rgb(0, 0, 0, 0.2);
		border-radius: 20px;
	}
</style>