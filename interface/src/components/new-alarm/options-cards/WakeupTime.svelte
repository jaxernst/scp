<script lang="ts">
    import "./options-styles.css"
    import FaUserClock from 'svelte-icons/fa/FaUserClock.svelte'
    import { alarmParams } from "../alarmCreationStore";
    import { fly } from 'svelte/transition'
    export let flyParams = {in : {}, out: {}}

    // Wakeup time params
    let hr = 8
    let min = 30
    let am_pm: "AM" | "PM" = "AM"
    $: hr = hr > 12 ? 1 : hr < 1 ? 12 : hr
    $: min = min > 59 ? 0 : min < 0 ? 59 : min

    const absHours = (hr: number, am_pm: "AM" | "PM") => {
        hr = hr === 12 ? 0 : hr
        if (am_pm === "PM") return hr + 12
        return hr
    }
    
    // Update store with selected value
    $: alarmParams.setWakeupTime(absHours(hr, am_pm), min, 0)
</script>

<div class="control-container flex-row" in:fly={flyParams.in} out:fly={flyParams.out}>
    <div class="icon"><FaUserClock/></div>
    <label class="inline-flex">
        <input type=number bind:value={hr} min=0 max=13/>
        :
        <input type=number bind:value={min} min={-1} max=60>
        <select bind:value={am_pm}>
            <option default={true} value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    </label>
</div>

    
<style>
    
</style>