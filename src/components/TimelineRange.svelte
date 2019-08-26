<script>
  import * as R from 'ramda'
  import {DateTime} from '../utils/luxon'
  import Fa from 'svelte-fa'
  import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
  import {debounce} from '../utils/functionUtil'
  import Range from './Range/index.svelte'
  import {events, beforeDate} from '../stores'
  let ratio

  $: topTipsStyle = `
    visibility: ${ratio > 0 ? 'hidden' : 'visible'};
  `

  $: sortedDates = R.pipe(
    R.map(R.prop('date')),
    R.sort(R.descend(R.identity)),
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
    const newBeforeDate = DateTime.fromObject({ day, month, year:2019 }).endOf('day').toISO()

    window.scrollTo(0, 0)
    updateBeforeDate(newBeforeDate)
  }
</script>

<style>
  timeline-range {
    display: flex;
    flex-direction: column;
  }
  top-tips {
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #cccccc;

    animation: blinker 1s linear infinite;
  }
  top-icon-wrapper {
    font-size: 18px;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }

  @keyframes blinker {
    50% {
      opacity: 0.7;
    }
  }
</style>

<timeline-range>
  <top-tips style={topTipsStyle}>
    拖動以選擇日期
  </top-tips>
  <top-icon-wrapper>
    <Fa icon={faCalendar} />
  </top-icon-wrapper>
  <Range bind:ratio={ratio} valueText={selectedDay} />
</timeline-range>