<script>
  import { onMount } from 'svelte'
	import Nav from '../components/Nav'
	import Timeline from '../components/Timeline'
	import TimelineSearch from '../components/TimelineSearch'
	import TimelineResultCount from '../components/TimelineResultCount'
	import TimelineRange from '../components/TimelineRange'
	import TopSearchBar from '../components/TopSearchBar'
	import HorizontalScrollRange from '../components/HorizontalScrollRange'
  import { getEvents } from '../services/eventService'
  import { events, loading } from '../stores'

	export let fetchedEvents
	$: events.set(fetchedEvents)

  // fetch data
  onMount(async () => {
		events.set(await getEvents())
		loading.set(false)
	})
	
</script>

<script context='module'>
	import URI from 'urijs'

  export async function preload() {
		const response = await this.fetch(
			URI('/api/events').query({ limit: 100 }).toString()
		)
		const fetchedEvents = await response.json()
		return { fetchedEvents }
  }
</script>

<Nav />
<h1>抗爭動態</h1>
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

<TopSearchBar />

<bottom-scroll-range-wrapper>
	<HorizontalScrollRange />
</bottom-scroll-range-wrapper>

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

	bottom-scroll-range-wrapper {
		display: none;
	}

	@media (max-width: 768px) {
		page-wrapper {
			width: auto;
		}
		time-range-wrapper {
			display: none;
		}
		bottom-scroll-range-wrapper {
			display: initial;
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
