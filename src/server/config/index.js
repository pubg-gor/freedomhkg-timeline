const { isProd } = require('../../utils/envUtil')

const config = (() => {
  if (isProd) return require('./config-production.js')
  return require('./config-development.js')
})()

module.exports = config
