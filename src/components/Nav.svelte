<script>
	export let segment;
</script>

<style>
	nav {
		width: 100%;
		background-color: #FED826;
		padding: 30px 0;
		display: flex;

	}

	head-title {
		font-size: 20px;
		line-height: 20px;
    font-weight: 700;
		margin-left: 24px;
	}

	head-items {
		display: flex;
	}

	head-item {
		margin-left: 32px;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	a {
		text-decoration: none;
		color: inherit;
		font-size: 14px;
		line-height: 20px;
	}
</style>

<nav>
	<a href='/'>
		<head-title>Freedom HKG</head-title>
	</a>
	<head-items>
		<head-item>
			<a class='{segment === undefined ? "selected" : ""}' href='.'>Home</a>
		</head-item>
		<!-- <head-item>
			<a class='{segment === "about" ? "selected" : ""}' href='about'>about</a>
		</head-item> -->
	</head-items>
</nav>