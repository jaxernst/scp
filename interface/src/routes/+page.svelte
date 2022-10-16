<script lang="ts">
	import ClockDisplay from "src/components/alarm-display/ClockDisplay.svelte";
	import AlarmInformationArea from "src/components/alarm-display/AlarmInformationArea.svelte";
	import ConnectWalletPopup from "src/components/ConnectWalletPopup.svelte";
	import Modal from "svelte-simple-modal";
	import { modal } from "src/lib/stores/stores"
	import { onMount } from "svelte";
	import { connected } from "svelte-web3"

	let nextWakeupTime = "8:30am"

	onMount(() => {
		if (!$connected) {
			modal.set(ConnectWalletPopup);
		}
	})
//<Modal show={$connected ? null : $modal}/>
</script>

<div class="spacing-large">
	<ClockDisplay widthVw={9}/>
	<div class="flexbox-container">
		<div class="flexbox-item inline-buttons">
			<button class="button-primary" style="margin-left:0">Confirm Wakeup</button>
			<div class="separator"></div>
			<button class="button-secondary">Pause</button>
		</div>
		<div class="flexbox-item next-wakeup-container">
			<div class="label" style="padding-left:10px">Next wakeup</div>
			<ClockDisplay overrideTime={'12'} widthVw={5}/>
		</div>
	</div>
</div>

<AlarmInformationArea/>

<style>
	.spacing-large {
		padding-top: 20px;
		padding-bottom: 20px;
	}

	.flexbox-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 0;
	}

	.flexbox-item {
		min-width: 200px;
	}

	.next-wakeup-container {
		flex-grow: 2;
	}

	.inline-buttons {
		display: inline-flex;
		align-items: center;
	}

	.separator {
		border-left: 1px solid white;
		height: 20px;
	}

	.label {
		color: var(--theme-color1-dark);
		font-size: var(--font-xsmall);
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