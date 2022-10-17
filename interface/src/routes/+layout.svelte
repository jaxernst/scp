<script>
	import '../theme.css';
	import Navigation from '../components/navigation/Navigation.svelte';
	import { connected } from "svelte-web3"
	import { bodyContainerWidthPx } from "src/theme"
	import ConnectionStatus from 'src/components/ConnectionStatus.svelte';
</script>

<body>
	<ConnectionStatus/>

	<div class="page-container" style="--content-width:{bodyContainerWidthPx}px">
		<slot/>
	</div>
	
	<div class="lower-nav">
		<Navigation />
	</div>
</body>

<style>
	body {
		height: 100%;
		margin: 0;
		background: rgb(242, 148, 146);
		background: var(--background-gradient);
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	:global(*) {
		font-family: Verdana;
	}

	:global(h3) {
		color: var(--theme-color1);
		font-size: medium;
		font-weight: 100;
		text-align: center;
	}

	.lower-nav {
		position: fixed;
		bottom: 0%;
		width: 100%;
	}

	.page-container {
		position: relative;
		margin-top: 8vh;
		margin-right: auto;
		margin-left: auto;
		max-width: var(--content-width);
		overflow: hidden;
		
		padding: 1rem 5%;
		background-color: var(--bg-body-wrapper);
		border-radius: var(--border-radius-medium);
	}
</style>
