<script>
    import FaUserClock from 'svelte-icons/fa/FaUserClock.svelte'
    import "./options-styles.css"
    import { fade, fly } from 'svelte/transition'
    import {flyIn, flyOut} from "./flyParams"

    // Wakeup time params
    let hr = 8
    let min = 30
    let am_pm = "AM"

</script>

<div class="control-container" in:fly={flyIn} out:fly={flyOut}>
    <div class="icon"><FaUserClock/></div>
    <label class="inline-flex">
        <input type=number bind:value={hr} min=0 max=12>
        :
        <input type=number bind:value={min} min=0 max=59>
        <select bind:value={am_pm}>
            <option default={true} value="AM">AM</option>
            <option value="PM">PM</option>
        </select>
    </label>
</div>

    
<style>
    
</style>