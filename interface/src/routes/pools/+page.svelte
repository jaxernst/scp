<script lang="ts">
    import CreateNewAlarm from "src/components/new-alarm/CreateNewAlarm.svelte";
    import MdAddAlarm from 'svelte-icons/md/MdAddAlarm.svelte'
    import { modal } from "$lib/stores/stores";
    import { contracts } from "svelte-ethers-store"
    import type { CommitmentProtocolHub } from "@social-alarm-clock/protocol/typechain-types"
	import { ProtocolHubAddr } from "src/addresses";

    const openNewAlarmModal = () => {
        modal.set(CreateNewAlarm);
    }

    const getPoolIdsArr = async (protocolHub: CommitmentProtocolHub) => {
        await new Promise(r => setTimeout(r, 1000))
        const numPools = Number(await protocolHub.nextPoolId())
        return [...Array(numPools).keys()]
    }

    let pools: any[] | Promise<any[]> = []
    $: if ($contracts.ProtocolHub) {
        pools = []
    }

</script>


<div class="header-row">
    <div class="title">Alarm Pools</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={openNewAlarmModal} class="icon"><MdAddAlarm/></div>
</div>
<div class="pool-cards-container">
    {#await pools}
        <div> loading pools...</div>
    {:then pools}
        {#if pools && pools.length > 0} 
            {#each pools as id}
                <h>{id}</h>
            {/each}
        {:else}
            <div></div>
        {/if}
    {:catch err} 
        <div>{err}</div>
    {/await}
</div>



<style>
    .header-row {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        justify-content: center;
        align-items: center;
    }

    .title {
        grid-column-start: 2;
        color: var(--theme-color1);
        font-size: var(--font-large);
        height: min-content;
    }

    .icon {
        margin-left: auto;
        justify-self: right;
        height: 25px;
        width: 25px;
        color: var(--theme-color3);
        transition: .8s
    }

    .icon:hover {
        height: 30px;
        width: 30px;
        transform: rotate(10deg);
    }
</style>