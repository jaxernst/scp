<script lang="ts">
	import type { UserCommitment } from "@scp/sdk/src/scp-helpers";
	import { scpUser } from "@scp/sdk/svelte-scp-stores/stores";
  import MdExpandMore from 'svelte-icons/md/MdExpandMore.svelte'
  export let commitment: UserCommitment
  let name = commitment.contract.name()
  
</script>

<div class=commitment-card>
  {#await name}
    loading...
  {:then name}
    {name}
  {/await}
  <div style="display:flex">
    <button on:click={() => scpUser.addTx(commitment.contract.submitConfirmation())}>x</button>
    <div class=icon><MdExpandMore/></div>
  </div>
</div>

<style>
  .commitment-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5em;
    min-height: 30px;
    background-color: var(--theme-container1);
    border-left: var(--border-radius3) solid var(--theme-color3);
    border-radius: var(--border-radius3);
    transition: box-shadow .2s;
  }

  .commitment-card:hover {
    box-shadow: 2px 2px 8px rgba(91, 91, 91, 0.509);
  }

  .icon {
    height: 20px;
    width: 20px;
    color: var(--theme-color2);
  }
</style>