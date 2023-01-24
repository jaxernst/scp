<script lang=ts>
    import type { CommitmentType, InitializationTypes } from "@scp/protocol/lib/types";
    import { formData } from "../formData";
    
    // export let createCommitment: <T extends CommitmentType>(type: T, initData: InitializationTypes[T]) => any
    
    const defaultName = "My Todo Item"
    const defaultDescription = "Task Description"
    let name = defaultName
    let description = defaultDescription

    $: formData.update((data) => ({...data, name, description}))
</script>

<p>
    A ToDo commitment is a personal agreement and pledge to complete the task as described below
</p>

<label for="name">Name:</label>
<input 
    id="name" 
    type=text 
    bind:value={name}
    placeholder={defaultName}
/>
<br/>
<label for="description">Description:</label>
<input 
    id="description" 
    type=text 
    bind:value={description}
    placeholder={defaultDescription}
/>
<br/>

<style>
    input {
        margin: 1em;
        padding: .5em;
        background: none;
        border: none;
        border-bottom: 1px solid var(--theme-color3-dark);
        color: var(--theme-color2);
    }
</style>