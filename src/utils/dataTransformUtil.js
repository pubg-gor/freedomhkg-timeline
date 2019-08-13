const R = require('ramda')
const { DateTime } = require('luxon')
const LosslessJSON = require('lossless-json')

module.exports = {
  transformSqliteTelegramMessages({ messages, medias }) {
    return messages.map(
      ({
        ID: id,
        ContextID: contextId,
        Date: date,
        Message: message,
        MediaID: mediaId,
      }) => {
        const media = mediaId ? medias.find(R.propEq('ID', mediaId)) : null
        return {
          idFromSqlite: id,
          message,
          date,
          ...(media && {
            media: {
              id: mediaId,
              photoId: R.unless(
                R.isNil,
                String,
                R.path(['photo', 'id'], LosslessJSON.parse(media.Extra))
              ),
              mimeType: media.MimeType,
              size: media.Size,
              type: media.Type,
              extra: media.Extra,
            },
          }),
          channelId: String(contextId),
        }
      }
    )
  },
  transformTelegramMessageToEvent: ({
    _id,
    message,
    date: unixDate,
    media,
  }) => ({
    date: DateTime.fromSeconds(unixDate).toISO(),
    ...(message && {
      description: message,
    }),
    ...(media &&
      media.mimeType === 'image/jpeg' && {
        imgUrl: `/telegram-images/${media.photoId}.jpg`,
      }),
    telegramMessageId: _id,
  }),
}
