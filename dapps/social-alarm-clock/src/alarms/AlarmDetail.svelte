<script lang="ts">
  import AlarmActiveDays from "../lib/components/AlarmActiveDays.svelte";
  import { getRequiredAccount } from "../lib/chainClient";
  import {
    ClockDisplay,
    timeString,
    formatTime,
    EthSymbol,
    shorthandAddress,
  } from "@scp/dapp-lib";
  import type { EvmAddress } from "../types";
  import { formatEther } from "ethers/lib/utils.js";
  import { getBetStanding, getOtherPlayer } from "../lib/alarmHelpers";
  import { transactions } from "../lib/transactions";
  import type { CommitmentInfo } from "@scp/sdk/src/scp-helpers";
  import { CommitStatus } from "@scp/protocol/lib/types";
  import SettingsIcon from "../assets/settings-icon.svelte";
  import SunIcon from "../assets/sun-icon.svelte";
  import EthereumIcon from "../assets/ethereum-icon.svelte";
  import { MINUTE } from "../lib/time";
  import { BigNumber } from "ethers";
  import { onMount } from "svelte";

  export let alarm: CommitmentInfo<"PartnerAlarmClock">;

  $: account = $getRequiredAccount();

  // COntract constants - Will eventually be refactored to avoid duplicate queries
  $: alarmTime = alarm.contract.alarmTime();
  let penaltyVal: string;
  let submissionWindow: number;
  let initialDeposit: string;
  let player1: EvmAddress;
  let player2: EvmAddress;

  // Contract variables
  let player1Balance: string = "";
  let player2Balance: string = "";
  let player1Confirmations: number = 0;
  let player2Confirmations: number = 0;
  let timeToNextDeadline: number = 0;

  alarm.contract
    .missedAlarmPenalty()
    .then((res) => (penaltyVal = formatEther(res)));

  alarm.contract
    .submissionWindow()
    .then((res) => (submissionWindow = res.toNumber()));

  alarm.contract.betAmount().then((res) => (initialDeposit = formatEther(res)));
  alarm.contract.player1().then((res) => (player1 = res as EvmAddress));
  alarm.contract.player2().then((res) => (player2 = res as EvmAddress));

  $: if (player1 && initialDeposit) {
    alarm.contract.getPlayerBalance(player1).then((res) => {
      player1Balance = formatEther(res);
    });

    alarm.contract
      .numConfirmations(player1)
      .then((res) => (player1Confirmations = res.toNumber()));
  }

  $: if (player2 && initialDeposit) {
    alarm.contract.getPlayerBalance(player2).then((res) => {
      player2Balance = formatEther(res);
    });

    alarm.contract
      .numConfirmations(player2)
      .then((res) => (player2Confirmations = res.toNumber()));
  }

  const syncTimeToDeadline = async () => {
    if (alarm.status === CommitStatus.ACTIVE) {
      timeToNextDeadline = (
        await alarm.contract.timeToNextDeadline($account.address)
      ).toNumber();
    }
  };

  onMount(syncTimeToDeadline);
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
        <div class=" rounded-lg p-1 text-xs">ID: {alarm.id}</div>
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
        <span class="text-zinc-500">submission window:</span>
        <span
          ><span class="h-3 w-3 text-cyan-600">{submissionWindow / MINUTE}</span
          > minutes</span
        >
      </div>

      <div class="flex justify-between gap-2">
        <span class="text-zinc-500">missed alarm penalty:</span>
        <span><span class="h-3 w-3 text-cyan-600">{penaltyVal}</span> eth</span>
      </div>
    </div>
    <div class="flex flex-grow justify-center gap-1 text-sm font-bold">
      <div
        class="bg-transparent-grey flex flex-grow flex-col rounded-bl-md px-2"
      >
        <span class="text-zinc-500"
          >{player1 ? shorthandAddress(player1) : ""}</span
        >
        <div class="flex flex-grow items-center justify-evenly pb-1">
          <div class="flex items-center gap-1">
            {player1Confirmations}
            <div class="h-3 w-3 fill-cyan-600">
              <SunIcon />
            </div>
          </div>
          <div class="flex items-center gap-1">
            {player1Balance}
            <div class="h-3 w-3 fill-cyan-600">
              <EthereumIcon />
            </div>
          </div>
        </div>
      </div>
      <div
        class="bg-transparent-grey flex flex-grow flex-col rounded-br-md px-2"
      >
        <span class="text-zinc-500"
          >{player2 ? shorthandAddress(player2) : ""}</span
        >
        <div class="flex flex-grow items-center justify-evenly pb-1">
          <div class="flex items-center gap-1">
            {player2Confirmations}
            <div class="h-3 w-3 fill-cyan-600">
              <SunIcon />
            </div>
          </div>
          <div class="flex items-center gap-1">
            {player2Balance}
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
        disabled={timeToNextDeadline > submissionWindow}
        on:click={submitConfirmation}>Confirm Wakeup</button
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
