<script lang="ts">
  import { TimezoneMode, timezoneMode } from "../alarmCreation";
</script>

<div>Timezone Mode</div>
<select bind:value={$timezoneMode}>
  <option value={TimezoneMode.SAME_TIME_OF_DAY}>Same Time of Day</option>
  <option value={TimezoneMode.SAME_ABSOLUTE_TIME}>Same Absolute Time</option>
</select>
