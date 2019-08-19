const credentials = require('../../utils/credentialUtil')(
  'src/server/config/credential-development.env'
)

module.exports = {
  telegram: {
    apiId: credentials.TELEGRAM_API_ID,
    apiHash: credentials.TELEGRAM_API_HASH,
    phoneNumber: credentials.TELEGRAM_PHONE_NUMBER,
  },
  s3: {
    public: {
      url: credentials.S3_PUBLIC_URL,
      s3Url: credentials.S3_PUBLIC_BUCKET_PATH,
    },
  },
}
