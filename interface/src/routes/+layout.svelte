<script>
	import '../theme.css';
	import Navigation from '../components/navigation/Navigation.svelte';
</script>

<body>
	<slot />
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

	.lower-nav {
		position: fixed;
		bottom: 0%;
		width: 100%;
	}
</style>
