<script lang=ts>
	import type { CommitmentContractName } from "@scp/protocol/lib/types";
	import { toUtf8CodePoints } from "ethers/lib/utils";
	import { backIn, backInOut, backOut, cubicIn, cubicInOut, elasticInOut, expoInOut, quintInOut } from "svelte/easing";
	import { crossfade, fade } from "svelte/transition";
	import NewCommitmentLayout from "./NewCommitmentLayout.svelte";
	import NewTimelockingDeadlineTask from "./NewTimelockingDeadlineTask.svelte";

    enum Display {
        CARDS,
        NEW_COMMITMENT
    }

    type CommitmentOption = {id: number, name: string, commitmentContract: string}
    
    const commitmentOptions: CommitmentOption[] = [
        { id: 0, name: "Todo", commitmentContract: "BaseCommitment"},
        { id: 1, name: "Timelock  Deadline", commitmentContract: "TimelockingDeadlineTask"},
        { id: 2, name: "Goal", commitmentContract: "BaseCommitment"},
        { id: 3, name: "Alarm", commitmentContract: "BaseCommitment"}
    ]

    let activeDisplay = Display.CARDS
    let activeOption: null | CommitmentOption = null
    
    const showNewCommitment = (id: number) => {
        activeDisplay = Display.NEW_COMMITMENT
        activeOption = commitmentOptions[id]
    }

    const onExit = () => {
        activeDisplay = Display.CARDS
    }

    const duration = 500
    export const [send, receive] = crossfade({ 
        duration,
        easing: expoInOut
    })

</script>

<div class=transition-wrapper>
    {#if activeDisplay === Display.CARDS}
        <div 
            style="display: flex; flex-direction:column; gap:1em" 
            transition:fade="{{duration}}"
        >
            <div>New</div>
            <div class="card-area transition-replace">
            {#each commitmentOptions as option}
                <button 
                    class="card-button-decor card-layout" 
                    on:click={() => showNewCommitment(option.id)}
                    in:receive="{{key:option.id}}"
                    out:send="{{key:option.id}}"
                >
                <span>{option.name}</span>
            </button>
            {/each}
        </div>
    </div>
    {:else if activeDisplay === Display.NEW_COMMITMENT && activeOption}
        <div 
            class="transition-replace"
            in:receive="{{key:activeOption.id}}"
            out:send="{{key:activeOption.id}}"
        >
            <NewCommitmentLayout 
                name={activeOption.name} 
                onExit={onExit}
            >
            </NewCommitmentLayout>
        </div>
    {/if}
</div>
<style>
    .card-area {
		margin: 0;
        flex-grow: 1;
        display: flex;
        gap: 1em;
	}

    .transition-wrapper {
        flex-grow: 1;
        display: grid;
    }

    .transition-wrapper > div {
        grid-row: 1;
        grid-column: 1;
    }

	.card-button-decor {
		font-family: 'Orbitron';
		color: var(--theme-color3-dark);
		border: 3px solid var(--theme-color3);
		border-radius: 10px;
		background-color: var(--theme-container1);
		min-width: 55px;
		height: 55px;
		transition: color .2s, box-shadow .4s, background-color .1s;
	}

	.card-button-decor:hover {
		box-shadow: 2px 2px 8px rgba(91, 91, 91, 0.509);
		background-color: var(--theme-color3);
		color: var(--theme-color2);
	}

	.card-layout {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}
</style>