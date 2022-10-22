<script>
	import GiReceiveMoney from 'svelte-icons/gi/GiReceiveMoney.svelte';
    import { fade, fly } from 'svelte/transition'
	import "./options-styles.css"
    export let flyParams = {in : {}, out: {}}

    // Pool penalty param
	let percFee = '10';
</script>

<div class="control-container flex-row" in:fly={flyParams.in} out:fly={flyParams.out}>    
    <div class="icon"><GiReceiveMoney /></div>
    <label>
        <input type="number" bind:value={percFee} min="0" max="40" />
        %
    </label>
</div>
