<script lang="ts">
  import ToggleLetter from "../../ToggleLetter.svelte";
  import { alarmDays } from "../alarmCreation";
</script>

Select the Days to Enforce the Alarm
<div class="days">
  {#each Object.keys($alarmDays) as day}
    <ToggleLetter value={day} bind:toggled={$alarmDays[day]} />
  {/each}
</div>

<style>
  .days {
    display: flex;
    gap: 0.5em;
    font-size: 1.2em;
  }
</style>
