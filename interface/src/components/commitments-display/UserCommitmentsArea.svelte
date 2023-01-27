<script lang="ts">
	import { getUserCommitments, type UserCommitments } from '$lib/commitments';
	import { getCommitmentHub } from '$lib/commitments';
	import { sessionTransactionReceipts } from '$lib/stores/stores';
  import type {
		CommitmentCreationEvent,
		CommitmentHub
	} from '@scp/protocol/typechain-types/contracts/CommitmentHub.sol/CommitmentHub';
	import { contracts, signer, signerAddress } from 'svelte-ethers-store';
	import CommitmentCard from './CommitmentCard.svelte';

	const queryCommitmentEvents = async (hub: CommitmentHub) => {
		return await hub?.queryFilter(hub.filters.CommitmentCreation($signerAddress));
	};

	enum Display {
		ACTIVE,
		PAST
	}

	let show: Display = Display.ACTIVE;
	let hub: CommitmentHub | undefined;
	let events: Promise<CommitmentCreationEvent[]> | undefined;
  let userCommitments: Promise<UserCommitments> = new Promise(r => r)

	$: {
		$sessionTransactionReceipts; // Re-query for events when tx receipts store is updated
		if ($contracts) hub = getCommitmentHub();
		if (hub) {
      events = queryCommitmentEvents(hub);
      userCommitments = getUserCommitments(events, $signer)
    }
	}

	$: activePageOn = (display: Display) => {
		return show === display ? 'active-page' : '';
	};
</script>

<div class="container">
	<div class="header">
		<button
			class={'page-button ' + activePageOn(Display.ACTIVE)}
			on:click={() => (show = Display.ACTIVE)}
		>
			Active
		</button>
		<button
			class={'page-button ' + activePageOn(Display.PAST)}
			on:click={() => (show = Display.PAST)}
		>
			Past
		</button>
	</div>
	<div class="body">
			{#await userCommitments}
				<h1>loading user commitments...</h1>
			{:then commitments}
        {#if show === Display.ACTIVE}
          {#each commitments.active as commitment}
            <CommitmentCard {commitment}/>
          {/each}
        {:else}
          <h1> Inactive commitments here</h1>
        {/if}
			{/await}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
    height: 100%;
    box-sizing: border-box;
		gap: 1em;
	}
	.page-button {
		padding: 0.5em 1em 0.5em 1em;
		border-radius: var(--border-radius4);
	}
	.active-page {
		background-color: var(--theme-container2);
    transition: background-color .2s;
	}

  .body {
    display: flex;
    flex-direction: column;
    gap: .5em;
    overflow-y: auto;
  }
</style>
