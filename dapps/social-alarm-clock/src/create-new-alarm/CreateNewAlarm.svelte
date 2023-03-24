<script lang="ts">
  import { prepareWriteContract, writeContract } from "@wagmi/core";
  import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
  import { alarmDays, buyIn, isReady, SelectionWheel } from "./alarmCreation";
  import SelectBuyIn from "./form/SelectBuyIn.svelte";
  import SelectDays from "./form/SelectDays.svelte";
  import SelectTime from "./form/SelectTime.svelte";
  import SelectTimezoneMode from "./form/SelectTimezoneMode.svelte";

  const numSelections = 5;
  const selections = SelectionWheel(5);
  $: selected = $selections.selected;

  const createAlarm = async () => {
    const config = await prepareWriteContract({
      address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      abi: CommitmentHubAbi,
      functionName: "createCommitment",
      args: [0, "0x"],
    });
    const data = await writeContract(config);
  };
  const formComponents = [
    SelectDays,
    SelectTime,
    SelectTimezoneMode,
    SelectBuyIn,
  ];
</script>

<div class="create-alarm-bar">
  <button
    class="arrow light-button"
    disabled={$selections.atStart}
    on:click={selections.prev}
    >{"<-"}
  </button>

  <div class="form-input">
    {#if selected === numSelections - 1}
      <button disabled={!$isReady} on:click={createAlarm}>Submit</button>
    {:else}
      <svelte:component this={formComponents[selected]} />
    {/if}
  </div>

  <button
    class="arrow light-button"
    disabled={$selections.atEnd}
    on:click={selections.next}>{"->"}</button
  >
</div>

<style>
  .create-alarm-bar {
    display: grid;
    grid-template-columns: 1fr 300px 1fr;
    justify-items: center;
    align-items: center;
    height: 4em;
  }

  .form-input {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    height: 30px;
  }
</style>
