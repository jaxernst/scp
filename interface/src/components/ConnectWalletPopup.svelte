<script lang="ts">
	import AlarmInformationArea from "./alarm-display/AlarmInformationArea.svelte";
	import { defaultEvmStores, connected} from "svelte-web3"

</script>

<h3> Welcome, please connect your Metamask wallet to begin:</h3>
<div class="alarm-display-row">
    <button class="button-primary" on:click={defaultEvmStores.setProvider}>
        Connect
    </button>
</div>