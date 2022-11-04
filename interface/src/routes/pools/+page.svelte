<script lang="ts">
    import CreateNewAlarm from "src/components/new-alarm/CreateNewAlarm.svelte";
    import MdAddAlarm from 'svelte-icons/md/MdAddAlarm.svelte'
    import { modal } from "$lib/stores/stores";
    import { connected } from "svelte-ethers-store"
    import type { AlarmPool, CommitmentProtocolHub } from "@social-alarm-clock/protocol/typechain-types"
	import { getComittmentProtocolHub, getPool } from "$lib/getContract";
	import type { PromiseOrValue } from "@social-alarm-clock/protocol/typechain-types/common";
	import PoolCard from "src/components/PoolCard.svelte";
	import { onMount } from "svelte";

    const openNewAlarmModal = () => {
        modal.set(CreateNewAlarm);
    }

    const getPoolIdsArr = async (protocolHub: CommitmentProtocolHub) => {
        await new Promise(r => setTimeout(r, 500))
        const numPools = Number(await protocolHub.nextPoolId())
        return [...Array(numPools).keys()]
    }

    let poolIds: PromiseOrValue<number[]> = []
    let pools: PromiseOrValue<AlarmPool>[] = []
    const fetchPools = (hub: CommitmentProtocolHub) => {
        console.log("Fetching pools")
        poolIds = getPoolIdsArr(hub)
        poolIds.then((poolIds) => {
            for (const id of poolIds) {
                pools = [...pools, getPool(hub, id)]
            }   
        })
    }

    $: if ($connected) {
        const hub = getComittmentProtocolHub()
        if (!hub) throw Error("No Hub")
        fetchPools(hub)
    }

</script>


<div class="header-row">
    <div class="title">Alarm Pools</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={openNewAlarmModal} class="icon"><MdAddAlarm/></div>
</div>
<div class="pool-cards-container">
    {#await poolIds}
        <div>Loading pools...</div>
    {:then}
        {#each pools as alarmPool}
            <PoolCard {alarmPool}/>
        {/each}
    {/await}
</div>



<style>
    .header-row {
        padding-bottom: 1em;
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

    .pool-cards-container {
        padding-top: 1em;
        padding-bottom: 1.5em;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        grid-gap: 20px;
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