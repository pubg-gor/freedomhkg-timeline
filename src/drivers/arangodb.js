const { Database } = require('arangojs')
const config = require('../server/config')
const logger = require('../utils/logger')

logger.info('db url:', config.db.url)

const db = new Database(config.db.url)

const initDb = async () => {
  try {
    await db.createDatabase('timelinedb')
    logger.info('database "timelinedb" created')
  } catch (e) {
    // do nothing
  }
  try {
    await db.collection('migrations').create()
    logger.info('collection "migrations" created')
  } catch (e) {
    // do nothing
  }
  db.useDatabase('timelinedb')
}

module.exports = { db, initDb }
