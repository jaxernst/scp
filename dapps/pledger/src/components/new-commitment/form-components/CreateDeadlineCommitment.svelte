<script lang=ts>
	import { PenaltyModule } from "@scp/sdk/types/types";


  let taskDescription: string
  let deadlineDate: string
  let deadlineTime: string
  let penaltyModule: PenaltyModule | undefined
  let collatoralVal: number
  $: console.log(penaltyModule)
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
      placeholder="date"
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
  <label for=penalty class=fixed-width>Penalty Module:</label>
  <select name=penalty class=input-item bind:value={penaltyModule}>
    <option>None</option>
    <option value={PenaltyModule.TIMELOCK}>Timelock</option>
  </select>
  {#if penaltyModule === PenaltyModule.TIMELOCK}
    <input 
      type=range 
      bind:value={collatoralVal}
      min=0
      max=100000
      class=fixed-width
    />
    {#if collatoralVal} {collatoralVal / 100000} {/if}
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

  .full-width {
    width: 100%;
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

  .fixed-width {
    width: 50px;
  }
</style>