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

<div class="flex flex-col">
  <div>
    <div style="font-size: 2.5em">
      {#await alarmTime then time}
        <ClockDisplay
          overrideTime={timeString(time.toNumber())}
          overrideColor={"orange"}
        />
      {/await}
    </div>
    <div class="flex justify-center" style="font-size: .75em">
      {#await daysActive}
        <AlarmActiveDays daysActive={[]} />
      {:then days}
        <AlarmActiveDays daysActive={days} />
      {/await}
    </div>
  </div>
</div>

<style>
</style>
