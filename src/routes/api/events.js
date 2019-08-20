import send from '@polka/send-type'
import { DateTime } from 'luxon'
import * as R from 'ramda'
import { Message, Channel } from '../../drivers/sqlitedb'
import logger from '../../utils/logger'

export async function get(req, res) {
  logger.info('/api/events')

  const channels = R.uniqBy(R.prop('id'))(
    await Channel.findAll({
      order: [['dateUpdated', 'DESC']],
    })
  )
  const telegramMessages = await Message.scope(['media']).findAll({
    order: [['date', 'DESC']],
    ...(req.query.limit && { limit: req.query.limit }),
  })

  const data = telegramMessages
    // .filter(R.path(['media', 'url']))
    .map(({ id, date, message, media, contextId }) => ({
      date: DateTime.fromSeconds(date).toISO(),
      telegramChannel: channels.find(R.propEq('id', contextId)),
      ...(message && {
        description: message,
      }),
      ...(media &&
        media.mimeType === 'image/jpeg' && {
          imgUrl: media.url
            ? `/s/${media.url}`
            : `/s/${contextId}/photo-${media.name}.${media.id}.jpg`,
        }),
      telegramMessageId: id,
    }))

  send(res, 200, data)
}
