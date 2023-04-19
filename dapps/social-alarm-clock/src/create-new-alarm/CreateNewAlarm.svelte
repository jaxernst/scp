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
  import SelectPartner from "./form/SelectPartner.svelte";
  import SelectTimezoneMode from "./form/SelectTimezoneMode.svelte";
  import { parseEther } from "ethers/lib/utils.js";
  import { get } from "svelte/store";
  import { CommitmentHubAddress } from "../lib/contractInterface";
  import { toast } from "@zerodevx/svelte-toast";
  import { transactions } from "../lib/transactions";
  import type { ContractTransaction } from "ethers";

  const formComponents = [
    SelectPartner,
    SelectDays,
    SelectTime,
    SelectTimezoneMode,
    SelectBuyIn,
  ];

  const selections = SelectionWheel(formComponents.length + 1);

  $: selected = $selections.selected;

  const dayValueMap = { Su: 1, M: 2, T: 3, W: 4, Th: 5, F: 6, Sa: 7 };

  const createAlarm = async () => {
    const alarmDaysArr = Object.entries($alarmDays).reduce(
      (acc, [day, selected]) => {
        if (selected) {
          acc.push(dayValueMap[day as keyof typeof dayValueMap]);
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
      timezoneOffset: new Date().getTimezoneOffset() * -60,
      otherPlayer: $otherPlayer,
    });

    const config = await prepareWriteContract({
      address: CommitmentHubAddress,
      abi: CommitmentHubAbi,
      functionName: "createCommitment",
      args: [2, encodedParams],
      overrides: {
        value: parseEther(get(buyIn)?.toString() ?? "0"),
      },
    });

    const txResult = await transactions.addTransaction(
      writeContract(config) as Promise<ContractTransaction>
    );

    if (!txResult.error) {
      toast.push("Alarm creation successful!");
    } else {
      toast.push("Alarm creation failed with: " + txResult.error.message);
    }
  };

  // This state is not currently being updated. The highlight option is shown
  // using the seleciton wheel index
  type OptionState = "valid" | "invalid" | "selected";
  const options: Record<string, OptionState> = {
    Partner: "selected",
    Days: "invalid",
    Time: "invalid",
    Timezone: "invalid",
    "Buy-in": "invalid",
  };
</script>

<div class="container">
  <div class="options-overview">
    {#each Object.entries(options) as [option, state], i}
      <div
        class="option"
        class:selected={i === selected}
        class:valid={state === "valid"}
        class:invalid={state === "invalid"}
      >
        {option}
      </div>
    {/each}
  </div>

  <div class="selection-controls">
    <button
      class="arrow light-button"
      disabled={$selections.atStart}
      on:click={selections.prev}
      >{"<-"}
    </button>

    <div class="form-input">
      {#if selected === formComponents.length}
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
</div>

<style>
  .container {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .options-overview {
    display: flex;
    flex-direction: row;
    gap: 2em;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    color: grey;
  }

  .selected {
    color: white;
    border-bottom: 2px solid white;
  }

  .selection-controls {
    flex-grow: 1;
    width: 100%;
    display: grid;
    grid-template-columns: 15% 1fr 15%;
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
    height: 60%;
    background-color: var(--bg-color2);
  }
</style>
