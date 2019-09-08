import getHttpLogger from 'pino-http'
import logger from './logger'

const httpLogger = getHttpLogger({
  logger,
})

export default httpLogger