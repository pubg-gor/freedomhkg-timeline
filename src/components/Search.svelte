<script>
  import {createEventDispatcher} from 'svelte'
  import {debounce} from '../utils/functionUtil'
  const dispatch = createEventDispatcher()

  export let text

  function search() {
    dispatch('search', {text})
  }

  function onKeyUp(e) {
    if (!e) e = window.event;
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13){
      search()
    }
  }

  $: searchDebounced = debounce(100, search)()
  $: searchDebounced(text)

</script>

<style>
  div {
    display: flex;
    justify-content: center;
  }
  input {
    border-radius: 4px;
    border: solid 1px #d9d9d9;
    font-size: 16px;
    padding: 8px;
  }
  input:focus {
    outline-width: 0;
  }
</style>

<div>
  <input bind:value={text} on:keyup={onKeyUp} placeholder="Search ..." />
</div>