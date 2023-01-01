<script>
    import { fade, fly } from 'svelte/transition'
    import IoMdPeople from 'svelte-icons/io/IoMdPeople.svelte'
    import "./options-styles.css"
    export let flyParams = {in : {}, out: {}}
    
    let percFee = 0
</script>

<div class="control-container flex-row" in:fly={flyParams.in} out:fly={flyParams.out}>
    <div class="icon"><IoMdPeople/></div>
    <label>
        <input type=number bind:value={percFee} min=0 max=40>
        Max Members
    </label>
</div>