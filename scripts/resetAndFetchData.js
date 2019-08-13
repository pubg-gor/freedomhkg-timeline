/**
 * reset data from telegram export,
 * then sync with those exported static data again
 */
;(async () => {
  await require('./actions/resetData')()
  require('./syncDbWithSqliteExport')
})()
