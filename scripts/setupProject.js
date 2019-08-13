/**
 * Setup project from stratch
 *
 * 1. use telegram credential to export data
 * 2. transform and transfer the data to arangodb
 * 3. move the images to /static for sapper to use
 */

const path = require('path')
const rootPath = path.join(__dirname, '../')

const { initDb } = require(path.join(rootPath, 'src/drivers/arangodb'))
const getUmzug = require(path.join(rootPath, 'src/drivers/umzug'))
const { migrateDb, undoAllDbMigration } = getUmzug({
  migrationPath: path.join(rootPath, 'src/migrations'),
})

;(async () => {
  require('./exportTelegramData')
  await initDb()
  await undoAllDbMigration()
  await migrateDb()
  await require('./actions/syncDbWithSqliteExport')()
})()
