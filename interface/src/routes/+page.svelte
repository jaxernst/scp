<script lang="ts">
	import ClockDisplay from 'src/components/alarm-display/ClockDisplay.svelte';
	import ConnectWalletPopup from 'src/components/ConnectWalletPopup.svelte';
	import LabeledLine from 'src/components/LabeledLine.svelte';
	import AlarmActiveDays from 'src/components/alarm-display/AlarmActiveDays.svelte';
	import CommitmentProtocolHubAbi from 'src/abi/CommitmentProtocolHub.json';

	import Modal from 'svelte-simple-modal';
	import { modal } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { connected, defaultEvmStores, contracts } from 'svelte-web3';
	import { bodyContainerWidthPx } from 'src/theme';
	import { ProtocolHubAddr } from 'src/addresses';
	import WakeupButton from 'src/components/WakeupButton.svelte';

	
	defaultEvmStores.attachContract(
		'ProtocolHub',
		ProtocolHubAddr,
		CommitmentProtocolHubAbi
	);

	let userAlarm = {
		active: true
	}

	$contracts.CPHub?.methods?.userPools().then(poolAddr => {
		
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
	<LabeledLine label="Active Alarm" />
	<AlarmActiveDays daysActive={[1, 3, 4, 5, 7]} />
	<WakeupButton/>

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

</style>
