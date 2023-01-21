<script lang="ts">
	import { defaultEvmStores, connected, signerAddress } from 'svelte-ethers-store';
	import { modal } from '$lib/stores/stores';

	let warning: string | null = null;
	const onConnectClick = () => {
		defaultEvmStores.setProvider().then(() => {
			console.log($connected, $signerAddress);
			if ($connected && $signerAddress) {
				console.log('Connection Successful');
				modal.set(null); // Close modal on success
				return;
			}

			warning = 'Connection to wallet unsuccessful';
		});
	};
</script>

<div class="flex-centered">
	<h2>Welcome, please connect your browser wallet to begin</h2>

	{#if warning}
		<h3>
			{warning}
		</h3>
	{/if}

	<div class="alarm-display-row">
		<button class="button-primary" on:click={onConnectClick}> Connect </button>
	</div>
</div>

<style>
	h3 {
		color: var(--alert-color);
	}

	h2 {
		color: white;
		font-weight: 200;
	}

	.flex-centered {
		display: flex;
		padding: 1em;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

</style>
