<script>
  import {createEventDispatcher} from 'svelte'
  import Fa from 'svelte-fa'
  import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
  import {debounce} from '../utils/functionUtil'
  const dispatch = createEventDispatcher()

  export let manualEnter
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
  icon-wrapper {
    position: absolute;
    left: 18px;
    top: 50%;
    color: #757575;
    transform: translateY(-50%);
  }
</style>

<input-wrapper>
  <input bind:value={text} on:keyup={onKeyUp} placeholder="Search ..." />
  <icon-wrapper>
    <Fa icon={faSearch} />
  </icon-wrapper>
</input-wrapper>