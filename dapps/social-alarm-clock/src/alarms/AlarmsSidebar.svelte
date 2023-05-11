<script lang="ts">
  import { CommitStatus } from "@scp/protocol/lib/types";
  import { userAlarms } from "../lib/contractInterface";
  import PendingAlarm from "./PendingAlarm.svelte";
  import ActiveAlarm from "./ActiveAlarm.svelte";
  import AlarmOverview from "./AlarmOverview.svelte";
  import { displayedAlarmId } from "./displayedAlarm";

  $: console.log(Object.entries($userAlarms));

  const stylePending = (status: CommitStatus) =>
    status === CommitStatus.INACTIVE
      ? "border border-dashed border-zinc-600"
      : "";

  $: styleSelected = (alarmId: string) =>
    $displayedAlarmId === alarmId ? "bg-zinc-800" : "";
</script>

<div class="bg-transparent-grey flex flex-col gap-2 overflow-y-auto rounded-xl">
  {#each Object.entries($userAlarms) as [alarmId, alarm]}
    <button
      class="rounded-xl px-2 py-1 text-left transition hover:bg-zinc-700 {stylePending(
        alarm.status
      )} {styleSelected(alarmId)}"
      on:click={() => ($displayedAlarmId = alarmId)}
    >
      {#if alarm.status === CommitStatus.INACTIVE}
        <div class="font-bold">Alarm ID: {alarmId}</div>
        <div class="text-xs">Waiting on Player 2 to start alarm...</div>
      {:else if alarm.status === CommitStatus.ACTIVE}
        <AlarmOverview userAlarm={alarm} />
      {/if}
    </button>
  {/each}
</div>
