<script>
  import {onMount} from 'svelte'
	import URI from 'urijs'
	import Nav from '../components/Nav'
	import Timeline from '../components/Timeline'
	import TimelineSearch from '../components/TimelineSearch'
	import TimelineResultCount from '../components/TimelineResultCount'
	import TimelineRange from '../components/TimelineRange'
  import {getEvents} from '../services/eventService'
  import {events, eventsForDisplay} from '../stores'

	export let fetchedEvents
	$: events.set(fetchedEvents)

  // fetch data
  onMount(async () => {
    events.set(await getEvents())
	})
	
</script>

<script context='module'>
  export async function preload(page, session) {
		const response = await this.fetch(
			URI('/api/events').query({limit: 100}).toString()
		)
		const fetchedEvents = await response.json()
		return {fetchedEvents}
  }
</script>

<Nav />

<h1>News Feed</h1>

<page-wrapper>
	<search-info>
		<search-info-inner>
			<TimelineSearch />
			<count-wrapper>
				<TimelineResultCount />
			</count-wrapper>
		</search-info-inner>
	</search-info>

	<content-wrapper>
		<Timeline />
		<time-range-wrapper>
			<TimelineRange />
		</time-range-wrapper>
	</content-wrapper>

</page-wrapper>

<style>
	h1 {
		text-align: center;
		font-size: 48px;
		line-height: 52px;
		font-weight: 700;
		margin-top: 64px;
		margin-bottom: 32px;
	}

	page-wrapper {
    width: 780px;
		display: flex;
    flex-direction: column;
		justify-content: center;
	}

	time-range-wrapper {
		position: fixed;
    transform: translateX(-100%);
	}
	
	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

	@media (max-width: 768px) {
		page-wrapper {
			width: auto;
		}
		time-range-wrapper {
			display: none;
		}
	}

	content-wrapper {
		max-width: 750px;
		width: 100%;
		display: flex;
	}

	search-info {
		display: flex;
		justify-content: center;
		margin-bottom: 12px;
	}

	search-info-inner {
		display: flex;
		flex-direction: column;

    align-items: center;
		justify-content: center;
	}

	count-wrapper {
		align-self: flex-end;
		margin-top: 4px;
		margin-right: 4px;
		display: flex;
		align-items: center;
	}
</style>
