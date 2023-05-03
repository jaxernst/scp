<script lang="ts">
  import { isAddress, parseEther } from "ethers/lib/utils.js";
  import FormCard from "./FormCard.svelte";
  import { alarmTime, creationParams, otherPlayer } from "./alarmCreation";
  import ToggleLetter from "../ToggleLetter.svelte";
  import { EthSymbol } from "@scp/dapp-lib";

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
    $creationParams.alarmPenalty = parseEther(input);
  }
</script>

<div class="flex flex-col gap-4 justify-center">
  <div>
    <h3 class="py-2">Join an Alarm</h3>
    <div class=" h-[30px] rounded-xl px-3 flex gap-2">
      <input
        type="text"
        class=" flex-grow h-full bg-zinc-700 rounded-xl px-2 placeholder-zinc-500 text-zinc-300"
        placeholder="Enter alarm id to join"
      />
      <button
        class="px-4 text-bold bg-zinc-800 text-bold rounded-xl text-cyan-400"
        >JOIN</button
      >
    </div>
  </div>

  <div class="">
    <h3 class="pt-2">Create an Alarm</h3>
    <div class="flex gap-3 px-3 py-2 text-zinc-300 overflow-x-auto">
      <FormCard
        itemNumber={1}
        emptyHeader="Select Partner"
        filledHeader="Partner"
        inputEmpty={!$creationParams.otherPlayer}
        inputValid={isAddress($creationParams.otherPlayer) ||
          $creationParams.otherPlayer.includes(".eth")}
      >
        <input
          class="bg-transparent outline-none text-center w-min"
          type="text"
          placeholder="Enter address or ENS"
          bind:value={$creationParams.otherPlayer}
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
        <div class="flex text-xs gap-4">
          <div class="flex flex-col flex-nowrap gap-1">
            <div class="whitespace-nowrap">Bet buy-in</div>
            <div class="whitespace-nowrap">
              <input
                type="number"
                class="w-[50px]"
                min="0"
                step="0.001"
                on:change={(e) => handleBuyInInput(e.target.value)}
              />
              <span><EthSymbol /></span>
            </div>
          </div>
          <div class="flex flex-col flex-nowrap gap-1">
            <div class="whitespace-nowrap text-[10px]">
              Missed Alarm Penalty
            </div>
            <div class="whitespace-nowrap">
              <input
                type="number"
                class="w-[50px]"
                min="0"
                step="0.001"
                on:change={(e) => handleAlarmPenaltyInput(e.target.value)}
              />
              <span><EthSymbol /></span>
            </div>
          </div>
        </div>
      </FormCard>
    </div>
  </div>
</div>
