const { isProd, isDev } = require('../../utils/envUtil')

const config = (() => {
  if (isProd) return require('./config-production.js')
  if (isDev) return require('./config-development.js')
  return require('./config-development.js')
})()

module.exports = config
