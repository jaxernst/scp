<script lang="ts">
	import AlarmInformationArea from "./alarm-display/AlarmInformationArea.svelte";
	import { defaultEvmStores, connected} from "svelte-web3"

    const onConnectClick = () => {
        defaultEvmStores.setProvider()
    }
    
</script>

<div class="flex-centered">
    <h2> Welcome, please connect your browser wallet to begin</h2>
    <div class="alarm-display-row">
        <button class="button-primary" on:click={onConnectClick}>
            Connect
        </button>
    </div>
</div>

<style>

    h2 {
        color: teal;
        text-align: center;
    }

    .flex-centered {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>