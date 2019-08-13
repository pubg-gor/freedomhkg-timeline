<script>
  export let loadMore
  let y
  let wrapper
  let windowHeight

  $: (y, (() => {
    const wrapperBottom = wrapper ? parseInt(wrapper.getBoundingClientRect().bottom) : null
    const progress = wrapperBottom ? windowHeight / wrapperBottom : 0
    if (progress >= 1) {
      loadMore()
    }
  })())
</script>

<svelte:window bind:scrollY={y}  bind:innerHeight={windowHeight} />
<div bind:this={wrapper}>
  <slot></slot>
</div>
