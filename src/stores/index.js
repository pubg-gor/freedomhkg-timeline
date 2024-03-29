import { writable, derived } from 'svelte/store'
import * as R from 'ramda'
import { DateTime } from 'luxon'

export const timelineSearch = writable('')

export const beforeDate = writable('')

export const loading = writable(true)

export const events = writable([])

export const maxVisibleItems = writable(10)

export const dateRangeData = derived([events], ([$events]) => {
  const sortedDates = R.pipe(
    R.map(R.prop('date')),
    R.sort(R.descend(R.identity))
  )($events)

  const dateRange = R.ap([R.head, R.last], [sortedDates])

  const maxDate = DateTime.fromISO(dateRange[0]).endOf('day')
  const minDate = DateTime.fromISO(dateRange[1]).startOf('day')
  const dayCount = Math.ceil(maxDate.diff(minDate, 'days').toObject().days)
  const monthDays = R.range(0, dayCount).map(i =>
    maxDate.minus({ days: i }).toFormat('L.d')
  )

  return {
    monthDays,
    dayCount,
  }
})

export const filteredEvents = derived(
  [events, timelineSearch, beforeDate],
  ([$events, $timelineSearch, $beforeDate]) => {
    return R.pipe(
      R.filter(
        ({ description }) =>
          !$timelineSearch ||
          (description && description.includes($timelineSearch))
      ),
      R.reject(({ date }) => $beforeDate && date > $beforeDate),
    )($events)
  }
)

// reset no. of visible items
filteredEvents.subscribe(() => {
  maxVisibleItems.set(10)
})

export const eventsForDisplay = derived(
  [filteredEvents, maxVisibleItems],
  ([$filteredEvents, $maxVisibleItems]) => {
    return R.pipe(
      R.take($maxVisibleItems),
      R.map(
        ({ description, imgUrl, date, telegramChannel, telegramMessageId }) => {
          const datetime = DateTime.fromISO(date)
          return {
            ...(description && { description }),
            date: datetime.toFormat('yyyy LLL dd ccc HH:mm'),
            monthAndDay: datetime.toFormat('L.d'),
            time: datetime.toFormat('h:mm a'),
            imgUrl,
            telegramChannel,
            telegramMessageUrl: `https://t.me/${telegramChannel.name}/${telegramMessageId}`,
          }
        }
      )
    )($filteredEvents)
  }
)

export const filteredEventsCount = derived(
  [eventsForDisplay],
  ([$eventsForDisplay]) => $eventsForDisplay.length
)
