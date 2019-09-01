<script>
  import * as R from 'ramda'
  import {DateTime} from '../utils/luxon'
  import Fa from 'svelte-fa'
  import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar'
  import {debounce} from '../utils/functionUtil'
  import Range from './Range/index.svelte'
  import { beforeDate, dateRangeData } from '../stores'
  let ratio

  $: topTipsStyle = `
    visibility: ${ratio > 0 ? 'hidden' : 'visible'};
  `

  $: selectedDay = $dateRangeData.monthDays[Math.floor(ratio*($dateRangeData.dayCount-1) + 0.5)]

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
    color: #616161;

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