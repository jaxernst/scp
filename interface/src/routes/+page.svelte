<script lang="ts">
	import ClockDisplay from "src/components/alarm-display/ClockDisplay.svelte";
	import ConnectWalletPopup from "src/components/ConnectWalletPopup.svelte";
	import Modal from "svelte-simple-modal";
	import { modal } from "src/lib/stores/stores"
	import { onMount } from "svelte";
	import { connected } from "svelte-web3"
	import { bodyContainerWidthPx } from "src/theme"

	let nextWakeupTime = "8:30am"

	onMount(() => {
		if (!$connected) {
			modal.set(ConnectWalletPopup);
		}
	})

	let clockFontSize: string = "90px"
	let pageWidth: any = 600
	$: if (pageWidth > ( bodyContainerWidthPx + 50)) {
		clockFontSize = "100px"
	} else {
		clockFontSize = "18.1vw"
	}
	
</script>

<svelte:window bind:innerWidth={pageWidth}/>
<Modal show={$connected ? null : $modal}/>

<div class="spacing-large">
	<ClockDisplay --font-size={clockFontSize}/>
</div>
<span>
	<button class="button-primary" style="margin-left:0">Confirm Wakeup</button>
</span>

<!--
<AlarmInformationArea/>
-->

<style>
	.spacing-large {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	span {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button {
		padding: 1em;
		margin: 10px;
        border-radius: 12px;
		transition: .3s;
	}
	
	.button-primary {
		background-color: rgba(255, 255, 255, 0.035);
		border: 1px solid var(--theme-color3-dark);
		color: var(--theme-color1-dark);
	}

	.button-secondary {
		padding-left: .5em;
		padding-right: .5em;
		background-color: transparent;
		border: none;
		color: var(--theme-alert-color-dark);
	}


    button:hover {
		background-color: rgb(255,255,255,.2);
	}
	
	.button-primary:hover {
		color: var(--theme-color3);
		border: 1px solid var(--theme-color3)
    }

	.button-secondary:hover {
		color: var(--theme-alert-color);
		border: 1px solid var(--theme-alert-color-dark)
	}

</style>