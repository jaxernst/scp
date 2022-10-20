<script>
    import NumMembers from './options/NumMembers.svelte';
    import PoolPenalty from './options/PoolPenalty.svelte';
    import WakeupTime from './options/WakeupTime.svelte'

    import { fade, fly } from 'svelte/transition'
	import { select_options } from 'svelte/internal';


    const ops = {
        comps: [NumMembers, PoolPenalty, WakeupTime],
        i: 0,
        active: () => ops.comps[ops.i % ops.comps.length],
        next: () => ops.i++,
        previous: () => ops.i--
    }

</script>

<h3>Create a New Alarm Pool</h3>

<div style="display:flex; justify-content: center">
    <button class="button-secondary" on:click={() => ops.previous()}>{"<"}</button>
    <button class="button-secondary" on:click={() => ops.next()}>{">"}</button>
</div>
<div class="container">
    <svelte:component  this={ops.active()}/>
</div>

<div style="display:flex; justify-content: center; padding:1em">
    <button class="button-primary">Create</button>
</div>

<style>
    .inline-flex {
        display: flex
    }


    .container {
        padding-top: 2em;
        display: grid;
        position: relative;
        height: 150px 
    }

    


    .icon-container:hover {
        outline: 1px solid var(--theme-color3-dark);
    }

    .icon {
        color: white;
        width: 50px;
        height: 50px
    }

    

    button {
        margin: 1em;
        width: 30%;
    }
</style>