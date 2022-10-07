<script>
	import '../app.css';
	import Navigation from '../components/navigation/Navigation.svelte';
</script>

<Navigation />

<body>
	<slot />
</body>

<style>
	body {
		height: 100%;
		margin: 0;
		background: rgb(242, 148, 146);
		background: linear-gradient(0deg, rgba(242, 148, 146, 1) 0%, rgba(17, 67, 87, 1) 100%);
		background-repeat: no-repeat;
		background-attachment: fixed;
	}

	:global(*) {
		font-family: Verdana;
	}
</style>
