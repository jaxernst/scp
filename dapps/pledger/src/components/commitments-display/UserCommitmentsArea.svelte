<script lang="ts">
	import { scpUser } from '$lib/scpUser';
	import { cph } from '$lib/stores/stores';
	import { CommitStatus } from '@scp/protocol/lib/types';
	import type { UserCommitment } from '@scp/sdk/src/scp-helpers';
	import { signer } from 'svelte-ethers-store';
	import CommitmentCard from './CommitmentCard.svelte';

	enum Display {
		ACTIVE,
		PAST
	}

	let show: Display = Display.ACTIVE;
	let commitmentQuery = new Promise(() => {});
	$: if ($cph && $signer) commitmentQuery = scpUser.fetchCommitments($cph, $signer);

	$: activePageOn = (display: Display) => {
		return show === display ? 'active-page' : '';
	};

	const statusFilter = (show: Display) => {
		if (show === Display.ACTIVE) {
			return (commit: UserCommitment) => commit.status === CommitStatus.ACTIVE;
		} else {
			return (commit: UserCommitment) => commit.status !== CommitStatus.ACTIVE;
		}
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
		{#await commitmentQuery}
			<p>Loading...</p>
		{:then}
			{#each Object.values($scpUser.commitments).filter(statusFilter(show)) as commitment}
				<CommitmentCard {commitment}/>
			{/each}
		{/await}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
		box-sizing: border-box;
	}

	.header {
		padding: 1em 1em 0 1em;
	}

	.page-button {
		padding: 0.5em 1em 0.5em 1em;
		border-radius: var(--border-radius4);
	}
	.active-page {
		background-color: var(--theme-container2);
		transition: background-color 0.2s;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		overflow-y: auto;
		padding: 1em;
	}
</style>
