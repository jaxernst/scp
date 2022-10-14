<div class="nav-container">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/pools">Pools</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</div>

<style>
	:root {
		--border-radius: 40px;
	}

    .nav-container {
		background-color: rgba(0, 0, 0, 0.268);
		grid-column: 2;
		border-radius: var(--border-radius)
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
		color: rgb(255, 255, 255);
		text-align: center;
		font-size: 18px;
		font-weight: 400;
		padding: 10px 18px;
		text-decoration: none;
	}

	/* Change the link color to #111 (black) on hover */
	li a:hover {
		background-color: rgb(255, 255, 255, .5);
        border-radius: var(--border-radius)
	}
</style>