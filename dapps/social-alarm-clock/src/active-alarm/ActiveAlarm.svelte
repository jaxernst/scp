<script lang="ts">
  import { account, ensName } from "../lib/chainClient";
  import AlarmActiveDays from "../lib/components/AlarmActiveDays.svelte";
  import { getOtherPlayer, userAlarm } from "../lib/contractInterface";
  import {
    shorthandAddress,
    ClockDisplay,
    timeString,
    EthSymbol,
  } from "@scp/dapp-lib";
  import type { EvmAddress } from "../types";
  import UserAlarmInfo from "./UserAlarmInfo.svelte";
  import { formatEther } from "ethers/lib/utils.js";

  $: daysActive = $userAlarm.alarmDays();
  $: alarmTime = $userAlarm.alarmTime();
  $: penaltyVal = $userAlarm.missedAlarmPenalty();
  $: submissionWindow = $userAlarm.submissionWindow();

  let otherPlayer: EvmAddress = null;
  $: getOtherPlayer($userAlarm, $account.address).then(
    (res) => (otherPlayer = res as EvmAddress)
  );
</script>

<div>
  <div class="container">
    <UserAlarmInfo
      userAddress={$account.address}
      heading="Player 1"
      missedAlarms={0}
      betStanding={0.0134}
    />

    <div class="alarm-overview">
      {#await alarmTime then time}
        <div style={"font-size: 3.5em"}>
          <ClockDisplay
            overrideTime={timeString(time)}
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
          <div class="stat">{window.toNumber() / 60} (min)</div>
        {/await}
      </div>

      <button disabled> Confirm Wakeup in 13 Hours </button>
    </div>

    {#if otherPlayer}
      <UserAlarmInfo
        heading="Player 2"
        userAddress={otherPlayer}
        missedAlarms={5}
        betStanding={-0.0134}
      />
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
    border: 2px solid rgb(99, 99, 99);
    border-radius: 1em;
    color: rgb(99, 99, 99);
  }
</style>
