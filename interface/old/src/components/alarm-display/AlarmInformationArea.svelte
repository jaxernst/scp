<script>
	import LabeledLine from '../LabeledLine.svelte';
	import AlarmActiveDays from './AlarmActiveDays.svelte';
	import AlarmStats from './AlarmStats.svelte';

	let alarmPoolName = 'Alarm Pool 0001';
</script>

<div class="label-line-row">
    <LabeledLine label={alarmPoolName} />
</div>
<div class="alarm-info-area">
	<AlarmActiveDays />
	<AlarmStats />
</div>

<style>
    .label-line-row {
        display: flex;
        justify-content: center;
        align-items: center;
    }

	.alarm-info-area {
		display: flex;
		flex-direction: column;
	}
</style>
