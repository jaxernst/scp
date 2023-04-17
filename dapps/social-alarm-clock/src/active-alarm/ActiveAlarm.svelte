<script lang="ts">
  import AlarmActiveDays from "../lib/components/AlarmActiveDays.svelte";
  import { getRequiredUserAlarm } from "../lib/contractInterface";
  import { getRequiredAccount } from "../lib/chainClient";
  import {
    ClockDisplay,
    timeString,
    formatTime,
    EthSymbol,
  } from "@scp/dapp-lib";
  import type { EvmAddress } from "../types";
  import { formatEther } from "ethers/lib/utils.js";
  import { getOtherPlayer } from "../lib/alarmHelpers";
  import PlayerInfo from "./PlayerInfo.svelte";

  $: userAlarm = $getRequiredUserAlarm();
  $: account = $getRequiredAccount();
  $: daysActive = $userAlarm.alarmDays();
  $: alarmTime = $userAlarm.alarmTime();
  $: penaltyVal = $userAlarm.missedAlarmPenalty();
  $: submissionWindow = $userAlarm
    .submissionWindow()
    .then((res) => res.toNumber());

  let timeToNextDeadline: number | undefined = undefined;
  $: $userAlarm.timeToNextDeadline($account.address).then((res) => {
    timeToNextDeadline = res.toNumber();
  });

  setInterval(() => {
    if (timeToNextDeadline) timeToNextDeadline -= 1;
  }, 1000);

  let otherPlayer: EvmAddress | null = null;
  $: getOtherPlayer($userAlarm, $account.address ?? "").then(
    (res) => (otherPlayer = res as EvmAddress)
  );
</script>

<div>
  <div class="container">
    <PlayerInfo playerAddress={$account.address} />

    <div class="alarm-overview">
      {#await alarmTime then time}
        <div style={"font-size: 3.5em"}>
          <ClockDisplay
            overrideTime={timeString(time.toNumber())}
            overrideColor={"orange"}
          />
        </div>
      {/await}

      <div class="active-days" style="font-size: .75em">
        {#await daysActive}
          <AlarmActiveDays daysActive={[]} />
        {:then days}
          <AlarmActiveDays daysActive={days} />
        {/await}
      </div>

      <div class="alarm-stats">
        {#await penaltyVal then val}
          <div class="stat">{formatEther(val)} <EthSymbol /></div>
          <div class="stat-label">Penalty Value</div>
        {/await}

        {#await submissionWindow then window}
          <div class="stat-label">Submission Window</div>
          <div class="stat">{window / 60} (min)</div>
        {/await}
      </div>

      {#await timeToNextDeadline then timeSeconds}
        {#await submissionWindow then submissionWindow}
          {#if timeSeconds > submissionWindow}
            <button disabled>
              Confirm Wakeup in {formatTime(timeSeconds)}</button
            >
          {:else}
            <button>
              Confirm Wakeup! (time left: {formatTime(timeSeconds)})
            </button>
          {/if}
        {/await}
      {/await}
    </div>

    {#if otherPlayer}
      <PlayerInfo playerAddress={otherPlayer} />
    {/if}
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .active-days {
    grid-column: 2 / 3;
    margin-bottom: 1em;
    background-color: #1a1a1a;
    border-radius: 0.5em;
  }

  .alarm-stats {
    display: grid;
    column-gap: 1em;
    grid-template-columns: auto auto;
  }

  .stat-label {
    grid-row: 1;
    font-size: 0.7em;
    margin: 0.5em 0 0.5em 0;
    white-space: nowrap;
  }

  .stat {
    background-color: #1a1a1a;
    border-radius: 0.5em;
  }

  button {
    background-color: transparent;
    margin-top: 2em;
    border: 2px solid rgb(0, 198, 33);
    border-radius: 1em;
    background-color: rgb(105, 105, 105);
  }
</style>
