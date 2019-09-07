import send from '@polka/send-type'
import { DateTime } from '../../utils/luxon'
import * as R from 'ramda'
import Sequelize from 'sequelize'
import { isDev } from '../../utils/envUtil'
import config from '../../server/config'
import { Message, Channel } from '../../drivers/sqlitedb'
import logger from '../../utils/logger'
const Op = Sequelize.Op

export async function get(req, res) {
  logger.info('/api/events')

  const channels = R.uniqBy(R.prop('id'))(
    await Channel.findAll({
      order: [['dateUpdated', 'DESC']],
    })
  )
  const telegramMessages = await Message.scope(['media']).findAll({
    attributes: { exclude: ['serviceAction'] },
    where: {
      [Op.or]: [
        { message: { [Op.ne]: '' } },
        {
          [Op.and]: [
            { mediaId: { [Op.ne]: null } },
            // uploaded jpg images only
            // no sticker image (not downloaded by telegram-export)
            { '$media.mimeType$': 'image/jpeg' },
          ],
        },
      ],
      serviceAction: null, // s.t. it's just a message
    },
    order: [['date', 'DESC']],
    ...(req.query.limit && { limit: req.query.limit }),
  })

  const data = telegramMessages.map(
    ({ id, date, message, media, contextId }) => ({
      date: DateTime.fromSeconds(date).toISO(),
      telegramChannel: channels.find(R.propEq('id', contextId)),
      ...(message && {
        description: message,
      }),
      ...(media && {
        imgUrl: media.url
          ? `/s/${media.url}` // from S3
          : `${
              isDev ? R.path(['cloudfront', 'url'], config) : ''
            }/s/${contextId}/photo-${media.name}.${media.id}.jpg`, // dev
      }),
      telegramMessageId: id,
    })
  )

  send(res, 200, data, {
    'Cache-Control': 'max-age=300'
  })
}
