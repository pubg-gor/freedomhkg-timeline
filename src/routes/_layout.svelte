<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	* {
		font-family: system-ui;
	}
	main {
		display: flex;
		flex-direction: column;
    align-items: center;
		margin: 0 auto;
		box-sizing: border-box;
		min-height: 100vh;
	}
</style>

<!-- <Nav {segment}/> -->

<main>
	<slot></slot>
</main>