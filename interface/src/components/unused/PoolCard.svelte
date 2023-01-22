<script lang="ts">
	import type { AlarmPool } from "@social-alarm-clock/protocol/typechain-types";
    export let alarmPool: PromiseOrValue<AlarmPool>

    let poolWakeup = "8:30 am"
    let showButton = false
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class=card on:mouseover={() => showButton = true} on:mouseout={() => showButton = false}>
    {#if showButton}
        <div class=joinButton>click me</div>
    {:else}
        <div>
            <h3>{poolWakeup}</h3>
        </div>
    {/if}
</div>

<style>
    .card {
        outline: 1px solid white;
        border-radius: 5px;
        min-height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .joinButton {
        background-color: aqua;
    }

</style>