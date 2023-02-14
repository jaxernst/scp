<script lang=ts>
	import type { ComponentType } from "svelte";
    export let displayName: string
    export let formComponent: ComponentType
    export let onExit: () => void
</script>

<div class=container>
    <div class=header>
        <div class=title>Create New {displayName}</div>
        <button class=exit on:click={onExit}>X</button>
    </div>
    <div class=body>
        <svelte:component this={formComponent}/>
    </div> 
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        color: var(--theme-color3-dark);
		border: 3px solid var(--theme-color3);
		border-radius: 10px;
		background-color: var(--theme-container1);
        height: 100%;
        box-sizing: border-box;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;        
    }

    .exit {
        font-size: small;
        color: var(--theme-color3-dark);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        height: 18px;
        width: 18px;
        transition: background-color .4s;
    }

    .exit:hover {
        background-color: var(--theme-color3);
    }

    .body {
        flex-grow: 1;
    } 
</style>