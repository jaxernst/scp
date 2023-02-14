<script lang ts>
	import { formData } from './formData';
	import type { CommitmentType } from '@scp/protocol/lib/types';
	import type { ComponentType } from 'svelte';
	import { connectionError } from '$lib/stores/dAppReady';
	import { cph } from '$lib/stores/stores';

	import { createCommitment } from '@scp/sdk/src/scp-helpers';
	import { scpUser } from '$lib/scpUser';

	export let displayName: string;
	export let commitmentType: CommitmentType;
	export let formComponent: ComponentType;
	export let onExit: () => void;

	const onSubmit = async () => {
		if (!$cph) throw Error('No Hub contract');
		scpUser.addTx(createCommitment($cph, commitmentType, $formData as any));
	};
</script>

<div class="container">
	<div class="header">
		<div class="title">Create New {displayName}</div>
		<button class="exit" on:click={onExit}>X</button>
	</div>
	<form on:submit|preventDefault={onSubmit}>
		<div class="body">
			<svelte:component this={formComponent} />
		</div>
		<div class="submit-button-container">
			<button
				disabled={!!$connectionError}
				class="button-submit"
				class:$connectionError={'disabled'}
			>
				{$connectionError ?? 'Submit ->'}
			</button>
		</div>
	</form>
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

	form {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
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
		transition: background-color 0.4s;
	}

	.exit:hover {
		background-color: var(--theme-color3);
	}

	.body {
		flex-grow: 1;
	}

	.submit-button-container {
		display: flex;
		justify-content: flex-end;
	}

	.button-submit {
		font-family: 'Orbitron';
		padding: 0.5em 1em 0.5em 1em;
		color: var(--theme-color3-dark);
		border-radius: 3px;
		transition: background-color 0.2s, color 0.4s, box-shadow 0.8s;
	}

	.button-submit:hover {
		background-color: var(--theme-color2);
		color: var(--theme-color1);
		box-shadow: 2px 2px 8px rgba(91, 91, 91, 0.509);
	}

	.disbaled {
		color: grey;
	}
</style>
