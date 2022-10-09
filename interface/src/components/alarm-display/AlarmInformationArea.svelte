<script>
    import AlarmActiveDays from "./AlarmActiveDays.svelte";
	import AlarmStats from "./AlarmStats.svelte";
</script>

<div class="alarm-info-area">
    <AlarmActiveDays/>
    <AlarmStats/>
</div>

<style>
    .alarm-info-area {
        display: flex;
        flex-direction: column;
    }
</style>