<script lang='ts'>
	import { modal } from "$lib/stores/stores";
    import { connected, chainId } from "svelte-web3"
	import ConnectWalletPopup from "./ConnectWalletPopup.svelte";
 
    $: indicatorColor = $connected ? "lime" : "red"
    $: connectedText = $connected ? "wallet connected" : "not connected"

    const showConnectWalletModal = () => modal.set(ConnectWalletPopup)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="clickable" on:click={showConnectWalletModal}>
    <div class="container" style="--indicator-color:{indicatorColor}">
        <div class="indicator" style="color:{indicatorColor}"/>
        <div class="text">{connectedText} </div>
        {#if $connected}
            <div class="separator"/>
            <div class="text">Chain ID: {$chainId}</div>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: right;
        align-items: center;
        color: var(--theme-color1);
        padding: .5em 1em;
    }

    .text {
        font-size: var(--font-small);
    }

    .indicator {
        height: 10px;
        width: 10px;
        border-radius: 100%;
        background-color: var(--indicator-color);
        margin: 0 .5em;
    }

    .separator {
        border-left: 1px solid white;
        height: 10px;
        margin-left: 5px;
        margin-right: 5px
    }
</style>
