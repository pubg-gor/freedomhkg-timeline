const pino = require('pino')
const { isProd } = require('./envUtil')
const pinoConfig = (() => {
  if (isProd) {
    return {
      level: 'info',
      prettyPrint: { colorize: true, translateTime: true },
    }
  }
  return {
    level: 'debug',
    prettyPrint: { colorize: true, translateTime: true },
  }
})()
const logger = pino(pinoConfig)

module.exports = logger
