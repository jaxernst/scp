<script lang="ts">
	import ClockDisplay from 'src/components/alarm-display/ClockDisplay.svelte';
	import LabeledLine from 'src/components/LabeledLine.svelte';
	import AlarmActiveDays from 'src/components/alarm-display/AlarmActiveDays.svelte';
	import { bodyContainerWidthPx } from 'src/theme';
	import WakeupButton from 'src/components/WakeupButton.svelte';
	import type { PromiseOrValue } from '@social-alarm-clock/protocol/typechain-types/common';
	import type { Contract } from "ethers"
	import { connected, signerAddress } from "svelte-ethers-store"

	let userAlarms: undefined | PromiseOrValue<Contract[]>
	$: if (connected && signerAddress) {
		//userAlarms = getUserPools($signerAddress)
	}

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
{#await userAlarms}
	<div>Checking for user AlarmStats...</div>
{:then}
	{#if userAlarms}
		<LabeledLine label="Active Alarm" />
		<AlarmActiveDays daysActive={[1, 3, 4, 5, 7]} />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div>
			<WakeupButton/>
		</div>

	{:else}
		<AlarmActiveDays/>	
		<div> No Alarm active</div>
	{/if}
{:catch err}
	<div>Error: Alarms could not be retrieved</div>
	<div>{err}</div>
{/await}


