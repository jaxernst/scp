<script lang="ts">
  import { prepareWriteContract, writeContract } from "@wagmi/core";
  import CommitmentHubAbi from "@scp/sdk/abi/CommitmentHub.json";
  import { encodeCreationParams } from "@scp/sdk/src/scp-helpers";
  import {
    alarmDays,
    alarmTime,
    buyIn,
    isReady,
    missedAlarmPenalty,
    otherPlayer,
    SelectionWheel,
    submissionWindow,
  } from "./alarmCreation";
  import SelectBuyIn from "./form/SelectBuyIn.svelte";
  import SelectDays from "./form/SelectDays.svelte";
  import SelectTime from "./form/SelectTime.svelte";
  import SelectTimezoneMode from "./form/SelectTimezoneMode.svelte";
  import { parseEther } from "ethers/lib/utils.js";
  import { get } from "svelte/store";
  import { CommitmentHubAddress } from "../lib/contractInterface";
  import { toast } from "@zerodevx/svelte-toast";
  import { view } from "../lib/appView";

  const numSelections = 5;
  const selections = SelectionWheel(5);
  $: selected = $selections.selected;

  const dayValueMap = { Su: 1, M: 2, T: 3, W: 4, Th: 5, F: 6, Sa: 7 };

  const createAlarm = async () => {
    const alarmDaysArr = Object.entries($alarmDays).reduce(
      (acc, [day, selected]) => {
        if (selected) {
          acc.push(dayValueMap[day]);
        }
        return acc;
      },
      [] as number[]
    );

    // We have '$alarmTIme' as as string in the format of 'HH:MM', and we must convert that
    // to a time of day in seconds
    const [hours, minutes] = $alarmTime.split(":");
    const alarmTimeSeconds = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
    const encodedParams = encodeCreationParams("PartnerAlarmClock", {
      alarmTime: alarmTimeSeconds,
      alarmdays: alarmDaysArr,
      missedAlarmPenalty: $missedAlarmPenalty,
      submissionWindow: $submissionWindow,
      timezoneOffset: -7 * 12,
      otherPlayer: $otherPlayer,
    });

    const config = await prepareWriteContract({
      address: CommitmentHubAddress,
      abi: CommitmentHubAbi,
      functionName: "createCommitment",
      args: [2, encodedParams],
      overrides: {
        value: parseEther(get(buyIn).toString()),
      },
    });

    try {
      const tx = await writeContract(config);
      const rc = await tx.wait();
      toast.push("Alarm creation successful!");
      view.initView();
    } catch (err) {
      toast.push("Alarm creation failed with:" + err.message);
    }
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
