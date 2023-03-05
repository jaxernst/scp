<script>
  import ToggleLetter from "../ToggleLetter.svelte";
  import { SelectionWheel } from "./alarmCreationOptions";
  const alarmSetup = {
    days: {
      M: false,
      T: false,
      W: false,
      Th: false,
      F: false,
      Sa: false,
      Su: false,
    },
  };

  const selections = SelectionWheel(4);
  $: selected = $selections.selected;
</script>

<div class="create-alarm-bar">
  <button
    class="light-button"
    disabled={$selections.atStart}
    on:click={selections.prev}>{"<-"}</button
  >
  {#if selected === 0}
    <div>
      Select Days
      <div class="days">
        {#each Object.keys(alarmSetup.days) as day}
          <ToggleLetter value={day} bind:toggled={alarmSetup.days[day]} />
        {/each}
      </div>
    </div>
  {:else if selected === 1}
    <div>
      <div>Select Time</div>
      <input id="select-time" type="time" />
    </div>
  {:else if selected === 2}
    <div>
      <div>Timezone Mode</div>
      <select>
        <option>Same Time of Day</option>
        <option>Same Absolute Time</option>
      </select>
    </div>
  {:else if selected === 3}
    <div>
      <div>Buy In</div>
      <input type="number" />
    </div>
  {/if}
  <button
    class="light-button"
    disabled={$selections.atEnd}
    on:click={selections.next}>{"->"}</button
  >
</div>

<style>
  .create-alarm-bar {
    display: grid;
    grid-template-columns: 1fr 300px 1fr;
    justify-items: center;
  }
</style>
