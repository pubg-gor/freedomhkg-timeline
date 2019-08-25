<script>
  import {onMount} from 'svelte'
	import URI from 'urijs'
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

<div class="header">
  <h1>HK Freedom Timeline</h1>
	<p>The darkest hours, before dawn </p>
</div>

<page-wrapper>
		<div class='search-info'>
			<TimelineSearch />
			<div class='count-wrapper'>
				<TimelineResultCount />
			</div>
		</div>

	<content-wrapper>
		<Timeline />
		<time-range-wrapper>
			<TimelineRange />
		</time-range-wrapper>

	</content-wrapper>

</page-wrapper>

<style>
	h1, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
    margin: 16px 8px;
	}

	p {
		margin: 1em auto;
	}

	page-wrapper {
    width: 780px;
		display: flex;
    flex-direction: column;
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
	.search-info {
		display: flex;
    align-items: center;
		justify-content: center;
		position: relative;
	}
	.count-wrapper {
		position: absolute;
		margin-right: 16px;
		right: 0;
	}
</style>
