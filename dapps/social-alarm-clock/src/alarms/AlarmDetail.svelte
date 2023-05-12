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

<div class="relative h-full">
  <div class="flex flex-col px-2 py-1">
    <div class="custom-grid gap-4">
      <div>
        <div class=" rounded-lg p-1 text-xs">ID: 1234</div>
      </div>
      <div class="justify-self-center pt-1" style="font-size: 2em">
        {#await alarmTime then time}
          <ClockDisplay
            overrideTime={timeString(time.toNumber())}
            overrideColor={"zinc-500"}
          />
        {/await}
      </div>
      <div class="h-[20px] w-[20px] justify-self-end"><SettingsIcon /></div>
    </div>
    <div class="pt-4 text-center">
      Next Deadline in {formatTime(timeToNextDeadline)} seconds...
    </div>
  </div>
  <div
    class="absolute bottom-0 right-0 flex w-full justify-center rounded-b-xl bg-zinc-800"
  >
    <button
      class="shadow-l p-2 font-bold text-cyan-500 transition hover:scale-105 hover:text-green-600"
      >Submit Confirmation</button
    >
  </div>
</div>

<style>
  .custom-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
  }
</style>
