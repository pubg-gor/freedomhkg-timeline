import sirv from 'sirv'
import polka from 'polka'
import { json } from 'body-parser'
import compression from 'compression'
import * as sapper from '@sapper/server'
import logger from '../utils/logger'

const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'

;(async () => {
  logger.info('NODE_ENV:', NODE_ENV)

  polka() // You can also use Express
    .use(json())
    .use(
      compression({ threshold: 0 }),
      sirv('tg-media', { dev }),
      sapper.middleware()
    )
    .listen(PORT, err => {
      if (err) console.log('error', err)
    })
})()
