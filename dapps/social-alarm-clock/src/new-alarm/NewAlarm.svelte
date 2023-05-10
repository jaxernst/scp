<script lang="ts">
  import { isAddress, parseEther } from "ethers/lib/utils.js";
  import FormCard from "./FormCard.svelte";
  import {
    alarmTime,
    createAlarm,
    creationParams,
    isReady,
    otherPlayer,
  } from "./alarmCreation";
  import ToggleLetter from "../ToggleLetter.svelte";
  import { EthSymbol } from "@scp/dapp-lib";
  import { transactions } from "../lib/transactions";
  import { toast } from "@zerodevx/svelte-toast";
  import { fetchEnsAddress } from "@wagmi/core";
  import { account, network } from "../lib/chainClient";
  import JoinAlarm from "./JoinAlarm.svelte";

  function handleAlarmDayToggle(daySelected: boolean, dayNumber: number) {
    console.log(daySelected, dayNumber);
    // Toggle day on
    if (daySelected && !$creationParams.alarmDays.includes(dayNumber)) {
      // Add day to alarmDays if not in already
      return ($creationParams.alarmDays = [
        ...$creationParams.alarmDays,
        dayNumber,
      ]);
    }
    // Toggle day off
    if (!daySelected && $creationParams.alarmDays.includes(dayNumber)) {
      // Remove day from alarmDays if in already
      return ($creationParams.alarmDays = $creationParams.alarmDays.filter(
        (d) => d !== dayNumber
      ));
    }
  }

  function handleAlarmTimeInput(input: string) {
    const [hours, minutes] = input.split(":");
    const seconds = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
    $creationParams.alarmTime = seconds;
  }

  function handleBuyInInput(input: string) {
    $creationParams.buyIn = parseEther(input);
  }

  function handleAlarmPenaltyInput(input: string) {
    $creationParams.missedAlarmPenalty = parseEther(input);
  }

  let partnerInputValid = false;
  async function handlePartnerInput(input: string) {
    $creationParams.otherPlayer = input;

    if (!isAddress(input) && input.endsWith(".eth")) {
      input =
        (await fetchEnsAddress({
          chainId: $network?.chain?.id,
          name: input,
        })) ?? "";
    }
    partnerInputValid = input !== $account?.address;
  }

  $: create = async () => {
    const createResult = $createAlarm();
    if (!createResult) return;

    const txResult = await transactions.addTransaction(createResult);
    if (!txResult.error) {
      toast.push("Alarm creation successful!");
    } else {
      toast.push("Alarm creation failed with: " + txResult.error.message);
    }
  };
</script>

<div class="flex flex-col gap-4 justify-center">
  <JoinAlarm />

  <div class="">
    <h3 class="pt-2">Create an Alarm</h3>
    <div class="flex gap-3 px-3 py-2 text-zinc-300 overflow-x-auto">
      <FormCard
        itemNumber={1}
        emptyHeader="Select Partner"
        filledHeader="Partner"
        inputEmpty={!$creationParams.otherPlayer}
        inputValid={partnerInputValid}
      >
        <input
          class="bg-transparent outline-none text-center w-min"
          type="text"
          placeholder="Enter address or ENS"
          on:change={(e) => handlePartnerInput(e.target.value)}
        />
      </FormCard>

      <FormCard
        itemNumber={2}
        emptyHeader="Select Time"
        filledHeader="Time"
        inputEmpty={!$creationParams.alarmTime}
        inputValid={$creationParams.alarmTime > 0 &&
          $creationParams.alarmTime < 86400}
      >
        <input
          id="select-time"
          class="bg-transparent outline-none text-center w-min"
          type="time"
          on:change={(e) => handleAlarmTimeInput(e.target.value)}
        />
      </FormCard>
      <FormCard
        itemNumber={3}
        emptyHeader="Select Days"
        filledHeader="Days"
        inputEmpty={$creationParams.alarmDays.length === 0}
        inputValid={true}
      >
        <div class="flex gap-2">
          {#each ["Su", "M", "T", "W", "Th", "F", "Sa"] as letter, i}
            <ToggleLetter
              on:toggle={(e) => handleAlarmDayToggle(e.detail, i + 1)}
              value={letter}
            />
          {/each}
        </div>
      </FormCard>
      <FormCard
        itemNumber={4}
        emptyHeader="Set Bet Rules"
        filledHeader="Bet Rules"
        inputEmpty={!$creationParams.buyIn &&
          !$creationParams.missedAlarmPenalty}
        inputValid={true}
      >
        <div class="flex flex-col text-s gap-1 justify-center -translate-y-2">
          <div class="flex flex-nowrap gap-1 items-center justify-end">
            <div class="whitespace-nowrap text-xs">Bet buy-in:</div>
            <div class="whitespace-nowrap">
              <input
                type="number"
                class="w-[70px] border border-zinc-500 text-right bg-transparent rounded-lg"
                min="0"
                step="0.001"
                on:change={(e) => handleBuyInInput(e.target.value)}
              />
              <span><EthSymbol /></span>
            </div>
          </div>
          <div class="flex flex-nowrap items-center justify-end gap-1">
            <div class="whitespace-nowrap text-[10px]">
              Missed Alarm Penalty:
            </div>
            <div class="whitespace-nowrap">
              <input
                type="number"
                class="w-[70px] border border-zinc-500 bg-transparent rounded-lg"
                min="0"
                step="0.001"
                on:change={(e) => handleAlarmPenaltyInput(e.target.value)}
              />
              <span><EthSymbol /></span>
            </div>
          </div>
        </div>
      </FormCard>
      {#if $isReady}
        <button
          on:click={create}
          class="p-2 rounded-xl transition hover:border-green-500 hover:scale-105 hover:border-2 hover:bg-zinc-700"
        >
          Submit
        </button>
      {/if}
    </div>
  </div>
</div>
