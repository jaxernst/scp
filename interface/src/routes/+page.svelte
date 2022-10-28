<script lang="ts">
	import ClockDisplay from 'src/components/alarm-display/ClockDisplay.svelte';
	import ConnectWalletPopup from 'src/components/ConnectWalletPopup.svelte';
	import LabeledLine from 'src/components/LabeledLine.svelte';
	import AlarmActiveDays from 'src/components/alarm-display/AlarmActiveDays.svelte';
	import { bodyContainerWidthPx } from 'src/theme';
	import WakeupButton from 'src/components/WakeupButton.svelte';

	let userAlarm = {
		active: true
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
{#if userAlarm.active}
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


