import { writable, derived } from 'svelte/store'
import * as R from 'ramda'
import { DateTime } from 'luxon'

export const timelineSearch = writable('')

export const beforeDate = writable('')

export const events = writable([])

export const eventsForDisplay = derived(
  [events, timelineSearch, beforeDate],
  ([$events, $timelineSearch, $beforeDate]) => {
    return R.pipe(
      R.filter(
        ({ description }) =>
          !$timelineSearch ||
          (description && description.includes($timelineSearch))
      ),
      R.reject(({ date }) => $beforeDate && date > $beforeDate),
      R.reduce(
        (
          acc,
          { description, imgUrl, date, telegramChannel, telegramMessageId }
        ) => {
          const datetime = DateTime.fromISO(date)
          const monthAndDay = datetime.toFormat('L.d')
          const isSameDayAsPreviousItem = R.pipe(
            R.last(),
            R.defaultTo({}),
            R.propEq('monthAndDay', monthAndDay)
          )(acc)
          return R.append(
            {
              ...(description && { description }),
              date: datetime.toFormat('yyyy LLL dd ccc HH:mm'),
              monthAndDay,
              isSameDayAsPreviousItem,
              time: datetime.toFormat('h:mm a'),
              imgUrl,
              telegramChannel,
              telegramMessageUrl: `https://t.me/${telegramChannel.name}/${telegramMessageId}`,
            },
            acc
          )
        },
        []
      )
    )($events)
  }
)

export const eventsForDisplayCount = derived(
  [eventsForDisplay],
  ([$eventsForDisplay]) => $eventsForDisplay.length
)
