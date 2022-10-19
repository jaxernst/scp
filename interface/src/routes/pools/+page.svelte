<script>
	import AlarmActiveDays from "src/components/alarm-display/AlarmActiveDays.svelte";
    import CreateNewAlarm from "src/components/CreateNewAlarm.svelte";
    import MdAddAlarm from 'svelte-icons/md/MdAddAlarm.svelte'
    import { modal } from "$lib/stores/stores";
    import Modal, { bind } from 'svelte-simple-modal';

    const openNewAlarmModal = () => {
        modal.set(CreateNewAlarm);
        console.log("set")
    }
</script>


<div class="header-row">
    <div class="title">Alarm Pools</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={openNewAlarmModal} class="icon"><MdAddAlarm/></div>
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