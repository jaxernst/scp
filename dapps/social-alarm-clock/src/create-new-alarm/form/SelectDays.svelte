<script lang="ts">
  import ToggleLetter from "../../ToggleLetter.svelte";
  import { alarmDays } from "../alarmCreation";
</script>

<div>
  Select Days
  <div class="days">
    {#each Object.keys($alarmDays) as day}
      <ToggleLetter value={day} bind:toggled={$alarmDays[day]} />
    {/each}
  </div>
</div>

<style>
  .days {
    display: flex;
    gap: 0.5em;
  }
</style>
