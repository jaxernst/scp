<script lang="ts">
	import '../app.css';

	import ConnectWalletPopup from 'src/components/ConnectWalletPopup.svelte';
	import { connected, defaultEvmStores } from "svelte-ethers-store"
	import { modal } from "$lib/stores/stores"
	import { onMount } from 'svelte';
	import Modal from 'svelte-simple-modal';
	import Hud from 'src/components/Hud.svelte';
	import TransitionButton from 'src/components/TransitionButton.svelte';
	import PlusIcon from 'src/PlusIcon.svelte';

	/* defaultEvmStores.attachContract(
		cph.contractName,
		CommitmentProtocolHubAddr,
		JSON.stringify(cph.abi)
	); */

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
			<div class="card-area">
				<div class="card-decor card-layout">
					<span>ToDo</span>
				</div>
			</div>
		</div>
		<div class="grid-item feed">Feed</div>
	</div>
</div>
	
	
<Modal 
	on:close={() => modal.set(null)} 
	show={$modal}
	styleWindow={{ backgroundColor: 'var(--theme-container3)'}}
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
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1.5em;
		height: 100%;
		max-width: 1000px;
  }

  .grid-container > div {
    background-color: var(--theme-container1);
		border-radius: 20px;
    padding: 20px;
    text-align: center;
		box-shadow: 4px 8px 3px rgba(0, 0, 0, 0.509);
  }

	.action-area {
		display: flex;
		flex-direction: column;
	}

	.grid-item:nth-child(3) {
    grid-row: 2/3;
    grid-column: 1/3;
  }

	.card-area {
		margin: .5em 0 .5em 0;
	}

	.card-decor {
		font-family: 'Orbitron';
		color: var(--theme-color3-dark);
		outline: 3px solid var(--theme-color3);
		border-radius: 10px;
		background-color: var(--theme-container1);
		width: 60px;
		height: 60px;
		box-shadow: 2px 2px 8px rgba(91, 91, 91, 0.509);
		
	}

	.card-layout {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>

