<script>
    import "./options-styles.css"
    import FaUserClock from 'svelte-icons/fa/FaUserClock.svelte'
    import { alarmParams } from "../alarmCreationStore";
    import { fly } from 'svelte/transition'
    export let flyParams = {in : {}, out: {}}



    // Wakeup time params
    let hr = 8
    let min = 30
    let am_pm = "AM"

    $: alarmParams.setWakeupTime(am_pm === "AM" ? hr : hr + 12, min, 0)

</script>

<div class="control-container flex-row" in:fly={flyParams.in} out:fly={flyParams.out}>
    <div class="icon"><FaUserClock/></div>
    <label class="inline-flex">
        <input type=number bind:value={hr} min=1 max=12>
        :
        <input type=number bind:value={min} min=1 max=59>
        <select bind:value={am_pm}>
            <option default={true} value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    </label>
</div>

    
<style>
    
</style>