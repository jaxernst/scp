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
    const createAlarmResult = $createAlarm();
    if (!createAlarmResult) return;

    const txResult = await transactions.addTransaction(createAlarmResult);
    if (!txResult.error) {
      toast.push("Alarm creation successful!");
    } else {
      toast.push("Alarm creation failed with: " + txResult.error.message);
    }
  };
</script>

<div class="flex flex-col justify-center gap-4">
  <JoinAlarm />

  <div class="">
    <h3 class="pt-2">Create an Alarm</h3>
    <div class="flex gap-3 overflow-x-auto px-3 py-2 text-zinc-300">
      <FormCard
        itemNumber={1}
        emptyHeader="Select Partner"
        filledHeader="Partner"
        inputEmpty={!$creationParams.otherPlayer}
        inputValid={partnerInputValid}
      >
        <input
          class="w-min bg-transparent text-center outline-none"
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
          class="w-min bg-transparent text-center outline-none"
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
        <div class="text-s flex -translate-y-2 flex-col justify-center gap-1">
          <div class="flex flex-nowrap items-center justify-end gap-1">
            <div class="whitespace-nowrap text-xs">Bet buy-in:</div>
            <div class="whitespace-nowrap">
              <input
                type="number"
                class="w-[70px] rounded-lg border border-zinc-500 bg-transparent text-right"
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
                class="w-[70px] rounded-lg border border-zinc-500 bg-transparent"
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
          class="hover:border--500 rounded-xl p-2 transition hover:scale-105 hover:border-2 hover:bg-zinc-700"
        >
          Submit
        </button>
      {/if}
    </div>
  </div>
</div>
