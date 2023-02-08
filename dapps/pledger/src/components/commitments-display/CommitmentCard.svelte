<script lang="ts">
	import { scpUser } from '$lib/scpUser';
	import type { TimelockingDeadlineTask } from '@scp/protocol/typechain-types';
	import type { UserCommitment } from '@scp/sdk/src/scp-helpers';
  import GoCheck from 'svelte-icons/go/GoCheck.svelte'
  import GoX from 'svelte-icons/go/GoX.svelte'
	export let commitment: UserCommitment;

	// Assuming for now that all commitments are timelocking deadline tasks.
	// Specific commitment types will eventually be factored out into separate files
	let description = commitment.description;
</script>

<div class="commitment-card">
	{#await description}
		loading...
	{:then description}
		{description}
	{/await}
	<div style="display:flex">
    <button on:click={() => scpUser.addTx(commitment.contract.submitConfirmation())}>
      <div class="icon"><GoCheck/></div>
    </button>
		<button on:click={() => scpUser.addTx(commitment.contract.cancel())}>
      <div class=icon><GoX/></div>
    </button>
	</div>
</div>

<style>
	.commitment-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5em;
		min-height: 30px;
		background-color: var(--theme-container1);
		border-left: var(--border-radius3) solid var(--theme-color3);
		border-radius: var(--border-radius3);
		transition: box-shadow 0.2s;
	}

	.commitment-card:hover {
		box-shadow: 2px 2px 8px rgba(91, 91, 91, 0.509);
	}

	.icon {
		height: 15px;
		width: 15px;
		color: var(--theme-color2);
	}
</style>
