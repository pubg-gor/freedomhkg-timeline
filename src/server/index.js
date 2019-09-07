import sirv from 'sirv'
import polka from 'polka'
import { json } from 'body-parser'
import compression from 'compression'
import * as sapper from '@sapper/server'
import helmet from 'helmet'
import logger from '../utils/logger'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

;(async () => {
  logger.info('NODE_ENV:', NODE_ENV)

  polka() // You can also use Express
    .use(
      helmet(),
      json(), 
      compression({ threshold: 0 })
    )
    .use('/s', sirv('tg-media', { dev }))
    .use(overrideSetHeader, sapper.middleware())
    .listen(PORT, err => {
      if (err) logger.error(err)
    })
})()

// https://github.com/sveltejs/sapper/issues/567
function overrideSetHeader(req, res, next) {
  const origSetHeader = res.setHeader
  res.setHeader = function (key, value) {
    if (key === 'Cache-Control') {
      // HTML files
      if (value === 'max-age=600') { 
        return origSetHeader.apply(this, ['Cache-Control', 'max-age=60'])
      }
    }

    return origSetHeader.apply(this, arguments)
  }
  return next()
}