<script>
  import goto from '@sapper/app'
  import {onMount} from 'svelte'
  import * as R from 'ramda'
  import {DateTime} from 'luxon'

  import {getEvents} from '../services/eventService'
  import Description from './Description.svelte'
  import LazyLoad from './LazyLoad.svelte'
  import {events, eventsForDisplay} from '../stores'

  let maxVisibleItems = 10

  // fetch data
  onMount(async () => {
    events.set(await getEvents({limit: 100}))
    events.set(await getEvents())
  })

  // reset no. of visible items
  $: ($eventsForDisplay, (() => {
    maxVisibleItems = 10
  })())

  $: visibleItems = R.take(maxVisibleItems, $eventsForDisplay)

  $: loadMore = () => {
    if (maxVisibleItems < $eventsForDisplay.length) {
      maxVisibleItems += 10
    }
  }
</script>

<LazyLoad loadMore={loadMore}>
  <div class='wrapper'>
    {#each visibleItems as {date, monthAndDay, time, isSameDayAsPreviousItem, description, imgUrl, telegramChannel}}
      <div class="item">
        <div class='datetime'>
          <div class='date'>{monthAndDay}</div>
          <div class='time'>{time}</div>
        </div>
        <div class='card'>
          <a class='channel-title' href={telegramChannel.url} target="_blank">
            {telegramChannel.title}
          </a>
          {#if imgUrl}
            <img class='image' src={encodeURI(imgUrl).replace('+','%2B')} alt={date} />
          {/if}
          {#if description}
            <div class='description'>
                <Description description={description} />
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</LazyLoad>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
  }
  .item {
    margin:  12px 12px 0 12px;
    display: flex;
  }
  .card {
    background-color: white;
    border: solid 1px #e8e8e8;
    border-radius: 8px;

    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }
  .card > * {
    margin-top: 8px;
  }
  .card :nth-child(1) {
    margin-top: 0;
  }
  .datetime {
    flex: 1 0 auto;
    margin-right: 4px;
    padding: 12px 4px 12px 12px;
    width: 113px;
    height: 28px;

    position: sticky;
    position: -webkit-sticky;
    top: 4px;

    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .date {
    font-size: 30px;
    line-height: 28px;
  }
  .time {
    font-size: 12px;
    width: 60px;
    text-align: right;
  }
  .channel-title {
    border: solid 1px #5fc2e8;
    font-size: 10px;
    background: #f1fcff;
    border-radius: 10px;
    padding: 2px 6px;
    width: fit-content;

    color: initial;
    text-decoration: none;
  }
  .description {
		line-height: 26px;
  }
  .image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

	@media (max-width: 768px) {
    .card {
      padding: 8px;
    }
		.datetime {
      flex-direction: column;
      height: auto;
      justify-content: flex-start;
      align-items: flex-end;
      flex: 0;
      padding-left: 0;
		}
    .time {
      margin-top: 4px;
      width: auto;
    }
    .description {
      line-height: 23px;
    }
	}
</style>
