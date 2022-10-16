<script lang="ts">
	import AlarmInformationArea from "./alarm-display/AlarmInformationArea.svelte";
	import { defaultEvmStores, connected} from "svelte-web3"

    const onConnectClick = () => {
        console.log("Clickl")
        defaultEvmStores.setProvider()
    }
</script>

<h3> Welcome, please connect your Metamask wallet to begin:</h3>
<div class="alarm-display-row">
    Connect your wallet:
    <button class="button-primary" on:click={onConnectClick}>
        Connect
    </button>
</div>

<style>
    .alarm-display-row {
    }
</style>