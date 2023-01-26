<script lang=ts>
	import { getCommitmentHub } from "$lib/getContract";
	import { connectionError } from "$lib/stores/dAppReady";
	import { txs } from "$lib/stores/stores";
	import type { TypedEvent } from "@scp/protocol/typechain-types/common";
	import type { CommitmentCreationEvent, CommitmentHub } from "@scp/protocol/typechain-types/contracts/CommitmentHub.sol/CommitmentHub";
  import { provider, signerAddress } from "svelte-ethers-store"
  
  
  let events: Promise<CommitmentCreationEvent[]> | undefined
  $: console.log($connectionError)
  $: {
    let _txs = txs
    const hub = getCommitmentHub()
    if (hub) {
      console.log("Querying")
      events = queryCommitmentEvents(hub)
    }
  }

  const queryCommitmentEvents = async (hub: CommitmentHub) => {
    return await hub?.queryFilter(
      hub.filters.CommitmentCreation($signerAddress)
    )
  }

  enum Display {
    ACTIVE,
    PAST
  }
  let show: Display = Display.ACTIVE
  
</script>

{#if events}
  {#await events}
    <h1>loading ...</h1>
  {:then events}
    {console.log(events.length)}
    {#each events as event}
      {console.log(event)}
    {/each}
  {/await}
{/if}