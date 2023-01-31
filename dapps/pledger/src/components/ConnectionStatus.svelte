<script lang='ts'>
	import { connectionError, dAppReady } from "$lib/stores/dAppReady";
	import { modal } from "$lib/stores/stores";
    import { connected, chainId, signerAddress } from "svelte-ethers-store"
	import ConnectWalletPopup from "./ConnectWalletPopup.svelte";
 
    $: indicatorColor = $dAppReady ? "lime" : "red"
    
    let connectedWalletText: string | null = null
    $: {
        if ($connected && $signerAddress) {
            connectedWalletText = "Connected to " + shorthandAddress($signerAddress)
        } else {
            connectedWalletText = "Not connected"
        }
    }
        
    const shorthandAddress = (address: string) => {
        return "0x" + address.slice(2, 4) + "..." + address.slice(-4)
    }
    const showConnectWalletModal = () => modal.set(ConnectWalletPopup)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="clickable" on:click={showConnectWalletModal}>
    <div class="container" style="--indicator-color:{indicatorColor}">
        <div class="indicator" style="color:{indicatorColor}"/>
        <div class="text">{connectedWalletText} </div>
        {#if $connected}
            <div class="separator"/>
            <div class="text">Chain ID: {$chainId}</div>
        {/if}
        {#if $connectionError}
        <div class="separator"/>
            <div class="text error">{$connectionError}</div>
        {/if}
    </div>
    
</div>

<style>
    .container {
        display: flex;
        justify-content: right;
        align-items: center;
        padding: .5em 1em;
    }

    .text {
        font-size: var(--font-small);
        color: var(--theme-color2);
    }

    .indicator {
        height: 10px;
        width: 10px;
        border-radius: 100%;
        background-color: var(--indicator-color);
        margin: 0 .5em;
    }

    .separator {
        border-left: 1px solid var(--theme-color2);
        height: 10px;
        margin-left: 5px;
        margin-right: 5px
    }

    .error {
        color: var(--indicator-color);
    }
</style>
