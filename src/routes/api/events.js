import send from '@polka/send-type'
import { DateTime } from 'luxon'
import { Message } from '../../drivers/sqlitedb'
import logger from '../../utils/logger'

export async function get(req, res) {
  logger.info('/api/events')

  const telegramMessages = await Message.scope(['channel', 'media']).findAll({
    ...(req.query.limit && { limit: req.query.limit }),
  })

  const data = telegramMessages.map(
    ({ id, date, message, media, channel }) => ({
      date: DateTime.fromSeconds(date).toISO(),
      telegramChannel: channel,
      ...(message && {
        description: message,
      }),
      ...(media &&
        media.mimeType === 'image/jpeg' && {
          imgUrl: `/${channel.id}/photo-${media.name}.${media.id}.jpg`,
        }),
      telegramMessageId: id,
    })
  )

  send(res, 200, data)
}
