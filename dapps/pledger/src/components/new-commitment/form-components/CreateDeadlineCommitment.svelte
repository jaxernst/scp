<script lang=ts>
	import { PenaltyModule } from "@scp/sdk/src/types";
  import { EthSymbol } from "@scp/dapp-lib";
  import { formData } from "../formData";
	import type { CommitmentType, InitializationTypes } from "@scp/protocol/lib/types";


  let taskDescription: string
  let deadlineDate: string
  let deadlineTime: string
  let penaltyModule: PenaltyModule | undefined
  let collatoralVal: number

  let initData: InitializationTypes[CommitmentType] = {

  }

  $: deadlineTimestamp = Math.floor(
    new Date(deadlineDate + " " + deadlineTime).getTime() / 1000
  )

  $: if (penaltyModule) {
    formData.set({
      deadline: deadlineTimestamp,
      submissionWindow: 60*60

    })
  }
</script>

<div class=container>


<div class="line">
  <input 
      id=task 
      type=text 
      bind:value={taskDescription}
      placeholder="Describe the task to complete by the deadline"
      class="input-item"
      style="flex-grow:1"
  />
</div>

<div class=line>
  <label for=deadline>Deadline:</label>
  <input 
      id=deadline
      type=date 
      bind:value={deadlineDate}
      placeholder=date
      class=input-item
  />
  <input 
      id=deadline
      type=time
      bind:value={deadlineTime}
      placeholder="date"
      class=input-item
  />
</div>

<div class=line>
  <label for=penalty class="nowrap">Penalty Module:</label>
  <select name=penalty class=input-item bind:value={penaltyModule}>
    <option>None</option>
    <option value={PenaltyModule.TIMELOCK}>Timelock</option>
  </select>
  {#if penaltyModule === PenaltyModule.TIMELOCK}
    <label for=collatoral>Collatoral:</label>
    <input 
      name=collatoral
      type=number
      class=input-item
      bind:value={collatoralVal}
      style="width: 60px"
    />
    <EthSymbol/>
  {/if}
</div>

  
</div>

<style>
  .container {
    padding: 1em 0 1em 0;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .nowrap {
    white-space: nowrap;
    overflow: hidden;
  }

  label {
    font-size: 14px;
  }

  .input-item {
    padding: .5em;
    border-radius: var(--border-radius3);
    outline: 1px dashed gray;
    border: none;
  }

  .line {
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: .5em;
  }

</style>