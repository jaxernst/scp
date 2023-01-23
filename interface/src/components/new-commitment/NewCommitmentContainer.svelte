<script lang=ts>
    export let name: string
    export let onExit: () => void
</script>

<div class=container>
    <div class=header>
        <div class=title>Create New {name}</div>
        <button class=exit on:click={onExit}>X</button>
    </div>
    <slot/>
</div>

<style>
    .container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        place-items: center;
        color: var(--theme-color3-dark);
		border: 3px solid var(--theme-color3);
		border-radius: 10px;
		background-color: var(--theme-container1);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .5rem;
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

</style>