const shell = require('shelljs')
const path = require('path')
const rootPath = path.join(__dirname, '../../')
const getUmzug = require(path.join(rootPath, 'src/drivers/umzug'))
const { migrateDb, undoAllDbMigration } = getUmzug({
  migrationPath: path.join(rootPath, 'src/migrations'),
})
const { initDb } = require(path.join(rootPath, 'src/drivers/arangodb'))

module.exports = async () => {
  await initDb()
  await undoAllDbMigration()
  await migrateDb()

  shell.rm(path.join(rootPath, 'static/telegram-images/*'))
}
