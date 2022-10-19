<script lang="ts">
	import ClockDisplay from 'src/components/alarm-display/ClockDisplay.svelte';
	import ConnectWalletPopup from 'src/components/ConnectWalletPopup.svelte';
	import LabeledLine from 'src/components/LabeledLine.svelte';
	import NextWakeup from 'src/components/alarm-display/NextWakeup.svelte';
	import AlarmActiveDays from 'src/components/alarm-display/AlarmActiveDays.svelte';
	import CommitmentProtocolHubAbi from 'src/abi/CommitmentProtocolHub.json';

	import Modal from 'svelte-simple-modal';
	import { modal } from 'src/lib/stores/stores';
	import { onMount } from 'svelte';
	import { connected, defaultEvmStores, contracts } from 'svelte-web3';
	import { bodyContainerWidthPx } from 'src/theme';
	import { ProtocolHubAddr } from 'src/addresses';

	onMount(() => {
		if (!$connected) {
			modal.set(ConnectWalletPopup);
		}
	});
	
	defaultEvmStores.attachContract(
		'CPHub',
		ProtocolHubAddr,
		CommitmentProtocolHubAbi
	);

	let userAlarm = {
		active: false
	}
	$contracts.CPHub?.methods?.userPools().then(poolAddr => {
		console.log(poolAddr)
	})

	let clockFontSize: string = '90px';
	let pageWidth: any = 600;
	$: if (pageWidth > bodyContainerWidthPx + 50) {
		clockFontSize = '100px';
	} else {
		clockFontSize = '18.1vw';
	}
</script>

<svelte:window bind:innerWidth={pageWidth} />

<ClockDisplay --font-size={clockFontSize} />
{#if userAlarm.active}
	<Modal show={$connected ? null : $modal} />
	<LabeledLine label="Active Alarm" />
	<AlarmActiveDays daysActive={[1, 3, 4, 5, 7]} />
	<div class="flex-row">
		<button class="button-primary full-length" style="margin-left:0">Confirm Wakeup</button>
		<NextWakeup />
	</div>
{:else}
	<AlarmActiveDays/>	
	<div> No Alarm active</div>
{/if}


<!--
<AlarmInformationArea/>
-->
<style>
	.flex-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	button {
		padding: 1em;
		margin: 10px;
		border-radius: 12px;
		transition: 0.3s;
	}

	.button-primary {
		background-color: rgba(255, 255, 255, 0.035);
		border: 1px solid var(--theme-color3-dark);
		color: var(--theme-color1-dark);
	}

	.button-secondary {
		padding-left: 0.5em;
		padding-right: 0.5em;
		background-color: transparent;
		border: none;
		color: var(--theme-alert-color-dark);
	}

	button:hover {
		background-color: rgb(255, 255, 255, 0.2);
	}

	.button-primary:hover {
		color: var(--theme-color3);
		border: 1px solid var(--theme-color3);
	}

	.button-secondary:hover {
		color: var(--theme-alert-color);
		border: 1px solid var(--theme-alert-color-dark);
	}

	.full-length {
		width: 100%;
	}
</style>
