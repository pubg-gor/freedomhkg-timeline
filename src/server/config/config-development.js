const credentials = require('../../utils/credentialUtil')(
  'src/server/config/credential-development.env'
)

module.exports = {
  db: {
    url: credentials.DB_URL,
  },
  telegram: {
    apiId: credentials.TELEGRAM_API_ID,
    apiHash: credentials.TELEGRAM_API_HASH,
    phoneNumber: credentials.TELEGRAM_PHONE_NUMBER,
  },
}
