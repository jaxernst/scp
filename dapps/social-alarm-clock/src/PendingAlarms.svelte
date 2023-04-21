<script lang="ts">
  import { shorthandAddress } from "@scp/dapp-lib";
  import type { EvmAddress } from "./types";

  type PendingAlarm = {
    id: string;
    otherPlayer: EvmAddress;
  };

  export let items: PendingAlarm[];
  console.log("items", items);
</script>

<div class="container">
  {#each items as { id: alarmId, otherPlayer }}
    <div class="row-item">
      <div class="text-area">
        <div><b>Alarm {alarmId ? "#" + alarmId : ""} Pending</b></div>
        <i
          >Waiting for {shorthandAddress(otherPlayer ?? "")} to start the alarm</i
        >
      </div>
      <button>Cancel Request</button>
    </div>
  {/each}
</div>

<style>
  .container {
    outline: 1px dashed grey;
    padding: 1em;
    display: flex;
  }

  .row-item {
    display: flex;
    padding: 0.5em;
    border-radius: 14px;
    gap: 1em;
    justify-content: space-between;
    height: min-content;
    background-color: rgba(38, 38, 38, 0.655);
  }

  .text-area {
    flex-grow: 1;
    padding-right: 3em;
    text-align: left;
  }
</style>
