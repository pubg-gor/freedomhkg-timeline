import { writable, derived } from 'svelte/store'
import * as R from 'ramda'
import { DateTime } from 'luxon'

export const timelineSearch = writable('')

export const beforeDate = writable('')

export const events = writable([])

export const eventsForDisplay = derived(
  [events, timelineSearch, beforeDate],
  R.memoizeWith(R.identity, ([$events, $timelineSearch, $beforeDate]) => {
    return R.pipe(
      R.filter(
        ({ description }) =>
          !$timelineSearch ||
          (description && description.includes($timelineSearch))
      ),
      R.reject(({ date }) => $beforeDate && date > $beforeDate),
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
    )($events)
  })
)

export const eventsForDisplayCount = derived(
  [eventsForDisplay],
  ([$eventsForDisplay]) => $eventsForDisplay.length
)
