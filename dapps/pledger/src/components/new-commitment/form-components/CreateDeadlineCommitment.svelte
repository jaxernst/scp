<script lang=ts>
  import { EthSymbol } from "@scp/dapp-lib";
	import type { CommitmentType, InitializationTypes } from "@scp/protocol/lib/types";
	import SubmitButton from "../SubmitButton.svelte";
	import { scpUser } from "$lib/scpUser";
	import { disableScrollHandling } from "$app/navigation";
	import { parseEther } from "ethers/lib/utils";

  const type: CommitmentType = "TimelockingDeadlineTask"

  const SECONDS_PER_DAY = 60 * 60 * 24
  const SECONDS_PER_HOUR = 60 * 60

  // Input fields
  let taskDescription: string
  let deadlineDate: string
  let deadlineTime: string 
  let timelockCollatoral: number = 0 // ether
  let timelockDurationDays: number = 30
  let submissionWindowHrs: number = 2

  $: deadlineTimestamp = (deadlineDate && deadlineTime) ? Math.floor(
    new Date(deadlineDate + " " + deadlineTime).getTime() / 1000
  ) : null

  $: disabled = () => !deadlineTimestamp || !taskDescription

  const onSubmit = () => {
    if (disabled()) return

    scpUser.createCommitment(
      type, 
      {
        deadline: deadlineTimestamp!,
        submissionWindow: submissionWindowHrs * SECONDS_PER_HOUR,
        timelockDuration: timelockDurationDays * SECONDS_PER_DAY,
        taskDescription
      },
      parseEther(timelockCollatoral.toString())
    )
  }

</script>


<form on:submit|preventDefault={() => {}}>
  <div class=form-inputs>
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
          style="width: 100px"
      />
    </div>
    <div class=line>
      <label for=collatoral>Collatoral:</label>
      <input 
        name=collatoral
        type=number
        class=input-item
        bind:value={timelockCollatoral}
        min=0
        style="width: 60px"
      />
      <EthSymbol/>
      <div style="width: 1em; text-align: center"></div>
      <label for=timelock-duration>Timelock:</label>
      <input 
        name=timelock-duration
        type=number
        class=input-item
        bind:value={timelockDurationDays}
        min=1
        style="width: 60px"
      />
      <span style="font-size:14px">days</span>
    </div>
    <div class=line>
      <label for=submission-window>Submission Window</label>
      <input
        name=submission-window
        class=input-item
        type=number
        bind:value={submissionWindowHrs}
        style="width: 60px"
      />
      <span style="font-size:14px">days</span>
    </div>
  </div>
  <SubmitButton onSubmit={onSubmit} disabled={disabled()}/>
</form>

<style>
  form {
    display: grid;
    height: 100%;
    margin: 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content;
    justify-content: space-evenly;
  }

  label {
    font-size: 14px;
  }

  .form-inputs {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
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