<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/browse">Browse Pools</a></li>
	<li><a href="/join">Join Pool</a></li>
	<li><a href="/about">About</a></li>
</ul>

<body>
	<slot />
</body>

<style>
	body {
		background: rgb(255, 255, 255);
		background: radial-gradient(
			circle,
			rgba(255, 255, 255, 1) 0%,
			rgba(255, 247, 202, 1) 47%,
			rgba(235, 216, 205, 1) 100%
		);
		padding: 2em;
        font-family: sans-serif;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		overflow: hidden;
		background-color: transparent;
	}

	li {
		float: left;
	}

	li a {
		display: block;
		color: rgb(0, 0, 0);
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
	}

	/* Change the link color to #111 (black) on hover */
	li a:hover {
		background-color: rgba(212, 211, 201, 0.271);
        border-radius: 50%;
	}
</style>
