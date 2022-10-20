<script lang="ts">
	import { defaultEvmStores, connected, selectedAccount} from "svelte-web3"
	import AlarmInformationArea from "./alarm-display/AlarmInformationArea.svelte";
	import { modal } from "$lib/stores/stores";
	import WakeupButton from "./WakeupButton.svelte";

    let warning: string | null = null 
    const onConnectClick = () => {
        defaultEvmStores.setProvider()
            .then(() => {
                console.log($connected, $selectedAccount)
                if ($connected && $selectedAccount) {
                    console.log("Connection Successful")
                    modal.set(null) // Close modal on success
                    return
                }

                warning = "Connection to wallet unsuccessful"
            })  
    }
    
</script>

<div class="flex-centered">
    <h2> Welcome, please connect your browser wallet to begin</h2>

    {#if warning}
        <h3>
            {warning}
        </h3>
    {/if}

    <div class="alarm-display-row">
        <button class="button-primary" on:click={onConnectClick}>
            Connect
        </button>
    </div>
</div>

<style>

    h3 {
        color: var(--alert-color)
    }

    .flex-centered {
        display: flex;
        padding: 1em;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>