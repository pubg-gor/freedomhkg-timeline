<script>
  import Description from './Description.svelte'
  import LazyLoad from './LazyLoad.svelte'
  import { eventsForDisplay, maxVisibleItems, filteredEvents } from '../stores'

  $: loadMore = () => {
    if ($maxVisibleItems < $filteredEvents.length) {
      maxVisibleItems.update(n => n + 10)
    }
  }
</script>

<LazyLoad loadMore={loadMore}>
  <div class='wrapper'>
    {#each $eventsForDisplay as {date, monthAndDay, time, description, imgUrl, telegramChannel, telegramMessageUrl}}
      <div class="item">
        <div class='datetime'>
          <div class='date'>{monthAndDay}</div>
          <div class='time'>{time}</div>
        </div>
        <div class='card'>
          <a class='channel-title' href={telegramMessageUrl} target="_blank">
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
  }
  .datetime {
    flex: 1 0 auto;
    margin-right: 4px;
    padding: 12px 4px 12px 12px;
    /* width: 113px; */
    height: 28px;

    position: sticky;
    position: -webkit-sticky;
    top: 35px;

    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .date {
    font-size: 30px;
    line-height: 28px;
    width: 60px;
    text-align: right;
  }
  .time {
    font-size: 12px;
    width: 60px;
    text-align: right;
  }
  .channel-title {
    color: initial;
    color: grey;
    font-size: 12px;
    font-weight: bold;
    border-radius: 10px;
    margin: 6px 12px 0 12px;
    border-radius: 8px 8px 0 0;

    text-decoration: none;
  }
  .description {
		line-height: 26px;
    margin: 8px 12px 12px 12px;
  }
  .image {
    width: 100%;
    height: auto;
    margin-top: 6px;
  }
  .image:last-child {
    border-radius: 0 0 8px 8px;
  }

	@media (max-width: 768px) {
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
