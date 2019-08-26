<script>
	import { spring } from 'svelte/motion';
	import { pannable } from './pannable.js';
	
	let bar
  export let ratio
  export let valueText

	const getBarLength = () => bar ? bar.offsetHeight : null

	let coords = {
		x: 0,
		y: 0
  }
  $: distance = coords.y

	function handlePanStart() {
		// do something
	}

	function handlePanMove(event) {
    // const difference = event.detail.dx
		const difference = event.detail.dy
		coords.y = Math.min(Math.max(0, distance + difference), getBarLength())
	}

	function handlePanEnd(event) {
		// do something
		
	}
	
	$: ratio = bar && getBarLength() ? (distance / getBarLength()).toFixed(2) : 0
	
	$: style = `
		transform: translate(0,-50%) translate(${coords.x || 0}px,${coords.y || 0}px);
	`
</script>

<style>
	.container {
    width: 80px;
    height: 300px;
	}
	.wrapper {
		/* background-color: grey; */
		
	}
	.bar {
		position: absolute;
		height: 300px;
		width: 1px;
		background-color: black;
		transform: translate(-50%, 0);
		border-radius: 4px;
	}
	.drag-box {
    user-select: none;
		position: relative;
		left: 2px;
		display: flex;
    align-items: center;
	}
	.pointer {
		width: 0; 
		height: 0; 
		border-top: 5px solid transparent;
		border-bottom: 5px solid transparent;

		border-right: 10px solid #f00;
		/* transform: translate(0, -50%); */
	}
	.pointer-box {
		user-select: none;
		background: white;
		width: 60px;
		height: 40px;
		/* transform: translate(0, -50%); */
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: ns-resize;
		border-radius: 4px;
    box-shadow: 2px 2px #0000001f;
	}
</style>

<div class='container'>
	
<div class='wrapper'>
	<div class='bar' bind:this={bar}>
		
	</div>
	<div class="drag-box"
		use:pannable
		on:panstart={handlePanStart}
		on:panmove={handlePanMove}
		on:panend={handlePanEnd}
		{style}
	>
		<div class='pointer'>
			
		</div>
		<div class='pointer-box'>
			{valueText || ratio}
		</div>
	</div>

</div>
	
</div>