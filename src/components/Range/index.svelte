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
		transform: translate(-50%,-50%) translate(${coords.x}px,${coords.y}px);
	`
</script>

<style>
	.container {
    width: 80px;
    height: 300px;
	}
	.wrapper {
		background-color: grey;
		
	}
	.bar {
		position: absolute;
		height: 300px;
		width: 4px;
		background-color: black;
		transform: translate(-50%, 0);
		border-radius: 4px;
	}
	.drag-box {
		--width: 0px;
		--height: 20px;
		width: var(--width);
		height: var(--height);
		position: absolute;
		background-color: #0000005c;
	}
	.pointer {
		width: 0; 
		height: 0; 
		border-top: 5px solid transparent;
		border-bottom: 5px solid transparent;

		border-right: 10px solid #f00;
		/* transform: translate(0, -50%); */
		position: relative;
		top: 4px;
	}
	.pointer-box {
		position: relative;
    left: 12px;
		/* top: -12px; */
		background: white;
		width: 60px;
		height: 40px;
		transform: translate(0, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: ns-resize;
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