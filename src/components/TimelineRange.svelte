<script>
  import * as R from 'ramda'
  import {DateTime} from 'luxon'
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
    const newBeforeDate = DateTime.fromObject({day, month, year:2019}).endOf('day').toISO()

    updateBeforeDate(newBeforeDate)
  }
</script>

<Range bind:ratio={ratio} valueText={selectedDay} />