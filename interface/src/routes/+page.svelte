<script lang="ts">
	import StyledTitle from "../components/StyledTitle.svelte";
	import ClockDisplay from "../components/alarm-display/ClockDisplay.svelte";
	import AlarmInformationArea from "../components/alarm-display/AlarmInformationArea.svelte";

	import { defaultEvmStores, connected} from "svelte-web3"
	import { onMount } from "svelte"

	const connectProvider = () => defaultEvmStores.setProvider()

</script>


<StyledTitle/>
<div class="spacing-large">
	<ClockDisplay class="spacing-large"/>
</div>

{#if $connected}
		<AlarmInformationArea/>
		<div class="alarm-display-row">
			<button class="button-primary">Confirm Wakeup</button>
			<div style="color:gray"> | </div>
			<button class="button-secondary">Pause Alarm</button>
		</div>
{:else}
	<div class="alarm-display-row">
		<button class="button-primary" on:click={connectProvider}>
			Please connect your wallet to get started
		</button>
	</div>
{/if}

<style>

	#awaitConnection {
		color: var(--theme-color1);
		font-size: 15px;
		font-weight: 100;
		text-align: center;
	}


	.alarm-display-row {
		padding-top: 1em;
		padding-bottom: 1em;
		display: flex;
        justify-content: center;
		align-items: center;
		grid-auto-columns: max-content auto max-content;
 		grid-auto-flow: column;
		width: 100%
	}

	.spacing-large {
		padding-top: 20px;
		padding-bottom: 20px;
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