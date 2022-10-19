<script>
	import { fade } from 'svelte/transition';
	let wakeupTime = 'Tomorrow, 8:30am';
	let showConfirm = false;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	class="container"
	on:mouseover={() => (showConfirm = true)}
	on:mouseleave={() => (showConfirm = false)}
>
	{#if showConfirm}
		<button class="button-primary" transition:fade|local>Confirm Wakeup</button>
	{:else}
		<button class="button-primary" transition:fade|local>{wakeupTime}</button>
	{/if}
</div>

<style>
	
	.container {
		position: relative;
		height: 60px;
		margin-bottom: 10px;
	}

	button {
		padding: 1em;
		margin: 10px;
		width: 100%;
		border-radius: 12px;
		transition: 0.3s;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.button-primary {
		background-color: rgba(255, 255, 255, 0.035);
		border: 1px solid var(--theme-color3-dark);
		color: var(--theme-color1-dark);
	}

	.button-secondary {
		padding-left: 0.5em;
		padding-right: 0.5em;
		background-color: transparent;
		border: none;
		color: var(--theme-alert-color-dark);
	}

	button:hover {
		background-color: rgb(255, 255, 255, 0.2);
	}

	.button-primary:hover {
		color: var(--theme-color3);
		border: 1px solid var(--theme-color3);
	}

	.button-secondary:hover {
		color: var(--theme-alert-color);
		border: 1px solid var(--theme-alert-color-dark);
	}

	.full-length {
		width: 100%;
	}
</style>
