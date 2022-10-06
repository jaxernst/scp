<div class="shadow-box">
	<p style="outline:1px solid red">Welcome to the Social Alarm Clock</p>
	<div class="container" style="outline:1px solid red">
		<button class="arrow" />
		<a data-scroll href="#full">
			<div class="arrow" />
		</a>
	</div>
</div>

<style>
	.shadow-box {
		border-style: solid;
		border-width: 2px;
		box-shadow: 10px 10px;
		display: grid;
		justify-content: center;
		align-items: center;
	}

	p {
		display: block;
		text-transform: uppercase;
		font-weight: bold;
		height: 40px;
		padding: 20px;
	}

	.arrow {
		box-sizing: border-box;
		height: 5em;
		width: 5em;
		border-style: solid;
		border-color: white;
		border-width: 0px 1px 1px 0px;
		transform: rotate(45deg);
		transition: border-width 150ms ease-in-out;
	}

	.arrow:hover {
		border-bottom-width: 4px;
		border-right-width: 4px;
	}

	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	#full {
		height: 100vh;
		background-color: #256347;
	}
</style>
