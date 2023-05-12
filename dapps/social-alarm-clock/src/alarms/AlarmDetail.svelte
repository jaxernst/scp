<script lang="ts">
  import AlarmActiveDays from "../lib/components/AlarmActiveDays.svelte";
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
  import { transactions } from "../lib/transactions";
  import type { CommitmentInfo } from "@scp/sdk/src/scp-helpers";
  import type { PartnerAlarmClock } from "@scp/protocol/typechain-types";
  import { CommitStatus } from "@scp/protocol/lib/types";
  import SettingsIcon from "../assets/settings-icon.svelte";
  import SunIcon from "../assets/sun-icon.svelte";
  import EthereumIcon from "../assets/ethereum-icon.svelte";

  export let alarm: CommitmentInfo<"PartnerAlarmClock">;

  $: account = $getRequiredAccount();
  $: daysActive = alarm.contract.alarmDays();
  $: alarmTime = alarm.contract.alarmTime();

  $: penaltyVal = alarm.contract.missedAlarmPenalty();
  $: submissionWindow = alarm.contract
    .submissionWindow()
    .then((res) => res.toNumber());

  let otherPlayer: EvmAddress | null = null;
  $: getOtherPlayer(alarm.contract, $account.address ?? "").then(
    (res) => (otherPlayer = res as EvmAddress)
  );

  let timeToNextDeadline: number = 0;

  const syncTimeToDeadline = async () => {
    if (alarm.status === CommitStatus.ACTIVE) {
      timeToNextDeadline = (
        await alarm.contract.timeToNextDeadline($account.address)
      ).toNumber();
    }
  };

  setInterval(syncTimeToDeadline, 15000);
  setInterval(() => {
    if (timeToNextDeadline) timeToNextDeadline -= 1;
  }, 1000);

  const submitConfirmation = () => {
    transactions.addTransaction(alarm.contract.submitConfirmation());
  };

  let expanded = false;
</script>

<div class="flex h-full flex-col">
  <div class="flex flex-grow flex-col gap-1 px-2 py-1">
    <div class="custom-grid gap-4">
      <div>
        <div class=" rounded-lg p-1 text-xs">ID: 2</div>
      </div>
      <div class="justify-self-center" style="font-size: 1.8em">
        {#await alarmTime then time}
          <ClockDisplay
            overrideTime={timeString(time.toNumber())}
            overrideColor={"zinc-500"}
          />
        {/await}
      </div>
      <div class="m-1 h-[15px] w-[15px] justify-self-end fill-zinc-500">
        <SettingsIcon />
      </div>
    </div>
    {#if alarm.status === CommitStatus.INACTIVE}
      <div class="-translate-y-1 pb-1 text-center">
        Alarm request pending...
      </div>
    {:else if alarm.status === CommitStatus.ACTIVE}
      <div class="-translate-y-1 rounded-md pb-1 text-center">
        Next Deadline in {formatTime(timeToNextDeadline)}...
      </div>
    {/if}

    <div class="bg-transparent-grey rounded-t-md p-2 text-sm">
      <div class="flex justify-between gap-2">
        <span class="text-zinc-500">Submission Window:</span>
        <span><span class="h-3 w-3 text-cyan-600">30 </span>minutes</span>
      </div>

      <div class="flex justify-between gap-2">
        <span class="text-zinc-500">Missed Alarm Penalty:</span>
        <span><span class="h-3 w-3 text-cyan-600">.01 </span>eth</span>
      </div>
    </div>
    <div class="flex flex-grow justify-center gap-1 text-sm font-bold">
      <div
        class="bg-transparent-grey flex flex-grow flex-col rounded-bl-md px-2"
      >
        <span class="text-zinc-500">jernst.eth</span>
        <div class="flex flex-grow items-center justify-evenly pb-1">
          <div class="flex items-center gap-1">
            0
            <div class="h-3 w-3 fill-cyan-600">
              <SunIcon />
            </div>
          </div>
          <div class="flex items-center gap-1">
            0.0356
            <div class="h-3 w-3 fill-cyan-600">
              <EthereumIcon />
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-transparent-grey flex flex-grow flex-col rounded-br-md px-2"
      >
        <span class="text-zinc-500">0x15...205b</span>
        <div class="flex flex-grow items-center justify-evenly pb-1">
          <div class="flex items-center gap-1">
            0
            <div class="h-3 w-3 fill-cyan-600">
              <SunIcon />
            </div>
          </div>
          <div class="flex items-center gap-1">
            0.0
            <div class="h-3 w-3 fill-cyan-600">
              <EthereumIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="bottom-0 right-0 mt-1 flex w-full justify-center rounded-b-xl bg-zinc-800 p-2"
  >
    {#if alarm.status === CommitStatus.INACTIVE}
      <button
        class="shadow-l p-1 text-sm font-bold text-red-700 transition hover:scale-105 hover:text-green-600"
        >Cancel Request</button
      >
    {:else}
      <button
        class="shadow-l p-1 text-sm font-bold text-green-600 transition hover:scale-105 disabled:text-green-900"
        disabled={true}>Confirm Wakeup</button
      >
    {/if}
  </div>
</div>

<style>
  .custom-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }
</style>
