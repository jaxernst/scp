<script>
	import GiReceiveMoney from 'svelte-icons/gi/GiReceiveMoney.svelte';
    import { fade, fly } from 'svelte/transition'
    import { alarmParams } from '../alarmCreationStore';
	import "./options-styles.css"
    export let flyParams = {in : {}, out: {}}

    // Pool penalty param
	let percFee = 10;
    let feeMin = 0
    let feeMax = 40
    $: percFee = percFee > feeMax ? feeMin : percFee < feeMin ? feeMax : percFee

    $: alarmParams.setPercentFee(percFee)
</script>

<div class="control-container flex-row" in:fly={flyParams.in} out:fly={flyParams.out}>    
    <div class="icon"><GiReceiveMoney /></div>
    <label>
        <input type="number" bind:value={percFee} min={feeMin - 1} max={feeMax + 1} />
        %
    </label>
</div>
