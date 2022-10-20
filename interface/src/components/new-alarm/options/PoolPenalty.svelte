<script>
	import GiReceiveMoney from 'svelte-icons/gi/GiReceiveMoney.svelte';
    import { fade, fly } from 'svelte/transition'
	import "./options-styles.css"
    import {flyIn, flyOut} from "./flyParams"

    // Pool penalty param
	let percFee = '10';
</script>

<div class="control-container" in:fly={flyIn} out:fly={flyOut}>    
    <div class="icon"><GiReceiveMoney /></div>
    <label>
        <input type="number" bind:value={percFee} min="0" max="40" />
        %
    </label>
</div>
