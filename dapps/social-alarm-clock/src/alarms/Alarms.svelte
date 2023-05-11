<script lang="ts">
  import { CommitStatus } from "@scp/protocol/lib/types";
  import { userAlarms } from "../lib/contractInterface";
  import PendingAlarm from "./PendingAlarm.svelte";
  import ActiveAlarm from "./ActiveAlarm.svelte";

  $: console.log(Object.entries($userAlarms));
</script>

<div class="flex flex-col gap-2 overflow-y-auto px-1 pt-2">
  {#each Object.entries($userAlarms) as [alarmId, alarm]}
    {#if alarm.status === CommitStatus.INACTIVE}
      <PendingAlarm {alarmId} />
    {:else if alarm.status === CommitStatus.ACTIVE}
      <ActiveAlarm userAlarm={alarm} />
    {/if}
  {/each}
</div>
