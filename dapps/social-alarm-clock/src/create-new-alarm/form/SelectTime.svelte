<script>
  import { alarmTime } from "../alarmCreation";

  $: console.log($alarmTime);
  let timeOfDay;
</script>

<div>Select Time</div>
<input id="select-time" type="time" bind:value={$alarmTime} />
