<script lang="ts">
	import '../app.css';

	import ConnectWalletPopup from 'src/components/ConnectWalletPopup.svelte';
	import NewCommitmentArea from 'src/components/new-commitment/NewCommitmentArea.svelte';
	import Hud from 'src/components/Hud.svelte';
	import Modal from 'svelte-simple-modal';
	import { modal } from "$lib/stores/stores";
	import { connected, defaultEvmStores } from "svelte-ethers-store";
	import { onMount } from 'svelte';
	import hubAbi from "src/abi/CommitmentHub.json"
	import { CommitmentProtocolHubAddr } from '$lib/constants';
	
	/**
	 * Add an instance of the protocol hub contract to stores 
	 */
	defaultEvmStores.attachContract(
		"CommitmentProtocolHub",
		CommitmentProtocolHubAddr,
		JSON.stringify(hubAbi)
	);

	onMount(() => {
		if (!$connected) {
			modal.set(ConnectWalletPopup);
		}
	});
</script>

<div class=app>	
	<div class=grid-container>
		<div class="grid-item commitment-area">
			<div>
			</div>
		</div>
		<div class="grid-item action-area">
			<Hud/>
			<NewCommitmentArea/>
		</div>
		<div class="grid-item feed">Feed</div>
	</div>
</div>
	
<Modal 
	on:close={() => modal.set(null)} 
	show={$modal}
	styleWindow={{ backgroundColor: 'var(--theme-container4)'}}
/>


<style>
	.app {
		display: flex;
		box-sizing: border-box;
		justify-content: center;
		margin: auto 0 auto 0;
		flex: 1;
		margin: 1.5em;
	}

	.grid-container {
		flex: 1;
		display: grid;
		grid-template-rows: repeat(2, minmax(0, 1fr));
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-gap: 1.5em;
		height: 100%;
		max-width: 1000px;
		height: 800px;

  }

  .grid-container > div {
    	background-color: var(--theme-container1);
		border-radius: 20px;
		padding: 1em;
		box-shadow: 4px 8px 3px rgba(0, 0, 0, 0.509);
  }

	.action-area {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.grid-item:nth-child(3) {
		grid-row: 2/3;
		grid-column: 1/3;
  }
</style>

