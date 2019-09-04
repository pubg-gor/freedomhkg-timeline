<script>
  import * as R from 'ramda'
  import { DateTime } from '../utils/luxon'
  import { beforeDate, dateRangeData, loading } from '../stores'
  import { debounce } from '../utils/functionUtil'
  
  let itemDoms = []
  let selectedDay

  function onScroll() {
    selectedDay = R.pipe(
      R.map(ele => ele.getBoundingClientRect()),
      R.findIndex(({ x, width }) => x > -width),
      i => $dateRangeData.monthDays[i]
    )(itemDoms)
  }

  $: updateBeforeDate = debounce(350, beforeDate.set)()
  $: if (typeof window !== 'undefined' && !R.isNil(selectedDay)) {
    const [month, day] = selectedDay.split('.')
    const newBeforeDate = DateTime.fromObject({ day, month, year:2019 }).endOf('day').toISO()

    updateBeforeDate(newBeforeDate)
    window.scrollTo(0, 0)
  }
</script>

<style>
  horizontal-scroll-range {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: white;
    overflow: auto;
    display: flex;
    -webkit-overflow-scrolling: touch;
    box-shadow: 0px -2px 8px #0000001f;
  }
  inner-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 0 auto;
    padding-right: calc(100vw - var(--range-item-width));
    height: 44px;
  }
  range-item {
    width: var(--range-item-width);
    border-left: solid 1px #efefef;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
  }
  loading-placeholder {
    width: 100vw;
    text-align: center;
  }
</style>

<horizontal-scroll-range 
  on:scroll={onScroll}
  style="
    --range-item-width: 70px;
  "
>
  <inner-bar>
    {#if $loading}
      <loading-placeholder>Loading...</loading-placeholder>
    {:else}
      {#each $dateRangeData.monthDays as monthDay, index}
        <range-item bind:this={itemDoms[index]}>{monthDay}</range-item>
      {/each}
    {/if}
  </inner-bar>
</horizontal-scroll-range>

