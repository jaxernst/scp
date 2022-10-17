<script lang='ts'>
    import { connected } from "svelte-web3"
    console.log($connected)
    $: indicatorColor = $connected ? "lime" : "red"
    $: connectedText = $connected ? "wallet connected" : "not connected"
</script>

<div class="container" style="--indicator-color:{indicatorColor}">
    <div class="indicator" style="color:{indicatorColor}"/>
    <div class="text">{connectedText}</div>
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
</style>
