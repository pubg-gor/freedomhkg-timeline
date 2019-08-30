<script>
  import Search from './Search'
  import {timelineSearch} from '../stores'
  export let manualEnter = false

  function onSearch(e) {
    const {text} = e.detail

    if (text === $timelineSearch) return

    timelineSearch.set(e.detail.text)
    window.scrollTo(0, 0)
  }
</script>

<Search text={$timelineSearch} on:search={onSearch} manualEnter={manualEnter} />