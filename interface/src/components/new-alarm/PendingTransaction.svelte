<script lang="ts">
    import { swipeColor } from '$lib/transitions/swipeColor';
    import { Jumper } from 'svelte-loading-spinners';
    import { crossfade } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import AnimatedCheckmark from './AnimatedCheckmark.svelte';
    export let complete = false
    export let waitFor: Promise<any> | null = null
    $: console.log(waitFor)

    const [send, receive] = crossfade({ duration: 1000 })

</script>

<div class="container">
    
    {#await waitFor}
    {:then}
        {#if !complete}
            <Jumper/>
            <h3 style="padding-left:15px"> Creating Contract...</h3>
        {:else}
            <AnimatedCheckmark/>
            <h3> Transaction success!</h3>
        {/if}
    {/await}
</div>

<style>
    .container{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px
    }
</style>