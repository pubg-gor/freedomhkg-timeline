<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	* {
		font-family: 'Noto Sans HK', sans-serif;
    letter-spacing: 0.3px;
	}
	main {
		display: flex;
		flex-direction: column;
    align-items: center;
		margin: 0 auto;
		box-sizing: border-box;
		min-height: 100vh;
    background: #e9ebee;
	}
</style>

<!-- <Nav {segment}/> -->

<main>
	<slot></slot>
</main>