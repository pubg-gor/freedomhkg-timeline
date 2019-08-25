<script>
  import * as R from 'ramda'
  import {DateTime} from 'luxon'
  import Fa from 'svelte-fa'
  import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
  import {debounce} from '../utils/functionUtil'
  import Range from './Range/index.svelte'
  import {events, beforeDate} from '../stores'
  let ratio

  $: sortedDates = R.pipe(
    R.map(R.prop('date')),
    R.sort(R.gt),
  )($events)

  $: dateRange = R.ap([R.head, R.last], [sortedDates])

  $: maxDate = DateTime.fromISO(dateRange[0]).endOf('day')
  $: minDate = DateTime.fromISO(dateRange[1]).startOf('day')
  $: dayCount = Math.ceil(maxDate.diff(minDate, 'days').toObject().days)
  $: monthDays = R.range(0, dayCount).map(i => maxDate.minus({days: i}).toFormat('L.d'))

  $: selectedDay = monthDays[Math.floor(ratio*(dayCount-1) + 0.5)]

  $: updateBeforeDate = debounce(100, beforeDate.set)()
  $: if (selectedDay) {
    const [month, day] = selectedDay.split('.')
    const newBeforeDate = DateTime.fromObject({day, month, year:2019, zone: 'Asia/Hong_Kong'}).endOf('day').toISO()
    console.log('newBeforeDate', newBeforeDate)

    window.scrollTo(0, 0)
    updateBeforeDate(newBeforeDate)
  }
</script>

<style>
  top-icon-wrapper {
    position: relative;
    left: -8px;
    top: -5px;
    font-size: 18px;
  }
</style>

<top-icon-wrapper>
  <Fa icon={faCalendar} />
</top-icon-wrapper>
<Range bind:ratio={ratio} valueText={selectedDay} />