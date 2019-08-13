<script>
  import Search from './Search'
  import {timelineSearch} from '../stores'

  function onSearch(e) {
    timelineSearch.set(e.detail.text)
  }
</script>

<Search text={$timelineSearch} on:search={onSearch} />