<script lang="ts">
  import { CommitStatus } from "@scp/protocol/lib/types";
  import { userAlarms } from "../lib/contractInterface";

  $: console.log(Object.entries($userAlarms));
</script>

<div class="flex flex-col overflow-y-auto pt-2 gap-2">
  {#each Object.entries($userAlarms) as [alarmId, alarm]}
    {#if alarm.status === CommitStatus.INACTIVE}
      <div class="border border-dashed rounded-2xl p-2">
        <div class="font-bold">Alarm ID: {alarmId}</div>
        <div>Waiting on Player 2 to start alarm...</div>
      </div>
    {/if}
  {/each}
</div>
