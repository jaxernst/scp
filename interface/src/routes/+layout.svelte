<script lang="ts">
	import '../theme.css';
	import Navigation from '../components/navigation/Navigation.svelte';
	import { connected } from "svelte-web3"
	import { bodyContainerWidthPx } from "src/theme"
	import ConnectionStatus from 'src/components/ConnectionStatus.svelte';
	import ConnectWalletPopup from 'src/components/ConnectWalletPopup.svelte';
	import { modal } from "$lib/stores/stores"
	import Modal from 'svelte-simple-modal';
	import { onMount, SvelteComponent } from 'svelte';

	onMount(() => {
		if (!$connected) {
			modal.set(ConnectWalletPopup);
		}
	});
</script>

<body>
	<ConnectionStatus/>
	<Modal 
		on:close={() => modal.set(null)} 
		show={$modal}
		styleWindow={{ backgroundColor: 'var(--dark-gray)'}}
	/>
	<div class="page-container" style="--content-width:{bodyContainerWidthPx}px">
		<slot/>
	</div>
	
	<div class="lower-nav">
		<Navigation />
	</div>
</body>

<style>
	body {
		height: 100%;
		margin: 0;
		background: rgb(242, 148, 146);
		background: var(--background-gradient);
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	:global(*) {
		font-family: Verdana;
	}

	:global(h3) {
		color: var(--theme-color1);
		font-size: medium;
		font-weight: 100;
		text-align: center;
	}

	.lower-nav {
		position: fixed;
		bottom: 0%;
		width: 100%;
	}

	.page-container {
		position: relative;
		margin-top: 8vh;
		margin-right: auto;
		margin-left: auto;
		max-width: var(--content-width);
		overflow: hidden;
		
		padding: 1rem 4%;
		background-color: var(--black-trans-50);
		border-radius: var(--border-radius-medium);
	}
</style>
