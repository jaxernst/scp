<script lang="ts">
	import '../app.css';
	import ConnectionStatus from 'src/components/ConnectionStatus.svelte';
</script>

<div class="header">
	<h1>The Social Commitment Protocol</h1>
	<div class=account-area>
		<ConnectionStatus/>
	</div>
</div>

<slot/>

<style>
	.header {
		display: flex;
		justify-items: space-between;
		align-items: center;
		padding: 1em 2em 0 2em;
	}

	.account-area {
		flex-grow: 1;
		align-items: right;
	}
</style>