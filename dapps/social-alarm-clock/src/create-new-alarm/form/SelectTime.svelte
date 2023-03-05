<script>
  import { alarmTime } from "../alarmCreation";

  $: console.log($alarmTime);
  let timeOfDay;
</script>

<div>
  <div>Select Time</div>
  <input id="select-time" type="time" bind:value={$alarmTime} />
</div>
