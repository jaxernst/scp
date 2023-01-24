<script lang=ts>
	import { getCommitmentHub } from "$lib/getContract";
    import { formData } from "./formData";
    import { createCommitment } from "$lib/createCommitment";
    import type { CommitmentType } from "@scp/protocol/lib/types";
	import type { ComponentType } from "svelte";

    export let displayName: string
    export let commitmentType: CommitmentType
    export let formComponent: ComponentType
    export let onExit: () => void


    const onSubmit = async () => {
        console.log($formData)

        const hub = getCommitmentHub()
        if (!hub) throw Error("No Hub contract")
        console.log(hub)
        await createCommitment(hub, commitmentType, $formData as any)
    }

</script>

<div class=container>
    <div class=header>
        <div class=title>Create New {displayName}</div>
        <button class=exit on:click={onExit}>X</button>
    </div>
    <div class=body>
        <form class=body on:submit|preventDefault={onSubmit}>
            <svelte:component this={formComponent}/>
            <div class=submit-button-container>
                <button class=button-primary>Submit</button>
            </div>
        </form>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 1rem;
        box-sizing: border-box;
        color: var(--theme-color3-dark);
		border: 3px solid var(--theme-color3);
		border-radius: 10px;
		background-color: var(--theme-container1);
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .submit-button-container {
        display: flex;
        justify-content: flex-end;
    }
</style>