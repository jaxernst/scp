<script lang=ts>
	import { BigNumber } from "ethers";
  import { getComittmentHub } from "$lib/getContract";

  const onSubmit = async () => {
    const hub = getComittmentHub()
    if (!hub) throw "No Hub"

  }
  let taskDescription = "task description"
  let deadline: number
  let stakeAmount: BigNumber = BigNumber.from(0)

</script>

<input type=text bind:value={taskDescription}>
<input type=radio bind:value={taskDescription}>
<input type=check bind:value={taskDescription}>
<button on:click={onSubmit}>Submit</button>

<style>
  input {
    margin: 1em;
    padding: .5em;
    border: none;
    outline: none;
    background-color: var(--theme-color3);
    border-radius: 14px;
  }


</style>

