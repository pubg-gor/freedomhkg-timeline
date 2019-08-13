const { Database } = require('arangojs')
;(async () => {
  const dbUrl = require('../src/server/config').db.url
  console.log('traget db url:', dbUrl)
  const db = new Database(dbUrl)
  console.log(
    `${
      (await (await db.query('RETURN DATE_ISO8601(DATE_NOW())')).all())[0]
    } - OK`
  )
})()
