<script>
  import {createEventDispatcher} from 'svelte'
  const dispatch = createEventDispatcher()

  export let text

  function onClick() {
    dispatch('search', {text})
  }

  function onKeyUp(e) {
    if (!e) e = window.event;
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13){
      onClick()
    }
  }
</script>

<style>
  div {
    display: flex;
    justify-content: center;
  }
</style>

<div>
  <input bind:value={text} on:keyup={onKeyUp} />
  <button on:click={onClick}>Search</button>
</div>