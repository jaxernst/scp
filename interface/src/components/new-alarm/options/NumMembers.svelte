<script>
    import { fade, fly } from 'svelte/transition'
    import IoMdPeople from 'svelte-icons/io/IoMdPeople.svelte'
    import "./options-styles.css"
    import {flyIn, flyOut} from "./flyParams"
	import { onDestroy } from 'svelte';

    let percFee = 0
</script>

<div class="control-container" in:fly={flyIn} out:fly={flyOut}>
    <div class="icon"><IoMdPeople/></div>
    <label>
        <input type=number bind:value={percFee} min=0 max=40>
        members
    </label>
</div>