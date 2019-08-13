import { aql } from 'arangojs'
import send from '@polka/send-type'
// import { DateTime } from 'luxon'
import * as R from 'ramda'
import { db } from '../../drivers/arangodb'
import logger from '../../utils/logger'

export async function get(req, res) {
  logger.info('/api/events')
  const cursor = await db.query(aql`
    FOR e IN events
      SORT e.date DESC
      LIMIT ${req.query.limit ? Number(req.query.limit) : null} || 10000
      LET tm = DOCUMENT(e.telegramMessageId)
      RETURN MERGE(
        e, 
        {
          telegramChannel: (
              FOR tc IN telegramChannels
                  FILTER tc._key == tm.channelId
                  RETURN KEEP(tc, '_key', 'name', 'title')
          )[0]
        }
      )
  `)
  const events = await cursor.all()
  const data = events.map(R.omit(['_rev', '_id', 'telegramMessageId']))

  send(res, 200, data)
}

// export async function post(req, res) {
//   const { description, date, hour, minute } = req.body
//   const [year, month, day] = date.split('-')
//   const datetime = DateTime.fromObject({
//     year,
//     month,
//     day,
//     hour,
//     minute,
//   }).toISO()
//   await db.query(aql`
//     INSERT {
//       description: ${description},
//       date: ${datetime},
//       createdAt: ${DateTime.local().toISO()}
//     } INTO events
//   `)
//   send(res, 200)
// }
