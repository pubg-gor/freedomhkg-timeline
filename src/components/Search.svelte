<script>
  import {createEventDispatcher} from 'svelte'
  import Fa from 'svelte-fa'
  import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
  import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
  import {debounce} from '../utils/functionUtil'
  const dispatch = createEventDispatcher()

  export let manualEnter
  export let text

  let input

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

  function resetSearch(e) {
    dispatch('search', {text: ''})
    input.focus()
  }

  $: searchDebounced = debounce(100, search)()
  $: if (!manualEnter) {
    searchDebounced(text)
  }

</script>

<style>
  input-wrapper {
    display: flex;
    justify-content: center;
    position: relative;
  }
  input {
    border-radius: 18px;
    border: solid 1px #e0e0e0;
    font-size: 16px;
    padding: 8px 18px 8px 38px;
  }
  input::placeholder {
    color: #BABECA;
    font-size: 14px;
    line-height: 20px;
  }
  input:focus {
    outline-width: 0;
  }
  search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    color: #757575;
    transform: translateY(-50%);
  }
  close-icon {
    position: absolute;
    right: 18px;
    top: 50%;
    color: #c5c5c5;
    transform: translateY(-50%);
    cursor: pointer;
  }
</style>

<input-wrapper>
  <input bind:this={input} bind:value={text} on:keyup={onKeyUp} placeholder="Search ..." />
  <search-icon>
    <Fa icon={faSearch} />
  </search-icon>
  {#if text}
    <close-icon on:click={resetSearch}>
      <Fa icon={faTimes} />
    </close-icon>
  {/if}
</input-wrapper>