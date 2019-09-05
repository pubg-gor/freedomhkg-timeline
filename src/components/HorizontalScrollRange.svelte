<script>
  import { onMount } from 'svelte'
  import * as R from 'ramda'
  import { DateTime } from '../utils/luxon'
  import { beforeDate, dateRangeData, loading } from '../stores'
  import { debounce } from '../utils/functionUtil'
  
  let itemDoms = []
  let selectedDay

  function updateSelectedDay() {
    selectedDay = R.pipe(
      R.map(ele => ele.getBoundingClientRect()),
      R.findIndex(({ x, width }) => x >= window.innerWidth / 2 - width && x < window.innerWidth / 2),
      i => $dateRangeData.monthDays[i]
    )(itemDoms)
  }

  function onScroll() {
    updateSelectedDay()
  }

  onMount(() => {
    updateSelectedDay()
  })

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
    padding-left: calc(50vw - var(--range-item-width) / 2);
    padding-right: calc(100vw - var(--range-item-width));
    height: var(--bar-height);
  }
  range-item {
    width: var(--range-item-width);
    border-left: solid 1px #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.2;
  }
  range-item.selected {
    border: solid 1px #cccccc;
    opacity: 1;
  }
  loading-placeholder {
    width: 100vw;
    text-align: center;
  }
  down-pointer {
    position: fixed;
    left: 50vw;
    bottom: calc(var(--bar-height) - 8px);
		border-left: 3px solid transparent;
		border-right: 3px solid transparent;

		border-top: 6px solid #f00;
  }
</style>

<horizontal-scroll-range 
  on:scroll={onScroll}
  style="
    --bar-height: 44px;
    --range-item-width: 90px;
  "
>
  <down-pointer />
  <inner-bar>
    {#if ($loading && false)}
      <loading-placeholder>Loading...</loading-placeholder>
    {:else}
      {#each $dateRangeData.monthDays as monthDay, index}
        <range-item bind:this={itemDoms[index]} class:selected={selectedDay === monthDay}>{monthDay}</range-item>
      {/each}
    {/if}
  </inner-bar>
</horizontal-scroll-range>

